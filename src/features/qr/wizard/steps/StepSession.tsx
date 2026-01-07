import React from 'react';
import { QrModel } from '../QrWizardPage';

export default function StepSession({ qrModel }: { qrModel: QrModel }) {
  return (
    <div className="qr-step">
      <h2>Session basics</h2>
      <p className="muted">Choose how joiners connect and label the room.</p>

      <div className="field">
        <label>Mode</label>
        <div className="segmented segmented--large">
          <button
            className={qrModel.state.config.mode === 'wifi' ? 'active' : ''}
            onClick={() => qrModel.setters.setConfig({ ...qrModel.state.config, mode: 'wifi' })}
          >
            Wi-Fi
          </button>
          <button
            className={qrModel.state.config.mode === 'nearby' ? 'active' : ''}
            onClick={() => qrModel.setters.setConfig({ ...qrModel.state.config, mode: 'nearby' })}
          >
            Nearby
          </button>
        </div>
        <p className="field-help">
          {qrModel.state.config.mode === 'wifi' ? 'Same Wi-Fi required.' : 'Bluetooth required.'}
        </p>
      </div>

      <div className="field">
        <label htmlFor="room-label">Room label (optional)</label>
        <input
          id="room-label"
          type="text"
          value={qrModel.state.config.roomLabel}
          onChange={(e) => qrModel.setters.setConfig({ ...qrModel.state.config, roomLabel: e.target.value })}
          placeholder="Room 12A"
        />
      </div>
    </div>
  );
}

