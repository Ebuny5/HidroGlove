import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  Eye,
  Hand,
  Layers,
  RotateCw,
  RefreshCw,
  Scan,
  Tag,
  X,
} from 'lucide-react';
import { buildGlove, BuiltGlove } from '../three/buildGlove';
import { PARTS } from '../data/parts';
import { CameraView, PartId, SimSnapshot } from '../types/hydroglove';

export interface SimRuntimeRefs {
  current: number;
  target: number;
  polarity: '+' | '−';
  remainingFormatted: string;
  stateLabel: 'READY' | 'ACTIVE' | 'CHECK PAD' | 'DONE';
  paused: boolean;
  done: boolean;
  running: boolean;
}

interface Viewport3DProps {
  selectedPartId: PartId | null;
  onSelectPart: (id: PartId | null) => void;
  flyRequest: { view: CameraView; nonce: number } | null;
  simRuntimeRef: React.MutableRefObject<SimRuntimeRefs>;
  simSnapshot: SimSnapshot;
  onSimTick: (dt: number) => void;
  onOpenProductPhoto: () => void;
}

const VIEWS: Record<CameraView, THREE.Vector3> = {
  palm: new THREE.Vector3(0.4, 0.5, 11.8),
  back: new THREE.Vector3(-0.4, 0.2, -11.8),
};

const GLOW_COLOR = new THREE.Color(0x14b8a6);

// Pre-allocated math helpers outside render loop (zero GC)
const _v = new THREE.Vector3();
const _n = new THREE.Vector3();
const _camDir = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const Viewport3D: React.FC<Viewport3DProps> = ({
  selectedPartId,
  onSelectPart,
  flyRequest,
  simRuntimeRef,
  simSnapshot,
  onSimTick,
  onOpenProductPhoto,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const hotspotsRef = useRef<HTMLDivElement>(null);

  const [exploded, setExploded] = useState(false);
  const [xray, setXray] = useState(false);
  const [labelsOn, setLabelsOn] = useState(true);
  const [spin, setSpin] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);

  // Refs synced to animation loop so React UI toggles never re-mount WebGL
  const explodedRef = useRef(exploded);
  explodedRef.current = exploded;
  const labelsOnRef = useRef(labelsOn);
  labelsOnRef.current = labelsOn;
  const selectedPartRef = useRef<PartId | null>(selectedPartId);
  selectedPartRef.current = selectedPartId;
  const onSelectPartRef = useRef(onSelectPart);
  onSelectPartRef.current = onSelectPart;
  const onSimTickRef = useRef(onSimTick);
  onSimTickRef.current = onSimTick;

  const gloveRef = useRef<BuiltGlove | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const flyStateRef = useRef<{
    from: THREE.Vector3;
    to: THREE.Vector3;
    t: number;
  } | null>(null);
  const hotspotButtonsRef = useRef<Map<PartId, HTMLButtonElement>>(new Map());

  // Trigger camera fly when parent requests a preset view
  useEffect(() => {
    if (!flyRequest || !cameraRef.current) return;
    flyStateRef.current = {
      from: cameraRef.current.position.clone(),
      to: VIEWS[flyRequest.view],
      t: 0,
    };
  }, [flyRequest]);

  // Apply X-ray transparency on glove fabric materials
  useEffect(() => {
    const g = gloveRef.current;
    if (!g) return;
    g.fabricMats.forEach((m) => {
      m.transparent = xray;
      m.opacity = xray ? 0.22 : 1;
      m.depthWrite = !xray;
      m.needsUpdate = true;
    });
  }, [xray]);

  // Apply spin autoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = spin;
    }
  }, [spin]);

  // Highlight selected part & update active hotspot class directly
  useEffect(() => {
    const g = gloveRef.current;
    if (g) {
      Object.values(g.parts)
        .flat()
        .forEach((m) => m.emissive.setHex(0x000000));
      if (selectedPartId && g.parts[selectedPartId]) {
        g.parts[selectedPartId].forEach((m) => m.emissive.copy(GLOW_COLOR));
      }
    }
    hotspotButtonsRef.current.forEach((btn, id) => {
      btn.classList.toggle('active', id === selectedPartId);
    });
  }, [selectedPartId]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mount = canvasMountRef.current;
    const hsLayer = hotspotsRef.current;
    if (!wrap || !mount || !hsLayer) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError('WebGL is unavailable in this browser.');
      return;
    }

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f5);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(1.2, 0.9, 12.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4.5;
    controls.maxDistance = 22;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Cancel camera fly immediately if user grabs orbit controls
    const onControlStart = () => {
      flyStateRef.current = null;
    };
    controls.addEventListener('start', onControlStart);

    // Three-point studio lighting + cool hemisphere + circular floor shadow pad
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 6, 6);
    if (!isSoftwareGl) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 20;
      key.shadow.camera.left = -5.5;
      key.shadow.camera.right = 5.5;
      key.shadow.camera.top = 5.5;
      key.shadow.camera.bottom = -5.5;
      key.shadow.bias = -0.0005;
    }
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xbfe8ff, 0.8);
    rim.position.set(-5, 2, -6);
    scene.add(rim);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 0.5));

    const floorGeo = new THREE.CircleGeometry(5.8, 64);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.1;
    scene.add(floor);

    const G = buildGlove({
      isSoftwareGl,
      maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
    });
    gloveRef.current = G;
    scene.add(G.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Build Direct-DOM Hotspots (1-10)
    hsLayer.innerHTML = '';
    hotspotButtonsRef.current.clear();
    const spots = G.anchors.map((a) => {
      const part = PARTS.find((p) => p.id === a.id)!;
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'hotspot';
      el.textContent = String(part.n);
      el.title = part.title;
      el.setAttribute('aria-label', `${part.n}. ${part.title}`);
      el.addEventListener('click', () => {
        onSelectPartRef.current(a.id);
        if (part.side === 'palm') {
          flyStateRef.current = {
            from: camera.position.clone(),
            to: VIEWS.palm,
            t: 0,
          };
        } else if (part.side === 'back') {
          flyStateRef.current = {
            from: camera.position.clone(),
            to: VIEWS.back,
            t: 0,
          };
        }
      });
      hsLayer.appendChild(el);
      hotspotButtonsRef.current.set(a.id, el);
      return { anchor: a, el };
    });

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w <= 0 || h <= 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.zoom = w < 640 ? 0.72 : 1;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const updateHotspots = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const showLabels = labelsOnRef.current;
      for (let i = 0; i < spots.length; i++) {
        const { anchor, el } = spots[i];
        anchor.obj.localToWorld(_v.copy(anchor.offset));
        _n.copy(anchor.normal).transformDirection(anchor.obj.matrixWorld);
        _camDir.copy(camera.position).sub(_v).normalize();
        const facing = _n.dot(_camDir) > -0.05;
        _v.project(camera);
        el.style.left = `${((_v.x + 1) / 2) * w}px`;
        el.style.top = `${((1 - _v.y) / 2) * h}px`;
        el.classList.toggle('hidden-spot', !showLabels || !facing);
      }
    };

    let explodeT = 0;
    let simAcc = 0;
    let lastTime = performance.now();
    let elapsedTotal = 0;
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsedTotal += dt;

      // Smooth camera fly
      const fly = flyStateRef.current;
      if (fly) {
        fly.t = Math.min(1, fly.t + dt * 1.6);
        const eased = 1 - Math.pow(1 - fly.t, 3);
        camera.position.lerpVectors(fly.from, fly.to, eased);
        if (fly.t >= 1) flyStateRef.current = null;
      }

      // Smooth layer explode
      const targetExplode = explodedRef.current ? 1 : 0;
      explodeT = THREE.MathUtils.damp(explodeT, targetExplode, 6, dt);
      for (let i = 0; i < G.explode.length; i++) {
        const item = G.explode[i];
        item.obj.position
          .copy(item.base)
          .addScaledVector(item.dir, item.dist * explodeT);
      }

      // Simulation tick + 3D telemetry sync
      simAcc += dt;
      if (simAcc > 0.05) {
        onSimTickRef.current(simAcc);
        simAcc = 0;
      }

      const sim = simRuntimeRef.current;
      const flowing = sim.current > 0.1;
      const flowSpeed = 0.15 + sim.current * 0.03;
      const dirSign = sim.polarity === '+' ? 1 : -1;

      for (let i = 0; i < G.particles.length; i++) {
        const p = G.particles[i];
        p.mesh.visible = flowing;
        if (!flowing) continue;
        p.t = (p.t + dt * flowSpeed * dirSign + 1) % 1;
        p.path.getPoint(p.t, p.mesh.position);
        p.mesh.scale.setScalar(0.6 + sim.current / 20);
      }

      // Pad emissive pulse when active
      const pulse = flowing
        ? (Math.sin(elapsedTotal * 4) * 0.5 + 0.5) * 0.25 * (sim.current / 20)
        : 0;
      (['pad', 'tips'] as const).forEach((id) => {
        if (selectedPartRef.current === id) return;
        const mats = G.parts[id];
        for (let i = 0; i < mats.length; i++) {
          mats[i].emissive.setRGB(0.1 * pulse * 4, 0.7 * pulse, 0.65 * pulse);
        }
      });

      // OLED + LED sync
      G.drawScreen({
        mA: sim.current,
        remaining: sim.remainingFormatted,
        polarity: sim.polarity,
        state: sim.stateLabel,
      });
      G.led.material.color.setHex(
        sim.paused
          ? 0xf59e0b
          : sim.current > 0.1
            ? 0x22d3ee
            : sim.done
              ? 0x22c55e
              : 0x64748b,
      );

      controls.update();
      renderer.render(scene, camera);
      updateHotspots();

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        handleContextRestored,
      );
      G.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      envTex.dispose();
      renderer.dispose();
      gloveRef.current = null;
      controlsRef.current = null;
      cameraRef.current = null;
    };
  }, [simRuntimeRef]);

  const selectedPart = selectedPartId
    ? PARTS.find((p) => p.id === selectedPartId) ?? null
    : null;

  const statusDotClass =
    simSnapshot.statusTone === 'active'
      ? 'bg-teal-500'
      : simSnapshot.statusTone === 'pause'
        ? 'bg-amber-500'
        : simSnapshot.statusTone === 'done'
          ? 'bg-emerald-500'
          : 'bg-slate-400';

  const handleViewClick = (view: CameraView) => {
    if (!cameraRef.current) return;
    flyStateRef.current = {
      from: cameraRef.current.position.clone(),
      to: VIEWS[view],
      t: 0,
    };
  };

  return (
    <section
      ref={wrapRef}
      className="relative w-full lg:w-7/12 h-[46vh] min-h-[260px] lg:h-full overflow-hidden shrink-0 bg-[#eef2f5] select-none"
    >
      {/* WebGL Canvas Container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

      {/* Fallback if WebGL unavailable */}
      {(webglError || contextLost) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#eef2f5] p-6 text-center">
          <p className="text-sm font-semibold text-slate-800">
            {webglError || '3D context temporarily paused'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            You can still inspect the studio product render, BOM parts, 8-step build guide, and session simulator.
          </p>
        </div>
      )}

      {/* Header Overlay */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-2 p-3 sm:p-4 pointer-events-none">
        <div className="flex items-center gap-2.5 pointer-events-auto min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm shrink-0">
            <Hand className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold leading-tight text-slate-900 truncate">
              HydroGlove
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">
              Portable iontophoresis glove · concept v0.2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <button
            type="button"
            onClick={onOpenProductPhoto}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-teal-600 text-xs font-medium text-slate-700 hover:text-teal-800 shadow-sm transition-colors whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden sm:inline">Product Photo</span>
            <span className="sm:hidden">Photo</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full shrink-0 ${statusDotClass}`} />
            <span className="font-mono-tech">{simSnapshot.statusText}</span>
          </div>
        </div>
      </header>

      {/* Direct-DOM Hotspot Layer */}
      <div
        ref={hotspotsRef}
        className="absolute inset-0 z-10 pointer-events-none [&>button]:pointer-events-auto"
      />

      {/* Selected Part Info Card (Bottom-Left) */}
      {selectedPart && (
        <div className="absolute left-3 right-3 sm:right-auto sm:left-4 bottom-16 z-20 sm:max-w-xs rounded-xl bg-white border border-slate-200 shadow-md p-3.5 pointer-events-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold text-slate-900">
                {selectedPart.n}. {selectedPart.title}
              </h2>
              <p className="text-[11px] font-mono-tech text-teal-700 mt-0.5">
                {selectedPart.cost}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectPart(null)}
              aria-label="Close part details"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mt-2">
            {selectedPart.body}
          </p>
        </div>
      )}

      {/* Floating Bottom Toolbar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 max-w-[95%] pointer-events-auto">
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto scroll-thin">
          <button
            type="button"
            onClick={() => handleViewClick('palm')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            <Hand className="w-3.5 h-3.5 text-slate-600" />
            <span>Palm</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewClick('back')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Back</span>
          </button>

          <div className="w-px h-4 bg-slate-200 mx-0.5 shrink-0" />

          <button
            type="button"
            onClick={() => setExploded((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              exploded
                ? 'bg-slate-100 text-teal-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explode</span>
          </button>

          <button
            type="button"
            onClick={() => setXray((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              xray
                ? 'bg-slate-100 text-teal-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>X-ray</span>
          </button>

          <button
            type="button"
            onClick={() => setLabelsOn((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              labelsOn
                ? 'bg-slate-100 text-teal-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Labels</span>
          </button>

          <button
            type="button"
            onClick={() => setSpin((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              spin
                ? 'bg-slate-100 text-teal-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Spin</span>
          </button>

          {xray && (
            <span className="sr-only">
              <Eye className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
