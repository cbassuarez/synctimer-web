import React, { useEffect, useState } from 'react';
import { QrModel } from '../types';

interface StepCompatibilityProps {
  qrModel: QrModel;
}

export default function StepCompatibility({ qrModel }: StepCompatibilityProps) {
  const { config, setConfig, validation } = qrModel;
  const [open, setOpen] = useState(false);
  const [minBuildEnabled, setMinBuildEnabled] = useState(Boolean(config.minBuild));
  const [minVersionEnabled, setMinVersionEnabled] = useState(Boolean(config.minVersion));

  useEffect(() => setMinBuildEnabled(Boolean(config.minBuild)), [config.minBuild]);
  useEffect(() => setMinVersionEnabled(Boolean(config.minVersion)), [config.minVersion]);

  const minBuildInvalid = minBuildEnabled && Boolean(config.minBuild) && !validation.checklist.find((item) => item.label.includes('Minimum build'))?.ok;
  const minVersionInvalid =
    minVersionEnabled && Boolean(config.minVersion) && !validation.checklist.find((item) => item.label.includes('Minimum version'))?.ok;

  return (
    <div className="qr-step-content">
      <button type="button" className="accordion" onClick={() => setOpen((prev) => !prev)}>
        <span>Advanced</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="accordion-body">
          <div className="field toggle">
            <label htmlFor="min-build-toggle">Require minimum build</label>
            <input
              id="min-build-toggle"
              type="checkbox"
              checked={minBuildEnabled}
              onChange={(e) => {
                const next = e.target.checked;
                setMinBuildEnabled(next);
                setConfig({ ...config, minBuild: next ? config.minBuild || '' : '' });
              }}
            />
          </div>
          {minBuildEnabled && (
            <div className={`field ${minBuildInvalid ? 'invalid' : ''}`}>
              <label>Minimum build</label>
              <input
                type="number"
                min={1}
                value={config.minBuild || ''}
                onChange={(e) => setConfig({ ...config, minBuild: e.target.value })}
                placeholder="e.g. 1200"
              />
              {minBuildInvalid && <small className="field-error">Enter a positive integer.</small>}
            </div>
          )}
          <div className="field toggle">
            <label htmlFor="min-version-toggle">Version note</label>
            <input
              id="min-version-toggle"
              type="checkbox"
              checked={minVersionEnabled}
              onChange={(e) => {
                const next = e.target.checked;
                setMinVersionEnabled(next);
                setConfig({ ...config, minVersion: next ? config.minVersion || '' : '' });
              }}
            />
          </div>
          {minVersionEnabled && (
            <div className={`field ${minVersionInvalid ? 'invalid' : ''}`}>
              <label>Minimum version</label>
              <input
                type="text"
                value={config.minVersion || ''}
                onChange={(e) => setConfig({ ...config, minVersion: e.target.value })}
                placeholder="e.g. 1.2.3"
              />
              {minVersionInvalid && <small className="field-error">Use x.y or x.y.z.</small>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
