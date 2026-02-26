"use client";
import React, { useState } from 'react';
import type { Direction, QuestionItem } from '../data/questions20';
import { questionsByDirection } from '../data/questions20';

interface TestPageProps {
  direction: Direction;
  onComplete: (answers: number[]) => void;
}

const TestPage: React.FC<TestPageProps> = ({ direction, onComplete }) => {
  const qs: QuestionItem[] = questionsByDirection[direction] || questionsByDirection['事业'];
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/50">
        {/* Card Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">方向测评</h3>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{direction}</p>
          </div>
          <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
            <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-300">quiz</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 text-center text-sm text-slate-600 dark:text-slate-400">
            第 {currentQuestion + 1} / {qs.length} 题
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-4 text-lg font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
          {current.question}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt, idx) => {
            const active = answers[currentQuestion] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`group rounded-xl border-2 px-4 py-3 text-left transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/30 ${active
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-xl ${active ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400'
                      }`}
                  >
                    {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`rounded-md px-4 py-2 transition-colors ${currentQuestion === 0
                ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            上一题
          </button>
          <div className="text-sm text-slate-500 dark:text-slate-400">点击选项自动进入下一题</div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;