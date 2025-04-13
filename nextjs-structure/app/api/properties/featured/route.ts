import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const featuredProperties = await db.query.properties.findMany({
      where: eq(properties.featured, true),
      orderBy: [desc(properties.rating)],
      limit: 4,
    });
    
    return NextResponse.json(featuredProperties);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}