import { NextRequest, NextResponse } from 'next/server';
import OpenAIService from '@/utils/OpenAIService';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const recommendationText = await OpenAIService.generateJewelryRecommendation(userData);
    
    // 解析推荐文本为结构化JSON
    const parsedRecommendation = parseRecommendation(recommendationText);
    
    return NextResponse.json(parsedRecommendation);
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return NextResponse.json({ 
      error: '很抱歉，推荐生成失败，请稍后重试。建议您根据自己的喜好选择适合的首饰。' 
    });
  }
}

function parseRecommendation(text: string) {
  const sections = {
    coreConclusion: extractSection(text, '核心结论：开运守护石'),
    personality: extractSection(text, '性格画像'),
    fatePattern: extractSection(text, '命理格局'),
    psychologicalAnalysis: extractSection(text, '深度心理行为分析'),
    transportationAdvice: extractSection(text, '专属转运建议'),
    jewelryDecision: extractSection(text, '首饰定案与材质解读')
  };
  
  // 进一步解析核心结论中的标签和点睛
  const coreConclusionLines = sections.coreConclusion.split('\n').filter(line => line.trim());
  const tagsLine = coreConclusionLines.find(line => line.includes('关键词') || line.includes('标签'));
  const insightLine = coreConclusionLines.find(line => line.includes('点睛') || line.length > 10 && !line.includes('关键词') && !line.includes('标签'));
  
  return {
    coreConclusion: {
      tags: tagsLine ? tagsLine.split(/[,，、]/).map(tag => tag.trim()).filter(tag => tag) : [],
      insight: insightLine || ''
    },
    personality: sections.personality,
    fatePattern: sections.fatePattern,
    psychologicalAnalysis: {
      currentState: extractSubSection(sections.psychologicalAnalysis, '当前状态'),
      personalityDuality: extractSubSection(sections.psychologicalAnalysis, '性格双面性'),
      logicConnection: extractSubSection(sections.psychologicalAnalysis, '逻辑关联')
    },
    transportationAdvice: sections.transportationAdvice,
    jewelryDecision: sections.jewelryDecision
  };
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`【${sectionName}】([\\s\\S]*?)(?=【|$)`);
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractSubSection(text: string, subSectionName: string): string {
  const lines = text.split('\n');
  const subSectionLine = lines.find(line => line.includes(subSectionName));
  return subSectionLine ? subSectionLine.replace(`${subSectionName}：`, '').trim() : '';
}
