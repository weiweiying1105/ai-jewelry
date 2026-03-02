"use client";

import React, { useState } from 'react';

interface BirthdaySelectorProps {
  onSubmit: (year: number, month: number, day: number, hour: number, gender: string) => void;
}

const BirthdaySelector: React.FC<BirthdaySelectorProps> = ({ onSubmit }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(12);
  const [gender, setGender] = useState<string>('女');

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const getShichen = (h: number) => {
    const shichenMap: Record<number, string> = {
      0: '子时 (23:00-01:00)',
      1: '子时 (23:00-01:00)',
      2: '丑时 (01:00-03:00)',
      3: '丑时 (01:00-03:00)',
      4: '寅时 (03:00-05:00)',
      5: '寅时 (03:00-05:00)',
      6: '卯时 (05:00-07:00)',
      7: '卯时 (05:00-07:00)',
      8: '辰时 (07:00-09:00)',
      9: '辰时 (07:00-09:00)',
      10: '巳时 (09:00-11:00)',
      11: '巳时 (09:00-11:00)',
      12: '午时 (11:00-13:00)',
      13: '午时 (11:00-13:00)',
      14: '未时 (13:00-15:00)',
      15: '未时 (13:00-15:00)',
      16: '申时 (15:00-17:00)',
      17: '申时 (15:00-17:00)',
      18: '酉时 (17:00-19:00)',
      19: '酉时 (17:00-19:00)',
      20: '戌时 (19:00-21:00)',
      21: '戌时 (19:00-21:00)',
      22: '亥时 (21:00-23:00)',
      23: '亥时 (21:00-23:00)'
    };
    return shichenMap[h];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(year, month, day, hour, gender);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-soft-blue/30 text-deep-blue font-sans-zh">
      <header className="pt-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={() => history.back()} className="flex size-10 items-center justify-center rounded-full bg-white/50 text-deep-blue">
            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
          </button>
          <div className="flex-1 px-4">
            <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-accent-blue rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
          <span className="text-xs font-medium text-muted-gray tracking-tighter">02 / 05</span>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">个人信息输入</h1>
          <p className="text-sm text-muted-gray/80 leading-relaxed">请告诉我们您的基本信息，以便我们为您精准匹配专属珠宝。</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <main className="flex-1 px-6">
          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-deep-blue/60 ml-1">您的性别</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative group cursor-pointer">
                  <input className="peer sr-only" name="gender" type="radio" value="女" checked={gender === '女'} onChange={(e) => setGender(e.target.value)} />

                  <div className={`relative flex flex-col items-center justify-center py-6 px-4 rounded-3xl glass-card transition-all duration-300 ${gender === '女' ? 'bg-white shadow-xl shadow-accent-blue/10 ring-1 ring-accent-blue/30' : ''} peer-checked:bg-white peer-checked:shadow-xl peer-checked:shadow-accent-blue/10 peer-checked:ring-1 peer-checked:ring-accent-blue/30`}>
                    <span className="material-symbols-outlined text-4xl mb-2 text-accent-blue">female</span>
                    <span className={`text-sm font-medium ${gender === '女' ? 'text-accent-blue' : ''}`}>女士</span>
                    {gender === '女' && (
                      <span className="material-symbols-outlined absolute top-3 right-3 text-accent-blue">check_circle</span>
                    )}
                  </div>
                </label>
                <label className="relative group cursor-pointer">
                  <input className="peer sr-only" name="gender" type="radio" value="男" checked={gender === '男'} onChange={(e) => setGender(e.target.value)} />
                  <div className={`relative flex flex-col items-center justify-center py-6 px-4 rounded-3xl glass-card transition-all duration-300 ${gender === '男' ? 'bg-white shadow-xl shadow-accent-blue/10 ring-1 ring-accent-blue/30' : ''} peer-checked:bg-white peer-checked:shadow-xl peer-checked:shadow-accent-blue/10 peer-checked:ring-1 peer-checked:ring-accent-blue/30`}>
                    <span className="material-symbols-outlined text-4xl mb-2 text-accent-blue">male</span>
                    <span className={`text-sm font-medium ${gender === '男' ? 'text-accent-blue' : ''}`}>男士</span>
                    {gender === '男' && (
                      <span className="material-symbols-outlined absolute top-3 right-3 text-accent-blue">check_circle</span>
                    )}
                  </div>
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-deep-blue/60 ml-1">出生日期</h3>
              <div className="relative glass-card rounded-3xl p-4 overflow-hidden">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-gray mb-1">年</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full rounded-2xl bg-white/70 border border-accent-blue/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-gray mb-1">月</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="w-full rounded-2xl bg-white/70 border border-accent-blue/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-gray mb-1">日</label>
                    <select
                      value={day}
                      onChange={(e) => setDay(parseInt(e.target.value))}
                      className="w-full rounded-2xl bg-white/70 border border-accent-blue/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-gray text-center px-4 italic">生日将决定您的生辰石与幸运色调</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-deep-blue/60 ml-1">出生时间</h3>
              <div className="relative glass-card rounded-3xl p-4 overflow-hidden">
                <div>
                  <label className="block text-xs font-medium text-muted-gray mb-2">时辰（影响八字命理分析）</label>
                  <select
                    value={hour}
                    onChange={(e) => setHour(parseInt(e.target.value))}
                    className="w-full rounded-2xl bg-white/70 border border-accent-blue/10 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>{getShichen(h)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-muted-gray text-center px-4 italic">时辰将影响八字命理分析的准确性</p>
            </section>
          </div>
        </main>

        <footer className="p-8 mt-auto">
          <button type="submit" className="w-full bg-white text-deep-blue font-bold py-4 rounded-full shadow-lg shadow-accent-blue/10 active:scale-[0.97] transition-all border border-accent-blue/10">
            下一步
          </button>
        </footer>
      </form>

      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-full h-[50%] bg-gradient-to-b from-white to-transparent opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[300px] h-[300px] bg-accent-blue/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[200px] h-[200px] bg-gold-soft/10 rounded-full blur-[80px]"></div>
      </div>
    </div>
  );
}

export default BirthdaySelector;