import { handleSendOtp, handleVerifyOtp } from './otp.js';
import { handleGetBooking } from './bookings.js';
import { json, jsonError } from './lib/responses.js';
import { applyCors, handlePreflight } from './lib/cors.js';

const routes = [
  { method: 'POST', pattern: /^\/api\/otp\/send\/?$/, handler: handleSendOtp },
  { method: 'POST', pattern: /^\/api\/otp\/verify\/?$/, handler: handleVerifyOtp },
  {
    method: 'GET',
    pattern: /^\/api\/bookings\/([^/]+)\/?$/,
    handler: handleGetBooking,
  },
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return handlePreflight(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return applyCors(json({ ok: true, status: 'healthy' }), request, env);
    }

    for (const route of routes) {
      if (request.method !== route.method) continue;
      const match = url.pathname.match(route.pattern);
      if (!match) continue;
      try {
        const response = await route.handler(request, env, {
          params: match.slice(1),
        });
        return applyCors(response, request, env);
      } catch (err) {
        console.error('Route error:', err);
        return applyCors(jsonError('Internal error', 500), request, env);
      }
    }

    return applyCors(jsonError('Not found', 404), request, env);
  },
};
