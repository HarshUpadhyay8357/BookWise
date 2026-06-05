import { NextResponse } from 'next/server';
import { createBook } from '@/lib/admin/actions/book';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createBook(body);
    if (result.success) return NextResponse.json(result);
    return NextResponse.json(result, { status: 500 });
  } catch (err) {
    console.error('API createBook error', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, message: 'Book id is required' }, { status: 400 });
    }

    await db.delete(books).where(eq(books.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API deleteBook error', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
