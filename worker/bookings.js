import { json, jsonError } from './lib/responses.js';

export async function handleGetBooking(request, env, { params }) {
  const ref = decodeURIComponent((params[0] || '').trim());
  if (!/^HLS-[A-Z0-9]{4,16}$/.test(ref)) {
    return jsonError('Invalid booking reference', 400);
  }

  const row = await env.DB.prepare(
    `SELECT booking_ref AS bookingRef,
            email,
            check_in   AS checkIn,
            check_out  AS checkOut,
            adults,
            children,
            status,
            created_at AS createdAt
     FROM bookings WHERE booking_ref = ? LIMIT 1`
  )
    .bind(ref)
    .first();

  if (!row) return jsonError('Booking not found', 404);
  return json({ ok: true, booking: row });
}
