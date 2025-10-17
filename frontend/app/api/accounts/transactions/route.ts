import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountNumber = searchParams.get('account_number')

    const url = accountNumber
      ? `${BACKEND_URL}/accounts/transactions?account_number=${accountNumber}`
      : `${BACKEND_URL}/accounts/transactions`

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: response.status })
    }

    const data = await response.json()
    // Map backend response to frontend expected format
    const mappedData = data.map((tx: { transfer_id: number; direction: string; counterparty_account_number: string; amount: string; description: string; status: string; occurred_at: string }) => ({
      id: tx.transfer_id,
      amount: parseFloat(tx.amount),
      description: tx.description,
      timestamp: tx.occurred_at,
      direction: tx.direction,
      counterparty: tx.counterparty_account_number,
    }))
    return NextResponse.json(mappedData)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}