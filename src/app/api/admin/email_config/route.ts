export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — Read current email settings
export async function GET() {
  try {
    const rows = await prisma.email_settings.findMany({
      select: { setting_key: true, setting_value: true }
    });

    const settings: Record<string, string> = {};
    for (const row of rows) {
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

    await prisma.$transaction(async (tx) => {
      for (const [key, value] of Object.entries(data)) {
        if (!allowedKeys.includes(key)) continue;

        const valStr = String(value);

        // Skip masked password — don't overwrite with bullets
        if (key === 'smtp_password' && (!valStr || valStr === '••••••••••••')) {
          continue;
        }

        // Upsert setting
        const existing = await tx.email_settings.findFirst({ where: { setting_key: key } });
        if (existing) {
          await tx.email_settings.update({
            where: { id: existing.id },
            data: { setting_value: valStr }
          });
        } else {
          await tx.email_settings.create({
            data: { setting_key: key, setting_value: valStr }
          });
        }
      }
    });

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
    const rows = await prisma.email_settings.findMany();
    const cfg: Record<string, string> = {};
    for (const row of rows) {
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
