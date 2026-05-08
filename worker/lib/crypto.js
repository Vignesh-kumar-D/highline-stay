const encoder = new TextEncoder();

function bytesToHex(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, '0');
  }
  return s;
}

export function generateOtp() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return (bytes[0] % 1_000_000).toString().padStart(6, '0');
}

export function generateSalt(byteLen = 16) {
  const bytes = new Uint8Array(byteLen);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export async function hashOtp({ pepper, salt, code }) {
  const data = encoder.encode(`${pepper}|${salt}|${code}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

const REF_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function generateBookingRef(prefix = 'HLS') {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return `${prefix}-${s}`;
}
