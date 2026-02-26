'use client';

import React, { useState } from 'react';

interface VerificationCodeProps {
  onVerify: () => void;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/verify/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.valid) {
        onVerify();
      } else {
        alert('验证码错误或已过期，请重试');
        setCode('');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('验证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">验证码登录</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入4位数字验证码"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? '验证中...' : '验证'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationCode;