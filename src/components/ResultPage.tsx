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

interface ResultPageProps {
  recommendation: {
    coreConclusion: {
      tags: string[];
      insight: string;
    };
    personality: string;
    fatePattern: string;
    psychologicalAnalysis: {
      currentState: string;
      personalityDuality: string;
      logicConnection: string;
    };
    transportationAdvice: string;
    jewelryDecision: string;
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

const ResultPage: React.FC<ResultPageProps> = ({ recommendation, userInfo, answers }) => {
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
          headers: {
            'Content-Type': 'application/json',
          },
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

  // 生成关键词标签（作为备用）
  const generateTags = (direction: string) => {
    const tagsMap: { [key: string]: string[] } = {
      '姻缘': ['温润如玉', '情比金坚', '心心相印'],
      '事业': ['烈火真金', '步步高升', '运筹帷幄'],
      '财运': ['招财进宝', '金玉满堂', '财源广进'],
      '健康': ['宁静致远', '身心健康', '平衡和谐'],
      '人际关系': ['左右逢源', '广结善缘', '和衷共济'],
      '学业': ['通透智者', '博学多才', '智慧之光']
    };
    return tagsMap[direction] || ['开运吉祥', '心想事成', '万事如意'];
  };

  // 生成一句话点睛（作为备用）
  const generateInsight = (direction: string) => {
    const insightsMap: { [key: string]: string } = {
      '姻缘': '执子之手，与子偕老，愿得一人心，白首不相离。',
      '事业': '长风破浪会有时，直挂云帆济沧海。',
      '财运': '君子爱财，取之有道，用之有度。',
      '健康': '身体是革命的本钱，健康是最大的财富。',
      '人际关系': '己欲立而立人，己欲达而达人。',
      '学业': '书山有路勤为径，学海无涯苦作舟。'
    };
    return insightsMap[direction] || '天行健，君子以自强不息。';
  };

  const tags = recommendation.coreConclusion.tags.length > 0 ? recommendation.coreConclusion.tags : generateTags(userInfo.direction);
  const insight = recommendation.coreConclusion.insight || generateInsight(userInfo.direction);
  const personalityText = recommendation.personality || '基于您的日干（日主）分析，您具有诚实、厚重、包容的性格特质，但可能略显固执。';
  const fatePatternText = recommendation.fatePattern || '您的八字组合形成了独特的命理格局，为您带来了先天的优势和挑战。';
  const currentStateText = recommendation.psychologicalAnalysis.currentState || `基于您的测试结果，您在${userInfo.direction}方面表现出积极的态度和良好的适应能力。`;
  const personalityDualityText = recommendation.psychologicalAnalysis.personalityDuality || `您的显性性格表现为${answers[0] > 10 ? '外向活泼' : '内向沉稳'}，而隐性性格则更加${answers[2] > 10 ? '传统保守' : '创新独特'}。`;
  const logicConnectionText = recommendation.psychologicalAnalysis.logicConnection || `分析显示，您的八字特质与测试结果高度吻合，表明您在${userInfo.direction}方面具有独特的优势。`;
  const recommendationParagraphs = recommendation.transportationAdvice ? recommendation.transportationAdvice.split('\n').filter(p => p.trim() !== '') : [];
  const jewelryDecisionText = recommendation.jewelryDecision || '基于您的八字分析和测试结果，我们为您推荐的首饰不仅考虑了美观性，更注重其与您命理的契合度。选择适合的材质和款式，能够更好地发挥首饰的能量，为您带来好运和正能量。';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">您的专属首饰推荐</h1>
        
        {/* 核心结论：开运守护石 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">核心结论：您的「开运守护石」</h2>
          
          <div className="flex flex-col items-center gap-6 mb-6">
            <div className="w-full space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-lg font-medium text-gray-800 italic border-l-4 border-blue-500 pl-4 py-2 max-w-2xl mx-auto">
                {insight}
              </div>
            </div>
          </div>
        </div>
        
        {/* 八字原局分析 */}
        <div className="mb-10 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">八字原局分析</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">基础命盘</h3>
              <div className="text-gray-600">{userInfo.chineseCalendar}</div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">五行能量</h3>
              <div className="h-48 bg-white rounded-lg p-4">
                {loading ? (
                  <div className="h-full flex items-center justify-center text-gray-500">加载中...</div>
                ) : fiveElementsData ? (
                  <Radar
                    data={{
                      labels: fiveElementsData.map((item: any) => item.element),
                      datasets: [
                        {
                          label: '五行能量',
                          data: fiveElementsData.map((item: any) => item.value),
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          borderWidth: 2,
                          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                          pointBorderColor: '#fff',
                          pointHoverBackgroundColor: '#fff',
                          pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
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
                  <div className="h-full flex items-center justify-center text-gray-500">无法加载五行能量数据</div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">性格画像</h3>
              <div className="text-gray-600">{personalityText}</div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">命理格局</h3>
              <div className="text-gray-600">{fatePatternText}</div>
            </div>
          </div>
        </div>
        
        {/* 深度心理行为分析 */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-800">深度心理行为分析</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">当前状态</h3>
              <div className="text-gray-700">{currentStateText}</div>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">性格双面性</h3>
              <div className="text-gray-700">{personalityDualityText}</div>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">逻辑关联</h3>
              <div className="text-gray-700">{logicConnectionText}</div>
            </div>
          </div>
        </div>
        
        {/* 专属转运建议 */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-green-800">专属转运建议</h2>
          <div className="text-gray-700 space-y-3">
            {recommendationParagraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        {/* 首饰定案与材质解读 */}
        <div className="mb-10 p-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-purple-800">首饰定案与材质解读</h2>
          <div className="text-gray-700 space-y-3">
            {jewelryDecisionText.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;