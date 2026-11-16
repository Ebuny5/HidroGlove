import { BuildStep } from '../types/hydroglove';

export const STUDIO_PRODUCT_IMAGE =
  '/src/assets/images/hydroglove_studio_product_1794838325622.jpg';

export const BUILD_STEPS: BuildStep[] = [
  {
    stepNumber: 1,
    title: 'Prepare & Size the Compression Glove Shell',
    shortTitle: 'Size Shell',
    layerBadge: 'L1 · Outer Shell',
    partIds: ['glove'],
    imageUrl: '/src/assets/images/step1_glove_sizing_1794838322124.jpg',
    imageAlt: 'Hardware engineer measuring charcoal compression glove width with calipers and tailor tape on an ESD mat',
    diagramType: 'sizing',
    clinicalMaterial: {
      name: 'Medical 4-Way Stretch Knit + Breathable Dorsal Mesh',
      spec: '82% Nylon / 18% Elastane compression knit (15–20 mmHg), seamless palm panel, hand-washable',
      cost: '≈ $5–8 / pair',
    },
    diyEquivalent: {
      name: 'Athletic Compression or Arthritis Glove (Charcoal)',
      spec: 'Full-finger snug compression glove sized ~5% tighter than casual gloves so pads stay flush',
      sourcingTip: 'Choose a model with zero thick leather/silicone grip dots on the palm and fingertips.',
    },
    tools: [
      'Flexible tailor tape & digital calipers',
      'Fabric chalk or silver fine-tip marker',
      'Warm mild detergent (pre-wash sizing)',
    ],
    instructions: [
      'Measure palm circumference across the knuckles and length from wrist crease to middle fingertip using a tailor tape.',
      'Pre-wash and air-dry the charcoal compression gloves so factory sizing coatings do not interfere with TPU adhesion.',
      'Wear the glove and flex all five fingers into a light fist: confirm snug compression across the palm hollow without bunching or restricting DIP/PIP joint flexion.',
      'Mark the 1 central palm zone (approx. 65 × 75 mm) and 5 distal fingertip pads (approx. 18 × 24 mm each) with chalk while the hand is slightly curved.',
    ],
    wiringNote:
      'Leave a clean 12 mm border around the wrist cuff edge so the dorsal controller strap can clamp evenly over the fabric without pinching finger tendons.',
    safetyCheck:
      'Verify zero tightness numbness at the thumb web or wrist crease after 5 minutes of wear before bonding any electronics.',
  },
  {
    stepNumber: 2,
    title: 'Laminate the Waterproof TPU Barrier',
    shortTitle: 'TPU Barrier',
    layerBadge: 'L2 · Moisture Block',
    partIds: ['barrier'],
    imageUrl: '/src/assets/images/step2_tpu_barrier_1794838321723.jpg',
    imageAlt: 'Smoothing translucent 30 micron waterproof TPU film onto the glove palm and fingertips with a squeegee',
    diagramType: 'laminate',
    clinicalMaterial: {
      name: '30 μm Medical-Grade Breathable TPU Film',
      spec: 'Heat-bondable polyurethane barrier (10,000 mm hydrostatic head, biocompatible ISO 10993)',
      cost: '≈ $1 / glove',
    },
    diyEquivalent: {
      name: 'Tegaderm / Transparent PU Wound Dressing or Heat-Press TPU',
      spec: '30–50 μm stretchable polyurethane sheet cut slightly oversized (+5 mm perimeter margin)',
      sourcingTip: '3M Tegaderm rolls or iron-on matte waterproof seam-sealing PU tape adhere cleanly to nylon knit.',
    },
    tools: [
      'Plastic vinyl squeegee',
      'Curved craft scissors',
      'Cardboard hand form insert (prevents front-to-back bonding)',
    ],
    instructions: [
      'Slide a rigid cardboard hand insert inside the glove so the palm and dorsal fabric remain flat and never stick together.',
      'Cut one palm-shaped TPU patch and five rounded fingertip TPU patches with a +5 mm waterproof skirt beyond the planned electrode footprints.',
      'Peel the backing gradually and burnish the film onto the palm and fingertip undersides using a plastic squeegee from center outward to expel air pockets.',
      'Inspect all edges under angled light to verify a continuous matte moisture seal over the knit.',
    ],
    wiringNote:
      'Do NOT punch snap holes through the TPU barrier yet—wait until Step 3 so every crimp stud seals directly against the TPU skirt.',
    safetyCheck:
      'Place 3 drops of tap water on the laminated TPU face for 60 seconds and confirm the inside lining of the glove remains 100% dry.',
  },
  {
    stepNumber: 3,
    title: 'Mount Carbon-Silicone Palm & Fingertip Electrodes + Snap Studs',
    shortTitle: 'Electrodes',
    layerBadge: 'L3 · Conductive Plate',
    partIds: ['electrode'],
    imageUrl: '/src/assets/images/step3_electrodes_snaps_1794838322623.jpg',
    imageAlt: 'Aligning dark carbon-silicone palm and fingertip electrodes with 10mm metal snap studs and crimping pliers',
    diagramType: 'electrodes',
    clinicalMaterial: {
      name: 'Carbon-Loaded Conductive Silicone Sheet (0.6 mm)',
      spec: 'Volume resistivity < 15 Ω·cm, non-corroding, paired with 4 palm + 5 fingertip 10 mm stainless snap studs',
      cost: '≈ $4 / glove',
    },
    diyEquivalent: {
      name: 'Replacement TENS Carbon-Rubber Pads or Conductive Silver-Nylon',
      spec: 'Trimmed carbon-silicone TENS sheets + standard 10 mm (3.9 mm stud) brass/nickel TENS snaps',
      sourcingTip: 'Pre-wired 10 mm TENS snap rivets save crimping time and resist electrolytic pitting.',
    },
    tools: [
      'Hand snap crimping pliers & 10 mm snap studs (9 per glove)',
      'Heavy-duty rotary cutter or precision shears',
      'Neutral-cure silicone adhesive (Permatex/Sil-Poxy)',
    ],
    instructions: [
      'Cut 1 contoured palm plate and 5 separate distal fingertip plates from carbon-silicone sheet, keeping 8–10 mm flexion gaps clear across every knuckle crease.',
      'Crimp 4 stainless 10 mm male snap studs onto the four corners of the palm plate and 1 centered snap stud onto each of the 5 fingertip pads.',
      'Coat the backside of each electrode with a thin, uniform layer of neutral-cure silicone adhesive and press firmly onto the TPU barrier (L2).',
      'Seal the backside of every snap rivet eyelet with a small drop of silicone or TPU patch so bare metal never contacts the inner knit.',
    ],
    wiringNote:
      'Check resistance from each snap stud to the farthest edge of its carbon-silicone pad with a multimeter; target < 80 Ω across the plate.',
    safetyCheck:
      'Slide your fingers inside the glove and feel every snap underside: zero exposed metal prongs or sharp burrs may contact bare skin.',
  },
  {
    stepNumber: 4,
    title: 'Route & Strain-Relieve Stretchable Traces / Silicone Wiring',
    shortTitle: 'Wire Traces',
    layerBadge: 'Bus · 28 AWG / Silver',
    partIds: ['traces'],
    imageUrl: '/src/assets/images/step4_silicone_wiring_1794838323082.jpg',
    imageAlt: 'Routing ultra-thin flexible silicone wires in serpentine loops along glove fingers with tweezers and heat-shrink',
    diagramType: 'wiring',
    clinicalMaterial: {
      name: 'Printed Stretchable Silver-Ink Traces (Encapsulated)',
      spec: 'DuPont PE874 stretchable silver conductor sealed under 30 μm TPU top-coat along palmar borders',
      cost: '≈ $3 / glove',
    },
    diyEquivalent: {
      name: '28–30 AWG Ultra-Flexible Stranded Silicone Wire',
      spec: 'High-strand-count (60+ strand) tinned copper silicone wire routed with S-curve knuckle slack',
      sourcingTip: 'Route wires along the lateral/medial edges of the fingers—never straight across the top of a bending joint.',
    },
    tools: [
      'Fine-tip soldering iron (320 °C) & rosin-core solder',
      '2:1 / 3:1 adhesive-lined heat-shrink tubing',
      'Precision ESD tweezers & heat gun',
    ],
    instructions: [
      'Tin the backside solder tabs (or crimp lugs) of the 5 fingertip electrodes and the palm electrode bus bar before placing them near fabric.',
      'Cut 28–30 AWG silicone wires 25% longer than the straight finger length so you can form gentle serpentine S-curves over each MCP/PIP knuckle.',
      'Solder the 5 fingertip leads into a common palmar bus rail along the ulnar/pinky edge and join the palm electrode corner stud cleanly.',
      'Slip adhesive-lined heat-shrink tubing over every solder joint, shrink until watertight, and tack the wire channels under narrow TPU/fabric strips.',
    ],
    wiringNote:
      'Single-glove architecture ties the Palm Plate + all 5 Fingertip Electrodes in parallel to the active Glove Output bus (I_out), ensuring uniform current distribution.',
    safetyCheck:
      'Flex the fingers 20 times while monitoring continuity (< 2 Ω from wrist pigtail to every snap stud) with zero intermittent dropouts.',
  },
  {
    stepNumber: 5,
    title: 'Install the Teal Wrist Cuff & Inter-Glove Return Cable',
    shortTitle: 'Wrist Cuff',
    layerBadge: 'Return · Paired Loop',
    partIds: ['cuff'],
    imageUrl: '/src/assets/images/step5_wrist_cuff_cable_1794838324933.jpg',
    imageAlt: 'Fastening surgical-teal hook-and-loop wrist cuff and plugging the inter-glove return cable into the wrist jack',
    diagramType: 'cuffLoop',
    clinicalMaterial: {
      name: 'Surgical-Teal Hook-and-Loop Cuff + Shielded Coax Return',
      spec: '25 mm breathable nylon Velcro strap with dorsal housing dock + keyed 2.5 mm/USB-C inter-glove return cable',
      cost: '≈ $3 / pair',
    },
    diyEquivalent: {
      name: '25 mm Teal Velcro Strap + 2-Pin / TRS Silicone Jumper Cable',
      spec: '22–24 AWG ultra-flexible silicone jumper (~1.1 m) linking Left Glove (−) and Right Glove (+)',
      sourcingTip: 'Use a locking barrel or 3.5 mm mono/TRS jack with strain-relief boot so arm movement cannot unplug mid-session.',
    },
    tools: [
      'Heavy-duty needle & nylon thread (or fabric rivet)',
      'Cable strain-relief grommet',
      'Multimeter (continuity & polarity check)',
    ],
    instructions: [
      'Wrap the surgical-teal hook-and-loop strap snugly around the glove wrist cuff and stitch two reinforcement bar-tacks on the dorsal anchor side.',
      'Mount the female return jack on the lateral wrist tab, soldering the secondary glove return lead cleanly to the jack sleeve/tip.',
      'Plug the 1.1 m black inter-glove return cable from the primary wrist controller housing into the paired glove wrist jack. This cable—NOT a wall charger—is what completes the current path between both hands.',
      'Verify that the paired glove acts strictly as the opposite electrode so current enters one hand, passes through the body, and exits via the return cable to the paired glove.',
    ],
    wiringNote:
      'What Plugs In to Work: Controller OUT_A → Primary Glove; Inter-Glove Return Cable → Paired Glove (OUT_B). Never plug into a wall outlet during use.',
    safetyCheck:
      'Confirm > 10 MΩ open-circuit isolation between OUT_A and OUT_B with the paired glove disconnected.',
  },
  {
    stepNumber: 6,
    title: 'Assemble Wrist Controller PCB, Back Glass OLED & Battery',
    shortTitle: 'Controller & OLED',
    layerBadge: 'Electronics · Back of Wrist',
    partIds: ['controller', 'battery', 'display'],
    imageUrl: '/src/assets/images/step6_pcb_controller_1794838324179.jpg',
    imageAlt: 'Seating green ESP32-C3 controller PCB, boost coil, OLED screen, and 1000mAh Li-ion battery into light-grey wrist housing',
    diagramType: 'controllerPcb',
    clinicalMaterial: {
      name: 'Custom ESP32-C3 Constant-Current + Back-of-Wrist Glass OLED',
      spec: '3.7V→60V boost, 5–20 mA CC sink, H-bridge polarity swapper, 0.96" glass OLED window, 1000 mAh Li-ion',
      cost: '≈ $25–35 / unit',
    },
    diyEquivalent: {
      name: 'ESP32-C3 SuperMini + Boost + INA219 + 0.96" Glass OLED + TP4056',
      spec: 'Modular perfboard stack inside a 3D-printed shell (52 × 40 × 12 mm) on the BACK of the wrist with clear/dark glass OLED lens',
      sourcingTip: 'Place the 0.96" glass OLED facing up on the back of the wrist so the wearer can always read live mA current, polarity (+/−), and where current stops (0.0 mA).',
    },
    tools: [
      '3D-printed light-grey dorsal shell (PETG/SLA) with OLED glass window',
      'M2 brass standoffs & Kapton polyimide tape',
      'Fine-tip soldering iron & flux',
    ],
    instructions: [
      'Line the bottom of the 3D-printed housing with Kapton tape and seat the 1000 mAh Li-ion battery flat inside. Charge the battery via USB-C beforehand, then UNPLUG USB-C—for safety, treatment cannot run while USB-C is plugged in.',
      'Wire the TP4056 USB-C charger with a hardware P-MOSFET charge-lockout so 5 V USB power physically disables the 60 V boost stage while charging.',
      'Connect the 3.7 V → 60 V boost stage through the constant-current limiter (clamped at 22 mA max) and H-bridge polarity swapper.',
      'Mount the 0.96" dark glass OLED display, teal start/pause button, and status LED facing outward on the BACK of the wrist so you can watch live mA current moving, polarity (+/−), timer bar, and stop state (CHECK PAD / DONE).',
    ],
    wiringNote:
      'Back-of-Wrist Glass OLED (#8) reads INA219 Current Sense (GPIO4/5 I2C) in real time: shows ACTIVE / CHECK PAD / DONE, POL + or POL −, large 0.0–20.0 mA readout, and countdown bar.',
    safetyCheck:
      'Plug in USB-C and confirm the 60 V boost rail drops to 0.0 V immediately; unplug USB-C to power the controller wirelessly from its Li-ion battery.',
  },
  {
    stepNumber: 7,
    title: 'Bench-Test Current Ceiling, 60V Limit & <40% Dry-Pad Cutoff',
    shortTitle: 'Safety Bench Test',
    layerBadge: 'CRITICAL SAFETY GATE',
    partIds: ['controller', 'display', 'electrode'],
    imageUrl: '/src/assets/images/step7_bench_safety_test_1794838326070.jpg',
    imageAlt: 'Digital multimeter probes in series with a dummy axial resistor between two smart glove prototypes during bench safety testing',
    diagramType: 'benchTest',
    isSafetyGate: true,
    clinicalMaterial: {
      name: 'IEC 60601 Bench Calibration & Dummy Load Verification',
      spec: 'Calibrated skin-impedance model (1.5 kΩ – 2.2 kΩ, 2W) + series ammeter + back-of-wrist OLED verification',
      cost: 'Bench lab fixture',
    },
    diyEquivalent: {
      name: 'Digital Multimeter (mA DC) + 1.5 kΩ–2.2 kΩ (2W) Dummy Resistor',
      spec: 'Clipped between Glove A and Glove B snaps (with inter-glove cable plugged in, USB-C UNPLUGGED) BEFORE touching skin',
      sourcingTip: 'A 1.8 kΩ resistor mimics wet palmar skin resistance so you can safely test real current flow on the bench while watching the back-of-wrist glass OLED.',
    },
    tools: [
      'Digital Multimeter set to mA DC (fused 200 mA range)',
      '1.5 kΩ – 2.2 kΩ, 2 W metal-film or wirewound resistor (simulates skin)',
      'Alligator clip test leads',
    ],
    instructions: [
      'UNPLUG USB-C (runs on internal battery) and PLUG IN the black inter-glove cable between Glove A and Glove B. Keep both gloves off your hands on the ESD mat.',
      'Clip the 1.5 kΩ–2.2 kΩ dummy resistor in series with your Digital Multimeter (mA DC) between Glove A palm snap and Glove B palm snap to close the loop.',
      'Press the teal button on the back-of-wrist controller to start a 12 mA test: watch BOTH your multimeter and the small glass OLED on the back of the glove ramp smoothly from 0.0 to 12.0 ± 0.3 mA.',
      'Wait for midpoint polarity reversal (glass OLED flips POL + to POL − after passing 0.0 mA), then unclip one alligator lead to simulate a dry pad (<40%): confirm both the multimeter and glass OLED drop immediately to 0.0 mA (CHECK PAD).',
    ],
    wiringNote:
      'Test Loop: Wrist Battery (USB-C Unplugged) → Glove A Palm Snap (+) → [DMM mA DC] → [1.8 kΩ 2W Dummy Resistor] → Glove B Palm Snap (−) → Inter-Glove Cable → Return.',
    safetyCheck:
      'PASS CRITERIA: Back-of-wrist glass OLED matches DMM within ±0.3 mA, hard ceiling ≤ 20.5 mA, open-circuit cap ≤ 60 V, and open-lead test drops to 0.0 mA in < 50 ms.',
  },
  {
    stepNumber: 8,
    title: 'Snap On Soaked Palm & Fingertip Pads & Final Fit Check',
    shortTitle: 'Wet Pads & Fit',
    layerBadge: 'L4 · Final Assembly',
    partIds: ['pad', 'tips', 'display'],
    imageUrl: '/src/assets/images/step8_wet_pads_final_1794838324955.jpg',
    imageAlt: 'Snapping damp aqua-teal sponge hydrogel pads onto palm and fingertip metal studs beside a dish of tap water',
    diagramType: 'wetPads',
    clinicalMaterial: {
      name: 'Open-Cell PVA Medical Sponge / Conductive Hydrogel Pads',
      spec: 'Die-cut 3.5 mm absorbent pads with female 10 mm snaps; holds tap-water mineral electrolytes uniformly',
      cost: '≈ $3–5 / replacement pair',
    },
    diyEquivalent: {
      name: 'Compressed PVA Chamois Sponge + Female 10 mm TENS Snaps',
      spec: 'Cut 1 palm pad + 5 fingertip pads from high-density PVA cloth; soak 30s in ordinary tap water before snapping on',
      sourcingTip: 'Squeeze gently so pads are saturated (~85% wet) without dripping water onto the wrist controller housing.',
    },
    tools: [
      'Clean shallow dish of room-temperature tap water',
      'Dry microfiber towel (for wrist & outer shell)',
      '10 mm female snap caps (pre-attached to pads)',
    ],
    instructions: [
      'Submerge the palm and 5 fingertip PVA sponge/hydrogel pads in room-temperature tap water for 30 seconds until evenly saturated, then gently blot excess drips.',
      'Snap the wet palm pad firmly onto the 4 palm studs and snap each wet fingertip pad onto its corresponding distal finger stud, ensuring zero bare metal touches skin.',
      'Verify USB-C is unplugged, plug in the inter-glove cable connecting both cuffs, slip on both gloves, and fasten the teal wrist straps snugly.',
      'Press the teal button on the back of the wrist and glance down at the small glass OLED window on the back of your glove: watch it ramp to 8–12 mA, flip POL + / POL − halfway, and automatically ramp down to 0.0 mA (DONE) when the timer finishes.',
    ],
    wiringNote:
      'During treatment, the back-of-wrist glass OLED is your live window: green/cyan LED + moving mA number = active; amber LED + 0.0 mA CHECK PAD = pad too dry; 0.0 mA DONE = session finished.',
    safetyCheck:
      'Confirm zero tingling pinpoints (indicates dry corner or exposed snap). If felt, press the teal button to pause (0.0 mA) and re-wet or re-seat that pad.',
  },
];
