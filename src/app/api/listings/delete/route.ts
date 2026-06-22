import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Listing ID required' }, { status: 400 });
    }

    const deleteAll = data.delete_all === true;
    let targetId = parseInt(data.id, 10);

    if (deleteAll) {
      const parentCheck = await prisma.listings.findUnique({
        where: { id: targetId },
        select: { parent_id: true }
      });
      if (parentCheck && parentCheck.parent_id) {
        targetId = parentCheck.parent_id;
      }
    }

    await prisma.listings.delete({
      where: { id: targetId }
    });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
