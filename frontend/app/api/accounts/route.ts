import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${BACKEND_URL}/accounts/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: response.status })
    }

    const data = await response.json()
    // Map backend response to frontend expected format
    const mappedData = data.map((acc: { account_number: string; account_name: string; id: number; user_id: number; balance: string }) => ({
      ...acc,
      balance: parseFloat(acc.balance),
    }))
    return NextResponse.json(mappedData)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/accounts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: response.status })
    }

    const data = await response.json()
    // Map backend response to frontend expected format
    const mappedData = {
      ...data,
      balance: parseFloat(data.balance),
    } as { account_number: string; account_name: string; id: number; user_id: number; balance: number }
    return NextResponse.json(mappedData)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}