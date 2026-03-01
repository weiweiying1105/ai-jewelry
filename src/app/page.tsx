'use client';

import React, { useState } from 'react';
import VerificationCode from '../components/VerificationCode';
import BirthdaySelector from '../components/BirthdaySelector';
import DirectionSelector from '../components/DirectionSelector';
import TestPage from '../components/TestPage';
import ResultPage from '../components/ResultPage';
import { calculateChineseCalendar, formatChineseDate } from '../utils/ChineseCalendar';
import { getAIRecommendation, Recommendation } from '@/utils/AIRecommendation';

// 对齐 Direction 类型字符串联合
type PageState = 'verification' | 'birthday' | 'direction' | 'test' | 'result' | 'loading';

enum StepDirection { }

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('verification');
  const [chineseCalendar, setChineseCalendar] = useState<any>(null);
  const [direction, setDirection] = useState<import('../data/questions20').Direction | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('女');
  const [recommendation, setRecommendation] = useState<Recommendation>({
    coreConclusion: {
      tags: [],
      insight: ''
    },
    personality: '',
    fatePattern: '',
    psychologicalAnalysis: {
      currentState: '',
      personalityDuality: '',
      logicConnection: ''
    },
    transportationAdvice: '',
    jewelryDecision: ''
  });
  const handleVerify = () => {
    setPageState('birthday');
  };

  const handleBirthdaySubmit = (year: number, month: number, day: number, genderValue: string) => {
    const calendarInfo = calculateChineseCalendar(year, month, day);
    setChineseCalendar(calendarInfo);
    setBirthday(`${year}-${month}-${day}`);
    setGender(genderValue);
    setPageState('direction');
  };

  const handleDirectionSelect = (selectedDirection: import('../data/questions20').Direction) => {
    setDirection(selectedDirection);
    setPageState('test');
  };

  const handleTestComplete = async (userAnswers: number[]) => {
    setAnswers(userAnswers);
    setPageState('loading');

    // 生成AI推荐
    const userData = {
      chineseCalendar,
      direction,
      answers: userAnswers,
      birthday,
      gender,
    };

    try {
      const aiRecommendation = await getAIRecommendation(userData);
      setRecommendation(aiRecommendation);
      setPageState('result');
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setRecommendation({
        coreConclusion: {
          tags: [],
          insight: ''
        },
        personality: '',
        fatePattern: '',
        psychologicalAnalysis: {
          currentState: '',
          personalityDuality: '',
          logicConnection: ''
        },
        transportationAdvice: '',
        jewelryDecision: '',
        error: '推荐生成失败，请重试'
      });
      setPageState('result');
    }
  };

  const renderPage = () => {
    switch (pageState) {
      case 'verification':
        return <VerificationCode onVerify={handleVerify} />;
      case 'birthday':
        return <BirthdaySelector onSubmit={handleBirthdaySubmit} />;
      case 'direction':
        return <DirectionSelector onSelect={handleDirectionSelect} />;
      case 'test':
        return direction ? <TestPage direction={direction} onComplete={handleTestComplete} /> : null;
      case 'result':
        return (
          <ResultPage
            recommendation={recommendation}
            userInfo={{
              direction: direction || '',
              birthday,
              chineseCalendar: formatChineseDate(chineseCalendar)
            }}
            answers={answers}
          />
        );
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold mb-6 text-gray-800">正在生成推荐...</h1>
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">正在分析您的信息，请稍候...</p>
            </div>
          </div>
        );
      default:
        return <VerificationCode onVerify={handleVerify} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}
