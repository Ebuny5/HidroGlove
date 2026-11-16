import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  Hammer,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { BUILD_STEPS } from '../data/buildSteps';
import { PARTS } from '../data/parts';
import { PartId } from '../types/hydroglove';
import { downloadAsJpeg } from '../utils/downloadJpeg';
import { StepSvgDiagram } from './StepSvgDiagram';

interface BuildGuidePanelProps {
  selectedPartId: PartId | null;
  onSelectPart: (id: PartId) => void;
  onOpenSessionSim: () => void;
}

const STORAGE_KEY = 'hydroglove_build_progress_v1';

function loadInitialProgress(): Record<number, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export const BuildGuidePanel: React.FC<BuildGuidePanelProps> = ({
  selectedPartId,
  onSelectPart,
  onOpenSessionSim,
}) => {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>(
    loadInitialProgress,
  );
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Ignore storage quota errors
    }
  }, [completed]);

  const step = BUILD_STEPS[activeStepIdx];
  const completedCount = BUILD_STEPS.filter(
    (s) => Boolean(completed[s.stepNumber]),
  ).length;
  const progressPct = Math.round((completedCount / BUILD_STEPS.length) * 100);
  const isStepDone = Boolean(completed[step.stepNumber]);
  const showStep7SoftReminder =
    step.stepNumber === 8 && !Boolean(completed[7]);

  const goToStep = (idx: number) => {
    const clamped = Math.max(0, Math.min(BUILD_STEPS.length - 1, idx));
    setActiveStepIdx(clamped);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCurrentStep = () => {
    setCompleted((prev) => ({
      ...prev,
      [step.stepNumber]: !prev[step.stepNumber],
    }));
  };

  const handleCompleteAndNext = () => {
    setCompleted((prev) => ({
      ...prev,
      [step.stepNumber]: true,
    }));
    if (activeStepIdx < BUILD_STEPS.length - 1) {
      goToStep(activeStepIdx + 1);
    }
  };

  const handleSaveStepPhoto = async () => {
    setSavingPhoto(true);
    try {
      await downloadAsJpeg(
        step.imageUrl,
        `hydroglove-step-${step.stepNumber}-${step.shortTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}.jpg`,
      );
    } finally {
      setSavingPhoto(false);
    }
  };

  return (
    <div ref={scrollContainerRef} className="p-5 space-y-5">
      {/* Progress Header + S1-S8 Quick Pills */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Wrench className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 truncate">
              8-Step Prototype Assembly
            </span>
          </div>
          <span className="text-[11px] font-mono-tech font-medium text-teal-800 whitespace-nowrap">
            {completedCount}/{BUILD_STEPS.length} complete ({progressPct}%)
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-8 gap-1">
          {BUILD_STEPS.map((s, idx) => {
            const active = idx === activeStepIdx;
            const done = Boolean(completed[s.stepNumber]);
            return (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => goToStep(idx)}
                title={`Step ${s.stepNumber}: ${s.shortTitle}`}
                className={`py-1.5 rounded-lg text-[11px] font-mono-tech font-semibold border transition-colors flex items-center justify-center gap-0.5 ${
                  active
                    ? s.isSafetyGate
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-teal-700 text-white border-teal-700'
                    : done
                      ? 'bg-teal-50 text-teal-800 border-teal-300'
                      : s.isSafetyGate
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:border-amber-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {done && !active ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>S{s.stepNumber}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Soft Safety Reminder if viewing Step 8 before completing Step 7 */}
      {showStep7SoftReminder && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <p className="font-semibold">
                Safety reminder: Step 7 bench test is not checked off yet
              </p>
              <p className="text-amber-800 mt-0.5">
                Verify the 5–20 mA ceiling and &lt;40% open-circuit shutoff across a 1.5–2.2
                kΩ dummy resistor before snapping wet pads onto your glove.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => goToStep(6)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
          >
            Review Step 7
          </button>
        </div>
      )}

      {/* Step Title & Clickable 3D Part Highlight Pills */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`text-[11px] font-mono-tech font-semibold uppercase tracking-wide ${
              step.isSafetyGate ? 'text-amber-700' : 'text-teal-700'
            }`}
          >
            Step {step.stepNumber} of 8 · {step.layerBadge}
          </span>
          <button
            type="button"
            onClick={toggleCurrentStep}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
              isStepDone
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isStepDone ? 'Completed' : 'Mark complete'}</span>
          </button>
        </div>

        <h2 className="text-base font-bold text-slate-900 leading-snug">
          {step.title}
        </h2>

        {/* Clickable 3D Part Highlight Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 mr-1">
            Inspect in 3D:
          </span>
          {step.partIds.map((pid) => {
            const part = PARTS.find((p) => p.id === pid);
            if (!part) return null;
            const active = selectedPartId === pid;
            return (
              <button
                key={pid}
                type="button"
                onClick={() => onSelectPart(pid)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  active
                    ? 'bg-teal-700 border-teal-700 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-800'
                }`}
              >
                <span className="font-mono-tech font-bold">#{part.n}</span>
                <span>{part.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear plain-language explainer for Steps 5–8: Back Glass OLED + What Plugs In */}
      {step.stepNumber >= 5 && (
        <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-3.5 space-y-2.5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-teal-300">
              Where You See Current Moving &amp; What Plugs In
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              The small dark glass screen (<strong className="text-white">#8 Status display</strong>)
              sits on the <strong className="text-white">back of the wrist</strong>—it displays the
              live <span className="font-mono-tech text-teal-300">mA</span> number moving,{' '}
              <span className="font-mono-tech text-slate-100">POL + / −</span>, and drops to{' '}
              <span className="font-mono-tech text-amber-300">0.0 mA (CHECK PAD / DONE)</span> when
              current stops. You <strong className="text-white">unplug USB-C</strong> before running
              (it runs off the wrist battery); the only cable plugged in during use is the{' '}
              <strong className="text-white">cable connecting both gloves</strong> so current flows
              between hands.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectPart('display')}
              className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold transition-colors"
            >
              Look at Back Glass OLED in 3D
            </button>
            <button
              type="button"
              onClick={onOpenSessionSim}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-[11px] font-medium transition-colors"
            >
              Watch Current Live in Session Sim
            </button>
          </div>
        </div>
      )}

      {/* 1. Clean ESD Mat Workbench Photo + Save Step Photo (.JPG) */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
        <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden">
          {imgErrors[step.stepNumber] ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-100">
              <Wrench className="w-7 h-7 text-teal-700 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Step {step.stepNumber}: {step.shortTitle}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                ESD Mat Workbench Reference
              </p>
            </div>
          ) : (
            <img
              src={step.imageUrl}
              alt={step.imageAlt}
              referrerPolicy="no-referrer"
              onError={() =>
                setImgErrors((prev) => ({ ...prev, [step.stepNumber]: true }))
              }
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white border-t border-slate-200">
          <span className="text-[11px] text-slate-500 truncate">
            ESD workbench assembly reference · Step {step.stepNumber}
          </span>
          <button
            type="button"
            disabled={savingPhoto}
            onClick={handleSaveStepPhoto}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-teal-600 text-xs font-medium text-slate-700 hover:text-teal-800 bg-slate-50 hover:bg-white transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {savingPhoto ? 'Saving…' : 'Save Step Photo (.JPG)'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Custom Explanatory SVG Diagram */}
      <StepSvgDiagram type={step.diagramType} />

      {/* 3. Side-by-Side Material Cards: Target Clinical BOM vs DIY Bench Equivalent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Target Clinical Material (BOM)
            </span>
            <span className="text-[10px] font-mono-tech font-semibold text-teal-700">
              {step.clinicalMaterial.cost}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-900">
            {step.clinicalMaterial.name}
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {step.clinicalMaterial.spec}
          </p>
        </div>

        <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-3 space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-teal-700 block">
            DIY Bench Equivalent (Prototype v1)
          </span>
          <p className="text-xs font-semibold text-slate-900">
            {step.diyEquivalent.name}
          </p>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {step.diyEquivalent.spec}
          </p>
          <p className="text-[11px] text-teal-900 leading-relaxed pt-1 border-t border-teal-200/70">
            <strong>Tip:</strong> {step.diyEquivalent.sourcingTip}
          </p>
        </div>
      </div>

      {/* 4. Tools on Your Workbench */}
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
          <Hammer className="w-3.5 h-3.5 text-slate-600" />
          <span>Tools on Your Workbench</span>
        </div>
        <ul className="space-y-1 text-xs text-slate-600">
          {step.tools.map((tool) => (
            <li key={tool} className="flex items-start gap-2">
              <span className="text-teal-700 font-bold leading-4">·</span>
              <span>{tool}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Numbered Step-by-Step Instructions */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Step-by-step assembly
        </h3>
        <ol className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          {step.instructions.map((text, idx) => (
            <li key={idx} className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono-tech flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 6. Wiring & Pinout Note */}
      <div className="rounded-lg bg-slate-900 text-slate-100 p-3.5 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-300">
          <Cpu className="w-3.5 h-3.5" />
          <span>Wiring &amp; Pinout Note</span>
        </div>
        <p className="text-xs font-mono-tech text-slate-200 leading-relaxed">
          {step.wiringNote}
        </p>
      </div>

      {/* 7. Pass / Safety Check */}
      <div
        className={`rounded-lg border p-3.5 flex items-start gap-2.5 ${
          step.isSafetyGate
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}
      >
        {step.isSafetyGate ? (
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        )}
        <div className="text-xs leading-relaxed">
          <p className="font-semibold">Pass / Safety Check</p>
          <p className="mt-0.5">{step.safetyCheck}</p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
        <button
          type="button"
          disabled={activeStepIdx === 0}
          onClick={() => goToStep(activeStepIdx - 1)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-medium text-slate-700 transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        <button
          type="button"
          onClick={handleCompleteAndNext}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <span>
            {activeStepIdx === BUILD_STEPS.length - 1
              ? 'Mark Build Complete'
              : 'Complete & Next Step'}
          </span>
          {activeStepIdx < BUILD_STEPS.length - 1 ? (
            <ArrowRight className="w-3.5 h-3.5" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
