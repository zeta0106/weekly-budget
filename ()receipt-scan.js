'use strict';

const crypto = require('crypto');
const admin = require('firebase-admin');

const MODEL = 'nvidia/nemotron-3.5-super-vl:free';
const DAILY_SCAN_LIMIT = 10;
const MAX_IMAGE_DATA_URL_CHARS = 4 * 1024 * 1024;
const DEFAULT_CATEGORIES = [
  'Food & Dining', 'Groceries', 'Transport', 'Bills & Utilities', 'Shopping',
  'Entertainment', 'Health', 'Savings Transfer', 'Other'
];
const PAYMENT_METHODS = [
  'Cash', 'Octopus', 'Visa', 'Mastercard', 'EPS', 'UnionPay', 'AlipayHK',
  'WeChat Pay HK', 'PayMe', 'FPS', 'Other'
];

function sendJson(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(body);
}

function getAdminApp() {
  if (admin.apps.length) return admin.app();
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!rawServiceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured');
  const serviceAccount = JSON.parse(rawServiceAccount);
  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId
  });
}

function cleanNames(values, fallback) {
  if (!Array.isArray(values)) return fallback;
  const seen = new Set();
  const clean = values.map((item) => String(item || '')
    .replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 40))
    .filter((item) => item && !seen.has(item.toLocaleLowerCase()) && seen.add(item.toLocaleLowerCase()))
    .slice(0, 40);
  return clean.length ? clean : fallback;
}

function parseBody(body) {
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch (_) { return null; }
  }
  return body && typeof body === 'object' ? body : null;
}

async function enforceDailyLimit(db, uid) {
  const uidHash = crypto.createHash('sha256').update(uid).digest('hex').slice(0, 40);
  const ref = db.collection('_receiptScanUsage').doc(uidHash);
  const today = new Date().toISOString().slice(0, 10);
  let limited = false;
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const previous = snapshot.exists ? snapshot.data() : {};
    const count = previous.day === today ? (Number(previous.count) || 0) : 0;
    if (count >= DAILY_SCAN_LIMIT) {
      limited = true;
      return;
    }
    transaction.set(ref, {
      uidHash,
      day: today,
      count: count + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
  return limited;
}

module.exports = async function receiptScanHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const body = parseBody(req.body);
  if (!body) return sendJson(res, 400, { error: 'Invalid request body.' });
  const imageDataUrl = String(body.imageDataUrl || '');
  if (imageDataUrl.length > MAX_IMAGE_DATA_URL_CHARS || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(imageDataUrl)) {
    return sendJson(res, 400, { error: 'A JPEG receipt image is required.' });
  }

  const authorization = String(req.headers.authorization || '');
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return sendJson(res, 401, { error: 'Sign-in is required.' });

  const openRouterKey = String(process.env.OPENROUTER_API_KEY || '').trim();
  if (!openRouterKey) return sendJson(res, 503, { error: 'Receipt scanning is not configured.' });

  try {
    const app = getAdminApp();
    const decoded = await admin.auth(app).verifyIdToken(tokenMatch[1]);
    const db = admin.firestore(app);
    if (await enforceDailyLimit(db, decoded.uid)) {
      return sendJson(res, 429, { error: 'Daily receipt-scan limit reached.' });
    }

    const categories = cleanNames(body.categories, DEFAULT_CATEGORIES);
    const prompt = 'Read this Hong Kong receipt and return only one JSON object, with no markdown or extra text. Use the final amount actually paid (not subtotal), and format date as YYYY-MM-DD. Keys: amount (number), date (string), description (merchant plus short purchase summary), category (choose the closest from ' + JSON.stringify(categories) + ' or a concise custom category), paymentMethod (choose from ' + JSON.stringify(PAYMENT_METHODS) + ' or use the exact custom payment-method name), customPaymentMethod (optional string when paymentMethod is Other). If a value is not visible, use an empty string for date/description/category/paymentMethod and omit customPaymentMethod.';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);
    let upstream;
    try {
      upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + openRouterKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageDataUrl } }
            ]
          }],
          temperature: 0.1
        }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!upstream.ok) {
      console.error('OpenRouter receipt scan error:', { status: upstream.status, uid: decoded.uid });
      return sendJson(res, 502, { error: 'Receipt provider request failed.' });
    }
    const providerData = await upstream.json();
    const content = providerData && providerData.choices && providerData.choices[0] &&
      providerData.choices[0].message && providerData.choices[0].message.content;
    if (!content) return sendJson(res, 502, { error: 'Receipt provider returned no extraction.' });
    return sendJson(res, 200, { content });
  } catch (error) {
    if (error && ['auth/id-token-expired', 'auth/argument-error', 'auth/invalid-id-token'].includes(error.code)) {
      return sendJson(res, 401, { error: 'Invalid or expired sign-in token.' });
    }
    console.error('Receipt scan proxy error:', error && error.message ? error.message : error);
    return sendJson(res, 500, { error: 'Receipt scanning failed.' });
  }
};
