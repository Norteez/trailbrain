import { useState } from 'react';

const priorityDot = {
  Essential:   'bg-bark-700',
  Recommended: 'bg-bark-400',
  Optional:    'bg-bark-200',
};

export default function GearChecklist({ gear }) {
  // Group by category
  const grouped = gear.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();
  const [open, setOpen] = useState(() =>
    Object.fromEntries(categories.map(c => [c, true]))
  );
  const [checked, setChecked] = useState({});

  function toggleCategory(cat) {
    setOpen(prev => ({ ...prev, [cat]: !prev[cat] }));
  }

  function toggleItem(key) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="rounded-sm border border-bark-200 bg-white/80">
      <div className="px-4 py-3 border-b border-bark-100">
        <div className="flex items-center gap-2">
          <span className="text-base">🎒</span>
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-bark-500">
            Gear List
          </span>
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="border-b border-bark-100 last:border-b-0">
          <button
            onClick={() => toggleCategory(cat)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-bark-50 transition-colors"
          >
            <span className="text-xs font-body font-semibold uppercase tracking-wider text-bark-600">
              {cat}
            </span>
            <span className="text-bark-400 text-xs">{open[cat] ? '▲' : '▼'}</span>
          </button>

          {open[cat] && (
            <ul className="px-4 pb-3 space-y-2">
              {grouped[cat].map((item, idx) => {
                const key = `${cat}-${idx}`;
                return (
                  <li key={key} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={!!checked[key]}
                      onChange={() => toggleItem(key)}
                      className="mt-0.5 flex-shrink-0 accent-moss-600"
                    />
                    <label
                      htmlFor={key}
                      className={`flex-1 cursor-pointer text-sm font-body leading-snug ${
                        checked[key] ? 'line-through text-bark-300' : 'text-bark-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[item.priority]}`}
                          title={item.priority}
                        />
                        {item.item}
                        {item.note && (
                          <span className="text-bark-400 text-xs">— {item.note}</span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
