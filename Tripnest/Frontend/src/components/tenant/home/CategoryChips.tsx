import { useState } from 'react';

const CATEGORIES = ['All', 'Student Rooms', 'Apartments', 'Long-term', 'Short Stay', 'Near UMaT', 'Furnished'];

export default function CategoryChips() {
  const [active, setActive] = useState('All');

  return (
    <div className="flex flex-wrap items-center gap-2">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => setActive(c)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === c
              ? 'border-brand bg-brand-50 text-brand'
              : 'border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {c}
        </button>
      ))}
      <button className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
        More ▾
      </button>
      <button className="ml-auto rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
        Filters
      </button>
    </div>
  );
}
