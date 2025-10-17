import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const formData = new FormData()
    formData.append('username', body.email)
    formData.append('password', body.password)

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Login failed' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}