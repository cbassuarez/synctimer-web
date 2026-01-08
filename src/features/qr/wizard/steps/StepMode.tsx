import React from 'react';
import { QrModel } from '../QrWizardPage';

export default function StepMode({ qrModel }: { qrModel: QrModel }) {
  return (
    <div className="qr-step">
      <h2>Connection mode</h2>
      <p className="muted">Pick how joiners connect to your session.</p>

      <div className="qr-mode-grid">
        <button
          type="button"
          className={`qr-mode-card ${qrModel.state.config.mode === 'wifi' ? 'is-active' : ''}`}
          data-testid="mode-wifi"
          onClick={() => qrModel.setters.setConfig({ ...qrModel.state.config, mode: 'wifi' })}
        >
          <span className="qr-mode-card__title">Wi-Fi</span>
          <span className="qr-mode-card__desc">Joiners must be on the same Wi-Fi network.</span>
        </button>
        <button
          type="button"
          className={`qr-mode-card ${qrModel.state.config.mode === 'nearby' ? 'is-active' : ''}`}
          data-testid="mode-nearby"
          onClick={() => qrModel.setters.setConfig({ ...qrModel.state.config, mode: 'nearby' })}
        >
          <span className="qr-mode-card__title">Nearby</span>
          <span className="qr-mode-card__desc">Nearby uses Bluetooth for discovery.</span>
        </button>
      </div>

      <div className="qr-paste-card">
        <div className={`field ${qrModel.state.transportHintNote ? 'is-invalid' : ''}`}>
          <label htmlFor="step1-paste">Paste link</label>
          <textarea
            id="step1-paste"
            rows={3}
            value={qrModel.state.hostInput}
            onChange={(e) => qrModel.setters.setHostInput(e.target.value)}
            placeholder="https://synctimerapp.com/join?... or .../host"
            data-testid="step1-paste"
          />
          {qrModel.state.transportHintNote && <p className="field-help error">{qrModel.state.transportHintNote}</p>}
          <p className="field-help qr-paste-card__hint">Paste a /qr prefill, /host, or /join link.</p>
        </div>
        <div className="row">
          <button
            type="button"
            className="secondary"
            data-testid="step1-import"
            onClick={() => qrModel.actions.importFromText(qrModel.state.hostInput)}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
