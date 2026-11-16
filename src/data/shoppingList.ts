export interface ShoppingItem {
  id: string;
  category:
    | 'Glove, Electrodes & Pads'
    | 'Plugs, Jacks, Cables & Cuff'
    | 'Wrist Controller, Glass OLED & Battery'
    | 'Bench Safety Test Gear';
  item: string;
  qty: string;
  spec: string;
  estCost: string;
}

export const SHOPPING_LIST: ShoppingItem[] = [
  // Glove, Electrodes & Pads
  {
    id: 'glove-shell',
    category: 'Glove, Electrodes & Pads',
    item: 'Snug compression gloves (Charcoal)',
    qty: '1 pair',
    spec: '82% nylon / 18% elastane, seamless palm (no grip dots)',
    estCost: '$5–8',
  },
  {
    id: 'tpu-film',
    category: 'Glove, Electrodes & Pads',
    item: 'Waterproof PU / Tegaderm barrier film',
    qty: '1 roll',
    spec: '30–50 μm stretchable polyurethane barrier sheet',
    estCost: '$3–5',
  },
  {
    id: 'carbon-silicone',
    category: 'Glove, Electrodes & Pads',
    item: 'Carbon-silicone electrode sheets',
    qty: '2 sheets',
    spec: '0.6 mm conductive TENS silicone (cut 2 palm + 10 fingertips)',
    estCost: '$4–6',
  },
  {
    id: 'snap-studs',
    category: 'Glove, Electrodes & Pads',
    item: '10 mm stainless TENS snap studs & female caps',
    qty: '18 male + 12 female',
    spec: '3.9 mm snap fasteners (4 palm + 5 fingertips per glove)',
    estCost: '$4',
  },
  {
    id: 'pva-pads',
    category: 'Glove, Electrodes & Pads',
    item: 'PVA chamois sponge or TENS hydrogel pads',
    qty: '1 pack',
    spec: '3.5 mm absorbent open-cell pads soaked 30s in tap water',
    estCost: '$3–5',
  },
  {
    id: 'silicone-glue',
    category: 'Glove, Electrodes & Pads',
    item: 'Neutral-cure silicone adhesive + heat-shrink tubing',
    qty: '1 tube + 1 kit',
    spec: 'Bonds carbon-silicone & seals snap stud backs + solder joints',
    estCost: '$5',
  },

  // Plugs, Jacks, Cables & Cuff
  {
    id: 'interglove-plug-jack',
    category: 'Plugs, Jacks, Cables & Cuff',
    item: 'Inter-glove return plug & panel jacks (2.1 mm DC or 3.5 mm locking)',
    qty: '2 male plugs + 2 panel jacks',
    spec: 'Connects Left (+) and Right (−) gloves so current completes the loop',
    estCost: '$3',
  },
  {
    id: 'interglove-cable',
    category: 'Plugs, Jacks, Cables & Cuff',
    item: '1.1 m ultra-flexible 22–24 AWG silicone return cable',
    qty: '1 cable (~1.2 m)',
    spec: 'Flexible silicone jacket linking both wrist cuffs',
    estCost: '$2',
  },
  {
    id: 'finger-wire',
    category: 'Plugs, Jacks, Cables & Cuff',
    item: '28–30 AWG ultra-flexible stranded silicone wire',
    qty: '3 meters',
    spec: '60+ strand tinned copper for serpentine finger routing',
    estCost: '$3',
  },
  {
    id: 'velcro-cuff',
    category: 'Plugs, Jacks, Cables & Cuff',
    item: '25 mm surgical-teal hook-and-loop wrist strap',
    qty: '1 meter',
    spec: 'Secures dorsal controller box and strain-relieves wrist plug',
    estCost: '$3',
  },
  {
    id: 'usbc-cable',
    category: 'Plugs, Jacks, Cables & Cuff',
    item: 'USB-C charging cable (for 5V USB power brick)',
    qty: '1 cable',
    spec: 'Charges battery BEFORE use only (unplugged during session)',
    estCost: '$3',
  },

  // Wrist Controller, Glass OLED & Battery
  {
    id: 'esp32-c3',
    category: 'Wrist Controller, Glass OLED & Battery',
    item: 'ESP32-C3 SuperMini microcontroller',
    qty: '1 board',
    spec: 'Drives current setpoint, polarity swap, dry-pad check & BLE',
    estCost: '$4–6',
  },
  {
    id: 'oled-glass',
    category: 'Wrist Controller, Glass OLED & Battery',
    item: '0.96" I2C OLED glass display (128×64)',
    qty: '1 module',
    spec: 'Mounts on BACK of wrist to read live mA, POL +/− & 0.0 mA stop',
    estCost: '$3–4',
  },
  {
    id: 'boost-cc-hbridge',
    category: 'Wrist Controller, Glass OLED & Battery',
    item: '3.7V→60V boost + 5–20 mA CC limiter + H-bridge + INA219',
    qty: '1 module set',
    spec: 'Constant-current driver, current sensor & midpoint polarity flip',
    estCost: '$8–12',
  },
  {
    id: 'button-led',
    category: 'Wrist Controller, Glass OLED & Battery',
    item: '6×6 mm tactile push-button + bi-color status LED',
    qty: '1 each',
    spec: 'Start/pause button + cyan/amber/green status indicator',
    estCost: '$1',
  },
  {
    id: 'battery-tp4056',
    category: 'Wrist Controller, Glass OLED & Battery',
    item: '1000 mAh 3.7V Li-ion pouch cell (JST-PH 2.0 plug) + TP4056 USB-C + P-MOSFET lockout',
    qty: '1 set',
    spec: '8–12 sessions/charge; locks out 60V boost while USB-C is plugged',
    estCost: '$6–7',
  },
  {
    id: 'enclosure',
    category: 'Wrist Controller, Glass OLED & Battery',
    item: '3D-printed dorsal controller shell (52×40×12 mm)',
    qty: '1 housing',
    spec: 'PETG/PLA shell with OLED glass window, button hole & USB-C slot',
    estCost: '$2–4',
  },

  // Bench Safety Test Gear
  {
    id: 'dummy-resistor',
    category: 'Bench Safety Test Gear',
    item: '1.5 kΩ – 2.2 kΩ (2 W) dummy test resistor + alligator leads',
    qty: '2 resistors + lead set',
    spec: 'Simulates skin resistance for Step 7 bench test before wearing',
    estCost: '$2–3',
  },
  {
    id: 'multimeter',
    category: 'Bench Safety Test Gear',
    item: 'Digital Multimeter (with fused mA DC mode)',
    qty: '1 meter',
    spec: 'Independently verifies 5–20 mA reading against back OLED',
    estCost: '$12–20 (tool)',
  },
];
