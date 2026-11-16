import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronRight, ShoppingBag, Wrench } from 'lucide-react';
import { PARTS } from '../data/parts';
import { SHOPPING_LIST } from '../data/shoppingList';
import { PartId } from '../types/hydroglove';

interface DesignPartsPanelProps {
  selectedPartId: PartId | null;
  onSelectPart: (id: PartId) => void;
  onOpenBuildGuide: () => void;
}

const SHOP_STORAGE_KEY = 'hydroglove_shopping_v1';

function loadCheckedItems(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export const DesignPartsPanel: React.FC<DesignPartsPanelProps> = ({
  selectedPartId,
  onSelectPart,
  onOpenBuildGuide,
}) => {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadCheckedItems);

  useEffect(() => {
    try {
      window.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // Ignore quota errors
    }
  }, [checked]);

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = SHOPPING_LIST.filter((i) => Boolean(checked[i.id])).length;
  const categories = Array.from(new Set(SHOPPING_LIST.map((i) => i.category)));

  return (
    <div className="p-5 space-y-5">
      {/* Quick Banner Shortcut */}
      <button
        type="button"
        onClick={onOpenBuildGuide}
        className="w-full text-left rounded-xl bg-teal-700 hover:bg-teal-800 text-white p-3.5 flex items-center justify-between gap-3 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-600/80 flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4 text-teal-50" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">
              Ready to Assemble These Materials?
            </p>
            <p className="text-[11px] text-teal-100 truncate">
              Open the 8-step illustrated prototype manual &amp; safety bench test
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 bg-white/15 px-2.5 py-1 rounded-lg">
          Open Build Guide
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </button>

      {/* Pad Layer Stack (Palm Side) */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Pad layer stack (palm side)
        </h3>
        <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 text-white">
            <span className="w-6 text-[10px] font-mono-tech opacity-70">L1</span>
            <span>Outer glove: stretch knit with mesh back</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-600 text-white">
            <span className="w-6 text-[10px] font-mono-tech opacity-70">L2</span>
            <span>Waterproof TPU barrier that keeps the fabric dry</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-zinc-700 text-white">
            <span className="w-6 text-[10px] font-mono-tech opacity-70">L3</span>
            <span>Carbon-silicone electrode connected to the silver traces</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-teal-400 text-teal-950 font-medium">
            <span className="w-6 text-[10px] font-mono-tech opacity-80">L4</span>
            <span>Replaceable sponge or hydrogel pad (wet, snap-on)</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-orange-100 text-orange-900">
            <span className="w-6 text-[10px] font-mono-tech opacity-70">—</span>
            <span>Skin (palm and fingertips)</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Tap <strong>Explode</strong> under the 3D view to see these layers separate.
        </p>
      </div>

      {/* 10 Interactive Components */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Components (tap to focus 3D)
        </h3>
        <div className="space-y-1.5">
          {PARTS.map((p) => {
            const isSelected = selectedPartId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPart(p.id)}
                className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70'
                    : 'border-slate-200 hover:border-teal-300 bg-white'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 text-[10px] font-bold font-mono-tech flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-teal-700 border-teal-700 text-white'
                      : 'border-teal-700 text-teal-700'
                  }`}
                >
                  {p.n}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-semibold text-slate-900">
                    {p.title}
                  </span>
                  <span className="block text-[11px] font-mono-tech text-slate-500">
                    {p.cost}
                  </span>
                </span>
                <ChevronRight
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isSelected ? 'text-teal-700' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Materials & Plugs Shopping Checklist */}
      <div className="pt-2 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShoppingBag className="w-4 h-4 text-teal-700 shrink-0" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700 truncate">
              Materials &amp; Plugs to Buy (Per Pair)
            </h3>
          </div>
          <span className="text-[11px] font-mono-tech text-teal-800 whitespace-nowrap">
            {checkedCount}/{SHOPPING_LIST.length} checked
          </span>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Complete bill of materials for 1 working glove pair—including the inter-glove plugs,
          USB-C charging cable, back-of-wrist glass OLED, and Step 7 bench test parts.
        </p>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700">
                {cat}
              </div>
              <div className="divide-y divide-slate-100">
                {SHOPPING_LIST.filter((i) => i.category === cat).map((item) => {
                  const isDone = Boolean(checked[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`w-full text-left flex items-start gap-2.5 p-2.5 transition-colors ${
                        isDone ? 'bg-teal-50/40' : 'bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? 'bg-teal-700 border-teal-700 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-xs font-medium ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.item}{' '}
                          <span className="font-mono-tech text-[11px] text-teal-700">
                            ({item.qty})
                          </span>
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {item.spec}
                        </span>
                      </span>
                      <span className="text-[11px] font-mono-tech text-slate-600 shrink-0">
                        {item.estCost}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
