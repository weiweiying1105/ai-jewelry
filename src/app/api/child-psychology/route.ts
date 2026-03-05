import { NextRequest, NextResponse } from 'next/server';
import ChildPsychologyService from '@/utils/ChildPsychologyService';
import { ChildPsychologyData } from '@/utils/ChildPsychology';



export async function POST(request: NextRequest) {
  try {
    const data: ChildPsychologyData = await request.json();
    const { answers } = data;

    // 调用AI服务生成心理分析
    const psychologyResult = await ChildPsychologyService.generatePsychologyAnalysis({ answers });

    return NextResponse.json(psychologyResult);
  } catch (error) {
    console.error('Error in child psychology API:', error);
    return NextResponse.json(
      { error: '心理分析生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
