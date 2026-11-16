import React from 'react';
import { BuildDiagramType } from '../types/hydroglove';

interface StepSvgDiagramProps {
  type: BuildDiagramType;
}

export const StepSvgDiagram: React.FC<StepSvgDiagramProps> = ({ type }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Engineering Diagram
        </span>
        <span className="text-[10px] font-mono-tech text-slate-400">
          HydroGlove Concept v0.2
        </span>
      </div>
      {type === 'sizing' && (
        <svg viewBox="0 0 420 140" className="w-full h-auto" role="img" aria-label="Hand sizing and contact zone layout">
          <rect x="0" y="0" width="420" height="140" rx="8" fill="#ffffff" />
          {/* Hand outline */}
          <path
            d="M72 115 L72 72 L52 58 Q46 53 51 47 Q56 42 63 48 L76 59 L76 26 Q76 19 82 19 Q88 19 88 26 L88 55 L94 55 L94 18 Q94 11 100 11 Q106 11 106 18 L106 55 L112 55 L112 22 Q112 15 118 15 Q124 15 124 22 L124 57 L130 57 L130 31 Q130 25 136 25 Q142 25 142 31 L142 82 L134 115 Z"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Contact zones */}
          <rect x="82" y="64" width="52" height="40" rx="6" fill="#5eead4" fillOpacity="0.65" stroke="#0f766e" strokeWidth="1.5" />
          <rect x="78" y="21" width="8" height="12" rx="3" fill="#5eead4" stroke="#0f766e" strokeWidth="1" />
          <rect x="96" y="13" width="8" height="12" rx="3" fill="#5eead4" stroke="#0f766e" strokeWidth="1" />
          <rect x="114" y="17" width="8" height="12" rx="3" fill="#5eead4" stroke="#0f766e" strokeWidth="1" />
          <rect x="132" y="27" width="8" height="12" rx="3" fill="#5eead4" stroke="#0f766e" strokeWidth="1" />
          <rect x="50" y="48" width="10" height="9" rx="3" transform="rotate(-35 55 52)" fill="#5eead4" stroke="#0f766e" strokeWidth="1" />
          {/* Callout lines */}
          <line x1="145" y1="78" x2="210" y2="50" stroke="#0f766e" strokeDasharray="3 2" strokeWidth="1.2" />
          <text x="216" y="47" fontSize="11" fontWeight="600" fill="#0f172a">Palm Zone (65 × 75 mm)</text>
          <text x="216" y="62" fontSize="10" fill="#475569">Snug 15–20 mmHg compression</text>
          <line x1="142" y1="30" x2="210" y2="25" stroke="#0f766e" strokeDasharray="3 2" strokeWidth="1.2" />
          <text x="216" y="27" fontSize="11" fontWeight="600" fill="#0f172a">5 Distal Fingertip Zones</text>
          <line x1="72" y1="108" x2="142" y2="108" stroke="#dc2626" strokeWidth="1.2" />
          <text x="216" y="96" fontSize="10" fontWeight="600" fill="#0f172a">12 mm Wrist Clearance</text>
          <text x="216" y="110" fontSize="10" fill="#475569">Prevents cuff tendon pinch</text>
        </svg>
      )}

      {type === 'laminate' && (
        <svg viewBox="0 0 420 140" className="w-full h-auto" role="img" aria-label="L1 to L4 waterproof moisture-block cross section">
          <rect x="0" y="0" width="420" height="140" rx="8" fill="#ffffff" />
          {/* Cross-section bars */}
          <rect x="20" y="18" width="190" height="22" rx="4" fill="#1e293b" />
          <text x="30" y="33" fontSize="10" fontWeight="600" fill="#ffffff">L1 · Outer Compression Knit (DRY)</text>
          <rect x="20" y="43" width="190" height="16" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
          <text x="30" y="54" fontSize="9.5" fontWeight="700" fill="#0f172a">L2 · 30 μm TPU Moisture Barrier</text>
          <rect x="28" y="62" width="174" height="18" rx="3" fill="#3f3f46" />
          <text x="38" y="74" fontSize="9.5" fontWeight="600" fill="#e2e8f0">L3 · Carbon-Silicone Electrode</text>
          <rect x="28" y="83" width="174" height="20" rx="3" fill="#5eead4" stroke="#0f766e" strokeWidth="1" />
          <text x="38" y="96" fontSize="9.5" fontWeight="700" fill="#042f2e">L4 · Wet Tap-Water Pad (85%)</text>
          <rect x="20" y="106" width="190" height="20" rx="4" fill="#ffedd5" stroke="#fdba74" strokeWidth="1" />
          <text x="30" y="119" fontSize="9.5" fontWeight="600" fill="#7c2d12">Palmar Skin (~400 μm Stratum)</text>
          {/* Skirt callout */}
          <path d="M225 51 L260 51" stroke="#0f766e" strokeWidth="1.5" markerEnd="url(#arrowTeal)" />
          <text x="266" y="44" fontSize="10.5" fontWeight="600" fill="#0f172a">+5 mm TPU Perimeter Skirt</text>
          <text x="266" y="58" fontSize="9.5" fill="#475569">Blocks tap-water wicking into</text>
          <text x="266" y="70" fontSize="9.5" fill="#475569">knit fabric (prevents leakage</text>
          <text x="266" y="82" fontSize="9.5" fill="#475569">paths & keeps hand warm)</text>
          <rect x="266" y="94" width="134" height="26" rx="5" fill="#f0fdfa" stroke="#99f6e4" />
          <text x="274" y="110" fontSize="9.5" fontWeight="600" fill="#0f766e">Current → Skin Only</text>
        </svg>
      )}

      {type === 'electrodes' && (
        <svg viewBox="0 0 420 140" className="w-full h-auto" role="img" aria-label="Palm and 5 fingertip isolated electrodes with snap studs">
          <rect x="0" y="0" width="420" height="140" rx="8" fill="#ffffff" />
          {/* Palm plate */}
          <rect x="42" y="58" width="90" height="62" rx="10" fill="#3a3f45" stroke="#0f172a" strokeWidth="1.2" />
          <circle cx="54" cy="70" r="4" fill="#cbd5e1" stroke="#0f172a" />
          <circle cx="120" cy="70" r="4" fill="#cbd5e1" stroke="#0f172a" />
          <circle cx="54" cy="108" r="4" fill="#cbd5e1" stroke="#0f172a" />
          <circle cx="120" cy="108" r="4" fill="#cbd5e1" stroke="#0f172a" />
          {/* 5 fingertip plates */}
          {[
            { x: 20, y: 52 },
            { x: 48, y: 20 },
            { x: 74, y: 12 },
            { x: 100, y: 18 },
            { x: 126, y: 30 },
          ].map((pt, idx) => (
            <g key={idx}>
              <rect x={pt.x} y={pt.y} width="18" height="22" rx="5" fill="#3a3f45" stroke="#0f172a" strokeWidth="1" />
              <circle cx={pt.x + 9} cy={pt.y + 11} r="3.2" fill="#cbd5e1" stroke="#0f172a" />
            </g>
          ))}
          {/* Flexion gap indicator */}
          <line x1="40" y1="49" x2="146" y2="49" stroke="#f59e0b" strokeDasharray="3 2" strokeWidth="1.5" />
          <text x="172" y="34" fontSize="11" fontWeight="600" fill="#0f172a">8–10 mm Joint Flexion Gaps</text>
          <text x="172" y="49" fontSize="9.5" fill="#475569">Keeps finger creases free of stiff silicone</text>
          <text x="172" y="75" fontSize="11" fontWeight="600" fill="#0f172a">9 Stainless 10 mm Snap Studs</text>
          <text x="172" y="90" fontSize="9.5" fill="#475569">4 on palm plate + 1 on each fingertip</text>
          <rect x="172" y="102" width="224" height="24" rx="5" fill="#fef3c7" stroke="#fcd34d" />
          <text x="180" y="117" fontSize="9.5" fontWeight="600" fill="#92400e">Insulate stud backs with silicone—zero bare metal</text>
        </svg>
      )}

      {type === 'wiring' && (
        <svg viewBox="0 0 420 140" className="w-full h-auto" role="img" aria-label="Serpentine finger wire slack routing diagram">
          <rect x="0" y="0" width="420" height="140" rx="8" fill="#ffffff" />
          {/* Finger channel */}
          <rect x="35" y="25" width="350" height="44" rx="22" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="150" y1="25" x2="150" y2="69" stroke="#94a3b8" strokeDasharray="3 3" />
          <line x1="255" y1="25" x2="255" y2="69" stroke="#94a3b8" strokeDasharray="3 3" />
          <text x="135" y="18" fontSize="9.5" fill="#64748b">PIP Joint</text>
          <text x="240" y="18" fontSize="9.5" fill="#64748b">MCP Joint</text>
          {/* Serpentine S-curve */}
          <path
            d="M65 47 L115 47 C135 47, 135 33, 150 33 C165 33, 165 61, 180 61 L220 47 C240 47, 240 33, 255 33 C270 33, 270 61, 285 61 L355 47"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2.5"
          />
          <circle cx="65" cy="47" r="6" fill="#3a3f45" />
          <rect x="85" y="42" width="18" height="10" rx="2" fill="#0f172a" />
          <text x="32" y="96" fontSize="10.5" fontWeight="600" fill="#0f172a">28–30 AWG Silicone Serpentine Slack (+25% length)</text>
          <text x="32" y="112" fontSize="9.5" fill="#475569">Adhesive heat-shrink over solder lugs prevents wire fatigue when gripping</text>
          <text x="32" y="126" fontSize="9.5" fontWeight="600" fill="#0f766e">All 6 electrode zones tie in parallel → Single Glove Bus (&lt; 2 Ω)</text>
        </svg>
      )}

      {type === 'cuffLoop' && (
        <svg viewBox="0 0 420 140" className="w-full h-auto" role="img" aria-label="Paired glove body-circuit return schematic">
          <rect x="0" y="0" width="420" height="140" rx="8" fill="#ffffff" />
          {/* Left Glove */}
          <rect x="24" y="24" width="102" height="68" rx="10" fill="#f0fdfa" stroke="#0f766e" strokeWidth="1.5" />
          <text x="40" y="48" fontSize="11" fontWeight="700" fill="#0f766e">Glove A (+)</text>
          <text x="36" y="64" fontSize="9.5" fill="#475569">Controller Cuff</text>
          <text x="40" y="78" fontSize="9.5" fontFamily="monospace" fill="#0f172a">5–20 mA OUT</text>
          {/* Right Glove */}
          <rect x="294" y="24" width="102" height="68" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="1.5" />
          <text x="310" y="48" fontSize="11" fontWeight="700" fill="#0f172a">Glove B (−)</text>
          <text x="308" y="64" fontSize="9.5" fill="#475569">Paired Return</text>
          <text x="312" y="78" fontSize="9.5" fontFamily="monospace" fill="#0f172a">Return Jack</text>
          {/* Body loop top */}
          <path d="M126 42 L294 42" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="5 3" />
          <text x="150" y="34" fontSize="9.5" fontWeight="600" fill="#0e7490">Current through palms</text>
          {/* Cable bottom */}
          <path d="M126 78 L294 78" stroke="#1e293b" strokeWidth="2.5" />
          <text x="148" y="94" fontSize="9.5" fontWeight="600" fill="#0f172a">1.1 m Inter-Glove Return Cable</text>
          <rect x="65" y="106" width="290" height="22" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="80" y="121" fontSize="9.5" fill="#475569">H-Bridge flips (+) and (−) halfway through session</text>
        </svg>
      )}

      {type === 'controllerPcb' && (
        <svg viewBox="0 0 420 148" className="w-full h-auto" role="img" aria-label="Back-of-wrist controller PCB and glass OLED display layout">
          <rect x="0" y="0" width="420" height="148" rx="8" fill="#ffffff" />
          <rect x="12" y="14" width="90" height="44" rx="6" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.2" />
          <text x="20" y="32" fontSize="9" fontWeight="700" fill="#1e40af">1000mAh Li-ion</text>
          <text x="20" y="46" fontSize="8" fill="#dc2626" fontWeight="600">Unplug USB-C to run</text>

          <line x1="102" y1="36" x2="118" y2="36" stroke="#475569" strokeWidth="1.5" />
          <rect x="118" y="14" width="84" height="44" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.2" />
          <text x="126" y="32" fontSize="9" fontWeight="700" fill="#166534">3.7V → 60V</text>
          <text x="126" y="46" fontSize="8" fill="#15803d">Boost Stage</text>

          <line x1="202" y1="36" x2="218" y2="36" stroke="#475569" strokeWidth="1.5" />
          <rect x="218" y="14" width="90" height="44" rx="6" fill="#f0fdfa" stroke="#0f766e" strokeWidth="1.2" />
          <text x="226" y="32" fontSize="9" fontWeight="700" fill="#0f766e">5–20 mA CC</text>
          <text x="226" y="46" fontSize="8" fill="#0d9488">INA219 Current</text>

          <line x1="308" y1="36" x2="324" y2="36" stroke="#475569" strokeWidth="1.5" />
          <rect x="324" y="14" width="84" height="44" rx="6" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.2" />
          <text x="333" y="32" fontSize="9" fontWeight="700" fill="#0f172a">H-Bridge</text>
          <text x="333" y="46" fontSize="8" fill="#475569">Cable → Glove B</text>

          {/* Back-of-wrist Glass OLED preview */}
          <rect x="12" y="72" width="176" height="64" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="22" y="80" width="114" height="48" rx="4" fill="#05090b" />
          <text x="28" y="92" fontSize="7.5" fontWeight="700" fill="#5eead4">ACTIVE</text>
          <text x="102" y="92" fontSize="7" fontFamily="monospace" fill="#94a3b8">POL +</text>
          <text x="28" y="111" fontSize="15" fontWeight="700" fontFamily="monospace" fill="#f8fafc">12.0</text>
          <text x="68" y="111" fontSize="8" fill="#94a3b8">mA</text>
          <text x="28" y="122" fontSize="7.5" fontFamily="monospace" fill="#cbd5e1">19:42</text>
          <rect x="64" y="117" width="64" height="5" rx="2" fill="#1e293b" />
          <rect x="64" y="117" width="38" height="5" rx="2" fill="#2dd4bf" />
          <circle cx="162" cy="96" r="10" fill="#0f766e" />
          <circle cx="162" cy="118" r="4" fill="#22d3ee" />

          <text x="198" y="88" fontSize="10" fontWeight="700" fill="#0f172a">Back-of-Wrist Glass OLED (#8)</text>
          <text x="198" y="103" fontSize="9" fill="#475569">Shows live mA current moving,</text>
          <text x="198" y="116" fontSize="9" fill="#475569">POL + / − flip, timer &amp; 0.0 mA stop</text>
          <text x="198" y="130" fontSize="8.5" fontWeight="600" fill="#0f766e">(CHECK PAD / DONE)</text>
        </svg>
      )}

      {type === 'benchTest' && (
        <svg viewBox="0 0 420 148" className="w-full h-auto" role="img" aria-label="Multimeter and dummy resistor bench test loop with back-of-wrist OLED">
          <rect x="0" y="0" width="420" height="148" rx="8" fill="#ffffff" />
          <rect x="14" y="18" width="106" height="66" rx="8" fill="#0f172a" />
          <text x="22" y="34" fontSize="8.5" fontWeight="700" fill="#5eead4">Back Glass OLED</text>
          <text x="22" y="51" fontSize="13" fontWeight="700" fontFamily="monospace" fill="#f8fafc">12.0 mA</text>
          <text x="22" y="65" fontSize="8" fill="#94a3b8">Stops → 0.0 mA</text>
          <text x="22" y="76" fontSize="7.5" fill="#fbbf24">USB-C Unplugged</text>

          <line x1="120" y1="38" x2="146" y2="38" stroke="#dc2626" strokeWidth="2" />
          <rect x="146" y="18" width="96" height="42" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <text x="155" y="36" fontSize="9.5" fontWeight="700" fill="#92400e">DMM (mA DC)</text>
          <text x="155" y="50" fontSize="8.5" fontFamily="monospace" fill="#b45309">Reads 12.0 mA</text>

          <line x1="242" y1="38" x2="266" y2="38" stroke="#475569" strokeWidth="2" />
          <rect x="266" y="18" width="120" height="42" rx="6" fill="#f1f5f9" stroke="#334155" strokeWidth="1.5" />
          <text x="276" y="36" fontSize="9.5" fontWeight="700" fill="#0f172a">1.5–2.2 kΩ (2W)</text>
          <text x="276" y="50" fontSize="8.5" fill="#475569">Dummy Skin Load</text>

          <path d="M386 38 L404 38 L404 96 L66 96 L66 84" fill="none" stroke="#0f172a" strokeWidth="2" />
          <text x="150" y="91" fontSize="8.5" fontWeight="600" fill="#0f172a">Inter-Glove Return Cable Plugged In (Glove B → Glove A)</text>
          <rect x="14" y="108" width="390" height="26" rx="5" fill="#fef2f2" stroke="#fca5a5" />
          <text x="24" y="124" fontSize="9" fontWeight="600" fill="#991b1b">
            Unclip 1 lead = open circuit → DMM &amp; Back Glass OLED both drop to 0.0 mA (CHECK PAD)
          </text>
        </svg>
      )}

      {type === 'wetPads' && (
        <svg viewBox="0 0 420 140" className="w-full h-auto" role="img" aria-label="30 second tap water soak and snap-on final check">
          <rect x="0" y="0" width="420" height="140" rx="8" fill="#ffffff" />
          <rect x="18" y="22" width="106" height="66" rx="8" fill="#ecfeff" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="29" y="44" fontSize="10.5" fontWeight="700" fill="#0e7490">1. Tap Water</text>
          <text x="29" y="59" fontSize="9.5" fill="#155e75">Soak 30s · Blot</text>
          <text x="29" y="74" fontSize="9.5" fontFamily="monospace" fill="#0f766e">~85% Wetness</text>

          <line x1="124" y1="55" x2="152" y2="55" stroke="#0f766e" strokeWidth="2" />
          <rect x="152" y="22" width="114" height="66" rx="8" fill="#f0fdfa" stroke="#0f766e" strokeWidth="1.5" />
          <text x="163" y="44" fontSize="10.5" fontWeight="700" fill="#0f766e">2. Snap Studs</text>
          <text x="163" y="59" fontSize="9.5" fill="#475569">4 Palm + 5 Tips</text>
          <text x="163" y="74" fontSize="9.5" fill="#0f172a">0 Bare Metal</text>

          <line x1="266" y1="55" x2="294" y2="55" stroke="#0f766e" strokeWidth="2" />
          <rect x="294" y="22" width="108" height="66" rx="8" fill="#0f172a" />
          <text x="305" y="44" fontSize="10.5" fontWeight="700" fill="#5eead4">3. First Run</text>
          <text x="305" y="59" fontSize="9.5" fill="#cbd5e1">8–10 mA Gentle</text>
          <text x="305" y="74" fontSize="9.5" fill="#94a3b8">15–20 min Pair</text>

          <rect x="18" y="102" width="384" height="24" rx="5" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="30" y="117" fontSize="9.5" fill="#475569">
            Rinse pads in clean water after every session; hand-wash glove shell with controller detached.
          </text>
        </svg>
      )}
    </div>
  );
};
