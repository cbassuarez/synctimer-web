import React from 'react';
import { QrModel } from '../QrWizardPage';

export default function StepPaste({
  qrModel,
  onContinue,
  showManualHostEditor,
  onShowManualHostEditor,
}: {
  qrModel: QrModel;
  onContinue: () => void;
  showManualHostEditor: boolean;
  onShowManualHostEditor: (value: boolean) => void;
}) {
  const hosts = qrModel.state.config.hosts;

  return (
    <div className="qr-step">
      <h2>Paste Host Share Link(s)</h2>
      <p className="muted">Paste one or more host share links to prefill the host list instantly.</p>

      <div className={`field ${qrModel.state.transportHintNote ? 'is-invalid' : ''}`}>
        <label htmlFor="host-paste">Paste Host Share Link(s)</label>
        <textarea
          id="host-paste"
          rows={4}
          value={qrModel.state.hostInput}
          onChange={(e) => qrModel.setters.setHostInput(e.target.value)}
          placeholder="https://synctimerapp.com/host?..."
        />
        {qrModel.state.transportHintNote && <p className="field-help error">{qrModel.state.transportHintNote}</p>}
        <p className="field-help">We’ll extract host UUIDs as soon as the link is pasted.</p>
      </div>

      {hosts.length > 0 && (
        <div className="qr-chip-list" aria-live="polite">
          {hosts.map((host, idx) => (
            <span key={host.uuid} className="qr-chip">
              {qrModel.derived.deviceNames[idx]} · {host.uuid.slice(-4)}
            </span>
          ))}
        </div>
      )}

      <div className="row">
        <button className="primary" onClick={onContinue}>
          Continue
        </button>
        <button className="secondary" onClick={() => onShowManualHostEditor(!showManualHostEditor)}>
          Enter manually
        </button>
      </div>
    </div>
  );
}
