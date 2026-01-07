import React from 'react';
import { downloadPng, downloadSvg } from '../../qr';
import { QrModel } from '../types';

interface StepDeployProps {
  qrModel: QrModel;
}

export default function StepDeploy({ qrModel }: StepDeployProps) {
  const { config, setConfig, validation, svgMarkup, joinUrl, branding } = qrModel;

  return (
    <div className="qr-step-content">
      <div className="qr-step-actions">
        <button onClick={() => setConfig({ ...config, displayMode: true })} disabled={!validation.valid}>
          Display
        </button>
        <button onClick={() => setConfig({ ...config, printMode: !config.printMode })} disabled={!validation.valid}>
          Print label
        </button>
        <button onClick={() => downloadSvg('synctimer-qr.svg', svgMarkup)} disabled={!validation.valid || !svgMarkup}>
          Download SVG
        </button>
        <button onClick={() => downloadPng(joinUrl, 'synctimer-qr.png', 1024, branding)} disabled={!validation.valid}>
          Download PNG
        </button>
      </div>
      <small className="muted">Branding is applied automatically.</small>
    </div>
  );
}
