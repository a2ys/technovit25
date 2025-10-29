import { useRef, useEffect } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;
    float waveFactor = uEnableWaves;
    vec3 transformed = position;
    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

function map(
  n: number,
  start: number,
  stop: number,
  start2: number,
  stop2: number
) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
}

const PX_RATIO = typeof window !== "undefined" ? window.devicePixelRatio : 1;

interface AsciiFilterOptions {
  fontSize?: number;
  fontFamily?: string;
  charset?: string;
  invert?: boolean;
}

class AsciiFilter {
  renderer: THREE.WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  deg: number;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width: number = 0;
  height: number = 0;
  center: { x: number; y: number } = { x: 0, y: 0 };
  mouse: { x: number; y: number } = { x: 0, y: 0 };
  cols: number = 0;
  rows: number = 0;
  imageData!: ImageData;

  constructor(
    renderer: THREE.WebGLRenderer,
    { fontSize, fontFamily, charset, invert }: AsciiFilterOptions = {}
  ) {
    this.renderer = renderer;
    this.domElement = document.createElement("div");
    this.domElement.style.position = "absolute";
    this.domElement.style.top = "0";
    this.domElement.style.left = "0";
    this.domElement.style.width = "100%";
    this.domElement.style.height = "100%";

    this.pre = document.createElement("pre");
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement("canvas");
    const context = this.canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Could not get 2D context");
    this.context = context;
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset =
      charset ??
      " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    this.context.imageSmoothingEnabled = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText("A").width;

    this.cols = Math.floor(
      this.width / (this.fontSize * (charWidth / this.fontSize))
    );
    this.rows = Math.floor(this.height / this.fontSize);

    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.imageData = this.context.createImageData(this.cols, this.rows);

    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = "0";
    this.pre.style.padding = "0";
    this.pre.style.lineHeight = "1em";
    this.pre.style.position = "absolute";
    this.pre.style.left = "50%";
    this.pre.style.top = "50%";
    this.pre.style.transform = "translate(-50%, -50%)";
    this.pre.style.zIndex = "9";
    this.pre.style.mixBlendMode = "difference";
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    this.asciify(this.context, w, h);
    this.hue();
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }
  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const imgData = ctx.getImageData(0, 0, w, h, {
      colorSpace: "srgb",
    }).data;
    let str = "";
    const charsetLen = this.charset.length - 1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (x + y * w) * 4;
        const a = imgData[i + 3];

        if (a === 0) {
          str += " ";
          continue;
        }

        const gray =
          (0.3 * imgData[i] + 0.6 * imgData[i + 1] + 0.1 * imgData[i + 2]) /
          255;
        const idx = Math.floor((this.invert ? gray : 1 - gray) * charsetLen);
        str += this.charset[idx];
      }
      str += "\n";
    }
    this.pre.textContent = str;
  }

  dispose() {
    document.removeEventListener("mousemove", this.onMouseMove);
  }
}

interface CanvasTxtOptions {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}
class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  txt: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;
  needsUpdate: boolean = true;

  constructor(
    txt: string,
    {
      fontSize = 200,
      fontFamily = "Arial",
      color = "#fdf9f3",
    }: CanvasTxtOptions = {}
  ) {
    this.canvas = document.createElement("canvas");
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Could not get 2D context for CanvasTxt");
    this.context = context;
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
    this.resize();
    this.render();
  }

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    const textWidth = Math.ceil(metrics.width) + 20;
    const textHeight =
      Math.ceil(
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
      ) + 20;
    this.canvas.width = textWidth;
    this.canvas.height = textHeight;
    this.needsUpdate = true;
  }

  updateText(newText: string) {
    if (this.txt !== newText) {
      this.txt = newText;
      this.resize();
      this.needsUpdate = true;
    }
  }

  updateStyle({ fontSize, fontFamily, color }: CanvasTxtOptions) {
    let changed = false;
    if (fontSize && this.fontSize !== fontSize) {
      this.fontSize = fontSize;
      changed = true;
    }
    if (fontFamily && this.fontFamily !== fontFamily) {
      this.fontFamily = fontFamily;
      changed = true;
    }
    if (color && this.color !== color) {
      this.color = color;
      this.needsUpdate = true;
    }
    if (changed) {
      this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
      this.resize();
    }
  }

  render() {
    if (!this.needsUpdate) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    const yPos = 10 + metrics.actualBoundingBoxAscent;
    this.context.fillText(this.txt, 10, yPos);
    this.needsUpdate = false;
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get texture() {
    return this.canvas;
  }
}

interface CanvAsciiOptions {
  text: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  enableWaves: boolean;
}

class CanvAscii {
  container: HTMLElement;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  filter: AsciiFilter;
  textCanvas: CanvasTxt;
  texture: THREE.CanvasTexture;
  mesh!: THREE.Mesh;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;

  width: number;
  height: number;
  center: { x: number; y: number } = { x: 0, y: 0 };
  mouse: { x: number; y: number } = { x: 0, y: 0 };
  animationFrameId: number = 0;
  isRunning: boolean = false;

  private currentOptions: CanvAsciiOptions;

  constructor(
    options: CanvAsciiOptions,
    containerElem: HTMLElement,
    width: number,
    height: number
  ) {
    this.currentOptions = { ...options };
    this.container = containerElem;
    this.width = width;
    this.height = height;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();

    this.textCanvas = new CanvasTxt(options.text, {
      fontSize: options.textFontSize,
      fontFamily:
        "'IBM Plex Mono', 'Noto Sans Symbols 2', 'Segoe UI Symbol', 'Apple Symbols', monospace",
      color: options.textColor,
    });
    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    this.setMesh();

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: "IBM Plex Mono",
      fontSize: options.asciiFontSize,
      invert: true,
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(width, height);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("touchmove", this.onMouseMove);
  }

  setMesh() {
    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const baseH = this.currentOptions.planeBaseHeight;
    const planeW = baseH * textAspect;
    const planeH = baseH;

    this.geometry?.dispose();
    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);

    this.material?.dispose();
    this.material?.uniforms.uTexture?.value?.dispose();

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.currentOptions.enableWaves ? 1.0 : 0.0 },
      },
    });

    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setSize(w: number, h: number) {
    if (w <= 0 || h <= 0) return;
    this.width = w;
    this.height = h;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.filter.setSize(w, h);
    this.center = { x: w / 2, y: h / 2 };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
  }

  onMouseMove(evt: MouseEvent | TouchEvent) {
    const e = (evt as TouchEvent).touches
      ? (evt as TouchEvent).touches[0]
      : (evt as MouseEvent);
    const bounds = this.container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    this.mouse = { x, y };
  }

  animate() {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    const time = performance.now() * 0.001;

    if (this.textCanvas.needsUpdate) {
      this.textCanvas.render();
      this.texture.needsUpdate = true;
    }

    this.material.uniforms.uTime.value = time;

    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const x = map(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = map(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
  }

  updateOptions(newOptions: Partial<CanvAsciiOptions>) {
    let meshNeedsUpdate = false;

    if (
      newOptions.text !== undefined &&
      newOptions.text !== this.currentOptions.text
    ) {
      this.textCanvas.updateText(newOptions.text);
      this.currentOptions.text = newOptions.text;
      meshNeedsUpdate = true;
    }
    if (
      newOptions.textFontSize !== undefined &&
      newOptions.textFontSize !== this.currentOptions.textFontSize
    ) {
      this.textCanvas.updateStyle({ fontSize: newOptions.textFontSize });
      this.currentOptions.textFontSize = newOptions.textFontSize;
      meshNeedsUpdate = true;
    }
    if (
      newOptions.textColor !== undefined &&
      newOptions.textColor !== this.currentOptions.textColor
    ) {
      this.textCanvas.updateStyle({ color: newOptions.textColor });
      this.currentOptions.textColor = newOptions.textColor;
    }
    if (
      newOptions.asciiFontSize !== undefined &&
      newOptions.asciiFontSize !== this.currentOptions.asciiFontSize
    ) {
      this.filter.fontSize = newOptions.asciiFontSize;
      this.filter.reset();
      this.currentOptions.asciiFontSize = newOptions.asciiFontSize;
    }
    if (
      newOptions.planeBaseHeight !== undefined &&
      newOptions.planeBaseHeight !== this.currentOptions.planeBaseHeight
    ) {
      this.currentOptions.planeBaseHeight = newOptions.planeBaseHeight;
      meshNeedsUpdate = true;
    }
    if (
      newOptions.enableWaves !== undefined &&
      newOptions.enableWaves !== this.currentOptions.enableWaves
    ) {
      this.material.uniforms.uEnableWaves.value = newOptions.enableWaves
        ? 1.0
        : 0.0;
      this.currentOptions.enableWaves = newOptions.enableWaves;
    }

    if (meshNeedsUpdate) {
      this.setMesh();
    }
  }

  dispose() {
    this.stop();
    this.filter.dispose();
    if (this.filter.domElement.parentNode === this.container) {
      this.container.removeChild(this.filter.domElement);
    }
    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("touchmove", this.onMouseMove);

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.uniforms?.uTexture?.value?.dispose();
            material.dispose();
          });
        } else if (object.material) {
          object.material.uniforms?.uTexture?.value?.dispose();
          object.material.dispose();
        }
      }
    });
    this.texture?.dispose();
    this.renderer?.dispose();
  }
}

interface ASCIITextProps {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
}

export default function ASCIIText({
  text = "David!",
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = "#fdf9f3",
  planeBaseHeight = 8,
  enableWaves = true,
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asciiInstanceRef = useRef<CanvAscii | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let instance: CanvAscii | null = null;
    let ro: ResizeObserver | null = null;
    let observer: IntersectionObserver | null = null;

    const init = (w: number, h: number) => {
      if (instance) return;
      instance = new CanvAscii(
        {
          text,
          asciiFontSize,
          textFontSize,
          textColor,
          planeBaseHeight,
          enableWaves,
        },
        container,
        w,
        h
      );
      asciiInstanceRef.current = instance;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            instance?.start();
          } else {
            instance?.stop();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(container);

      ro = new ResizeObserver((entries) => {
        if (!entries[0] || !instance) return;
        const { width: currentW, height: currentH } = entries[0].contentRect;
        if (currentW > 0 && currentH > 0) {
          instance.setSize(currentW, currentH);
        }
      });
      ro.observe(container);
    };

    const { width, height } = container.getBoundingClientRect();

    if (width > 0 && height > 0) {
      init(width, height);
    } else {
      const initialObserver = new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            entry.boundingClientRect.width > 0 &&
            entry.boundingClientRect.height > 0
          ) {
            const { width: initialW, height: initialH } =
              entry.boundingClientRect;
            init(initialW, initialH);
            initialObserver.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      initialObserver.observe(container);
      return () => initialObserver.disconnect();
    }

    return () => {
      observer?.disconnect();
      ro?.disconnect();
      instance?.dispose();
      asciiInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    asciiInstanceRef.current?.updateOptions({
      text,
      asciiFontSize,
      textFontSize,
      textColor,
      planeBaseHeight,
      enableWaves,
    });
  }, [
    text,
    asciiFontSize,
    textFontSize,
    textColor,
    planeBaseHeight,
    enableWaves,
  ]);

  return (
    <div
      ref={containerRef}
      className="ascii-text-container"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* Keep existing styles, maybe remove global body styles if not needed */
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Noto+Sans+Symbols+2&display=swap');

        .ascii-text-container canvas {
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          image-rendering: optimizeSpeed;
          image-rendering: pixelated;
          pointer-events: none;
        }

        .ascii-text-container pre {
          margin: 0;
          user-select: none;
          padding: 0;
          line-height: 1em;
          text-align: left;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
          mix-blend-mode: difference;
          pointer-events: none;
          color: white;
        }
      `}</style>
    </div>
  );
}
