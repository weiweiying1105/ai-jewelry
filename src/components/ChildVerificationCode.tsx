'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChildVerificationCodeProps {
  onVerify: () => void;
}

const ChildVerificationCode: React.FC<ChildVerificationCodeProps> = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hint, setHint] = useState<string>('');
  const router = useRouter();
  const canSubmit = code.length === 4 && !loading;

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
        alert('验证码错误或不在5天有效期，请重试');
        setCode('');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('验证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCode = async () => {
    setLoading(true);
    setHint('');
    try {
      const res = await fetch('/api/verify/generate');
      const data = await res.json();
      if (data.code) {
        setCode(data.code);
        setHint(`测试用验证码（5天内有效）：${data.code}`);
      } else {
        setHint('未能获取验证码，请稍后重试');
      }
    } catch (e) {
      console.error(e);
      setHint('获取验证码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-blue-50 to-purple-50 font-sans-zh text-indigo-900 antialiased overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] -left-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] -right-20 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-pink-100 rounded-full opacity-30 blur-2xl"></div>
      </div>
      <nav className="relative z-10 flex items-center bg-transparent p-6 justify-between">
        <button onClick={() => router.back()} aria-label="返回" className="text-indigo-600/40 flex size-10 shrink-0 items-center justify-center active:opacity-60 transition-opacity">
          <span className="material-symbols-outlined font-light">
            arrow_back_ios
          </span>
        </button>
        <div className="flex-1 text-center">
          <span className="text-[10px] tracking-[0.4em] text-indigo-600/30 font-medium uppercase">
            Child Assessment
          </span>
        </div>
        <div className="size-10"></div>
      </nav>
      <main className="relative flex justify-center z-10 flex-col items-center flex-1 px-8 pt-12">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-white/60 rounded-full blur-2xl"></div>
            <div className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/80 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-500 text-5xl font-extralight">
                psychology
              </span>
            </div>
          </div>
          <h1 className="font-serif-zh text-indigo-800 text-2xl tracking-[0.15em] mb-4">
            心理调查问卷
          </h1>
          <p className="text-gray-600 text-sm font-light tracking-[0.1em] leading-relaxed">
            请输入验证码开始测试
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-[280px] space-y-8">
          <div className="relative">
            <input
              aria-label="验证码"
              name="code"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              className="w-full h-16 rounded-xl border-2 border-indigo-200 text-center text-2xl tracking-[0.5em] text-indigo-800 placeholder:text-indigo-300 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all font-light"
              maxLength={4}
              placeholder="••••"
              type="text"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCode(v);
              }}
              disabled={loading}
            />
            {hint && (
              <p className="mt-2 text-center text-sm text-indigo-600">{hint}</p>
            )}
            <p className="mt-2 text-center text-xs text-gray-500">验证码有效期5天，请尽快完成测试</p>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGetCode}
              className="w-full h-12 rounded-xl bg-indigo-100 text-indigo-700 text-sm font-medium tracking-[0.1em] transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '正在获取…' : '获取测试验证码'}
            </button>
            <button
              type="submit"
              className={`w-full h-14 rounded-xl bg-indigo-600 text-white text-base font-medium tracking-[0.15em] shadow-lg shadow-indigo-200 transition-all ${canSubmit ? 'active:scale-[0.97]' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!canSubmit}
            >
              {loading ? '验证中...' : '开始问卷'}
            </button>
            <p className="text-center text-xs text-gray-500 font-light px-2 leading-relaxed">
              继续操作即代表您已阅读并同意
              <br />
              <a
                className="underline underline-offset-4 decoration-indigo-200 text-indigo-600"
                href="#"
              >
                服务协议
              </a>{' '}
              与{' '}
              <a
                className="underline underline-offset-4 decoration-indigo-200 text-indigo-600"
                href="#"
              >
                隐私政策
              </a>
            </p>
          </div>
        </form>
      </main>
      <footer className="relative z-10 pb-12 px-4">
        <div className="flex justify-center gap-8 mb-4 opacity-30">
          <span className="material-symbols-outlined text-indigo-600 text-lg font-extralight">
            sentiment_satisfied
          </span>
          <span className="material-symbols-outlined text-indigo-600 text-lg font-extralight">
            psychology
          </span>
          <span className="material-symbols-outlined text-indigo-600 text-lg font-extralight">
            check_circle
          </span>
        </div>
        <p className="text-indigo-600/30 text-[9px] text-center uppercase tracking-[0.4em] font-light">
          Child Psychology • Assessment Tool
        </p>
      </footer>
    </div>
  );
};

export default ChildVerificationCode;
