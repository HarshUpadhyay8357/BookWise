import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { desc } from 'drizzle-orm'
import AdminBooksTable from '@/components/admin/AdminBooksTable'

const page = async () => {
  const allBooks = (await db.select().from(books).orderBy(desc(books.createdAt))) as Book[]
  const serializedBooks = allBooks.map((book) => ({
    ...book,
    createdAt: book.createdAt instanceof Date ? book.createdAt.toISOString() : String(book.createdAt),
  }))

  return (
    <section className='w-full rounded-2xl bg-white p-7'>
        <div className="flex flex-wrap justify-between items-center gap-2">
            <h2 className="font-semibold text-2xl">All Books</h2>
            <Button className='bg-primary-admin' asChild>
                <Link href='/admin/books/new' className='text-white'>+ Add a new book</Link>
            </Button>
        </div>

        <div className="mt-7 w-full overflow-hidden">
          <AdminBooksTable books={serializedBooks} />
        </div>
    </section>
  )
}

export default page