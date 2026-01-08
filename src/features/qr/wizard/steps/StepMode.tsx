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
    </div>
  );
}
