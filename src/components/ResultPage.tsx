'use client';

import React from 'react';
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
    fatePattern?: string;
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
  
  // 直接使用推荐API返回的五行数据
  const fiveElementsData = (recommendation as any).fiveElementsData || null;
  const loading = false;

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
    <div className="flex flex-col items-center justify-center min-h-screen  bg-gray-50">
      <div className="relative w-full max-w-[430px] mx-auto bg-[var(--bg-gradient)] shadow-2xl overflow-x-hidden rounded-2xl">
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/30 backdrop-blur-md border-b border-white/20">
          <button onClick={() => router.back()} className="size-10 flex items-center justify-center bg-white/60 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <h1 className="font-serif font-bold text-mystic-purple tracking-widest text-sm">你的解析报告</h1>
          <button onClick={() => navigator.share?.({ title: '解析报告', url: typeof window !== 'undefined' ? window.location.href : '' })} className="d-none">
            {/* <span className="material-symbols-outlined text-xl">share</span> */}
          </button>
        </header>
        <div className="pt-2 pb-10">
          {recommendation.error ? (
            <div className="text-center text-red-500 mb-8">{recommendation.error}</div>
          ) : (
            <>
              {/* 第一屏：你的守护石 + 三个身份标签 */}
              <section className="relative pt-4 pb-8 px-8 flex flex-col items-center text-center">
                <div className="mb-6">
                  <p className="text-[11px] tracking-[0.4em] text-mystic-purple/60 uppercase mb-2 font-bold">The Guardian Oracle</p>
                  <h2 className="font-serif text-2xl text-mystic-purple tracking-[0.2em] flex items-center justify-center gap-3 text-center">
                    <span className="w-6 h-[1px] bg-mystic-purple/20"></span>
                    开运守护石<br/>{guardianStoneName}
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
                  <div className="relative w-full aspect-square flex flex-col items-center justify-center mb-12">
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none radius-50%">
                      <img alt="Spirit Gem" className="w-64 h-64 object-cover rounded-full mix-blend-multiply blur-xl opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiuPAS8B5dGerJEPBJPGwr1zbw0CiQ4s8Yrgp_9W9Mc8CI7i8igTLF6_cnFqAk0zFZcY4ubqj270yODgNTs0BFYvHctdqAwnx5Jn2AuftZDLzCOrpSs1wk8zh48kod31CpqdHwmiGydrPsOowNA3qd5BaX4c38UWc0juP0z-3ofd0FbfpDMk6zxQN055tGWuX2UOVYdq0bour53HRAWqzb0dguCk6Z5b2AOL0aEWTWoxWNKY1ynBqDtp-xq3QJADGzJIu7JqO3VBQ" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-6">
                     {tags[0] && (
                      <div className="self-start bg-white px-6 py-4 rounded-2xl border border-purple-200 rotate-[-4deg] shadow-xl shadow-purple-200/50">
                        <span className="font-serif text-2xl font-black text-purple-600">{tags[0]}</span>
                      </div>
                    )}
                    {tags[1] && (
                      <div className="self-end bg-white px-8 py-5 rounded-2xl border border-purple-200 rotate-[2deg] shadow-xl shadow-purple-200/50">
                        <span className="font-serif text-3xl font-black text-gray-800">{tags[1]}</span>
                      </div>
                    )}
                    {tags[2] && (
                      <div className="self-center bg-white px-6 py-4 rounded-2xl border border-purple-200 rotate-[-2deg] shadow-xl shadow-purple-200/50">
                        <span className="font-serif text-2xl font-black text-purple-500">{tags[2]}</span>
                      </div>
                    )}
                    </div>
                  </div>
                
                </div>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-mystic-purple/40 to-transparent"></div>
                <p className="font-serif text-lg leading-relaxed text-text-primary/90 py-6">{oneLineInsight}</p>
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-mystic-purple/40 to-transparent"></div>
              </section>

              {/* 第二屏：五行图 + 一句话解读 + 元素解析 */}
              <section className="space-y-6 px-6">
                <div className="glass-card rounded-[2rem] p-8">
                  <h3 className="font-serif text-lg mb-8 text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-mystic-purple/40">explore</span>
                    五行能量解析
                  </h3>
                  
                  {/* 五行蜘蛛网图 */}
                  <div className="mb-8">
                    {loading ? (
                      <div className="h-64 flex items-center justify-center text-gray-500">加载中...</div>
                    ) : fiveElementsData && fiveElementsData.length > 0 ? (
                      <Radar
                        data={{
                          labels: fiveElementsData.map((item: any) => item.element),
                          datasets: [
                            {
                              label: '五行能量',
                              data: fiveElementsData.map((item: any) => item.value),
                              backgroundColor: 'rgba(147, 51, 234, 0.2)',
                              borderColor: 'rgba(147, 51, 234, 1)',
                              borderWidth: 2,
                              pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                              pointBorderColor: '#fff',
                              pointHoverBackgroundColor: '#fff',
                              pointHoverBorderColor: 'rgba(147, 51, 234, 1)',
                              pointRadius: 5,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                stepSize: 20,
                              },
                              grid: {
                                color: 'rgba(147, 51, 234, 0.1)',
                              },
                              angleLines: {
                                color: 'rgba(147, 51, 234, 0.2)',
                              },
                            },
                          },
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-500">无法加载五行能量数据</div>
                    )}
                  </div>
                  
                  {elementItems && elementItems.length > 0 && (
                    <div className="space-y-4">
                      {elementItems.map((el: { emoji: string; title: string; desc: string }, idx: number) => {
                        const isFire = el.emoji === '🔥' || el.title.includes('火');
                        const isWater = el.emoji === '💧' || el.title.includes('水');
                        const isWood = el.emoji === '🌳' || el.title.includes('木');
                        const isMetal = el.emoji === '⚪' || el.title.includes('金');
                        const isEarth = el.emoji === '🪨' || el.title.includes('土');
                        
                        const bgClass = isFire
                          ? 'bg-red-100'
                          : isWater
                            ? 'bg-blue-100'
                            : isWood
                              ? 'bg-green-100'
                              : isMetal
                                ? 'bg-gray-100'
                                : isEarth
                                  ? 'bg-amber-100'
                                  : 'bg-gray-100';
                        
                        return (
                          <div key={idx} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                            <div className={`w-10 h-10 shrink-0 ${bgClass} rounded-xl flex items-center justify-center text-xl`}>
                              {el.emoji}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm mb-1">{el.title}</h4>
                              {el.desc && <p className="text-sm text-gray-600 leading-relaxed">{el.desc}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* 第三屏：你的双重性格面相 */}
              <section className="flex-1 px-8 pb-12">
                <div className="mt-4 mb-12 text-center">
                  {/* <h2 className="text-xs tracking-[0.5em] text-accent-purple mb-4 font-bold">深度解析</h2> */}
                  <h1 className="font-serif text-3xl font-bold tracking-wider gradient-text mb-2 mt-16">你的人格双面性</h1>
                  <div className="w-12 h-1 bg-accent-purple mx-auto rounded-full opacity-30"></div>
                </div>
                <div className="space-y-8 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-accent-purple/40 via-accent-purple/10 to-transparent ml-4"></div>
                  <div className="pl-10 relative">
                    <div className="absolute left-2.5 top-1 size-3 rounded-full bg-accent-purple ring-4 ring-lavender-bg"></div>
                    <div className="analysis-card p-6 rounded-3xl shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-deep-purple mb-3">【表面：{(recommendation as any).personality?.surface?.title || recommendation.psychologicalAnalysis.surface || recommendation.psychologicalAnalysis.currentState || ''}】</h3>
                      <p className="text-sm leading-relaxed text-text-main opacity-80">
                        {(recommendation as any).personality?.surface?.description || ''}
                      </p>
                    </div>
                  </div>
                  {(recommendation.psychologicalAnalysis.innerCore || recommendation.psychologicalAnalysis.logicConnection || (recommendation as any).personality?.innerCore?.title) && (
                    <div className="pl-10 relative">
                      <div className="absolute left-2.5 top-1 size-3 rounded-full bg-accent-purple/60 ring-4 ring-lavender-bg"></div>
                      <div className="analysis-card p-6 rounded-3xl shadow-sm">
                        <h3 className="font-serif text-lg font-bold text-deep-purple mb-3">【内核：{(recommendation as any).personality?.innerCore?.title || recommendation.psychologicalAnalysis.innerCore || recommendation.psychologicalAnalysis.logicConnection}】</h3>
                        <p className="text-sm leading-relaxed text-text-main opacity-80">
                          {(recommendation as any).personality?.innerCore?.description || ''}
                        </p>
                      </div>
                    </div>
                  )}
                  {(recommendation.psychologicalAnalysis.truth || recommendation.psychologicalAnalysis.personalityDuality || (recommendation as any).personality?.truth?.title) && (
                    <div className="pl-10 relative">
                      <div className="absolute left-2.5 top-1 size-3 rounded-full bg-accent-purple/30 ring-4 ring-lavender-bg"></div>
                      <div className="analysis-card p-6 rounded-3xl shadow-sm border-accent-purple/20">
                        <h3 className="font-serif text-lg font-bold text-deep-purple mb-3">【真相：{(recommendation as any).personality?.truth?.title || recommendation.psychologicalAnalysis.truth || recommendation.psychologicalAnalysis.personalityDuality}】</h3>
                        <p className="text-sm leading-relaxed text-text-main opacity-80">
                          {(recommendation as any).personality?.truth?.description || ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className="mt-16 text-center">
                  <p className="text-xs text-text-muted mb-6 tracking-widest">— 基于灵魂特质为你推荐 —</p>
                  <div className="flex justify-center gap-2">
                    <div className="size-2 rounded-full bg-accent-purple/20"></div>
                    <div className="size-2 rounded-full bg-accent-purple/40"></div>
                    <div className="size-2 rounded-full bg-accent-purple"></div>
                  </div>
                </div> */}
              </section>

              {/* 第四屏：具体佩戴推荐 */}
              {parsedItems && parsedItems.length > 0 && (
                <section className="flex-1 px-6 pt-8 pb-24">
                  <div className="mb-10 text-center">
                    <span className="text-[10px] tracking-[0.4em] text-lavender-accent uppercase font-semibold">Curation for You</span>
                    <h2 className="mt-2 font-serif text-2xl text-text-main">基于灵性特质的选物</h2>
                    <div className="mt-4 flex justify-center gap-2">
                      {tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-lavender-light text-lavender-accent text-xs rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {parsedItems.map((item, idx) => (
                      <div key={idx} className="recommendation-card rounded-2xl p-5 flex items-start gap-4 border border-lavender-soft">
                        <div className="mt-1 check-circle size-6 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm bg-purple-500">
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-semibold text-text-main mb-1">{item.title}</h3>
                          <p className="text-sm text-text-sub leading-relaxed">
                            {item.bullets.join('，')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-6 bg-lavender-light/50 rounded-3xl border border-dashed border-lavender-accent/30 text-center">
                    <span className="material-symbols-outlined text-lavender-accent/40 block mb-2">auto_awesome</span>
                    <p className="font-serif text-[15px] italic text-text-sub leading-loose">
                      "首饰不仅是点缀，更是你与宇宙能量对话的媒介。"
                    </p>
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