import { NextResponse } from 'next/server';
import apiClient from '@/lib/apiClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await apiClient.post('/auth/signup', body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Signup proxy error:', error.message);
    return NextResponse.json(
      { message: 'Signup failed' },
      { status: error.response?.status || 500 }
    );
  }
}
