'use client';

import React, { useState } from 'react';
import ChildVerificationCode from '@/components/ChildVerificationCode';
import ChildTestPage from '@/components/ChildTestPage';
import ChildResultPage from '@/components/ChildResultPage';
import { getChildPsychologyAnalysis, ChildPsychologyResult } from '@/utils/ChildPsychology';

// 页面状态类型
type PageState = 'verification' | 'test' | 'result' | 'loading';

export default function ChildHome() {
  const [pageState, setPageState] = useState<PageState>('verification');
  const [answers, setAnswers] = useState<number[]>([]);
  const [psychologyResult, setPsychologyResult] = useState<ChildPsychologyResult | null>(null);

  const handleVerify = () => {
    setPageState('test');
  };

  const handleTestComplete = async (userAnswers: number[]) => {
    setAnswers(userAnswers);
    setPageState('loading');

    // 生成心理分析
    const userData = {
      answers: userAnswers
    };

    try {
      const result = await getChildPsychologyAnalysis(userData);
      setPsychologyResult(result);
      setPageState('result');
    } catch (error) {
      console.error('Error getting psychology analysis:', error);
      setPsychologyResult(null);
      setPageState('result');
    }
  };

  const renderPage = () => {
    switch (pageState) {
      case 'verification':
        return <ChildVerificationCode onVerify={handleVerify} />;
      case 'test':
        return <ChildTestPage onComplete={handleTestComplete} />;
      case 'result':
        return <ChildResultPage answers={answers} psychologyResult={psychologyResult} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold mb-6 text-indigo-800">正在分析您的问卷...</h1>
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">正在生成专属分析，请稍候...</p>
            </div>
          </div>
        );
      default:
        return <ChildVerificationCode onVerify={handleVerify} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {renderPage()}
    </div>
  );
}
