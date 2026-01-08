import QRCode from 'qrcode';

const QUIET_ZONE = 4;
const BRANDING_MARGIN_TARGET = 0.19;
const BRANDING_MARGIN_PRINT_SAFE = 0.22;
const LOGO_PATH = '/brand/synctimer-logo.png';

export type BrandingCorner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';

export interface BrandingOptions {
  enabled: boolean;
  corner: BrandingCorner;
  sizePct: number;
  patchPaddingPct: number;
  printSafe?: boolean;
}

export async function generateSvgMarkup(text: string, width = 320, branding?: BrandingOptions): Promise<string> {
  const effectiveLevel = branding?.enabled ? 'H' : 'M';
  const modules = QRCode.create(text, { errorCorrectionLevel: effectiveLevel }).modules.size;
  const margin = resolveMargin(modules, branding);
  const svgMarkup = await QRCode.toString(text, {
    type: 'svg',
    margin,
    width,
    errorCorrectionLevel: effectiveLevel,
    color: branding?.enabled ? { dark: '#000000', light: '#00000000' } : undefined,
  });
  if (!branding?.enabled) return svgMarkup;
  const layout = resolveBrandingLayout(width, modules, margin, branding);
  if (!layout) return svgMarkup;
  const tileCorner = width * 0.06;
  const logoUrl = resolveLogoUrl();
  const defs = [
    '<defs>',
    '<filter id="brandShadow">',
    '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.18)" />',
    '</filter>',
    '</defs>',
  ].join('');
  const tileRect = `<rect x="0" y="0" width="${width}" height="${width}" rx="${tileCorner}" fill="white" />`;
  const overlay = [
    '<g class="qr-branding" pointer-events="none">',
    `<rect x="${layout.plateX}" y="${layout.plateY}" width="${layout.plateSize}" height="${layout.plateSize}" rx="${layout.plateRadius}" ry="${layout.plateRadius}" fill="rgba(255,255,255,0.98)" filter="url(#brandShadow)" />`,
    `<rect x="${layout.plateX}" y="${layout.plateY}" width="${layout.plateSize}" height="${layout.plateSize}" rx="${layout.plateRadius}" ry="${layout.plateRadius}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="${layout.outerStroke}" />`,
    `<rect x="${layout.plateX}" y="${layout.plateY}" width="${layout.plateSize}" height="${layout.plateSize}" rx="${layout.plateRadius}" ry="${layout.plateRadius}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="${layout.innerStroke}" />`,
    `<image href="${logoUrl}" x="${layout.logoX}" y="${layout.logoY}" width="${layout.logoSize}" height="${layout.logoSize}" preserveAspectRatio="xMidYMid meet" />`,
    '</g>',
  ].join('');
  const withTile = svgMarkup.replace(/<svg([^>]*)>/, `<svg$1>${defs}${tileRect}`);
  return withTile.replace('</svg>', `${overlay}</svg>`);
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
  const effectiveLevel = branding?.enabled ? 'H' : 'M';
  const modules = QRCode.create(text, { errorCorrectionLevel: effectiveLevel }).modules.size;
  const margin = resolveMargin(modules, branding);
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, text, {
    margin,
    width: size,
    errorCorrectionLevel: effectiveLevel,
    color: branding?.enabled ? { dark: '#000000', light: '#00000000' } : undefined,
  });
  if (!branding?.enabled) {
    triggerDownload(qrCanvas.toDataURL('image/png'), filename);
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const tileCorner = size * 0.06;
  ctx.save();
  drawRoundedRect(ctx, 0, 0, size, size, tileCorner);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.clip();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qrCanvas, 0, 0);
  ctx.restore();
  await drawBrandingOverlay(canvas, modules, margin, branding);
  triggerDownload(canvas.toDataURL('image/png'), filename);
}

function resolveMargin(modules: number, branding?: BrandingOptions): number {
  if (!branding?.enabled) return QUIET_ZONE;
  const target =
    branding.corner === 'center'
      ? BRANDING_MARGIN_TARGET
      : branding.printSafe
        ? BRANDING_MARGIN_PRINT_SAFE
        : BRANDING_MARGIN_TARGET;
  return Math.max(QUIET_ZONE, Math.ceil((target * modules) / (1 - 2 * target)));
}

function resolveBrandingLayout(
  totalSize: number,
  modules: number,
  margin: number,
  branding: BrandingOptions,
) {
  const paddingPct = clamp(branding.patchPaddingPct, 0.08, 0.2);
  const totalModules = modules + margin * 2;
  const modulePx = totalModules > 0 ? totalSize / totalModules : 0;
  const marginPx = margin * modulePx;
  if (modulePx <= 0) return null;

  if (branding.corner === 'center') {
    const innerSide = totalSize - 2 * marginPx;
    const plateSide = clamp(innerSide * branding.sizePct, innerSide * 0.18, innerSide * 0.3);
    const plateX = marginPx + (innerSide - plateSide) / 2;
    const plateY = marginPx + (innerSide - plateSide) / 2;
    const plateRadius = plateSide * 0.26;
    const inset = plateSide * paddingPct;
    const logoSize = plateSide - inset * 2;
    if (logoSize <= 0) return null;
    return {
      plateX,
      plateY,
      plateSize: plateSide,
      plateRadius,
      outerStroke: Math.max(0.5, plateSide * 0.012),
      innerStroke: Math.max(0.5, plateSide * 0.008),
      logoSize,
      logoX: plateX + inset,
      logoY: plateY + inset,
    };
  }

  const sizePct = clamp(branding.sizePct, 0.1, 0.2);
  const marginPct = totalModules > 0 ? margin / totalModules : 0;
  const marginSide = totalSize * marginPct;
  const desiredPatch = totalSize * sizePct;
  if (marginSide <= 0) return null;
  const maxInset = Math.max(0, (marginSide - desiredPatch) / 2);
  const inset = Math.min(totalSize * 0.03, maxInset);
  const patchSize = Math.min(desiredPatch, Math.max(0, marginSide - inset * 2));
  if (patchSize <= 0) return null;
  const patchRadius = Math.max(2, patchSize * 0.18);
  const logoSize = patchSize * (1 - 2 * paddingPct);
  if (logoSize <= 0) return null;
  const marginStart = totalSize - marginSide;
  const positions = {
    topLeft: { x: inset, y: inset },
    topRight: { x: marginStart + inset, y: inset },
    bottomLeft: { x: inset, y: marginStart + inset },
    bottomRight: { x: marginStart + inset, y: marginStart + inset },
  } as const;
  const corner = positions[branding.corner] ?? positions.bottomRight;
  return {
    plateX: corner.x,
    plateY: corner.y,
    plateSize: patchSize,
    plateRadius: patchRadius,
    outerStroke: Math.max(0.5, patchSize * 0.02),
    innerStroke: Math.max(0.5, patchSize * 0.012),
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
  const logo = await loadImage(resolveLogoUrl());
  if (!logo) return;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  drawRoundedRect(ctx, layout.plateX, layout.plateY, layout.plateSize, layout.plateSize, layout.plateRadius);
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRect(ctx, layout.plateX, layout.plateY, layout.plateSize, layout.plateSize, layout.plateRadius);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = layout.outerStroke;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  drawRoundedRect(ctx, layout.plateX, layout.plateY, layout.plateSize, layout.plateSize, layout.plateRadius);
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = layout.innerStroke;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  drawRoundedRect(ctx, layout.plateX, layout.plateY, layout.plateSize, layout.plateSize, layout.plateRadius);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(logo, layout.logoX, layout.logoY, layout.logoSize, layout.logoSize);
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

function resolveLogoUrl(): string {
  return new URL(LOGO_PATH, window.location.origin).toString();
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
