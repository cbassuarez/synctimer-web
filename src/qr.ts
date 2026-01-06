import QRCode from 'qrcode';

const QUIET_ZONE = 4;

export async function generateSvgMarkup(text: string, width = 320): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    margin: QUIET_ZONE,
    width,
    errorCorrectionLevel: 'M',
  });
}

export async function downloadSvg(filename: string, svgMarkup: string): Promise<void> {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

export async function downloadPng(text: string, filename: string, size = 1024): Promise<void> {
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, {
    margin: QUIET_ZONE,
    width: size,
    errorCorrectionLevel: 'M',
  });
  const url = canvas.toDataURL('image/png');
  triggerDownload(url, filename);
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
