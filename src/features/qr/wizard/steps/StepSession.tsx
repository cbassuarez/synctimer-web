import React from 'react';
import { Mode } from '../../model';
import { QrModel } from '../types';

interface StepSessionProps {
  qrModel: QrModel;
}

export default function StepSession({ qrModel }: StepSessionProps) {
  const { config, setConfig } = qrModel;
  return (
    <div className="qr-step-content">
      <div className="field">
        <label>Mode</label>
        <div className="segmented segmented-pill">
          {(['wifi', 'nearby'] as Mode[]).map((m) => (
            <button
              type="button"
              key={m}
              className={config.mode === m ? 'active' : ''}
              onClick={() => setConfig({ ...config, mode: m })}
            >
              {m === 'wifi' ? 'Wi-Fi' : 'Nearby'}
            </button>
          ))}
        </div>
        <small className="muted">{config.mode === 'wifi' ? 'Same Wi-Fi required.' : 'Bluetooth required.'}</small>
      </div>
      <div className="field">
        <label>Room label</label>
        <input
          type="text"
          value={config.roomLabel}
          onChange={(e) => setConfig({ ...config, roomLabel: e.target.value })}
          placeholder="Room 12A"
        />
      </div>
    </div>
  );
}
