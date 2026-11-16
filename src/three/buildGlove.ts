import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PartId } from '../types/hydroglove';

export interface ExplodeEntry {
  obj: THREE.Object3D;
  base: THREE.Vector3;
  dir: THREE.Vector3;
  dist: number;
}

export interface AnchorEntry {
  id: PartId;
  obj: THREE.Object3D;
  offset: THREE.Vector3;
  normal: THREE.Vector3;
}

export interface ParticleEntry {
  mesh: THREE.Mesh;
  path: THREE.CatmullRomCurve3;
  t: number;
}

export interface ScreenDrawParams {
  mA?: number;
  remaining?: string;
  polarity?: '+' | '−';
  state?: string;
}

export interface BuiltGlove {
  root: THREE.Group;
  parts: Record<PartId, THREE.MeshStandardMaterial[]>;
  explode: ExplodeEntry[];
  anchors: AnchorEntry[];
  fabricMats: THREE.MeshStandardMaterial[];
  particles: ParticleEntry[];
  led: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  drawScreen: (params?: ScreenDrawParams) => void;
  dispose: () => void;
}

function knitTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#808080';
    g.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 8) {
      for (let x = 0; x < 128; x += 8) {
        g.fillStyle = (x / 8 + y / 8) % 2 ? '#9a9a9a' : '#6a6a6a';
        g.beginPath();
        g.ellipse(x + 4, y + 4, 2.6, 3.6, 0, 0, Math.PI * 2);
        g.fill();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
  t.anisotropy = Math.min(4, maxAnisotropy);
  return t;
}

function meshTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = '#000000';
    for (let y = 0; y < 128; y += 16) {
      for (let x = 0; x < 128; x += 16) {
        const ox = (y / 16) % 2 ? 8 : 0;
        g.beginPath();
        g.arc(x + ox + 4, y + 8, 3.2, 0, Math.PI * 2);
        g.fill();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  t.anisotropy = Math.min(4, maxAnisotropy);
  return t;
}

export function buildGlove(options?: {
  isSoftwareGl?: boolean;
  maxAnisotropy?: number;
}): BuiltGlove {
  const isSoftwareGl = options?.isSoftwareGl ?? false;
  const maxAnisotropy = options?.maxAnisotropy ?? 1;

  const root = new THREE.Group();
  const parts: Record<PartId, THREE.MeshStandardMaterial[]> = {
    pad: [],
    tips: [],
    electrode: [],
    barrier: [],
    traces: [],
    controller: [],
    battery: [],
    display: [],
    cuff: [],
    glove: [],
  };

  const explode: ExplodeEntry[] = [];
  const anchors: AnchorEntry[] = [];
  const fabricMats: THREE.MeshStandardMaterial[] = [];

  const reg = <T extends THREE.MeshStandardMaterial>(id: PartId, mat: T): T => {
    parts[id].push(mat);
    return mat;
  };
  const addExplode = (obj: THREE.Object3D, dir: THREE.Vector3, dist: number) => {
    explode.push({
      obj,
      base: obj.position.clone(),
      dir: dir.clone().normalize(),
      dist,
    });
  };

  const knit = knitTexture(maxAnisotropy);
  const mesh = meshTexture(maxAnisotropy);

  const fabric = reg(
    'glove',
    new THREE.MeshStandardMaterial({
      color: 0x252b33,
      roughness: 0.92,
      bumpMap: knit,
      bumpScale: 0.6,
    }),
  );
  const fabricBack = reg(
    'glove',
    new THREE.MeshStandardMaterial({
      color: 0x2c333c,
      roughness: 0.85,
      bumpMap: mesh,
      bumpScale: 1.2,
    }),
  );
  fabricMats.push(fabric, fabricBack);

  const barrierMat = reg(
    'barrier',
    new THREE.MeshStandardMaterial({
      color: 0xc9d4dc,
      roughness: 0.35,
      transparent: true,
      opacity: 0.85,
    }),
  );
  const electrodeMat = reg(
    'electrode',
    new THREE.MeshStandardMaterial({
      color: 0x3a3f45,
      roughness: 0.55,
      metalness: 0.1,
    }),
  );
  const padMat = reg(
    'pad',
    new THREE.MeshPhysicalMaterial({
      color: 0x5eead4,
      roughness: 0.6,
      transmission: isSoftwareGl ? 0 : 0.15,
      transparent: isSoftwareGl,
      opacity: isSoftwareGl ? 0.9 : 1,
      thickness: 0.2,
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
    }),
  );
  const studMat = reg(
    'electrode',
    new THREE.MeshStandardMaterial({
      color: 0xb8c0c8,
      metalness: 0.9,
      roughness: 0.25,
    }),
  );
  const poreMat = reg(
    'pad',
    new THREE.MeshStandardMaterial({
      color: 0x2dd4bf,
      roughness: 0.9,
    }),
  );
  const traceMat = reg(
    'traces',
    new THREE.MeshStandardMaterial({
      color: 0xd9dee3,
      metalness: 0.85,
      roughness: 0.25,
    }),
  );
  const tipMat = reg(
    'tips',
    new THREE.MeshPhysicalMaterial({
      color: 0x5eead4,
      roughness: 0.6,
      clearcoat: 0.6,
      side: THREE.DoubleSide,
    }),
  );
  const cuffMat = reg(
    'cuff',
    new THREE.MeshStandardMaterial({
      color: 0x0f766e,
      roughness: 0.7,
      bumpMap: knit,
      bumpScale: 0.3,
    }),
  );
  const velcroMat = reg(
    'cuff',
    new THREE.MeshStandardMaterial({ color: 0x115e59, roughness: 0.95 }),
  );

  const studGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
  const poreGeo = new THREE.CircleGeometry(0.035, 10);

  let seed = 4219;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  function buildHandAssembly(opts: {
    xOffset: number;
    mirrored: boolean;
    registerPrimaryAnchors: boolean;
  }) {
    const { xOffset, mirrored, registerPrimaryAnchors } = opts;
    const sign = mirrored ? -1 : 1;
    const handGroup = new THREE.Group();
    handGroup.position.set(xOffset, 0, 0);
    root.add(handGroup);

    // Palm
    const palm = new THREE.Mesh(
      new RoundedBoxGeometry(2.0, 2.2, 0.72, 6, 0.32),
      [fabric, fabric, fabric, fabric, fabric, fabricBack],
    );
    palm.castShadow = !isSoftwareGl;
    palm.receiveShadow = !isSoftwareGl;
    handGroup.add(palm);

    // Palm layer stack (+Z)
    const barrier = new THREE.Mesh(
      new RoundedBoxGeometry(1.72, 1.9, 0.03, 2, 0.012),
      barrierMat,
    );
    barrier.position.set(0, -0.02, 0.375);
    handGroup.add(barrier);
    addExplode(barrier, new THREE.Vector3(0, 0, 1), 0.35);

    const electrode = new THREE.Group();
    const elPlate = new THREE.Mesh(
      new RoundedBoxGeometry(1.56, 1.74, 0.04, 2, 0.018),
      electrodeMat,
    );
    electrode.add(elPlate);

    [
      [-0.6, 0.7],
      [0.6, 0.7],
      [-0.6, -0.7],
      [0.6, -0.7],
    ].forEach(([x, y]) => {
      const s = new THREE.Mesh(studGeo, studMat);
      s.rotation.x = Math.PI / 2;
      s.position.set(x, y, 0.04);
      electrode.add(s);
    });
    electrode.position.set(0, -0.02, 0.41);
    handGroup.add(electrode);
    addExplode(electrode, new THREE.Vector3(0, 0, 1), 0.75);

    const pad = new THREE.Group();
    const padBody = new THREE.Mesh(
      new RoundedBoxGeometry(1.5, 1.68, 0.12, 4, 0.05),
      padMat,
    );
    pad.add(padBody);

    for (let i = 0; i < 70; i++) {
      const p = new THREE.Mesh(poreGeo, poreMat);
      p.position.set(
        (nextRand() - 0.5) * 1.3,
        (nextRand() - 0.5) * 1.5,
        0.062,
      );
      pad.add(p);
    }
    pad.position.set(0, -0.02, 0.5);
    handGroup.add(pad);
    addExplode(pad, new THREE.Vector3(0, 0, 1), 1.25);

    if (registerPrimaryAnchors) {
      anchors.push({
        id: 'pad',
        obj: pad,
        offset: new THREE.Vector3(0.3, 0.2, 0.08),
        normal: new THREE.Vector3(0, 0, 1),
      });
      anchors.push({
        id: 'electrode',
        obj: electrode,
        offset: new THREE.Vector3(-0.6, 0.7, 0.06),
        normal: new THREE.Vector3(0, 0, 1),
      });
      anchors.push({
        id: 'barrier',
        obj: barrier,
        offset: new THREE.Vector3(0.82, -0.85, 0.02),
        normal: new THREE.Vector3(0, 0, 1),
      });
      anchors.push({
        id: 'glove',
        obj: palm,
        offset: new THREE.Vector3(0.25, 0.3, -0.37),
        normal: new THREE.Vector3(0, 0, -1),
      });
    }

    // Fingers (mirrored cleanly left-to-right for the second glove)
    const fingers = [
      { x: -0.72 * sign, L: 1.05, r: 0.2, tilt: 0.1 * sign },
      { x: -0.24 * sign, L: 1.35, r: 0.22, tilt: 0.03 * sign },
      { x: 0.24 * sign, L: 1.25, r: 0.215, tilt: -0.03 * sign },
      { x: 0.72 * sign, L: 0.95, r: 0.19, tilt: -0.1 * sign },
    ];

    fingers.forEach((f, i) => {
      const grp = new THREE.Group();
      grp.position.set(f.x, 0.95, 0.02);
      grp.rotation.set(0.14, 0, f.tilt);

      const cap = new THREE.Mesh(new THREE.CapsuleGeometry(f.r, f.L, 8, 20), fabric);
      cap.position.y = f.L / 2 + f.r;
      grp.add(cap);

      [0.38, 0.72].forEach((t) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(f.r + 0.004, 0.012, 6, 24),
          fabricBack,
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = f.L * t + f.r * 0.5;
        grp.add(ring);
      });

      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(
          f.r + 0.035,
          f.r + 0.035,
          0.48,
          24,
          1,
          true,
          -1.15,
          2.3,
        ),
        tipMat,
      );
      tip.position.y = f.L + f.r - 0.3;

      const tipCap = new THREE.Mesh(
        new THREE.SphereGeometry(
          f.r + 0.035,
          24,
          12,
          Math.PI / 2 - 1.15,
          2.3,
          0,
          Math.PI / 2,
        ),
        tipMat,
      );
      tipCap.position.y = f.L + f.r - 0.06;

      const tipGroup = new THREE.Group();
      tipGroup.add(tip, tipCap);
      grp.add(tipGroup);
      addExplode(tipGroup, new THREE.Vector3(0, 0, 1), 0.55);

      const tr = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, f.L * 0.72, 0.012),
        traceMat,
      );
      tr.position.set(0, f.L * 0.36 + 0.02, f.r + 0.006);
      grp.add(tr);

      handGroup.add(grp);

      if (registerPrimaryAnchors && i === 1) {
        anchors.push({
          id: 'tips',
          obj: grp,
          offset: new THREE.Vector3(0, f.L + f.r - 0.25, f.r + 0.05),
          normal: new THREE.Vector3(0, 0, 1),
        });
      }
      if (registerPrimaryAnchors && i === 2) {
        anchors.push({
          id: 'traces',
          obj: grp,
          offset: new THREE.Vector3(0, f.L * 0.35, f.r + 0.02),
          normal: new THREE.Vector3(0, 0, 1),
        });
      }
    });

    // Thumb (points outward on each glove)
    const thumb = new THREE.Group();
    thumb.position.set(-0.95 * sign, -0.35, 0.18);
    thumb.rotation.set(0.35, -0.3 * sign, 0.85 * sign);
    const tcap = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.24, 0.95, 8, 20),
      fabric,
    );
    tcap.position.y = 0.95 / 2 + 0.24;
    thumb.add(tcap);

    const ttip = new THREE.Group();
    const ttipShell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.275, 0.275, 0.45, 24, 1, true, -1.15, 2.3),
      tipMat,
    );
    ttipShell.position.y = 0.95 + 0.24 - 0.28;
    ttip.add(ttipShell);
    thumb.add(ttip);
    addExplode(ttip, new THREE.Vector3(0, 0, 1), 0.55);

    const ttr = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.7, 0.012), traceMat);
    ttr.position.set(0, 0.4, 0.246);
    thumb.add(ttr);
    handGroup.add(thumb);

    // Palm conductive bus traces
    const palmTrace = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.1, 0.012),
      traceMat,
    );
    palmTrace.position.set(0.86 * sign, -1.35, 0.33);
    handGroup.add(palmTrace);

    const busTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.035, 0.012),
      traceMat,
    );
    busTop.position.set(0, 0.96, 0.37);
    handGroup.add(busTop);

    const busSide = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 1.9, 0.012),
      traceMat,
    );
    busSide.position.set(0.9 * sign, 0.0, 0.37);
    handGroup.add(busSide);

    // Wrist + Teal Cuff
    const wrist = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.88, 1.3, 40),
      fabric,
    );
    wrist.scale.z = 0.48;
    wrist.position.y = -1.65;
    handGroup.add(wrist);

    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.92, 0.55, 40),
      cuffMat,
    );
    cuff.scale.z = 0.53;
    cuff.position.y = -1.85;
    handGroup.add(cuff);

    const velcro = new THREE.Mesh(
      new RoundedBoxGeometry(0.5, 0.45, 0.06, 2, 0.02),
      velcroMat,
    );
    velcro.position.set(0.82 * sign, -1.85, 0.1);
    velcro.rotation.y = 1.35 * sign;
    handGroup.add(velcro);

    return { handGroup, cuff };
  }

  // ---------- 1. Primary Glove (Left side in viewer, x = -1.75, holds controller) ----------
  const primaryX = -1.75;
  const secondaryX = 1.75;

  const { handGroup: primaryHand } = buildHandAssembly({
    xOffset: primaryX,
    mirrored: false,
    registerPrimaryAnchors: true,
  });

  // ---------- 2. Paired Second Glove (Right side in viewer, x = +1.75, return socket) ----------
  const { handGroup: secondaryHand, cuff: secondaryCuff } = buildHandAssembly({
    xOffset: secondaryX,
    mirrored: true,
    registerPrimaryAnchors: false,
  });

  // Return Socket Dock on Second Glove's Wrist Cuff (inner-back side facing primary controller)
  const socketGroup = new THREE.Group();
  socketGroup.position.set(-0.78, -1.85, -0.34);
  secondaryHand.add(socketGroup);

  const socketBody = new THREE.Mesh(
    new RoundedBoxGeometry(0.32, 0.44, 0.24, 3, 0.05),
    reg('cuff', new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 })),
  );
  socketGroup.add(socketBody);

  const socketCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.14, 20),
    reg(
      'cuff',
      new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        metalness: 0.85,
        roughness: 0.25,
      }),
    ),
  );
  socketCollar.position.set(0, -0.22, 0);
  socketGroup.add(socketCollar);

  const socketBore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.15, 16),
    new THREE.MeshBasicMaterial({ color: 0x090d16 }),
  );
  socketBore.position.set(0, -0.225, 0);
  socketGroup.add(socketBore);

  // Hotspot #9 points directly to the second glove's cuff + wrist socket where the plug enters!
  anchors.push({
    id: 'cuff',
    obj: secondaryCuff,
    offset: new THREE.Vector3(-0.85, -0.1, -0.22),
    normal: new THREE.Vector3(-0.7, 0, -0.7),
  });

  // ---------- Primary Controller (back of primary glove wrist, -Z) ----------
  const ctrlGroup = new THREE.Group();
  ctrlGroup.position.set(0, -1.62, -0.5);
  primaryHand.add(ctrlGroup);

  const shellMat = reg(
    'controller',
    new THREE.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.35 }),
  );
  const shell = new THREE.Mesh(
    new RoundedBoxGeometry(1.25, 0.95, 0.26, 5, 0.1),
    shellMat,
  );
  shell.position.z = -0.08;
  ctrlGroup.add(shell);
  addExplode(shell, new THREE.Vector3(0, 0, -1), 0.7);

  const screenMat = reg(
    'display',
    new THREE.MeshStandardMaterial({
      color: 0x0b1215,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0x000000,
    }),
  );
  const screen = new THREE.Mesh(
    new RoundedBoxGeometry(0.72, 0.42, 0.02, 2, 0.01),
    screenMat,
  );
  screen.position.set(-0.14, 0.08, -0.215);
  shell.add(screen);

  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 256;
  screenCanvas.height = 150;
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = Math.min(4, maxAnisotropy);

  const screenFace = new THREE.Mesh(
    new THREE.PlaneGeometry(0.66, 0.38),
    new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }),
  );
  screenFace.position.set(-0.14, 0.08, -0.227);
  screenFace.rotation.y = Math.PI;
  shell.add(screenFace);

  const btn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.04, 24),
    reg(
      'display',
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.4 }),
    ),
  );
  btn.rotation.x = Math.PI / 2;
  btn.position.set(0.4, 0.08, -0.215);
  shell.add(btn);

  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0x64748b }),
  );
  led.position.set(0.4, -0.25, -0.205);
  shell.add(led);

  // USB-C Charging Port (outer side of primary controller, charge only)
  const usb = new THREE.Mesh(
    new RoundedBoxGeometry(0.06, 0.22, 0.09, 2, 0.02),
    reg('battery', new THREE.MeshStandardMaterial({ color: 0x1e293b })),
  );
  usb.position.set(-0.625, -0.1, 0);
  shell.add(usb);

  // Internals: PCB + battery (visible when exploded)
  const pcb = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.78, 0.03),
    reg(
      'controller',
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 }),
    ),
  );
  pcb.position.z = -0.02;
  ctrlGroup.add(pcb);
  addExplode(pcb, new THREE.Vector3(0, 0, -1), 0.4);

  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.4,
  });
  [
    [-0.25, 0.15, 0.22, 0.22],
    [0.2, 0.18, 0.3, 0.16],
    [0.25, -0.18, 0.2, 0.2],
    [-0.25, -0.2, 0.3, 0.12],
  ].forEach(([x, y, w, h]) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), chipMat);
    c.position.set(x, y, -0.03);
    pcb.add(c);
  });

  const coil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16),
    new THREE.MeshStandardMaterial({ color: 0x78716c, metalness: 0.5 }),
  );
  coil.rotation.x = Math.PI / 2;
  coil.position.set(-0.4, -0.05, -0.04);
  pcb.add(coil);

  const battMat = reg(
    'battery',
    new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }),
  );
  const batt = new THREE.Mesh(
    new RoundedBoxGeometry(0.95, 0.65, 0.1, 3, 0.03),
    battMat,
  );
  batt.position.z = 0.06;
  ctrlGroup.add(batt);
  addExplode(batt, new THREE.Vector3(0, 0, -1), 0.15);

  anchors.push({
    id: 'controller',
    obj: shell,
    offset: new THREE.Vector3(-0.45, 0.32, -0.14),
    normal: new THREE.Vector3(0, 0, -1),
  });
  anchors.push({
    id: 'display',
    obj: shell,
    offset: new THREE.Vector3(-0.14, 0.08, -0.24),
    normal: new THREE.Vector3(0, 0, -1),
  });
  anchors.push({
    id: 'battery',
    obj: shell,
    offset: new THREE.Vector3(-0.65, -0.1, 0),
    normal: new THREE.Vector3(-1, 0, -0.3),
  });

  // ---------- Connected Inter-Glove Return Cable + Seated Plug in Second Glove Socket ----------
  const cableStart = new THREE.Vector3(primaryX + 0.58, -1.96, -0.45);
  const socketEntry = new THREE.Vector3(secondaryX - 0.78, -2.14, -0.34);

  const cableCurve = new THREE.CatmullRomCurve3([
    cableStart,
    new THREE.Vector3(primaryX + 0.92, -2.65, -0.36),
    new THREE.Vector3(0, -3.35, -0.18),
    new THREE.Vector3(secondaryX - 1.05, -2.72, -0.3),
    socketEntry,
  ]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 48, 0.048, 12),
    reg(
      'cuff',
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }),
    ),
  );
  root.add(cable);

  // Primary controller cable boot
  const controllerBoot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.18, 16),
    new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.4 }),
  );
  controllerBoot.position.copy(cableCurve.getPoint(0.01));
  controllerBoot.lookAt(cableCurve.getPoint(0.06));
  controllerBoot.rotateX(Math.PI / 2);
  root.add(controllerBoot);

  // Teal Locking Plug visibly seated directly into the Second Glove's wrist socket!
  const plugBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.075, 0.24, 18),
    reg(
      'cuff',
      new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.35 }),
    ),
  );
  plugBody.position.set(secondaryX - 0.78, -2.21, -0.34);
  root.add(plugBody);

  // ---------- Full-Loop Current Flow Particles (Across BOTH Gloves & Cable) ----------
  const flowPaths = [
    // Path 1: Controller -> Primary Glove Palm -> Bridge Across -> Second Glove Palm -> Return Socket -> Cable
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(primaryX - 0.25, -1.62, -0.62),
      new THREE.Vector3(primaryX - 0.85, -1.78, 0.1),
      new THREE.Vector3(primaryX - 0.88, -0.6, 0.42),
      new THREE.Vector3(primaryX, 0.05, 0.62),
      new THREE.Vector3(0, 0.15, 0.78),
      new THREE.Vector3(secondaryX, 0.05, 0.62),
      new THREE.Vector3(secondaryX - 0.84, -0.65, 0.4),
      new THREE.Vector3(secondaryX - 0.78, -2.05, -0.34),
      new THREE.Vector3(0, -3.35, -0.18),
      new THREE.Vector3(primaryX + 0.58, -1.96, -0.45),
    ]),
    // Path 2: Controller -> Primary Index/Middle Tips -> Bridge Across -> Second Glove Tips -> Socket -> Cable
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(primaryX + 0.15, -1.6, -0.62),
      new THREE.Vector3(primaryX + 0.82, -1.4, 0.35),
      new THREE.Vector3(primaryX + 0.86, 0.94, 0.38),
      new THREE.Vector3(primaryX + 0.24, 2.38, 0.45),
      new THREE.Vector3(0, 2.55, 0.58),
      new THREE.Vector3(secondaryX - 0.24, 2.38, 0.45),
      new THREE.Vector3(secondaryX - 0.82, 0.94, 0.38),
      new THREE.Vector3(secondaryX - 0.78, -2.05, -0.34),
      new THREE.Vector3(0, -3.35, -0.18),
      new THREE.Vector3(primaryX + 0.58, -1.96, -0.45),
    ]),
    // Path 3: Controller -> Primary Ring Finger -> Bridge Across -> Second Glove Ring Finger -> Socket -> Cable
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(primaryX + 0.15, -1.6, -0.62),
      new THREE.Vector3(primaryX + 0.82, -1.4, 0.35),
      new THREE.Vector3(primaryX - 0.24, 1.0, 0.39),
      new THREE.Vector3(primaryX - 0.25, 2.52, 0.46),
      new THREE.Vector3(0, 2.65, 0.62),
      new THREE.Vector3(secondaryX + 0.24, 2.52, 0.46),
      new THREE.Vector3(secondaryX - 0.82, 0.94, 0.38),
      new THREE.Vector3(secondaryX - 0.78, -2.05, -0.34),
      new THREE.Vector3(0, -3.35, -0.18),
      new THREE.Vector3(primaryX + 0.58, -1.96, -0.45),
    ]),
  ];

  const particleMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
  });
  const particleGeo = new THREE.SphereGeometry(0.04, 10, 8);
  const particles: ParticleEntry[] = [];
  for (let i = 0; i < 48; i++) {
    const m = new THREE.Mesh(particleGeo, particleMat);
    m.visible = false;
    root.add(m);
    particles.push({
      mesh: m,
      path: flowPaths[i % 3],
      t: i / 48,
    });
  }

  // ---------- Screen drawing (Back-of-Wrist Glass OLED) ----------
  let lastDrawKey = '';
  function drawScreen({
    mA = 0,
    remaining = '20:00',
    polarity = '+',
    state = 'READY',
  }: ScreenDrawParams = {}) {
    const key = `${state}|${polarity}|${mA.toFixed(1)}|${remaining}`;
    if (key === lastDrawKey) return;
    lastDrawKey = key;

    const g = screenCanvas.getContext('2d');
    if (!g) return;
    g.fillStyle = '#05090b';
    g.fillRect(0, 0, 256, 150);

    g.fillStyle = '#5eead4';
    g.font = '600 18px "Plus Jakarta Sans", sans-serif';
    g.fillText(state, 14, 28);

    g.fillStyle = '#94a3b8';
    g.font = '500 16px "IBM Plex Mono", monospace';
    g.fillText(polarity === '+' ? 'POL +' : 'POL −', 176, 28);

    g.fillStyle = '#f8fafc';
    g.font = '700 54px "IBM Plex Mono", monospace';
    g.fillText(mA.toFixed(1), 14, 96);

    g.fillStyle = '#94a3b8';
    g.font = '500 18px "Plus Jakarta Sans", sans-serif';
    g.fillText('mA', 154, 96);

    g.fillStyle = '#cbd5e1';
    g.font = '500 20px "IBM Plex Mono", monospace';
    g.fillText(remaining, 14, 134);

    g.fillStyle = '#1e293b';
    g.fillRect(110, 122, 132, 10);
    g.fillStyle = '#2dd4bf';
    g.fillRect(110, 122, 132 * Math.min(1, mA / 20), 10);

    screenTex.needsUpdate = true;
  }

  drawScreen();
  root.position.y = -0.25;

  const dispose = () => {
    const disposedGeos = new Set<THREE.BufferGeometry>();
    const disposedMats = new Set<THREE.Material>();
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (!disposedGeos.has(obj.geometry)) {
          obj.geometry.dispose();
          disposedGeos.add(obj.geometry);
        }
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => {
            if (!disposedMats.has(mat)) {
              mat.dispose();
              disposedMats.add(mat);
            }
          });
        } else if (obj.material && !disposedMats.has(obj.material)) {
          obj.material.dispose();
          disposedMats.add(obj.material);
        }
      }
    });
    knit.dispose();
    mesh.dispose();
    screenTex.dispose();
  };

  return {
    root,
    parts,
    explode,
    anchors,
    fabricMats,
    particles,
    led,
    drawScreen,
    dispose,
  };
}
