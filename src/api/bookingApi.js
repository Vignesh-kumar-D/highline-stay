const RAW_BASE = import.meta.env.VITE_API_BASE_URL || '';
const BASE = RAW_BASE.replace(/\/$/, '');

async function request(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
    ...init,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* response not JSON */
  }

  if (!res.ok || !data || data.ok === false) {
    const message = (data && data.error) || res.statusText || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return data;
}

export function sendOtp(payload) {
  return request('/api/otp/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function verifyOtp(email, code) {
  return request('/api/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export function getBooking(bookingRef) {
  return request(`/api/bookings/${encodeURIComponent(bookingRef)}`);
}
