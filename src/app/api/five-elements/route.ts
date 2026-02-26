import { NextRequest, NextResponse } from 'next/server';

// 生成五行能量数据
const generateFiveElementsData = (chineseCalendar: string) => {
  // 模拟五行能量数据生成
  // 在实际应用中，这里应该根据八字信息进行真实的五行分析
  const elements = ['金', '木', '水', '火', '土'];
  const data = elements.map(element => {
    // 基于八字信息生成不同的能量值
    // 这里使用简单的随机数模拟，实际应用中应该有更复杂的算法
    const baseValue = 50;
    const variation = Math.floor(Math.random() * 40) - 20; // -20 到 20 的随机变化
    const value = Math.max(0, Math.min(100, baseValue + variation));
    return {
      element,
      value
    };
  });
  return data;
};

export async function POST(request: NextRequest) {
  try {
    const { chineseCalendar } = await request.json();
    
    if (!chineseCalendar) {
      return NextResponse.json(
        { error: '缺少八字信息' },
        { status: 400 }
      );
    }
    
    const fiveElementsData = generateFiveElementsData(chineseCalendar);
    
    return NextResponse.json({
      success: true,
      data: fiveElementsData
    });
  } catch (error) {
    console.error('生成五行能量数据失败:', error);
    return NextResponse.json(
      { error: '生成五行能量数据失败' },
      { status: 500 }
    );
  }
}
