'use client';
import React, { useState } from 'react';

type Direction = '姻缘' | '人际关系' | '事业' | '财运' | '健康' | '学业';

interface DirectionSelectorProps {
  onSelect: (direction: Direction) => void;
}

const DirectionSelector: React.FC<DirectionSelectorProps> = ({ onSelect }) => {
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(null);

  const directions: Direction[] = ['姻缘', '人际关系', '事业', '财运', '健康', '学业'];

  const handleSelect = (direction: Direction) => {
    setSelectedDirection(direction);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDirection) {
      onSelect(selectedDirection);
    } else {
      alert('请选择一个方向');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">请选择您关注的方向</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {directions.map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => handleSelect(direction)}
                className={`py-4 px-3 rounded-lg border-2 transition-all ${selectedDirection === direction
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="text-center font-medium">{direction}</div>
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors mt-6"
          >
            确认选择
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectionSelector;