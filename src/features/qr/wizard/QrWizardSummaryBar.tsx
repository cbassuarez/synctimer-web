import React from 'react';
import { QrModel } from './QrWizardPage';

export default function QrWizardSummaryBar({
  qrModel,
  onJumpToStep,
}: {
  qrModel: QrModel;
  onJumpToStep: (step: number) => void;
}) {
  const isReady = qrModel.derived.validation.valid && qrModel.state.config.hosts.length > 0;
  const roomLabel = qrModel.state.config.roomLabel.trim() || 'No room label';

  return (
    <div className="qr-summary">
      <div className="qr-summary__items">
        <button className="qr-summary__item" onClick={() => onJumpToStep(1)}>
          <span className="qr-summary__label">Mode</span>
          <strong>{qrModel.state.config.mode === 'wifi' ? 'Wi-Fi' : 'Nearby'}</strong>
        </button>
        <button className="qr-summary__item" onClick={() => onJumpToStep(1)}>
          <span className="qr-summary__label">Room</span>
          <strong>{roomLabel}</strong>
        </button>
        <button className="qr-summary__item" onClick={() => onJumpToStep(2)}>
          <span className="qr-summary__label">Hosts</span>
          <strong>{qrModel.state.config.hosts.length}</strong>
        </button>
      </div>
      <span className={`qr-summary__chip ${isReady ? 'is-ready' : 'is-not-ready'}`}>
        {isReady ? 'Ready' : 'Not ready'}
      </span>
    </div>
  );
}

