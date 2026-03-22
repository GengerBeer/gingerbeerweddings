import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_EMAIL || 'hello@gingerbeerstudio.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, role, date, projectType, message } = req.body;

  if (!name || !email || !role || !projectType || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: missing RESEND_API_KEY' });
  }

  const roleLabel = role === 'couple' ? 'Couple' : 'Videographer';
  const projectLabels: Record<string, string> = {
    teaser: 'Teaser Film',
    highlight: 'Highlight Film',
    full: 'Full Wedding Film',
    photo: 'Photo Retouching',
    other: 'Other / Custom',
  };

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #1c2b2b; padding: 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #d4b896; margin: 0; font-size: 22px; letter-spacing: 0.05em;">
          New Inquiry — Ginger Beer Weddings
        </h1>
      </div>
      <div style="background: #f9f6f2; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e8e0d5;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e8e0d5;">
            <td style="padding: 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; width: 140px;">Name</td>
            <td style="padding: 12px 0; font-size: 15px;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e8e0d5;">
            <td style="padding: 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
            <td style="padding: 12px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #1c2b2b;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #e8e0d5;">
            <td style="padding: 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">I Am a</td>
            <td style="padding: 12px 0; font-size: 15px;">${roleLabel}</td>
          </tr>
          ${date ? `
          <tr style="border-bottom: 1px solid #e8e0d5;">
            <td style="padding: 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Wedding Date</td>
            <td style="padding: 12px 0; font-size: 15px;">${date}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #e8e0d5;">
            <td style="padding: 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Project Type</td>
            <td style="padding: 12px 0; font-size: 15px;">${projectLabels[projectType] || projectType}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; font-size: 15px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e8e0d5;">
          <a href="mailto:${email}" style="display: inline-block; background: #1c2b2b; color: #d4b896; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 13px; letter-spacing: 0.05em;">
            Reply to ${name}
          </a>
        </div>
      </div>
      <p style="text-align: center; color: #aaa; font-size: 11px; margin-top: 16px;">
        Ginger Beer Weddings · gingerbeerweddings.vercel.app
      </p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ginger Beer Weddings <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Inquiry from ${name} — ${projectLabels[projectType] || projectType}`,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
