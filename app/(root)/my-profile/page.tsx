import BookList from '@/components/BookList'
import { auth } from '@/auth'
import { db } from '@/database/drizzle'
import { books, borrowRecords } from '@/database/schema'
import { eq } from 'drizzle-orm'

const page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return <p className="text-light-200">Please sign in to view your borrowed books.</p>;
  }

  const borrowedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      description: books.description,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      videoUrl: books.videoUrl,
      summary: books.summary,
      createdAt: books.createdAt,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session.user.id))
    .where(eq(borrowRecords.status, 'Borrowed'));

  if (!borrowedBooks.length) {
    return <p className="text-light-200">You have no borrowed books right now.</p>;
  }

  return (
    <>
      <BookList title='borrowed books' books={borrowedBooks} />
    </>
  )
}

export default page;