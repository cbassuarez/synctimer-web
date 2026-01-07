import React from 'react';
import { downloadPng, downloadSvg } from '../qr';
import { QrModel } from './types';

interface QrOutputMonitorProps {
  qrModel: QrModel;
}

export function QrJoinUrlBlock({ qrModel }: { qrModel: QrModel }) {
  const { joinUrl, validation, copyMessage } = qrModel;
  return (
    <div className="qr-output-block">
      <div className="qr-output-header">
        <h3>Join URL</h3>
        <span className={`status-chip ${validation.valid ? 'ready' : 'not-ready'}`}>
          {validation.valid ? 'Ready' : 'Not ready'}
        </span>
      </div>
      <div className="qr-join-url" title={joinUrl}>
        {joinUrl}
      </div>
      <div className="qr-output-actions">
        <button onClick={() => qrModel.actions.handleCopy(joinUrl)} disabled={!validation.valid}>
          Copy
        </button>
      </div>
      {copyMessage && <div className="note success">{copyMessage}</div>}
    </div>
  );
}

export function QrPreview({ qrModel }: { qrModel: QrModel }) {
  const { svgMarkup, validation } = qrModel;
  return (
    <div className="qr-output-block">
      <div className="qr-output-header">
        <h3>QR preview</h3>
      </div>
      {validation.valid ? (
        <div className="qr-preview" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
      ) : (
        <div className="note">Fix validation to render QR.</div>
      )}
    </div>
  );
}

export function QrExportActions({ qrModel }: { qrModel: QrModel }) {
  const { config, joinUrl, validation, svgMarkup, branding } = qrModel;
  return (
    <div className="qr-output-actions qr-export-actions">
      <button onClick={() => qrModel.setConfig({ ...config, displayMode: true })} disabled={!validation.valid}>
        Display
      </button>
      <button onClick={() => qrModel.setConfig({ ...config, printMode: !config.printMode })} disabled={!validation.valid}>
        Print label
      </button>
      <button onClick={() => downloadSvg('synctimer-qr.svg', svgMarkup)} disabled={!validation.valid || !svgMarkup}>
        Download SVG
      </button>
      <button onClick={() => downloadPng(joinUrl, 'synctimer-qr.png', 1024, branding)} disabled={!validation.valid}>
        Download PNG
      </button>
    </div>
  );
}

export function QrPrintPreview({ qrModel }: { qrModel: QrModel }) {
  const { config, validation, svgMarkup } = qrModel;
  if (!config.printMode || !validation.valid) return null;

  return (
    <div className="print-area" id="print-area">
      <div className="label">
        <p className="room">{config.roomLabel || 'SyncTimer room'}</p>
        <p className="subtitle">Scan to join SyncTimer</p>
        <div className="qr" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
      </div>
      <div className="row">
        <button onClick={qrModel.actions.handlePrint}>Print</button>
      </div>
    </div>
  );
}

export default function QrOutputMonitor({ qrModel }: QrOutputMonitorProps) {
  return (
    <div className="qr-output-monitor">
      <QrJoinUrlBlock qrModel={qrModel} />
      <QrPreview qrModel={qrModel} />
      <QrExportActions qrModel={qrModel} />
      <div className="qr-output-footnote">Scan → App/App Clip → opens Sync View → connects</div>
      <small className="muted">Branding is applied automatically.</small>
      <QrPrintPreview qrModel={qrModel} />
    </div>
  );
}
