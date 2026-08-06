/**
 * Shared canvas image-sequence helpers for scroll-scrubbed comic panels.
 * Used by Scene 5 (optional) and Scene 6 monster reveal.
 */

/** Draw `img` into `canvas` with object-fit: cover math. */
export function drawCover(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !img.complete || img.naturalWidth === 0) return;

  const cw = canvas.width;
  const ch = canvas.height;
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = cw / ch;

  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;

  if (ir > cr) {
    dh = ch;
    dw = ch * ir;
    dx = (cw - dw) / 2;
    dy = 0;
  } else {
    dw = cw;
    dh = cw / ir;
    dx = 0;
    dy = (ch - dh) / 2;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/** Size canvas to the panel with devicePixelRatio (capped for perf). */
export function sizeCanvasToPanel(
  canvas: HTMLCanvasElement,
  panel: HTMLElement,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = panel.clientWidth;
  const h = panel.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}

/** Preload a numbered frame sequence into memory. */
export function preloadFrameSequence(
  count: number,
  srcForIndex: (index: number) => string,
  onProgress?: (loaded: number, total: number) => void,
): Promise<HTMLImageElement[]> {
  let loaded = 0;

  const jobs = Array.from({ length: count }, (_, i) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded += 1;
        onProgress?.(loaded, count);
        resolve(img);
      };
      img.onerror = () =>
        reject(new Error(`Failed to load ${srcForIndex(i)}`));
      img.src = srcForIndex(i);
    });
  });

  return Promise.all(jobs);
}
