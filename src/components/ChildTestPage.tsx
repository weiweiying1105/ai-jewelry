'use client';

import React, { useState } from 'react';
import type { ChildQuestionItem } from '@/data/childQuestions';
import { childQuestions } from '@/data/childQuestions';

interface ChildTestPageProps {
  onComplete: (answers: number[]) => void;
}

const ChildTestPage: React.FC<ChildTestPageProps> = ({ onComplete }) => {
  const qs: ChildQuestionItem[] = childQuestions;
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(Array(qs.length).fill(-1));

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < qs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const current = qs[currentQuestion];

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  // 进度百分比
  const progress = Math.round(((currentQuestion + 1) / qs.length) * 100);

  // 获取当前维度
  const getCurrentDimension = () => {
    return current.dimension;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-blue-50 to-purple-50 max-w-md mx-auto">
      {/* Header */}
      <header className="pt-6 px-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button" 
            onClick={handlePrev} 
            disabled={currentQuestion === 0} 
            className={`flex size-10 items-center justify-center rounded-full bg-white/70 text-indigo-700 ${currentQuestion === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
          </button>
          <div className="flex-1 px-4">
            <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <span className="text-xs font-medium text-indigo-700 tracking-tighter">{String(currentQuestion + 1).padStart(2, '0')} / {String(qs.length).padStart(2, '0')}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8">
        {/* 维度信息 */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
            {getCurrentDimension()}
          </span>
        </div>
        
        {/* 问题 */}
        <div className="mt-4 mb-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold leading-tight text-indigo-800 mb-4">
            {current.question}
          </h3>
          <p className="text-indigo-600 text-sm tracking-widest opacity-80 uppercase">请选择最符合您情况的选项</p>
        </div>
        
        {/* 选项 */}
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
          {current.options.map((opt, idx) => {
            const active = answers[currentQuestion] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full h-16 rounded-xl bg-white border shadow-sm flex items-center px-6 text-lg font-medium transition-all ${active 
                  ? 'border-indigo-500 text-indigo-800 bg-indigo-50' 
                  : 'border-indigo-100 text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50/50'}`}
              >
                <span className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${active ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-indigo-200 text-indigo-300'}`}>
                  {active ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    idx + 1
                  )}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-8 text-center">
        <p className="text-xs text-indigo-500 opacity-70">
          回答完所有{qs.length}个问题后，系统将为您生成详细的性格分析报告
        </p>
      </footer>
    </div>
  );
};

export default ChildTestPage;
