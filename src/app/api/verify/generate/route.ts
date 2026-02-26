import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '@/utils/DatabaseService';

export async function GET(request: NextRequest) {
  try {
    const code = await DatabaseService.generateAndStoreCode();
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error generating code:', error);
    // 生成备用验证码
    const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4位数字
    return NextResponse.json({ code: fallbackCode });
  }
}
