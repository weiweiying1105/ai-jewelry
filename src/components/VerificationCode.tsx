'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VerificationCodeProps {
  onVerify: () => void;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({ onVerify }) => {
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
    <div className="relative flex min-h-screen w-full flex-col main-bg overflow-hidden bg-ivory font-sans-zh text-deep-purple antialiased overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="gem-facet absolute top-[-5%] -left-10 w-48 h-48 rotate-12 opacity-30"></div>
        <div className="gem-facet absolute top-[60%] -right-12 w-40 h-40 -rotate-12 opacity-20"></div>
        <div className="purple-glow absolute top-1/4 left-1/4 w-72 h-72 blur-3xl"></div>
        <div className="absolute top-16 right-12 opacity-40">
          <span className="material-symbols-outlined text-accent-purple text-2xl font-light">
            star_rate
          </span>
        </div>
        <div className="absolute top-24 right-24 opacity-25">
          <span className="material-symbols-outlined text-accent-purple text-sm font-light">
            star
          </span>
        </div>
      </div>
      <nav className="relative z-10 flex items-center bg-transparent p-6 justify-between">
        <button onClick={() => router.back()} aria-label="返回" className="text-deep-purple/40 flex size-10 shrink-0 items-center justify-center active:opacity-60 transition-opacity">
          <span className="material-symbols-outlined font-light">
            arrow_back_ios
          </span>
        </button>
        <div className="flex-1 text-center">
          <span className="text-[10px] tracking-[0.4em] text-deep-purple/30 font-medium uppercase">
            Exclusivity
          </span>
        </div>
        <div className="size-10"></div>
      </nav>
      <main className="relative flex justify-center  z-10  flex-col items-center flex-1 px-8 pt-12">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="w-20 h-20 mb-8 relative">
            <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] blur-2xl"></div>
            <div className="relative w-full h-full bg-white/60 backdrop-blur-md rounded-[2rem] shadow-sm border border-white/80 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent-purple text-4xl font-extralight">
                auto_awesome
              </span>
            </div>
          </div>
          <h1 className="font-serif-zh text-deep-purple text-2xl tracking-[0.15em] mb-4">
            开启定制旅程
          </h1>
          <p className="text-soft-gray text-xs font-light tracking-[0.1em] leading-relaxed">
            请输入您的专属验证码
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-[280px] space-y-10">
          <div className="relative">
            <input
              aria-label="验证码"
              name="code"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              className="glass-input-large w-full h-16 rounded-2xl border-none text-center text-2xl tracking-[0.5em] text-deep-purple placeholder:text-deep-purple/20 placeholder:tracking-normal focus:ring-0 transition-all font-light"
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
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleGetCode}
                className="text-[11px] text-accent-purple/80 tracking-widest font-medium active:opacity-50 transition-opacity disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '正在获取…' : '重新获取验证码'}
              </button>
            </div>
            {hint && (
              <p className="mt-2 text-center text-[11px] text-accent-purple/70">{hint}</p>
            )}
            <p className="mt-1 text-center text-[10px] text-soft-gray">验证码有效期5天，且仅可使用一次</p>
          </div>
          <div className="space-y-6">
            <button
              type="submit"
              className={`w-full h-14 rounded-full bg-deep-purple text-white text-base font-medium tracking-[0.25em] shadow-xl shadow-deep-purple/15 transition-all ${canSubmit ? 'active:scale-[0.97]' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!canSubmit}
            >
              {loading ? '验证中...' : '进入测试'}
            </button>
            <p className="text-center text-[10px] text-soft-gray font-light px-2 leading-relaxed opacity-80">
              继续操作即代表您已阅读并同意
              <br />
              <a
                className="underline underline-offset-4 decoration-deep-purple/10 text-deep-purple/50"
                href="#"
              >
                服务协议
              </a>{' '}
              与{' '}
              <a
                className="underline underline-offset-4 decoration-deep-purple/10 text-deep-purple/50"
                href="#"
              >
                隐私政策
              </a>
            </p>
          </div>
        </form>
      </main>
      <footer className="relative z-10 pb-12 px-4">
        <div className="flex justify-center gap-10 mb-5 opacity-25">
          <span className="material-symbols-outlined text-deep-purple text-lg font-extralight">
            auto_fix_high
          </span>
          <span className="material-symbols-outlined text-deep-purple text-lg font-extralight">
            diamond
          </span>
          <span className="material-symbols-outlined text-deep-purple text-lg font-extralight">
            temp_preferences_custom
          </span>
        </div>
        <p className="text-deep-purple/30 text-[9px] text-center uppercase tracking-[0.4em] font-light">
          Destiny Jewelry • Custom Experience
        </p>
      </footer>
    </div>
  );
};

export default VerificationCode;