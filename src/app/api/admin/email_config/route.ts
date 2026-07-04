export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET — Read current email settings
export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from('email_settings')
      .select('setting_key, setting_value');

    if (error) throw error;

    const settings: Record<string, string> = {};
    for (const row of rows || []) {
      if (!row.setting_key) continue;
      // Don't expose the full password — mask it
      if (row.setting_key === 'smtp_password' && row.setting_value) {
        settings[row.setting_key] = '••••••••••••';
      } else {
        settings[row.setting_key] = row.setting_value || '';
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Email config GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — Save email settings
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    const allowedKeys = [
      'smtp_host', 'smtp_port', 'smtp_username', 
      'smtp_password', 'smtp_from_email', 'smtp_from_name', 'smtp_encryption'
    ];

    for (const [key, value] of Object.entries(data)) {
      if (!allowedKeys.includes(key)) continue;

      const valStr = String(value);

      // Skip masked password — don't overwrite with bullets
      if (key === 'smtp_password' && (!valStr || valStr === '••••••••••••')) {
        continue;
      }

      // Upsert setting
      const { data: existing } = await supabase
        .from('email_settings')
        .select('id')
        .eq('setting_key', key)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('email_settings')
          .update({ setting_value: valStr })
          .eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('email_settings')
          .insert({ setting_key: key, setting_value: valStr });
        if (insertError) throw insertError;
      }
    }

    return NextResponse.json({ success: true, message: 'Email settings saved successfully' });
  } catch (error: any) {
    console.error('Email config POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT — Test email
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const testEmail = data.test_email || '';

    if (!testEmail) {
      return NextResponse.json({ success: false, message: 'Please provide a test email address' }, { status: 400 });
    }

    // Load settings from DB
    const { data: rows, error } = await supabase.from('email_settings').select('*');
    if (error) throw error;
    
    const cfg: Record<string, string> = {};
    for (const row of rows || []) {
      if (row.setting_key) cfg[row.setting_key] = row.setting_value || '';
    }

    if (!cfg.smtp_username || !cfg.smtp_password) {
      return NextResponse.json({ success: false, message: 'SMTP credentials not configured. Please save settings first.' }, { status: 400 });
    }

    // Mock send test email
    // In local dev we just return success
    return NextResponse.json({ success: true, message: `Test email sent successfully to ${testEmail} (Simulated locally)` });

  } catch (error: any) {
    console.error('Email config PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
