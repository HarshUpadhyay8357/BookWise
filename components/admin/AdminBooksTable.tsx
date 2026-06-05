"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import dayjs from 'dayjs'
import BookCover from '@/components/BookCover'

interface AdminBook {
  id: string
  title: string
  author: string
  genre: string
  coverUrl: string
  coverColor: string
  summary: string
  createdAt: string
}

interface Props {
  books: AdminBook[]
}

const AdminBooksTable = ({ books }: Props) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Delete this book? This action cannot be undone.')
    if (!confirmed) return

    setDeletingId(id)

    try {
      const res = await fetch('/api/admin/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Unable to delete book')
      }

      router.refresh()
    } catch (error) {
      console.error('Delete failed', error)
      alert('Could not delete the book. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full rounded-lg border">
      <table className="w-full text-left">
        <thead className="bg-[#f8fafc]">
          <tr>
            <th className="p-4">Book Title</th>
            <th className="p-4">Author</th>
            <th className="p-4">Genre</th>
            <th className="p-4">Date Created</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t font-ibm-plex-sans">
              <td className="p-4 align-middle">
                <div className="flex items-center gap-4">
                  <div>
                    <Link href={`/books/${book.id}`} className="font-semibold text-slate-900">
                      {book.title}
                    </Link>
                  </div>
                </div>
              </td>
              <td className="p-4 align-middle">{book.author}</td>
              <td className="p-4 align-middle">{book.genre}</td>
              <td className="p-4 align-middle">{dayjs(book.createdAt).format('MMM D YYYY')}</td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-red-500 font-semibold cursor-pointer"
                    onClick={() => handleDelete(book.id)}
                    disabled={deletingId === book.id}
                  >
                    {deletingId === book.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminBooksTable
