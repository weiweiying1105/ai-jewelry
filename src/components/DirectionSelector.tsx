'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Direction } from '../data/questions20';

interface DirectionSelectorProps {
  onSelect: (direction: Direction) => void;
}

const DirectionSelector: React.FC<DirectionSelectorProps> = ({ onSelect }) => {
  const router = useRouter();
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);

  const options: { key: Direction; title: string; subtitle: string; icon: string }[] = [
    { key: '爱情姻缘', title: '婚姻情感', subtitle: '探索您的情感归宿与良缘', icon: 'favorite' },
    { key: '事业突破', title: '事业发展', subtitle: '解析您的职业路径与晋升', icon: 'work' },
    { key: '财运提升', title: '财富运势', subtitle: '洞察您的财运趋势与机遇', icon: 'payments' },
    { key: '考试运', title: '学业考运', subtitle: '助力您的学术表现与考运', icon: 'school' },
    { key: '贵人运', title: '人际关系', subtitle: '提升人脉与沟通协作', icon: 'groups' },
    { key: '能量平衡', title: '身心健康', subtitle: '关注体质与心理平衡', icon: 'monitor_heart' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDirection) onSelect(selectedDirection);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-gradient-to-b from-[#f3e8ff] to-[#f7f6f8]">
      <nav className="flex items-center justify-between p-4">
        <button type="button" onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-white/50 text-slate-900">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-base font-semibold">个性化定制</h2>
        <div className="size-10" />
      </nav>

      <div className="px-6 pt-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
          <div className="h-full w-2/3 bg-primary rounded-full" />
        </div>
        <p className="mt-2 text-right text-xs font-medium text-primary/70">步骤 2/3</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 pt-10 pb-8">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">请选择您当前最关注的方向</h1>
          <p className="mt-3 text-sm text-slate-600">我们将为您定制专属测试与建议，助您洞察未来</p>
        </header>

        <div className="flex flex-col gap-4">
          {options.map((opt) => {
            const checked = selectedDirection === opt.key;
            return (
              <label key={opt.key} className={`relative flex cursor-pointer items-center justify-between rounded-xl p-5 transition-all ${checked ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'glass-card hover:bg-white/80'}`}>
                <input className="hidden" name="direction" type="radio" value={opt.key} checked={checked} onChange={() => setSelectedDirection(opt.key)} />
                <div className="flex items-center gap-4">
                  <div className={`flex size-12 items-center justify-center rounded-full ${checked ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined">{opt.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-bold ${checked ? 'text-white' : 'text-slate-900'}`}>{opt.title}</span>
                    <span className={`text-sm ${checked ? 'text-white/80' : 'text-slate-500'}`}>{opt.subtitle}</span>
                  </div>
                </div>
                <div className={`flex size-6 items-center justify-center rounded-full ${checked ? 'bg-white text-primary' : 'border-2 border-primary/20'}`}>
                  {checked && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
              </label>
            );
          })}
        </div>

        <footer className="mt-auto p-6">
          <button
            type="submit"
            disabled={!selectedDirection}
            className={`w-full h-14 rounded-full bg-primary text-white text-lg font-bold shadow-lg shadow-primary/30 transition-transform active:scale-95 flex items-center justify-center gap-2 ${!selectedDirection ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            确认并开始测试
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">选择后不可更改，请根据真实情况选择</p>
        </footer>
      </form>

      <div className="absolute -top-24 -left-24 size-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 size-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
    </div>
  );
};

export default DirectionSelector;