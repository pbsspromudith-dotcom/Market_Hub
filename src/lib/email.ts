import nodemailer from 'nodemailer';
import { supabase } from './supabase';

export async function sendEmail(to: string, subject: string, html: string) {
  // Fetch SMTP settings from the database
  const { data: rows, error } = await supabase
    .from('email_settings')
    .select('setting_key, setting_value');

  if (error || !rows) {
    throw new Error('Failed to fetch email settings');
  }

  const settings: Record<string, string> = {};
  for (const row of rows) {
    if (row.setting_key) {
      settings[row.setting_key] = row.setting_value || '';
    }
  }

  if (!settings.smtp_host || !settings.smtp_username || !settings.smtp_password) {
    throw new Error('SMTP settings are not fully configured in the database');
  }

  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    host: settings.smtp_host,
    port: parseInt(settings.smtp_port) || 465,
    secure: settings.smtp_encryption === 'ssl' || settings.smtp_port === '465',
    auth: {
      user: settings.smtp_username,
      pass: settings.smtp_password,
    },
  });

  const fromName = settings.smtp_from_name || 'Market Hub';
  const fromEmail = settings.smtp_from_email || settings.smtp_username;



  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export function getThemedEmailHtml(title: string, contentHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F7F7F7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <!-- Brand Red Top Accent bar -->
        <div style="height: 4px; background-color: #D72638; line-height: 4px; font-size: 1px;">&nbsp;</div>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F7; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);">
                
                <!-- Branded Header -->
                <tr>
                  <td align="center" style="padding: 25px 40px; border-bottom: 1px solid #F1F5F9; background-color: #ffffff;">
                    <img src="https://hitads.ca/logo.png" alt="HitAds.ca" style="height: 42px; display: block; outline: none; border: none; text-decoration: none;" />
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 40px; color: #111111;">
                    ${contentHtml}
                  </td>
                </tr>

                <!-- Branded Footer -->
                <tr>
                  <td align="center" style="padding: 0 40px 40px 40px; background-color: #ffffff;">
                    <p style="margin: 0 0 6px 0; font-size: 11px; line-height: 1.5; color: #5B616A; font-weight: 800; text-transform: uppercase; tracking-wider;">
                      HitAds.ca
                    </p>
                    <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #5B616A;">
                      © ${new Date().getFullYear()} HitAds.ca. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
