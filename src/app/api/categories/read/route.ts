import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        IsActive: true
      },
      orderBy: {
        SortOrder: 'asc'
      }
    });

    const buildCategoryTree = (elements: any[], parentId: number | null = null): any[] => {
      const branch: any[] = [];
      for (const element of elements) {
        if (element.ParentCategoryID === parentId) {
          const children = buildCategoryTree(elements, element.CategoryID);
          element.children = children;
          branch.push(element);
        }
      }
      return branch;
    };

    const tree = buildCategoryTree(categories, null);

    return NextResponse.json({
      success: true,
      data: tree
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: "Database read error: " + error.message
    }, { status: 500 });
  }
}
