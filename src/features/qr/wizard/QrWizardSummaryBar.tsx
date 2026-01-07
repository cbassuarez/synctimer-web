import React from 'react';
import { QrModel } from './types';

interface QrWizardSummaryBarProps {
  qrModel: QrModel;
  onJump: (step: number) => void;
}

export default function QrWizardSummaryBar({ qrModel, onJump }: QrWizardSummaryBarProps) {
  const { config, validation } = qrModel;
  return (
    <div className="qr-summary-bar">
      <button type="button" className="summary-item" onClick={() => onJump(1)}>
        <span className="summary-label">Mode</span>
        <span>{config.mode === 'wifi' ? 'Wi-Fi' : 'Nearby'}</span>
      </button>
      <button type="button" className="summary-item" onClick={() => onJump(1)}>
        <span className="summary-label">Room</span>
        <span>{config.roomLabel ? config.roomLabel : 'No label'}</span>
      </button>
      <button type="button" className="summary-item" onClick={() => onJump(2)}>
        <span className="summary-label">Hosts</span>
        <span>{config.hosts.length}</span>
      </button>
      <button type="button" className="summary-item" onClick={() => onJump(4)}>
        <span className="summary-label">Status</span>
        <span className={`status-chip ${validation.valid ? 'ready' : 'not-ready'}`}>
          {validation.valid ? 'Ready' : 'Not ready'}
        </span>
      </button>
    </div>
  );
}
