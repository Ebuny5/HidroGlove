export type PartId =
  | 'pad'
  | 'tips'
  | 'electrode'
  | 'barrier'
  | 'traces'
  | 'controller'
  | 'battery'
  | 'display'
  | 'cuff'
  | 'glove';

export type CameraView = 'palm' | 'back';

export type TabId = 'feasibility' | 'parts' | 'build' | 'session';

export interface PartItem {
  id: PartId;
  n: number;
  side: CameraView | 'any';
  title: string;
  cost: string;
  body: string;
}

export interface SimLogEntry {
  id: string;
  time: string;
  message: string;
}

export interface SimSnapshot {
  running: boolean;
  duration: number;
  elapsed: number;
  current: number;
  target: number;
  wet: number;
  polarity: '+' | '−';
  paused: boolean;
  done: boolean;
  flipped: boolean;
  phase: string;
  statusText: string;
  statusTone: 'idle' | 'active' | 'pause' | 'done';
  logs: SimLogEntry[];
}

export type BuildDiagramType =
  | 'sizing'
  | 'laminate'
  | 'electrodes'
  | 'wiring'
  | 'cuffLoop'
  | 'controllerPcb'
  | 'benchTest'
  | 'wetPads';

export interface BuildStep {
  stepNumber: number;
  title: string;
  shortTitle: string;
  layerBadge: string;
  partIds: PartId[];
  imageUrl: string;
  imageAlt: string;
  diagramType: BuildDiagramType;
  isSafetyGate?: boolean;
  clinicalMaterial: {
    name: string;
    spec: string;
    cost: string;
  };
  diyEquivalent: {
    name: string;
    spec: string;
    sourcingTip: string;
  };
  tools: string[];
  instructions: string[];
  wiringNote: string;
  safetyCheck: string;
}
