import { useRef, useEffect } from 'react';

export default function FilterChips({ topics, activeFilter, onFilterChange }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeChip = scrollRef.current.querySelector('[data-active="true"]');
      if (activeChip) {
        activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeFilter]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-none px-5 py-3"
    >
      <button
        data-active={activeFilter === null}
        onClick={() => onFilterChange(null)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
          activeFilter === null
            ? 'bg-road-black text-white'
            : 'bg-road-gray-100 text-road-gray-600 hover:bg-road-gray-200'
        }`}
      >
        🚦 အားလုံး
      </button>
      {topics.map((topic) => (
        <button
          key={topic.id}
          data-active={activeFilter === topic.id}
          onClick={() => onFilterChange(topic.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            activeFilter === topic.id
              ? 'bg-road-black text-white'
              : 'bg-road-gray-100 text-road-gray-600 hover:bg-road-gray-200'
          }`}
        >
          {topic.emoji} {topic.title}
        </button>
      ))}
    </div>
  );
}
