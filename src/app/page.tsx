'use client'

import { useState } from 'react'

export default function Home() {
  const [content, setContent] = useState('')
  const [noteUrl, setNoteUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const createNote = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNoteUrl('')

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create note')
      }

      const data = await response.json()
      const noteUrl = `${window.location.origin}/${data.id}`
      setNoteUrl(noteUrl)
      setContent('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Notes Sharing Tool</h1>
        
        <form onSubmit={createNote} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note here..."
            className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {noteUrl && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-700 mb-2">Note created successfully! Share this link:</p>
            <input
              type="text"
              value={noteUrl}
              readOnly
              className="w-full p-2 bg-white border rounded"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        )}
      </div>
    </main>
  )
}
