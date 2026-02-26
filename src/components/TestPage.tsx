'use client';
import React, { useState } from 'react';
import { questions } from '../data/questions20';

interface TestPageProps {
  onComplete: (answers: number[]) => void;
}

const TestPage: React.FC<TestPageProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">性格测试</h1>
          <div className="text-sm text-gray-600">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${answers[currentQuestion] === index
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-md ${currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:underline'}
            `}
          >
            上一题
          </button>
          <div className="text-sm text-gray-600">
            请选择一个选项
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;