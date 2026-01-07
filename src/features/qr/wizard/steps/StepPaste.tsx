import React, { useMemo } from 'react';
import { parseAnyInput } from '../../parse';
import { QrModel } from '../types';

interface StepPasteProps {
  qrModel: QrModel;
  onShowManual: () => void;
}

export default function StepPaste({ qrModel, onShowManual }: StepPasteProps) {
  const { hostInput, setHostInput, transportHintNote } = qrModel;
  const parsed = useMemo(() => (hostInput.trim() ? parseAnyInput(hostInput.trim()) : { hosts: [], join: undefined }), [hostInput]);
  const hosts = parsed.join?.config.hosts?.length ? parsed.join.config.hosts : parsed.hosts;

  return (
    <div className="qr-step-content">
      <div className="field">
        <label htmlFor="host-input">Paste Host Share Link(s)</label>
        <textarea
          id="host-input"
          rows={4}
          value={hostInput}
          onChange={(e) => setHostInput(e.target.value)}
          placeholder="Paste host share links or a join link"
        />
        {transportHintNote && <small className="field-error">{transportHintNote}</small>}
      </div>
      {hosts.length > 0 && (
        <div className="qr-host-chips">
          {hosts.map((host, idx) => (
            <span className="qr-host-chip" key={`${host.uuid}-${idx}`}>
              <span className="chip-name">{host.deviceName?.trim() ? host.deviceName : `Host ${idx + 1}`}</span>
              <span className="chip-suffix">••{host.uuid.slice(-4)}</span>
            </span>
          ))}
        </div>
      )}
      <div className="qr-step-actions">
        <button type="button" className="secondary" onClick={onShowManual}>
          Enter manually
        </button>
      </div>
    </div>
  );
}
