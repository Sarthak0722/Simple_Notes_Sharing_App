import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AppError } from '@/types/errors'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const note = await prisma.note.create({
      data: { content }
    })
    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    const message = error instanceof Error ? error.message : 'Error creating note'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
  }

  try {
    const note = await prisma.note.findUnique({
      where: { id }
    })

    if (!note) {
      throw new AppError('Note not found')
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    const message = error instanceof Error ? error.message : 'Error fetching note'
    const status = error instanceof AppError ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
} 