import { json, jsonError } from './lib/responses.js';
import {
  generateOtp,
  generateSalt,
  hashOtp,
  generateBookingRef,
} from './lib/crypto.js';
import { sendOtpEmail } from './lib/sendgrid.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeEmail(s) {
  return String(s || '').trim().toLowerCase();
}

function getClientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for') ||
    'unknown'
  );
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function validateDates(checkIn, checkOut) {
  if (!ISO_DATE_RE.test(checkIn) || !ISO_DATE_RE.test(checkOut)) {
    return 'Invalid date format';
  }
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
    return 'Invalid dates';
  }
  if (outDate <= inDate) return 'Check-out must be after check-in';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (inDate < today) return 'Check-in cannot be in the past';
  return null;
}

const RATE_LIMIT_PER_EMAIL_PER_HOUR = 3;

export async function handleSendOtp(request, env) {
  const body = await readJson(request);
  if (!body) return jsonError('Invalid JSON body', 400);

  const email = normalizeEmail(body.email);
  if (!EMAIL_RE.test(email)) return jsonError('Invalid email', 400);

  const adults = Number(body.adults);
  const children = Number(body.children ?? 0);
  if (!Number.isInteger(adults) || adults < 1 || adults > 30) {
    return jsonError('Adults must be 1-30', 400);
  }
  if (!Number.isInteger(children) || children < 0 || children > 10) {
    return jsonError('Children must be 0-10', 400);
  }

  const dateError = validateDates(body.checkIn, body.checkOut);
  if (dateError) return jsonError(dateError, 400);

  const ip = getClientIp(request);

  const recent = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM otp_challenges
     WHERE email = ? AND created_at >= datetime('now', '-1 hour')`
  )
    .bind(email)
    .first();

  if ((recent?.c ?? 0) >= RATE_LIMIT_PER_EMAIL_PER_HOUR) {
    return jsonError(
      'Too many OTP requests for this email. Please try again later.',
      429
    );
  }

  const code = generateOtp();
  const salt = generateSalt();
  const codeHash = await hashOtp({
    pepper: env.OTP_PEPPER || '',
    salt,
    code,
  });
  const expiryMinutes = parseInt(env.OTP_EXPIRY_MINUTES || '10', 10);

  const meta = {
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    adults,
    children,
    ip,
  };

  await env.DB.prepare(
    `INSERT INTO otp_challenges (email, purpose, code_hash, salt, expires_at, metadata_json)
     VALUES (?, 'booking_inquiry', ?, ?, datetime('now', ?), ?)`
  )
    .bind(email, codeHash, salt, `+${expiryMinutes} minutes`, JSON.stringify(meta))
    .run();

  const testMode = String(env.TEST_MODE || '').toLowerCase() === 'true';
  let emailSent = false;
  let sendError = null;

  if (env.SENDGRID_API_KEY && env.FROM_EMAIL) {
    try {
      await sendOtpEmail({ env, toEmail: email, code, expiryMinutes });
      emailSent = true;
    } catch (err) {
      console.error('SendGrid error:', err && err.message);
      sendError = err && err.message ? String(err.message) : 'SendGrid send failed';
    }
  }

  if (!emailSent && !testMode) {
    return jsonError(
      sendError || 'Email service not configured. Please contact support.',
      502
    );
  }

  if (!emailSent && testMode) {
    console.log(`[TEST_MODE] OTP for ${email} = ${code}`);
  }

  const response = { ok: true, expiresInMinutes: expiryMinutes, emailSent };
  if (testMode) {
    response.testMode = true;
    response.devCode = code;
    if (sendError) response.sendError = sendError;
  }

  return json(response);
}

export async function handleVerifyOtp(request, env) {
  const body = await readJson(request);
  if (!body) return jsonError('Invalid JSON body', 400);

  const email = normalizeEmail(body.email);
  const code = String(body.code || '').trim();
  if (!EMAIL_RE.test(email)) return jsonError('Invalid email', 400);
  if (!/^\d{6}$/.test(code)) return jsonError('Invalid code format', 400);

  const challenge = await env.DB.prepare(
    `SELECT id, code_hash, salt, expires_at, attempts, metadata_json
     FROM otp_challenges
     WHERE email = ? AND consumed_at IS NULL
     ORDER BY created_at DESC LIMIT 1`
  )
    .bind(email)
    .first();

  if (!challenge) {
    return jsonError('No active OTP found. Please request a new code.', 400);
  }

  const maxAttempts = parseInt(env.OTP_MAX_ATTEMPTS || '5', 10);
  if (challenge.attempts >= maxAttempts) {
    return jsonError('Too many attempts. Please request a new code.', 429);
  }

  const expCheck = await env.DB.prepare(
    `SELECT (expires_at <= datetime('now')) AS is_expired
     FROM otp_challenges WHERE id = ?`
  )
    .bind(challenge.id)
    .first();

  if (expCheck?.is_expired) {
    return jsonError('Code has expired. Please request a new one.', 400);
  }

  const expectedHash = await hashOtp({
    pepper: env.OTP_PEPPER || '',
    salt: challenge.salt,
    code,
  });

  if (expectedHash !== challenge.code_hash) {
    await env.DB.prepare(
      `UPDATE otp_challenges SET attempts = attempts + 1 WHERE id = ?`
    )
      .bind(challenge.id)
      .run();
    return jsonError('Incorrect code', 400);
  }

  await env.DB.prepare(
    `UPDATE otp_challenges SET consumed_at = datetime('now') WHERE id = ?`
  )
    .bind(challenge.id)
    .run();

  const meta = challenge.metadata_json ? JSON.parse(challenge.metadata_json) : {};
  let bookingRef = null;
  let lastErr = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateBookingRef();
    try {
      await env.DB.prepare(
        `INSERT INTO bookings (booking_ref, email, check_in, check_out, adults, children, status)
         VALUES (?, ?, ?, ?, ?, ?, 'otp_verified')`
      )
        .bind(
          candidate,
          email,
          meta.checkIn,
          meta.checkOut,
          meta.adults || 1,
          meta.children || 0
        )
        .run();
      bookingRef = candidate;
      break;
    } catch (err) {
      lastErr = err;
    }
  }

  if (!bookingRef) {
    console.error('Failed to insert booking after retries', lastErr);
    return jsonError('Failed to create booking. Please try again.', 500);
  }

  return json({
    ok: true,
    bookingRef,
    booking: {
      bookingRef,
      email,
      checkIn: meta.checkIn,
      checkOut: meta.checkOut,
      adults: meta.adults || 1,
      children: meta.children || 0,
      status: 'otp_verified',
    },
  });
}
