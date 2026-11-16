import { useCallback, useRef, useState } from 'react';
import { Wrench } from 'lucide-react';
import { Viewport3D, SimRuntimeRefs } from './components/Viewport3D';
import { FeasibilityPanel } from './components/FeasibilityPanel';
import { DesignPartsPanel } from './components/DesignPartsPanel';
import { BuildGuidePanel } from './components/BuildGuidePanel';
import { SessionSimPanel } from './components/SessionSimPanel';
import { ProductPhotoModal } from './components/ProductPhotoModal';
import { PARTS } from './data/parts';
import {
  CameraView,
  PartId,
  SimLogEntry,
  SimSnapshot,
  TabId,
} from './types/hydroglove';

function formatSimTime(min: number): string {
  const s = Math.max(0, Math.round(min * 60));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('feasibility');
  const [selectedPartId, setSelectedPartId] = useState<PartId | null>(null);
  const [flyRequest, setFlyRequest] = useState<{
    view: CameraView;
    nonce: number;
  } | null>(null);
  const [productPhotoOpen, setProductPhotoOpen] = useState(false);

  // Mutable simulation state accessed at 60fps by Three.js loop
  const simMutableRef = useRef({
    running: false,
    duration: 20,
    elapsed: 0,
    current: 0,
    target: 12,
    wet: 85,
    polarity: '+' as '+' | '−',
    paused: false,
    done: false,
    flipped: false,
    phase: 'Ready',
    logs: [] as SimLogEntry[],
    logSeq: 0,
  });

  const simRuntimeRef = useRef<SimRuntimeRefs>({
    current: 0,
    target: 12,
    polarity: '+',
    remainingFormatted: '20:00',
    stateLabel: 'READY',
    paused: false,
    done: false,
    running: false,
  });

  const [simSnapshot, setSimSnapshot] = useState<SimSnapshot>({
    running: false,
    duration: 20,
    elapsed: 0,
    current: 0,
    target: 12,
    wet: 85,
    polarity: '+',
    paused: false,
    done: false,
    flipped: false,
    phase: 'Ready',
    statusText: 'Idle',
    statusTone: 'idle',
    logs: [],
  });

  const pushLog = useCallback((message: string) => {
    const s = simMutableRef.current;
    s.logSeq += 1;
    const entry: SimLogEntry = {
      id: `${s.logSeq}-${Date.now()}`,
      time: formatSimTime(s.elapsed),
      message,
    };
    s.logs = [entry, ...s.logs].slice(0, 40);
  }, []);

  const syncSnapshot = useCallback(() => {
    const s = simMutableRef.current;
    let statusText = 'Idle';
    let statusTone: SimSnapshot['statusTone'] = 'idle';
    if (s.running && !s.paused) {
      statusText = `Session · ${s.current.toFixed(1)} mA`;
      statusTone = 'active';
    } else if (s.paused && s.running) {
      statusText = 'Safety pause';
      statusTone = 'pause';
    } else if (s.done) {
      statusText = 'Session complete';
      statusTone = 'done';
    }

    simRuntimeRef.current.current = s.current;
    simRuntimeRef.current.target = s.target;
    simRuntimeRef.current.polarity = s.polarity;
    simRuntimeRef.current.remainingFormatted = formatSimTime(
      Math.max(0, s.duration - s.elapsed),
    );
    simRuntimeRef.current.stateLabel = s.done
      ? 'DONE'
      : s.paused
        ? 'CHECK PAD'
        : s.running
          ? 'ACTIVE'
          : 'READY';
    simRuntimeRef.current.paused = s.paused;
    simRuntimeRef.current.done = s.done;
    simRuntimeRef.current.running = s.running;

    setSimSnapshot({
      running: s.running,
      duration: s.duration,
      elapsed: s.elapsed,
      current: s.current,
      target: s.target,
      wet: s.wet,
      polarity: s.polarity,
      paused: s.paused,
      done: s.done,
      flipped: s.flipped,
      phase: s.phase,
      statusText,
      statusTone,
      logs: s.logs,
    });
  }, []);

  const handleSimTick = useCallback(
    (dt: number) => {
      const s = simMutableRef.current;
      const minutes = dt; // 1 second real = 1 minute simulated
      let phase = 'Ready';
      let goal = 0;

      if (s.running) {
        s.elapsed += minutes;
        const contactOk = s.wet >= 40;
        if (!contactOk && !s.paused) {
          s.paused = true;
          pushLog('Pad too dry. Current stopped (safety cutoff)');
        }
        if (contactOk && s.paused) {
          s.paused = false;
          pushLog('Contact restored. Ramping back up');
        }

        const half = s.duration / 2;
        if (!s.flipped && s.elapsed >= half) {
          s.flipped = true;
          pushLog('Halfway: polarity reversed');
        }
        s.polarity = s.flipped ? '−' : '+';

        const nearFlip = Math.abs(s.elapsed - half) < 0.35;
        const nearEnd = s.duration - s.elapsed < 1;
        goal =
          s.paused || nearFlip
            ? 0
            : nearEnd
              ? s.target * Math.max(0, s.duration - s.elapsed)
              : s.target;

        phase = s.paused
          ? 'Paused · check pad wetness'
          : nearFlip
            ? 'Switching polarity'
            : nearEnd
              ? 'Ramping down'
              : s.current < s.target - 0.5
                ? 'Ramping up'
                : 'Treating';

        if (s.elapsed >= s.duration) {
          s.elapsed = s.duration;
          s.running = false;
          s.done = true;
          phase = 'Complete';
          pushLog('Session complete. Dry hands and rinse the pads');
        }
      } else if (s.done) {
        phase = 'Complete';
      } else if (s.elapsed > 0) {
        phase = 'Paused';
      }

      const wasActive = s.running || s.current > 0;
      s.current += (goal - s.current) * Math.min(1, dt * 1.5);
      if (s.current < 0.05) s.current = 0;
      s.phase = phase;

      if (wasActive) {
        syncSnapshot();
      }
    },
    [pushLog, syncSnapshot],
  );

  const handleSelectPart = useCallback((id: PartId | null) => {
    setSelectedPartId(id);
    if (!id) return;
    const part = PARTS.find((p) => p.id === id);
    if (part && (part.side === 'palm' || part.side === 'back')) {
      setFlyRequest({ view: part.side, nonce: Date.now() });
    }
  }, []);

  const handleResetSim = useCallback(() => {
    const s = simMutableRef.current;
    s.running = false;
    s.elapsed = 0;
    s.current = 0;
    s.polarity = '+';
    s.paused = false;
    s.done = false;
    s.flipped = false;
    s.phase = 'Ready';
    s.logs = [];
    syncSnapshot();
  }, [syncSnapshot]);

  const handleToggleStart = useCallback(() => {
    const s = simMutableRef.current;
    if (s.done) {
      s.elapsed = 0;
      s.current = 0;
      s.polarity = '+';
      s.paused = false;
      s.done = false;
      s.flipped = false;
      s.logs = [];
    }
    s.running = !s.running;
    if (s.running) {
      pushLog(
        s.elapsed === 0
          ? `Session started, ramping to ${s.target} mA`
          : 'Resumed',
      );
    } else {
      pushLog('Paused by user');
    }
    syncSnapshot();
  }, [pushLog, syncSnapshot]);

  const handleTargetChange = useCallback(
    (mA: number) => {
      simMutableRef.current.target = mA;
      syncSnapshot();
    },
    [syncSnapshot],
  );

  const handleDurationChange = useCallback(
    (minutes: number) => {
      if (simMutableRef.current.running) return;
      simMutableRef.current.duration = minutes;
      syncSnapshot();
    },
    [syncSnapshot],
  );

  const handleWetnessChange = useCallback(
    (percent: number) => {
      simMutableRef.current.wet = percent;
      syncSnapshot();
    },
    [syncSnapshot],
  );

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* Left (Desktop) / Top (Mobile) 3D Viewport */}
      <Viewport3D
        selectedPartId={selectedPartId}
        onSelectPart={handleSelectPart}
        flyRequest={flyRequest}
        simRuntimeRef={simRuntimeRef}
        simSnapshot={simSnapshot}
        onSimTick={handleSimTick}
        onOpenProductPhoto={() => setProductPhotoOpen(true)}
      />

      {/* Right (Desktop) / Bottom (Mobile) Tabbed Workspace */}
      <aside className="flex-1 lg:w-5/12 min-h-0 flex flex-col relative z-30 bg-white border-t lg:border-t-0 lg:border-l border-slate-200">
        {/* 4-Tab Bar */}
        <nav
          aria-label="HydroGlove workspace sections"
          className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/90 px-1.5 pt-1.5 gap-1 shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'feasibility'}
            onClick={() => setActiveTab('feasibility')}
            className={`px-2 py-2.5 text-xs font-medium rounded-t-lg border border-b-0 transition-colors whitespace-nowrap truncate ${
              activeTab === 'feasibility'
                ? 'bg-white text-slate-900 border-slate-200 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Feasibility
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'parts'}
            onClick={() => setActiveTab('parts')}
            className={`px-2 py-2.5 text-xs font-medium rounded-t-lg border border-b-0 transition-colors whitespace-nowrap truncate ${
              activeTab === 'parts'
                ? 'bg-white text-slate-900 border-slate-200 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="hidden sm:inline">Design &amp; parts</span>
            <span className="sm:hidden">Parts</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'build'}
            onClick={() => setActiveTab('build')}
            className={`px-2 py-2.5 text-xs font-medium rounded-t-lg border border-b-0 transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
              activeTab === 'build'
                ? 'bg-white text-teal-800 border-slate-200 font-semibold'
                : 'border-transparent text-teal-700 hover:text-teal-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            <span>Build guide</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'session'}
            onClick={() => setActiveTab('session')}
            className={`px-2 py-2.5 text-xs font-medium rounded-t-lg border border-b-0 transition-colors whitespace-nowrap truncate ${
              activeTab === 'session'
                ? 'bg-white text-slate-900 border-slate-200 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="hidden sm:inline">Session sim</span>
            <span className="sm:hidden">Session</span>
          </button>
        </nav>

        {/* Scrollable Active Panel */}
        <div className="flex-1 min-h-0 overflow-y-auto scroll-thin bg-white">
          {activeTab === 'feasibility' && <FeasibilityPanel />}
          {activeTab === 'parts' && (
            <DesignPartsPanel
              selectedPartId={selectedPartId}
              onSelectPart={(id) => handleSelectPart(id)}
              onOpenBuildGuide={() => setActiveTab('build')}
            />
          )}
          {activeTab === 'build' && (
            <BuildGuidePanel
              selectedPartId={selectedPartId}
              onSelectPart={(id) => handleSelectPart(id)}
              onOpenSessionSim={() => setActiveTab('session')}
            />
          )}
          {activeTab === 'session' && (
            <SessionSimPanel
              snapshot={simSnapshot}
              onTargetChange={handleTargetChange}
              onDurationChange={handleDurationChange}
              onWetnessChange={handleWetnessChange}
              onToggleStart={handleToggleStart}
              onReset={handleResetSim}
            />
          )}
        </div>
      </aside>

      {/* Product Photo Modal */}
      <ProductPhotoModal
        open={productPhotoOpen}
        onClose={() => setProductPhotoOpen(false)}
      />
    </div>
  );
}
