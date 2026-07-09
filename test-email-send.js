
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  try {
    console.log('Fetching email settings from Supabase...');
    const { data: rows, error } = await supabase
      .from('email_settings')
      .select('setting_key, setting_value');

    if (error) {
      console.error('Supabase Error:', error);
      return;
    }

    if (!rows || rows.length === 0) {
      console.error('No email settings found in the database. (Could be RLS issue if using anon key)');
      return;
    }

    const settings = {};
    for (const row of rows) {
      if (row.setting_key) {
        settings[row.setting_key] = row.setting_value || '';
      }
    }

    console.log('Settings fetched:', JSON.stringify(settings, null, 2));

    if (!settings.smtp_host || !settings.smtp_username || !settings.smtp_password) {
      console.error('SMTP settings are not fully configured in the database');
      return;
    }

    console.log('Creating Nodemailer transport...');
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port) || 465,
      secure: settings.smtp_encryption === 'ssl' || settings.smtp_port === '465',
      auth: {
        user: settings.smtp_username,
        pass: settings.smtp_password,
      },
      debug: true,
      logger: true
    });

    const fromName = settings.smtp_from_name || 'Market Hub';
    const fromEmail = settings.smtp_from_email || settings.smtp_username;

    const to = 'promudithsenanayake@gmail.com'; // You can change this
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: 'Test Email from Market Hub',
      html: '<p>This is a test email.</p>',
    };

    console.log('Sending email to:', to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
  } catch (err) {
    console.error('Exception during email test:', err);
  }
}

main();
