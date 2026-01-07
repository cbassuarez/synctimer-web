import QRCode from 'qrcode';

const QUIET_ZONE = 4;
const BRANDING_MARGIN_TARGET = 0.19;
const BRANDING_MARGIN_PRINT_SAFE = 0.22;
const LOGO_URL = '/brand/synctimer-logo.png';

export type BrandingCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface BrandingOptions {
  enabled: boolean;
  corner: BrandingCorner;
  sizePct: number;
  patchPaddingPct: number;
  printSafe?: boolean;
<<<<<<< HEAD
  logoUrl?: string;
=======
>>>>>>> main
}

export async function generateSvgMarkup(text: string, width = 320, branding?: BrandingOptions): Promise<string> {
  const errorCorrectionLevel = branding?.enabled ? 'H' : 'M';
  const modules = QRCode.create(text, { errorCorrectionLevel }).modules.size;
  const margin = resolveMargin(modules, branding);
  const svgMarkup = await QRCode.toString(text, {
    type: 'svg',
    margin,
    width,
    errorCorrectionLevel,
  });
  if (!branding?.enabled) return svgMarkup;
  const layout = resolveBrandingLayout(width, modules, margin, branding);
  if (!layout) return svgMarkup;
<<<<<<< HEAD
  const logoUrl = branding.logoUrl || LOGO_URL;
  const overlay = [
    '<g class="qr-branding" pointer-events="none">',
    `<rect x="${layout.patchX}" y="${layout.patchY}" width="${layout.patchSize}" height="${layout.patchSize}" rx="${layout.patchRadius}" ry="${layout.patchRadius}" fill="#FFFFFF" stroke="#D7DFEA" stroke-width="${layout.patchStroke}" />`,
    `<image href="${logoUrl}" x="${layout.logoX}" y="${layout.logoY}" width="${layout.logoSize}" height="${layout.logoSize}" preserveAspectRatio="xMidYMid meet" />`,
=======
  const overlay = [
    '<g class="qr-branding" pointer-events="none">',
    `<rect x="${layout.patchX}" y="${layout.patchY}" width="${layout.patchSize}" height="${layout.patchSize}" rx="${layout.patchRadius}" ry="${layout.patchRadius}" fill="#FFFFFF" stroke="#D7DFEA" stroke-width="${layout.patchStroke}" />`,
    `<image href="${LOGO_URL}" x="${layout.logoX}" y="${layout.logoY}" width="${layout.logoSize}" height="${layout.logoSize}" preserveAspectRatio="xMidYMid meet" />`,
>>>>>>> main
    '</g>',
  ].join('');
  return svgMarkup.replace('</svg>', `${overlay}</svg>`);
}

export async function downloadSvg(filename: string, svgMarkup: string): Promise<void> {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

export async function downloadPng(
  text: string,
  filename: string,
  size = 1024,
  branding?: BrandingOptions,
): Promise<void> {
  const canvas = document.createElement('canvas');
  const errorCorrectionLevel = branding?.enabled ? 'H' : 'M';
  const modules = QRCode.create(text, { errorCorrectionLevel }).modules.size;
  const margin = resolveMargin(modules, branding);
  await QRCode.toCanvas(canvas, text, {
    margin,
    width: size,
    errorCorrectionLevel,
  });
  if (branding?.enabled) {
    await drawBrandingOverlay(canvas, modules, margin, branding);
  }
  const url = canvas.toDataURL('image/png');
  triggerDownload(url, filename);
}

function resolveMargin(modules: number, branding?: BrandingOptions): number {
  if (!branding?.enabled) return QUIET_ZONE;
  const target = branding.printSafe ? BRANDING_MARGIN_PRINT_SAFE : BRANDING_MARGIN_TARGET;
  return Math.max(QUIET_ZONE, Math.ceil((target * modules) / (1 - 2 * target)));
}

function resolveBrandingLayout(
  totalSize: number,
  modules: number,
  margin: number,
  branding: BrandingOptions,
) {
  const sizePct = clamp(branding.sizePct, 0.1, 0.16);
  const paddingPct = clamp(branding.patchPaddingPct, 0.08, 0.2);
  const totalModules = modules + margin * 2;
  const marginPct = totalModules > 0 ? margin / totalModules : 0;
  const marginPx = totalSize * marginPct;
  const desiredPatch = totalSize * sizePct;
  if (marginPx <= 0) return null;
  const maxInset = Math.max(0, (marginPx - desiredPatch) / 2);
  const inset = Math.min(totalSize * 0.03, maxInset);
  const patchSize = Math.min(desiredPatch, Math.max(0, marginPx - inset * 2));
  if (patchSize <= 0) return null;
  const patchRadius = Math.max(2, patchSize * 0.18);
  const patchStroke = Math.max(0.5, patchSize * 0.02);
  const logoSize = patchSize * (1 - 2 * paddingPct);
  if (logoSize <= 0) return null;
  const marginStart = totalSize - marginPx;
  const positions = {
    'top-left': { x: inset, y: inset },
    'top-right': { x: marginStart + inset, y: inset },
    'bottom-left': { x: inset, y: marginStart + inset },
    'bottom-right': { x: marginStart + inset, y: marginStart + inset },
  } as const;
  const corner = positions[branding.corner] ?? positions['bottom-right'];
  return {
    patchX: corner.x,
    patchY: corner.y,
    patchSize,
    patchRadius,
    patchStroke,
    logoSize,
    logoX: corner.x + (patchSize - logoSize) / 2,
    logoY: corner.y + (patchSize - logoSize) / 2,
  };
}

async function drawBrandingOverlay(
  canvas: HTMLCanvasElement,
  modules: number,
  margin: number,
  branding: BrandingOptions,
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const layout = resolveBrandingLayout(canvas.width, modules, margin, branding);
  if (!layout) return;
<<<<<<< HEAD
  const logo = await loadImage(branding.logoUrl || LOGO_URL);
=======
  const logo = await loadImage(LOGO_URL);
>>>>>>> main
  if (!logo) return;
  ctx.save();
  drawRoundedRect(ctx, layout.patchX, layout.patchY, layout.patchSize, layout.patchSize, layout.patchRadius);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#D7DFEA';
  ctx.lineWidth = layout.patchStroke;
  ctx.stroke();
  ctx.save();
  drawRoundedRect(ctx, layout.patchX, layout.patchY, layout.patchSize, layout.patchSize, layout.patchRadius);
  ctx.clip();
  ctx.drawImage(logo, layout.logoX, layout.logoY, layout.logoSize, layout.logoSize);
  ctx.restore();
  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
