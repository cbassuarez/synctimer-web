import React from 'react';
import { QrModel } from './QrWizardPage';

export function QrJoinUrlBlock({ qrModel }: { qrModel: QrModel }) {
  const isReady = qrModel.derived.validation.valid && qrModel.state.config.hosts.length > 0;

  return (
    <div className="qr-output__block">
      <div className="qr-output__header">
        <h3>Join URL</h3>
        <span className={`qr-output__chip ${isReady ? 'is-ready' : 'is-not-ready'}`}>
          {isReady ? 'Ready' : 'Not ready'}
        </span>
      </div>
      <div className="qr-output__url" data-testid="qr-join-url">
        {qrModel.derived.joinUrl}
      </div>
      <div className="row">
        <button onClick={() => qrModel.actions.handleCopy(qrModel.derived.joinUrl)} disabled={!isReady}>
          Copy URL
        </button>
        <button onClick={qrModel.actions.handleCopyGeneratorLink}>Copy generator link</button>
      </div>
      {qrModel.state.copyMessage && <p className="field-help">{qrModel.state.copyMessage}</p>}
    </div>
  );
}

export function QrPreviewBlock({ qrModel }: { qrModel: QrModel }) {
  const isReady = qrModel.derived.validation.valid && qrModel.state.config.hosts.length > 0;

  return (
    <div className="qr-output__preview">
      <div className="qr-output__header">
        <h3>QR preview</h3>
      </div>
      {isReady ? (
        <div className="qr" dangerouslySetInnerHTML={{ __html: qrModel.derived.svgMarkup }} />
      ) : (
        <div className="note">Fix validation to render the QR.</div>
      )}
      <p className="qr-output__what">Scan → App/App Clip → opens Sync View → connects</p>
    </div>
  );
}

export default function QrOutputMonitor({ qrModel }: { qrModel: QrModel }) {
  const isReady = qrModel.derived.validation.valid && qrModel.state.config.hosts.length > 0;
  const canPrint = typeof window !== 'undefined' && 'print' in window;

  const handlePrint = () => {
    if (!isReady || !canPrint) return;
    qrModel.setters.setConfig((prev) => ({ ...prev, printMode: true }));
    window.setTimeout(() => {
      window.print();
    }, 0);
  };

  return (
    <aside className="qr-output qr-output--hero">
      <div className="qr-output__hero">
        {isReady ? (
          <div className="qr" dangerouslySetInnerHTML={{ __html: qrModel.derived.svgMarkup }} />
        ) : (
          <div className="note">Complete the required fields to render the QR.</div>
        )}
      </div>
      <div className="qr-output__actions qr-output__actions--compact">
        <button type="button" onClick={() => qrModel.actions.handleCopy(qrModel.derived.joinUrl)} disabled={!isReady}>
          Copy link
        </button>
        <button
          type="button"
          onClick={() => qrModel.actions.downloadPng(qrModel.derived.joinUrl, 'synctimer-qr.png', 1024, qrModel.derived.branding)}
          disabled={!isReady}
        >
          Download PNG
        </button>
        <button
          type="button"
          onClick={() => qrModel.actions.downloadSvg('synctimer-qr.svg', qrModel.derived.svgMarkup)}
          disabled={!isReady || !qrModel.derived.svgMarkup}
        >
          Download SVG
        </button>
        {canPrint && (
          <button type="button" onClick={handlePrint} disabled={!isReady}>
            Print
          </button>
        )}
      </div>
      {qrModel.state.copyMessage && <p className="field-help">{qrModel.state.copyMessage}</p>}
      {!isReady && qrModel.derived.validation.errors.length > 0 && (
        <div className="note">
          {qrModel.derived.validation.errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
      <p className="field-help">Scan to open Join App Clip.</p>
    </aside>
  );
}
