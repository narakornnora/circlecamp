import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ ok:false, error:'Use external backend at NEXT_PUBLIC_BACKEND_URL' });
}
