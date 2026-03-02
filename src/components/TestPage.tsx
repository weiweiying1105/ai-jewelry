"use client";
import React, { useState } from 'react';
import type { Direction, QuestionItem } from '../data/questions20';
import { questionsByDirection } from '../data/questions20';

interface TestPageProps {
  direction: Direction;
  onComplete: (answers: number[]) => void;
}

const TestPage: React.FC<TestPageProps> = ({ direction, onComplete }) => {
  const qs: QuestionItem[] = questionsByDirection[direction] || questionsByDirection['事业突破'];
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="pt-6 px-8">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={handlePrev} disabled={currentQuestion === 0} className={`flex size-10 items-center justify-center rounded-full bg-white/50 text-slate-800 ${currentQuestion === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}>
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
          </button>
          <div className="flex-1 px-4">
            <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-600 tracking-tighter">{String(currentQuestion + 1).padStart(2, '0')} / {String(qs.length).padStart(2, '0')}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-8">
        <div className="mt-12 mb-12 text-center">
          <h3 className="text-2xl font-bold leading-tight text-slate-800 mb-4">
            {current.question}
          </h3>
          <p className="text-slate-500 text-sm tracking-widest opacity-80 uppercase">Select one preference</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
          {current.options.map((opt, idx) => {
            const active = answers[currentQuestion] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`option-button w-full h-16 rounded-2xl bg-white border shadow-sm flex items-center px-8 text-lg font-medium transition-all ${
                  active 
                    ? 'border-slate-800 text-slate-800' 
                    : 'border-slate-100 text-slate-700 hover:border-slate-200'
                }`}
              >
                {opt}
                <span className={`ml-auto material-symbols-outlined transition-all ${active ? 'text-slate-800' : 'text-slate-800/0'}`}>
                  check_circle
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default TestPage;