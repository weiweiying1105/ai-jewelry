'use client';

import React, { useEffect, useState } from 'react';
import { childQuestions, dimensions } from '@/data/childQuestions';
import { ChildPsychologyResult } from '@/utils/ChildPsychology';

interface ChildResultPageProps {
  answers: number[];
  psychologyResult: ChildPsychologyResult | null;
}

// 结果数据结构
interface ResultData {
  dimensionScores: Record<string, number>;
  totalScore: number;
  人格类型名称: string;
  原生家庭影响指数: number;
  依恋类型: string;
  成长优势: string[];
  性格关键词: string[];
  性格形成路径: string[];
  成长建议: string[];
  核心人格结论: string;
}

// 从心理分析结果生成显示数据
const generateResultFromPsychology = (psychologyResult: ChildPsychologyResult, answers: number[]): ResultData => {
  // 计算各维度分数
  const dimensionScores: Record<string, number> = {};
  dimensions.forEach(dim => {
    dimensionScores[dim.id] = 0;
  });

  // 统计各维度分数
  childQuestions.forEach((question, index) => {
    const score = answers[index] + 1; // 0-3 转换为 1-4
    dimensionScores[question.dimension] += score;
  });

  // 计算原生家庭影响指数
  const maxTotalScore = childQuestions.length * 4;
  const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
  
  // 计算分数的标准差
  const scores = Object.values(dimensionScores);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // 基础影响指数 + 标准差影响
  const baseInfluence = (totalScore / maxTotalScore) * 70;
  const stdDevInfluence = Math.min((stdDev / 10) * 30, 30);
  const influenceIndex = Math.round(baseInfluence + stdDevInfluence);

  // 确定依恋类型
  const attachmentScore = dimensionScores['依恋模式'];
  let attachmentType = '';
  if (attachmentScore >= 32) {
    attachmentType = '焦虑型';
  } else if (attachmentScore >= 24) {
    attachmentType = '安全型';
  } else if (attachmentScore >= 16) {
    attachmentType = '回避型';
  } else {
    attachmentType = '混乱型';
  }

  return {
    dimensionScores,
    totalScore,
    人格类型名称: psychologyResult.人格类型名称,
    原生家庭影响指数: influenceIndex,
    依恋类型: attachmentType,
    成长优势: psychologyResult.成长优势,
    性格关键词: psychologyResult.性格关键词,
    性格形成路径: psychologyResult.性格形成路径,
    成长建议: psychologyResult.成长建议,
    核心人格结论: psychologyResult.核心人格结论
  };
};

const ChildResultPage: React.FC<ChildResultPageProps> = ({ answers, psychologyResult }) => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果有心理分析结果，直接使用
    if (psychologyResult) {
      const result = generateResultFromPsychology(psychologyResult, answers);
      setResult(result);
      setLoading(false);
      return;
    }

    // 否则使用本地计算逻辑
    const calculateResult = () => {
      // 计算各维度分数
      const dimensionScores: Record<string, number> = {};
      dimensions.forEach(dim => {
        dimensionScores[dim.id] = 0;
      });

      // 统计各维度分数
      childQuestions.forEach((question, index) => {
        const score = answers[index] + 1; // 0-3 转换为 1-4
        dimensionScores[question.dimension] += score;
      });

      // 计算原生家庭影响指数
      // 基于各维度分数的分布情况，表示家庭环境对性格形成的影响程度
      // 影响指数高 = 家庭环境对性格影响大（可能是正面或负面）
      const maxTotalScore = childQuestions.length * 4;
      const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
      
      // 计算分数的标准差，标准差越大说明某些维度特别突出，影响指数越高
      const scores = Object.values(dimensionScores);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      
      // 基础影响指数 + 标准差影响
      const baseInfluence = (totalScore / maxTotalScore) * 70; // 基础70%
      const stdDevInfluence = Math.min((stdDev / 10) * 30, 30); // 标准差影响最多30%
      const influenceIndex = Math.round(baseInfluence + stdDevInfluence);

      // 确定依恋类型
      const attachmentScore = dimensionScores['依恋模式'];
      let attachmentType = '';
      if (attachmentScore >= 32) {
        attachmentType = '焦虑型';
      } else if (attachmentScore >= 24) {
        attachmentType = '安全型';
      } else if (attachmentScore >= 16) {
        attachmentType = '回避型';
      } else {
        attachmentType = '混乱型';
      }

      // 如果没有AI分析结果，使用默认值
      const defaultResult: ResultData = {
        dimensionScores,
        totalScore,
        人格类型名称: '待分析',
        原生家庭影响指数: influenceIndex,
        依恋类型: attachmentType,
        成长优势: [],
        性格关键词: [],
        性格形成路径: [],
        成长建议: [],
        核心人格结论: '分析中...'
      };

      setResult(defaultResult);
      setLoading(false);
    };

    calculateResult();
  }, [answers, psychologyResult]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-6 text-indigo-800">正在分析您的问卷...</h1>
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">正在生成专属分析，请稍候...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-6 text-indigo-800">分析失败</h1>
          <p className="text-gray-600">请重试或联系客服</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-sans-zh">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl"></div>
            <div className="relative w-full h-full bg-white rounded-full shadow-md flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-500 text-4xl">
                psychology
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800 mb-2">原生家庭人格分析</h1>
          <p className="text-indigo-600 text-sm">你的性格{result['原生家庭影响指数']}%受原生家庭影响</p>
        </header>

        {/* Result Content */}
        <main className="space-y-4 mb-6">
          {/* ① 核心人格结论 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">stars</span>
              <h2 className="text-lg font-bold text-indigo-800">你的性格核心</h2>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 mb-3">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">「{result.人格类型名称}」</h3>
              <p className="text-indigo-700 text-sm leading-relaxed">
                {result.核心人格结论}
              </p>
            </div>
          </section>

          {/* ② 原生家庭影响指数 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">insights</span>
              <h2 className="text-lg font-bold text-indigo-800">原生家庭影响指数</h2>
            </div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-indigo-800 mb-2">{result['原生家庭影响指数']}%</p>
              <p className="text-indigo-600 text-sm">你的很多行为模式，可能来自成长环境的长期塑造</p>
            </div>
            {/* <div className="flex flex-wrap gap-2 justify-center">
              {result.性格关键词.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                  {keyword}
                </span>
              ))}
            </div> */}
          </section>

          {/* ③ 依恋类型 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">favorite</span>
              <h2 className="text-lg font-bold text-indigo-800">依恋类型</h2>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-800 mb-2">{result.依恋类型}</p>
              <p className="text-indigo-700 text-sm leading-relaxed">
                {result.依恋类型 === '安全型' && '你在亲密关系中相对稳定，既不会过度依赖，也不会刻意回避亲密关系。'}
                {result.依恋类型 === '焦虑型' && '你在人际关系中比较渴望安全感，容易担心被拒绝或抛弃。'}
                {result.依恋类型 === '回避型' && '你在关系中倾向于保持距离，不太容易完全信任他人。'}
                {result.依恋类型 === '混乱型' && '你在关系中既渴望亲密又害怕受伤，情绪反应比较复杂。'}
              </p>
            </div>
          </section>

          {/* ④ 性格关键词 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">label</span>
              <h2 className="text-lg font-bold text-indigo-800">性格关键词</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.性格关键词.map((keyword, index) => (
                <span key={index} className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm rounded-xl font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          {/* ⑤ 成长优势 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">emoji_events</span>
              <h2 className="text-lg font-bold text-indigo-800">成长优势</h2>
            </div>
            <div className="space-y-2">
              {result.成长优势.map((advantage, index) => (
                <div key={index} className="flex items-center bg-indigo-50 rounded-lg p-3">
                  <span className="material-symbols-outlined text-indigo-500 mr-2">check_circle</span>
                  <span className="text-indigo-800 text-sm font-medium">{advantage}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ⑥ 性格形成路径 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">timeline</span>
              <h2 className="text-lg font-bold text-indigo-800">性格形成路径</h2>
            </div>
            <div className="space-y-3">
              {result.性格形成路径.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center mr-3 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-indigo-800 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ⑦ 成长建议 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">lightbulb</span>
              <h2 className="text-lg font-bold text-indigo-800">成长建议</h2>
            </div>
            <div className="space-y-2">
              {result.成长建议.map((suggestion, index) => (
                <div key={index} className="flex items-start bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                  <span className="material-symbols-outlined text-indigo-500 mr-2 text-sm">arrow_right</span>
                  <span className="text-indigo-800 text-sm leading-relaxed">{suggestion}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ⑧ 维度分数详情 */}
          <section className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center mb-3">
              <span className="material-symbols-outlined text-indigo-500 mr-2">bar_chart</span>
              <h2 className="text-lg font-bold text-indigo-800">各维度得分</h2>
            </div>
            <div className="space-y-3">
              {dimensions.map((dimension) => {
                const score = result.dimensionScores[dimension.id];
                const percentage = (score / dimension.maxScore) * 100;
                return (
                  <div key={dimension.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-indigo-700">{dimension.name}</span>
                      <span className="text-sm font-medium text-indigo-800">{score}/{dimension.maxScore}</span>
                    </div>
                    <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs text-indigo-500 opacity-70 mb-4">
            本报告仅供参考，不构成专业心理诊断
          </p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm tracking-wide hover:bg-indigo-700 transition-colors">
              重新测试
            </button>
            <button className="flex-1 py-3 bg-white border border-indigo-200 text-indigo-700 rounded-xl font-medium text-sm tracking-wide hover:bg-indigo-50 transition-colors">
              分享报告
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChildResultPage;
