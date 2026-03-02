import { NextRequest, NextResponse } from 'next/server';
import OpenAIService from '@/utils/OpenAIService';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const modelResult = await OpenAIService.generateJewelryRecommendation(userData);
    const apiResult = typeof modelResult === 'string' ? parseFromText(modelResult) : transformResult(modelResult);
    return NextResponse.json(apiResult);
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return NextResponse.json({ 
      error: '很抱歉，推荐生成失败，请稍后重试。建议您根据自己的喜好选择适合的首饰。' 
    });
  }
}

function transformResult(result: any) {
  const emojiMap: Record<string, string> = { 金: '⚪', 木: '🌳', 水: '💧', 火: '🔥', 土: '🪨' };

  const elementsItems = Array.isArray(result?.fiveElements)
    ? result.fiveElements.map((fe: any) => ({
        emoji: emojiMap[fe.element as string] || '',
        title: `${fe.element}元素`,
        desc: fe.analysis || ''
      }))
    : [];

  const elements = elementsItems.map((e: { emoji: string; title: string; desc: string }) =>
    `${e.emoji ? e.emoji + ' ' : ''}${e.title}${e.desc ? ' → ' + e.desc : ''}`
  );

  const recommendations = Array.isArray(result?.recommendations)
    ? result.recommendations.map((r: any) => ({
        title: r.name || '',
        bullets: [...(Array.isArray(r.benefits) ? r.benefits : []), r.scene].filter(Boolean)
      }))
    : [];

  const fiveElementsData = result?.fiveElementScore 
    ? Object.entries(result.fiveElementScore).map(([element, value]) => ({
        element,
        value: value as number
      }))
    : [];

  return {
    coreConclusion: {
      tags: Array.isArray(result?.coreStone?.tags) ? result.coreStone.tags : [],
      insight: result?.coreStone?.summary || '',
      stone: result?.coreStone?.name || ''
    },
    personality: result?.personality || '',
    elements,
    elementsItems,
    fiveElementsData,
    psychologicalAnalysis: {
      currentState: result?.personality?.surface?.title || '',
      personalityDuality: result?.personality?.truth?.title || '',
      logicConnection: result?.personality?.innerCore?.title || '',
      surface: result?.personality?.surface?.title || '',
      innerCore: result?.personality?.innerCore?.title || '',
      truth: result?.personality?.truth?.title || ''
    },
    recommendations,
    transportationAdvice: '',
    jewelryDecision: result?.materialExplanation || ''
  };
}

function parseFromText(text: string) {
  const getSection = (name: string) => {
    const m = text.match(new RegExp(`【${name}】([\s\S]*?)(?=\n\s*【|$)`));
    return m ? m[1].trim() : '';
  };
  const core = getSection('核心结论：开运守护石');
  const fate = getSection('命理格局');
  const psycho = getSection('深度心理行为分析');
  const advice = getSection('专属转运建议');
  const material = getSection('首饰定案与材质解读');

  const coreStoneMatch = core.match(/守护石名[:：]\s*(.+)/);
  const tagsMatch = core.match(/标签[:：]\s*(.+)/);
  const insightMatch = core.match(/一句话点睛[:：]\s*(.+)/);

  const stone = coreStoneMatch ? coreStoneMatch[1].trim() : '';
  const tags = tagsMatch ? tagsMatch[1].split(/[，,、\s]+/).filter(Boolean) : [];
  const insight = insightMatch ? insightMatch[1].trim() : '';

  const elementLines = fate
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^(🔥|💧|🌳|🪨|土|火|水|木)/.test(l));

  const elementsItems = elementLines.slice(0, 3).map(l => {
    const emoji = (l.match(/^(🔥|💧|🌳|🪨)/) || [''])[0];
    const parts = l.replace(/^(🔥|💧|🌳|🪨)\s*/, '').split('→');
    const title = (parts[0] || '').trim();
    const desc = (parts[1] || '').trim();
    return { emoji, title, desc };
  });

  const elements = elementsItems.map(e => `${e.emoji ? e.emoji + ' ' : ''}${e.title}${e.desc ? ' → ' + e.desc : ''}`);

  const surfaceMatch = psycho.match(/表面[:：]\s*(.+)/);
  const innerMatch = psycho.match(/内核[:：]\s*(.+)/);
  const truthMatch = psycho.match(/真相[:：]\s*(.+)/);

  const recommendations: { title: string; bullets: string[] }[] = [];
  const adviceLines = advice.split('\n').map(l => l.trim()).filter(Boolean);
  let current: { title: string; bullets: string[] } | null = null;
  for (const line of adviceLines) {
    if (/^[-•\s]*推荐\s*\d+[:：]/.test(line)) {
      if (current) recommendations.push(current);
      current = { title: line.replace(/^[-•\s]*推荐\s*\d+[:：]\s*/, ''), bullets: [] };
    } else if (current) {
      current.bullets.push(line);
    }
  }
  if (current) recommendations.push(current);

  return {
    coreConclusion: { tags, insight, stone },
    personality: '',
    elements,
    elementsItems,
    psychologicalAnalysis: {
      currentState: surfaceMatch ? surfaceMatch[1].trim() : '',
      personalityDuality: truthMatch ? truthMatch[1].trim() : '',
      logicConnection: innerMatch ? innerMatch[1].trim() : '',
      surface: surfaceMatch ? surfaceMatch[1].trim() : '',
      innerCore: innerMatch ? innerMatch[1].trim() : '',
      truth: truthMatch ? truthMatch[1].trim() : ''
    },
    recommendations,
    transportationAdvice: '',
    jewelryDecision: material
  };
}
