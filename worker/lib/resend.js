const ENDPOINT = 'https://api.resend.com/emails';

export async function sendOtpEmail({ env, toEmail, code, expiryMinutes }) {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  if (!env.FROM_EMAIL) {
    throw new Error('FROM_EMAIL is not configured');
  }

  const fromName = env.FROM_NAME || 'Highline Luxurious Stay';
  const from = `${fromName} <${env.FROM_EMAIL}>`;
  const subject = `Your verification code: ${code}`;
  const text = [
    `Your Highline Luxurious Stay verification code is ${code}.`,
    '',
    `This code expires in ${expiryMinutes} minutes.`,
    `If you didn't request this, please ignore this email.`,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; max-width: 520px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #c9a961; margin-bottom: 8px;">Highline Luxurious Stay</h2>
      <p style="font-size: 15px; color: #333;">Use the code below to confirm your booking inquiry:</p>
      <p style="font-size: 30px; letter-spacing: 8px; font-weight: 700; padding: 14px 20px; background: #faf3e6; border-radius: 8px; display: inline-block; margin: 14px 0;">${code}</p>
      <p style="font-size: 14px; color: #555;">This code expires in ${expiryMinutes} minutes.</p>
      <p style="font-size: 12px; color: #888; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [toEmail],
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${errText}`);
  }
  return true;
}
