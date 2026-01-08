import React, { useState } from 'react';
import { HostEntry } from '../../../qr/model';
import { QrModel } from '../QrWizardPage';

export default function StepHosts({
  qrModel,
  showManualHostEditor,
  onShowManualHostEditor,
}: {
  qrModel: QrModel;
  showManualHostEditor: boolean;
  onShowManualHostEditor: (value: boolean) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="qr-step">
      <h2>Hosts</h2>
      <p className="muted">Review the host list and add or edit entries as needed.</p>

      <div className="row">
        <button
          type="button"
          className="secondary"
          data-testid="hosts-add"
          onClick={() => qrModel.actions.addHosts([{ uuid: '', deviceName: '' }])}
        >
          Add host
        </button>
      </div>

      <HostList
        hosts={qrModel.state.config.hosts}
        deviceNames={qrModel.derived.deviceNames}
        onChange={qrModel.actions.updateHost}
        onRemove={qrModel.actions.removeHost}
        onMove={qrModel.actions.moveHost}
      />

      <p className="field-help">Join picker order.</p>

      <div className="qr-advanced">
        <div className="row">
          <button type="button" className="secondary" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? 'Hide advanced' : 'Advanced'}
          </button>
          <button
            type="button"
            className="link"
            onClick={() => onShowManualHostEditor(!showManualHostEditor)}
          >
            {showManualHostEditor ? 'Hide manual entry' : 'Enter manually'}
          </button>
        </div>

        {(showManualHostEditor || showAdvanced) && (
          <div className="qr-advanced__panel">
            <div className="field">
              <label>Host UUID</label>
              <input
                type="text"
                value={qrModel.state.manualUuid}
                onChange={(e) => qrModel.setters.setManualUuid(e.target.value)}
                placeholder="123e4567-e89b-12d3-a456-426614174000"
              />
            </div>
            <div className="field">
              <label>Device name (optional)</label>
              <input
                type="text"
                value={qrModel.state.manualDevice}
                onChange={(e) => qrModel.setters.setManualDevice(e.target.value)}
                placeholder="iPad Pro"
              />
            </div>
            <button type="button" onClick={qrModel.actions.handleManualAdd} className="secondary">
              Add host
            </button>
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
  hosts: HostEntry[];
  deviceNames: string[];
  onChange: (idx: number, patch: Partial<HostEntry>) => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, delta: number) => void;
}) {
  if (!hosts.length) return <div className="note">No hosts added yet.</div>;
  return (
    <div className="host-list">
      {hosts.map((host, idx) => (
        <div key={`host-${idx}`} className="host-row">
          <div className="field">
            <label>Host name</label>
            <input
              type="text"
              value={host.deviceName ?? ''}
              onChange={(e) => onChange(idx, { deviceName: e.target.value })}
              placeholder={deviceNames[idx]}
              data-testid={idx === 0 ? 'host-name-0' : undefined}
            />
          </div>
          <div className="field">
            <label>UUID</label>
            <input
              type="text"
              value={host.uuid}
              onChange={(e) => onChange(idx, { uuid: e.target.value })}
              data-testid={idx === 0 ? 'host-uuid-0' : undefined}
            />
          </div>
          <div className="row compact">
            <button type="button" onClick={() => onMove(idx, -1)} disabled={idx === 0}>
              ↑
            </button>
            <button type="button" onClick={() => onMove(idx, 1)} disabled={idx === hosts.length - 1}>
              ↓
            </button>
            <button type="button" onClick={() => onRemove(idx)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
