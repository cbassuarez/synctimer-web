import React, { useEffect, useState } from 'react';
import { QrModel } from '../QrWizardPage';

export default function StepRoomOptions({ qrModel }: { qrModel: QrModel }) {
  const [showMinBuild, setShowMinBuild] = useState(Boolean(qrModel.state.config.minBuild));
  const [showMinVersion, setShowMinVersion] = useState(Boolean(qrModel.state.config.minVersion));

  useEffect(() => {
    if (qrModel.state.config.minBuild) {
      setShowMinBuild(true);
    }
  }, [qrModel.state.config.minBuild]);

  useEffect(() => {
    if (qrModel.state.config.minVersion) {
      setShowMinVersion(true);
    }
  }, [qrModel.state.config.minVersion]);

  const hasMinBuildError = qrModel.derived.validation.errors.includes('min_build must be a positive integer.');
  const hasMinVersionError = qrModel.derived.validation.errors.includes('min_version must look like x.y or x.y.z.');

  return (
    <div className="qr-step">
      <h2>Room label + options</h2>
      <p className="muted">Name the room and set optional compatibility gates.</p>

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

      {qrModel.state.config.mode === 'wifi' && (
        <p className="field-help">Transport hint is set to Bonjour for Wi-Fi mode.</p>
      )}

      <details className="qr-accordion">
        <summary>Advanced</summary>
        <div className="qr-accordion__content">
          <label className="qr-toggle">
            <input
              type="checkbox"
              checked={showMinBuild}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowMinBuild(checked);
                if (!checked) {
                  qrModel.setters.setConfig({ ...qrModel.state.config, minBuild: '' });
                }
              }}
            />
            Require minimum build
          </label>
          {showMinBuild && (
            <div className={`field ${hasMinBuildError ? 'is-invalid' : ''}`}>
              <label>Minimum build</label>
              <input
                type="number"
                min={1}
                value={qrModel.state.config.minBuild || ''}
                onChange={(e) => qrModel.setters.setConfig({ ...qrModel.state.config, minBuild: e.target.value })}
                placeholder="e.g. 1200"
              />
              {hasMinBuildError && <p className="field-help error">Enter a positive integer.</p>}
            </div>
          )}

          <label className="qr-toggle">
            <input
              type="checkbox"
              checked={showMinVersion}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowMinVersion(checked);
                if (!checked) {
                  qrModel.setters.setConfig({ ...qrModel.state.config, minVersion: '' });
                }
              }}
            />
            Version note
          </label>
          {showMinVersion && (
            <div className={`field ${hasMinVersionError ? 'is-invalid' : ''}`}>
              <label>Minimum version</label>
              <input
                type="text"
                value={qrModel.state.config.minVersion || ''}
                onChange={(e) => qrModel.setters.setConfig({ ...qrModel.state.config, minVersion: e.target.value })}
                placeholder="e.g. 1.2.3"
              />
              {hasMinVersionError && <p className="field-help error">Use x.y or x.y.z.</p>}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
