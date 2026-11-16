import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const FeasibilityPanel: React.FC = () => {
  return (
    <div className="p-5 space-y-5">
      {/* Verdict banner */}
      <div className="rounded-xl bg-teal-50/90 border border-teal-200 p-4">
        <div className="flex items-center gap-2 text-teal-900 font-semibold text-sm">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Verdict: Yes, it&apos;s possible</span>
        </div>
        <p className="text-xs text-teal-900/90 leading-relaxed mt-1.5">
          Switching from Peltier cooling to <strong>tap-water iontophoresis</strong> makes
          sense. Iontophoresis is already a proven first-line treatment for sweaty palms.
          Swapping the bulky water tray for <strong>wet pads inside a glove</strong> makes
          it portable and affordable.
        </p>
      </div>

      {/* Why Peltier didn't work */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Why Peltier didn&apos;t work
        </h3>
        <ul className="space-y-2 text-xs text-slate-700">
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              Cooling only eases sweating while the device is running. It doesn&apos;t
              change how the sweat glands behave afterwards.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              It uses a lot of power (<span className="font-mono-tech">2–6 W</span> per
              module), and the battery is empty within minutes to an hour.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              The hot side needs a heat sink, and the cold side causes condensation, so the
              palm gets wet anyway.
            </span>
          </li>
        </ul>
      </div>

      {/* How the glove works */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          How the glove works
        </h3>
        <ol className="space-y-2.5 text-xs text-slate-700">
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono-tech flex items-center justify-center shrink-0">
              1
            </span>
            <span>
              Sponge or hydrogel pads soaked 30s in tap water sit against the palm and
              fingertips. The minerals in tap water carry the current.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono-tech flex items-center justify-center shrink-0">
              2
            </span>
            <span>
              A wrist controller sends a small, steady DC current (about{' '}
              <span className="font-mono-tech">8–20 mA</span>) through the pads for{' '}
              <span className="font-mono-tech">15–25 min</span>.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono-tech flex items-center justify-center shrink-0">
              3
            </span>
            <span>
              Ions build up in the sweat ducts and block them for a while. Sweating
              usually drops after <span className="font-mono-tech">6–10</span> sessions,
              followed by <span className="font-mono-tech">1–2</span> maintenance sessions
              a week.
            </span>
          </li>
        </ol>
      </div>

      {/* What you need to solve */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          What you need to solve
        </h3>
        <div className="space-y-2">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-900">
              You need two gloves, not one
            </p>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Current needs a path in and a path out. One glove is (+) and the other is
              (−), and the current flows through your body between them. The controller
              swaps the polarity halfway through so both hands get the same treatment.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-900">Pads still need water</p>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              No tray, but the pads have to be wet. Use snap-on sponge or hydrogel pads
              that you soak for about 30 seconds before each session and can replace.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-900">
              Even contact keeps it safe
            </p>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              A dry spot concentrates the current and causes tingling or small burns. The
              fix is a constant-current driver that checks skin contact and shuts off on
              its own.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-900">
              You need a voltage boost
            </p>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Skin (~400 μm palmar stratum corneum) resists current, so pushing 15 mA
              needs up to about <span className="font-mono-tech">40–60 V</span>. A small
              boost converter can get that from one 3.7 V Li-ion cell.
            </p>
          </div>
        </div>
      </div>

      {/* Cost outlook */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Cost outlook
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-[11px] text-slate-500">Estimated parts cost</p>
            <p className="text-lg font-semibold font-mono-tech text-slate-900 mt-0.5">
              $40–70
            </p>
            <p className="text-[11px] text-slate-500">prototype, per pair</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-[11px] text-slate-500">Typical tray units</p>
            <p className="text-lg font-semibold font-mono-tech text-slate-900 mt-0.5">
              $300+
            </p>
            <p className="text-[11px] text-slate-500">home iontophoresis devices</p>
          </div>
        </div>
      </div>

      {/* Medical safety disclaimer */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 leading-relaxed flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
        <span>
          This is a concept only. Iontophoresis devices are regulated medical devices (FDA
          Class II / CE). Don&apos;t use or test a prototype if you have a pacemaker or
          metal implants, are pregnant, or have open cuts. Talk to a dermatologist and a
          qualified electronics engineer before testing on skin.
        </span>
      </div>
    </div>
  );
};
