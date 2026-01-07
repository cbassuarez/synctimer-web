import React from 'react';
import { QrModel } from '../QrWizardPage';

export default function StepDeploy({ qrModel }: { qrModel: QrModel }) {
  const isReady = qrModel.derived.validation.valid && qrModel.state.config.hosts.length > 0;

  return (
    <div className="qr-step">
      <h2>Deploy</h2>
      <p className="muted">Use these actions to share or display the QR.</p>

      <div className="row">
        <button onClick={qrModel.actions.handleDisplayMode} disabled={!isReady}>
          Display
        </button>
        <button onClick={qrModel.actions.handlePrintLabel} disabled={!isReady}>
          Print label
        </button>
        <button
          onClick={() => qrModel.actions.downloadSvg('synctimer-qr.svg', qrModel.derived.svgMarkup)}
          disabled={!isReady || !qrModel.derived.svgMarkup}
        >
          Download SVG
        </button>
        <button
          onClick={() =>
            qrModel.actions.downloadPng(qrModel.derived.joinUrl, 'synctimer-qr.png', 1024, qrModel.derived.branding)
          }
          disabled={!isReady}
        >
          Download PNG
        </button>
      </div>

      {!isReady && (
        <div className="note">
          {qrModel.derived.validation.errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}

      <p className="field-help">Branding is applied automatically.</p>
    </div>
  );
}

