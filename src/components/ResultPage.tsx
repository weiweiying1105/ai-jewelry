'use client';

import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRouter } from 'next/navigation';

interface ResultPageProps {
  recommendation: {
    coreConclusion: {
      tags: string[];
      insight: string;
      stone?: string;
    };
    personality: string;
    fatePattern: string;
    elements?: string[];
    psychologicalAnalysis: {
      currentState: string;
      personalityDuality: string;
      logicConnection: string;
      surface?: string;
      innerCore?: string;
      truth?: string;
    };
    transportationAdvice: string;
    jewelryDecision: string;
    error?: string;
  };
  userInfo: {
    direction: string;
    birthday: string;
    chineseCalendar: string;
  };
  answers: number[];
}

// 注册Chart.js组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ResultPage: React.FC<ResultPageProps> = ({ recommendation, userInfo }) => {
  const router = useRouter();
  // 五行能量数据状态
  const [fiveElementsData, setFiveElementsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取五行能量数据
  useEffect(() => {
    const fetchFiveElementsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/five-elements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chineseCalendar: userInfo.chineseCalendar }),
        });
        const data = await response.json();
        if (data.success) {
          setFiveElementsData(data.data);
        }
      } catch (error) {
        console.error('获取五行能量数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiveElementsData();
  }, [userInfo.chineseCalendar]);

  // 生成标签与点睛（新版方向）
  const generateTags = (direction: string) => {
    const tagsMap: { [key: string]: string[] } = {
      '爱情姻缘': ['温润如玉', '心心相印', '情定良缘'],
      '事业突破': ['锋芒毕露', '稳中求进', '创意驱动'],
      '财运提升': ['聚财稳财', '贵人相助', '灵动机会'],
      '能量平衡': ['身心和谐', '稳定舒缓', '专注平衡'],
      '贵人运': ['可信影响', '亲和共情', '人脉扩展'],
      '考试运': ['专注高效', '秩序条理', '表达自信'],
    };
    return tagsMap[direction] || ['开运吉祥', '心想事成', '万事如意'];
  };


  // 守护石名称提取（优先从标签或文案中识别）
  const knownStones = ['绿幽灵', '祖母绿', '粉晶', '摩根石', '海蓝宝', '蓝宝石', '石榴石', '红玉髓', '黄水晶', '琥珀', '黑曜石', '黄虎眼', '青金石'];
  const coreText = `${recommendation.coreConclusion.insight}\n${recommendation.jewelryDecision}`;
  const tagStones = (recommendation.coreConclusion.tags || []).filter(t => knownStones.some(s => t.includes(s)));
  const textStone = knownStones.find(s => coreText.includes(s));
  const guardianStoneName = recommendation.coreConclusion.stone || tagStones[0] || textStone || '—';

  // Use only API-provided tags and insight; no local generation
  const tags = recommendation.coreConclusion.tags ? recommendation.coreConclusion.tags.slice(0, 3) : [];
  const oneLineInsight = recommendation.coreConclusion.insight || '';

  // 计算五行一句话解读
  const fiveElementsOneLine = (() => {
    if (!loading && Array.isArray(fiveElementsData) && fiveElementsData.length > 0) {
      const sorted = [...fiveElementsData].sort((a: any, b: any) => b.value - a.value);
      const top = sorted[0];
      return `五行侧重为「${top.element}」，建议顺势而为，选择相应材质与色调以加持气场。`;
    }
    return oneLineInsight;
  })();

  // 元素强弱判定 & 解析文案（若模型已给出则优先使用）
  const getElementValue = (el: string) => {
    if (!Array.isArray(fiveElementsData)) return null;
    const found = fiveElementsData.find((i: any) => i.element === el);
    return found ? found.value : null;
  };
  const levelText = (v: number | null) => {
    if (v === null) return '未知';
    if (v >= 66) return '旺';
    if (v <= 33) return '偏弱';
    return '适中';
  };
  const fireVal = getElementValue('火');
  const waterVal = getElementValue('水');
  const woodVal = getElementValue('木');
  const fireLine = fireVal === null ? '火元素信息不足' : (levelText(fireVal) === '偏弱' ? '🔥 火元素偏弱 → 行动力容易受情绪影响' : levelText(fireVal) === '旺' ? '🔥 火元素旺 → 行动力强但易急躁' : '🔥 火元素适中 → 行动力稳健更可持续');
  const waterLine = waterVal === null ? '💧 水元素信息不足' : (levelText(waterVal) === '旺' ? '💧 水元素旺 → 思考力强但容易内耗' : levelText(waterVal) === '偏弱' ? '💧 水元素偏弱 → 表达与共情稍弱' : '💧 水元素适中 → 思维与情绪平衡良好');
  const woodLine = woodVal === null ? '🌳 木元素信息不足' : (levelText(woodVal) === '适中' ? '🌳 木适中 → 成长潜力很好' : levelText(woodVal) === '旺' ? '🌳 木旺 → 成长动力强但需节制' : '🌳 木偏弱 → 成长动力不足需激励');
  const elementPoints = recommendation.elements && recommendation.elements.length ? recommendation.elements : null;

  // 具体佩戴推荐（直接使用接口结构化字段）
  const elementItems = (recommendation as any).elementsItems as Array<{ emoji: string; title: string; desc: string }> | undefined;
  const parsedItems = (recommendation as any).recommendations as Array<{ title: string; bullets: string[] }> | undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="relative w-full max-w-[430px] mx-auto bg-[var(--bg-gradient)] shadow-2xl overflow-x-hidden rounded-2xl">
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/30 backdrop-blur-md border-b border-white/20">
          <button onClick={() => router.back()} className="size-10 flex items-center justify-center bg-white/60 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <h1 className="font-serif font-bold text-mystic-purple tracking-widest text-sm">你的命理解析报告</h1>
          <button onClick={() => navigator.share?.({ title: '命理解析报告', url: typeof window !== 'undefined' ? window.location.href : '' })} className="size-10 flex items-center justify-center bg-white/60 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </header>
        <div className="pt-2 pb-10">
          {recommendation.error ? (
            <div className="text-center text-red-500 mb-8">{recommendation.error}</div>
          ) : (
            <>
              {/* 第一屏：你的守护石 + 三个身份标签 */}
              <section className="relative pt-12 pb-16 px-8 flex flex-col items-center text-center">
                <div className="mb-6">
                  <p className="text-[11px] tracking-[0.4em] text-mystic-purple/60 uppercase mb-2 font-bold">The Guardian Oracle</p>
                  <h2 className="font-serif text-2xl text-mystic-purple tracking-[0.2em] flex items-center justify-center gap-3">
                    <span className="w-6 h-[1px] bg-mystic-purple/20"></span>
                    开运守护石：{guardianStoneName}
                    <span className="w-6 h-[1px] bg-mystic-purple/20"></span>
                  </h2>
                </div>
                <div className="relative w-full aspect-square flex flex-col items-center justify-center mb-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/40 to-transparent rounded-full blur-3xl scale-75" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {guardianStoneName && (
                      <img
                        alt={guardianStoneName}
                        className="w-48 h-48 object-cover rounded-full opacity-30 blur-md"
                        src={`https://source.unsplash.com/featured/?gemstone,${encodeURIComponent(guardianStoneName)}`}
                      />
                    )}
                  </div>
                  {/* 图片装饰移除，全部数据来自接口 */}
                  <div className="relative z-10 flex flex-col gap-5 w-full">
                    {tags[0] && (
                      <div className="self-start bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-purple-100 rotate-[-4deg]">
                        <span className="font-serif text-xl font-black text-mystic-purple">{tags[0]}</span>
                      </div>
                    )}
                    {tags[1] && (
                      <div className="self-end bg-white px-7 py-4 rounded-2xl border border-purple-100 rotate-[2deg]">
                        <span className="font-serif text-2xl font-black text-text-primary">{tags[1]}</span>
                      </div>
                    )}
                    {tags[2] && (
                      <div className="self-center bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-purple-100 rotate-[-2deg]">
                        <span className="font-serif text-xl font-black text-mystic-purple/70">{tags[2]}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="font-serif text-lg leading-relaxed text-text-primary/90">{oneLineInsight}</p>
              </section>

              {/* 第二屏：五行图 + 一句话解读 + 元素解析 */}
              <section className="space-y-6 px-6">
                <div className="glass-card rounded-[2rem] p-8">
                  <h3 className="font-serif text-lg mb-8 text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-mystic-purple/40">explore</span>
                    五行能量解析
                  </h3>
                  {elementItems && elementItems.length > 0 && (
                    <div className="space-y-4">
                      {elementItems.map((el: { emoji: string; title: string; desc: string }, idx: number) => {
                        const isFire = el.emoji === '🔥' || el.title.includes('火');
                        const isWater = el.emoji === '💧' || el.title.includes('水');
                        const isWood = el.emoji === '🌳' || el.title.includes('木');
                        const isMetal = el.emoji === '⚪' || el.title.includes('金');
                        const isEarth = el.emoji === '🪨' || el.title.includes('土');
                        const panelClass = isFire
                          ? 'bg-red-50/50 border border-red-100'
                          : isWater
                          ? 'bg-blue-50/50 border border-blue-100'
                          : isWood
                          ? 'bg-green-50/50 border border-green-100'
                          : isMetal
                          ? 'bg-gray-50/50 border border-gray-200'
                          : isEarth
                          ? 'bg-amber-50/50 border border-amber-100'
                          : 'bg-gray-50/50 border border-gray-200';
                        return (
                          <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl ${panelClass}`}>
                            <span className="text-xl">{el.emoji}</span>
                            <div>
                              <p className="font-bold text-sm">{el.title}</p>
                              {el.desc && <p className="text-xs mt-1 text-text-primary/70">{el.desc}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* 第三屏：你的双重性格面相 */}
              <section className="px-6 py-10 bg-white/20">
                <h3 className="font-serif text-xl mb-6 text-center">你的双重性格面相</h3>
                <div className="flex flex-col gap-4">
                  <div className="glass-card p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-mystic-purple/50 uppercase tracking-widest">Outer Layer</span>
                      <span className="material-symbols-outlined text-mystic-purple/40 text-lg">visibility</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold mb-2">外表：{recommendation.psychologicalAnalysis.surface || recommendation.psychologicalAnalysis.currentState || '理性克制'}</h4>
                    <p className="text-sm text-text-primary/70 leading-relaxed">在人群中你总是那个最先冷静下来的人，善于规划，逻辑严密。</p>
                  </div>
                  {(recommendation.psychologicalAnalysis.innerCore || recommendation.psychologicalAnalysis.logicConnection) && (
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-l-mystic-purple">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-mystic-purple uppercase tracking-widest">Inner Core</span>
                        <span className="material-symbols-outlined text-mystic-purple text-lg">favorite</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold mb-2">内核：{recommendation.psychologicalAnalysis.innerCore || recommendation.psychologicalAnalysis.logicConnection}</h4>
                    </div>
                  )}
                  {(recommendation.psychologicalAnalysis.truth || recommendation.psychologicalAnalysis.personalityDuality) && (
                    <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-white/80 to-purple-50/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest">The Truth</span>
                        <span className="material-symbols-outlined text-accent-gold text-lg">psychology</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold mb-2">真实：{recommendation.psychologicalAnalysis.truth || recommendation.psychologicalAnalysis.personalityDuality}</h4>
                    </div>
                  )}
                </div>
              </section>

              {/* 第四屏：具体佩戴推荐（2条） */}
              {parsedItems && parsedItems.length > 0 && (
                <section className="space-y-4 px-6">
                  <h3 className="text-xl font-bold text-slate-800">首饰推荐</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parsedItems.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <h4 className="font-semibold text-mystic-purple mb-2">✔ 推荐 {idx + 1}：{item.title}</h4>
                        <ul className="text-text-primary text-sm leading-relaxed list-disc list-inside space-y-1">
                          {item.bullets.map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;