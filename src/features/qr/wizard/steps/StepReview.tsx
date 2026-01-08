import React from 'react';
import { QrModel } from '../QrWizardPage';

export default function StepReview({ qrModel }: { qrModel: QrModel }) {
  const roomLabel = qrModel.state.config.roomLabel.trim() || 'No room label';
  const minBuild = qrModel.state.config.minBuild?.trim();
  const minVersion = qrModel.state.config.minVersion?.trim();

  return (
    <div className="qr-step">
      <h2>Review</h2>
      <p className="muted">Confirm the configuration before deploying the QR.</p>

      <div className="qr-review">
        <div className="qr-review__block">
          <h3>Session</h3>
          <ul>
            <li>
              <span>Mode</span>
              <strong>{qrModel.state.config.mode === 'wifi' ? 'Wi-Fi' : 'Nearby'}</strong>
            </li>
            <li>
              <span>Room label</span>
              <strong>{roomLabel}</strong>
            </li>
            <li>
              <span>Minimum build</span>
              <strong>{minBuild || 'None'}</strong>
            </li>
            <li>
              <span>Minimum version</span>
              <strong>{minVersion || 'None'}</strong>
            </li>
          </ul>
        </div>

        <div className="qr-review__block">
          <h3>Hosts</h3>
          {qrModel.state.config.hosts.length === 0 ? (
            <p className="note">No hosts added yet.</p>
          ) : (
            <ul>
              {qrModel.state.config.hosts.map((host, idx) => (
                <li key={host.uuid}>
                  <span>{qrModel.derived.deviceNames[idx]}</span>
                  <strong>{host.uuid}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="qr-review__block">
        <h3>Join URL</h3>
        <div className="qr-output__url" data-testid="qr-join-url">
          {qrModel.derived.joinUrl}
        </div>
        <div className="row">
          <button type="button" onClick={() => qrModel.actions.handleCopy(qrModel.derived.joinUrl)}>
            Copy link
          </button>
        </div>
        {qrModel.state.copyMessage && <p className="field-help">{qrModel.state.copyMessage}</p>}
      </div>
    </div>
  );
}
