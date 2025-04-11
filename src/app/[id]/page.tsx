'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Note {
  id: string
  content: string
  createdAt: string
}

export default function NotePage() {
  const params = useParams()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes?id=${params.id}`)
        if (!response.ok) {
          throw new Error('Note not found')
        }
        const data = await response.json()
        setNote(data)
      } catch (err) {
        setError('Failed to load note')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-700 text-center">{error || 'Note not found'}</p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="whitespace-pre-wrap mb-4">{note.content}</p>
          <p className="text-sm text-gray-500">
            Created: {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
} 