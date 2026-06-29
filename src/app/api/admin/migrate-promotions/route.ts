import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// One-time migration endpoint to create the promotion_pricing table
// DELETE THIS FILE after the table is created successfully
export async function GET() {
  try {
    // Create the table using raw SQL
    await (prisma as any).$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS promotion_pricing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        promotion_type VARCHAR(50) NOT NULL,
        duration_days INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_promotion_duration (promotion_type, duration_days)
      )
    `);

    // Seed default pricing data
    const defaults = [
      { type: 'top_ad', days: 7, price: 9.99 },
      { type: 'top_ad', days: 14, price: 15.99 },
      { type: 'top_ad', days: 30, price: 24.99 },
      { type: 'top_ad', days: 90, price: 59.99 },
      { type: 'top_ad', days: 180, price: 99.99 },
      { type: 'top_ad', days: 365, price: 179.99 },
      { type: 'highlighted', days: 7, price: 4.99 },
      { type: 'highlighted', days: 14, price: 7.99 },
      { type: 'highlighted', days: 30, price: 12.99 },
      { type: 'highlighted', days: 90, price: 29.99 },
      { type: 'highlighted', days: 180, price: 49.99 },
      { type: 'highlighted', days: 365, price: 89.99 },
      { type: 'urgent', days: 7, price: 5.99 },
      { type: 'urgent', days: 14, price: 9.99 },
      { type: 'urgent', days: 30, price: 14.99 },
      { type: 'urgent', days: 90, price: 34.99 },
      { type: 'urgent', days: 180, price: 59.99 },
      { type: 'urgent', days: 365, price: 99.99 },
      { type: 'home_gallery', days: 7, price: 14.99 },
      { type: 'home_gallery', days: 14, price: 24.99 },
      { type: 'home_gallery', days: 30, price: 39.99 },
      { type: 'home_gallery', days: 90, price: 89.99 },
      { type: 'home_gallery', days: 180, price: 149.99 },
      { type: 'home_gallery', days: 365, price: 249.99 },
    ];

    for (const d of defaults) {
      await (prisma as any).$executeRawUnsafe(
        `INSERT IGNORE INTO promotion_pricing (promotion_type, duration_days, price) VALUES (?, ?, ?)`,
        d.type, d.days, d.price
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'promotion_pricing table created and seeded with default data!' 
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
