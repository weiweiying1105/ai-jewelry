import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/utils/DatabaseService';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    const isValid = await DatabaseService.verifyCode(code);
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json({ valid: false });
  }
}
