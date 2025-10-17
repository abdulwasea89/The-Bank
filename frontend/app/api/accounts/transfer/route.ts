import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    console.log('Transfer API called')
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      console.log('No token')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Transfer body:', body)
    const response = await fetch(`${BACKEND_URL}/accounts/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('Backend response status:', response.status)
    if (!response.ok) {
      const errorData = await response.json()
      console.log('Backend error:', errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    console.log('Backend success:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Transfer API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}