import React from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { SimSnapshot } from '../types/hydroglove';

interface SessionSimPanelProps {
  snapshot: SimSnapshot;
  onTargetChange: (mA: number) => void;
  onDurationChange: (minutes: number) => void;
  onWetnessChange: (percent: number) => void;
  onToggleStart: () => void;
  onReset: () => void;
}

function formatMinutes(min: number): string {
  const s = Math.max(0, Math.round(min * 60));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export const SessionSimPanel: React.FC<SessionSimPanelProps> = ({
  snapshot,
  onTargetChange,
  onDurationChange,
  onWetnessChange,
  onToggleStart,
  onReset,
}) => {
  const progressPct =
    snapshot.duration > 0
      ? Math.min(100, (snapshot.elapsed / snapshot.duration) * 100)
      : 0;

  const polarityLabel =
    snapshot.polarity === '+'
      ? 'This glove (+) · Pair (−)'
      : 'This glove (−) · Pair (+)';

  const startLabel = snapshot.done
    ? 'New session'
    : snapshot.running
      ? 'Pause'
      : snapshot.elapsed > 0
        ? 'Resume'
        : 'Start session';

  return (
    <div className="p-5 space-y-5">
      {/* Dark Live Telemetry Card */}
      <div className="rounded-xl bg-slate-900 text-white p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="truncate font-medium text-teal-300">
            {snapshot.phase}
          </span>
          <span className="whitespace-nowrap font-mono-tech">{polarityLabel}</span>
        </div>

        <div className="flex items-end gap-2 mt-2">
          <span className="text-4xl font-semibold font-mono-tech tracking-tight">
            {snapshot.current.toFixed(1)}
          </span>
          <span className="text-sm text-slate-400 mb-1">mA</span>
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-teal-400 transition-all duration-100"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono-tech text-slate-400 mt-1.5">
          <span>{formatMinutes(snapshot.elapsed)}</span>
          <span>{formatMinutes(snapshot.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Target Current */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label htmlFor="sim-target-current" className="font-medium text-slate-800">
              Target current
            </label>
            <span className="text-slate-600 font-mono-tech">
              {snapshot.target} mA
            </span>
          </div>
          <input
            id="sim-target-current"
            type="range"
            min={5}
            max={20}
            step={1}
            value={snapshot.target}
            onChange={(e) => onTargetChange(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Session Length */}
        <div>
          <span className="text-xs font-medium text-slate-800 block mb-1.5">
            Session length
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {[10, 15, 20, 25].map((d) => {
              const active = snapshot.duration === d;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={snapshot.running}
                  onClick={() => onDurationChange(d)}
                  className={`py-2 rounded-lg border font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                  }`}
                >
                  {d} min
                </button>
              );
            })}
          </div>
        </div>

        {/* Pad Wetness */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <label htmlFor="sim-pad-wetness" className="font-medium text-slate-800">
              Pad wetness (contact quality)
            </label>
            <span
              className={`font-mono-tech ${
                snapshot.wet < 40 ? 'text-amber-600 font-semibold' : 'text-slate-600'
              }`}
            >
              {snapshot.wet}%
            </span>
          </div>
          <input
            id="sim-pad-wetness"
            type="range"
            min={0}
            max={100}
            step={1}
            value={snapshot.wet}
            onChange={(e) => onWetnessChange(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Under 40%, the controller pauses to prevent hot spots.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleStart}
            className="flex-1 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {snapshot.running ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{startLabel}</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset session simulation"
            className="px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Simulation runs at <span className="font-mono-tech">1 second = 1 minute</span>.
          Watch the current flow and OLED readout in the 3D model.
        </p>
      </div>

      {/* Session Log */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Session log
        </h3>
        {snapshot.logs.length === 0 ? (
          <p className="text-xs text-slate-400">No events yet.</p>
        ) : (
          <ul className="text-xs text-slate-600 space-y-1.5">
            {snapshot.logs.map((entry) => (
              <li key={entry.id} className="flex gap-2">
                <span className="text-slate-400 font-mono-tech w-11 shrink-0">
                  {entry.time}
                </span>
                <span>{entry.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
