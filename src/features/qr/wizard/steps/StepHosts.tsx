import React, { useEffect, useState } from 'react';
import { QrModel } from '../types';

interface StepHostsProps {
  qrModel: QrModel;
  showManualHostEditor: boolean;
}

export default function StepHosts({ qrModel, showManualHostEditor }: StepHostsProps) {
  const { config, deviceNames, manualDevice, manualUuid, setManualDevice, setManualUuid, transportHintNote } = qrModel;
  const { updateHost, removeHost, moveHost, handleManualAdd } = qrModel.actions;
  const [showAdvanced, setShowAdvanced] = useState(showManualHostEditor);

  useEffect(() => {
    if (showManualHostEditor) {
      setShowAdvanced(true);
    }
  }, [showManualHostEditor]);

  return (
    <div className="qr-step-content">
      <HostList hosts={config.hosts} deviceNames={deviceNames} onChange={updateHost} onRemove={removeHost} onMove={moveHost} />
      <div className="field note-inline">
        <small className="muted">Join picker order.</small>
      </div>
      <div className="manual">
        <button type="button" className="link" onClick={() => setShowAdvanced((prev) => !prev)}>
          {showAdvanced ? 'Hide advanced' : 'Advanced'}
        </button>
        {showAdvanced && (
          <div className="manual-stack">
            <div className="manual-grid">
              <div className="field">
                <label>Host UUID</label>
                <input
                  type="text"
                  value={manualUuid}
                  onChange={(e) => setManualUuid(e.target.value)}
                  placeholder="123e4567-e89b-12d3-a456-426614174000"
                />
              </div>
              <div className="field">
                <label>Device name (optional)</label>
                <input
                  type="text"
                  value={manualDevice}
                  onChange={(e) => setManualDevice(e.target.value)}
                  placeholder="iPad Pro"
                />
              </div>
            </div>
            <button onClick={handleManualAdd} className="secondary">
              Add host
            </button>
            {transportHintNote && <small className="field-error">{transportHintNote}</small>}
          </div>
        )}
      </div>
    </div>
  );
}

function HostList({
  hosts,
  deviceNames,
  onChange,
  onRemove,
  onMove,
}: {
  hosts: QrModel['config']['hosts'];
  deviceNames: string[];
  onChange: (idx: number, patch: { deviceName?: string }) => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, delta: number) => void;
}) {
  if (!hosts.length) return <div className="note">No hosts added yet.</div>;
  return (
    <div className="host-list">
      {hosts.map((host, idx) => (
        <div key={host.uuid} className="host-row">
          <div className="field">
            <label>Device name</label>
            <input
              type="text"
              value={host.deviceName ?? ''}
              onChange={(e) => onChange(idx, { deviceName: e.target.value })}
              placeholder={deviceNames[idx]}
            />
          </div>
          <div className="field">
            <label>UUID</label>
            <input type="text" value={host.uuid} readOnly />
          </div>
          <div className="row compact">
            <button onClick={() => onMove(idx, -1)} disabled={idx === 0}>
              ↑
            </button>
            <button onClick={() => onMove(idx, 1)} disabled={idx === hosts.length - 1}>
              ↓
            </button>
            <button onClick={() => onRemove(idx)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
