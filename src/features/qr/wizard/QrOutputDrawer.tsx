import React, { useState } from 'react';
import { QrExportActions, QrJoinUrlBlock, QrPreview } from './QrOutputMonitor';
import { QrModel } from './types';

interface QrOutputDrawerProps {
  qrModel: QrModel;
}

const tabs = ['QR', 'URL', 'Export'] as const;

type Tab = (typeof tabs)[number];

export default function QrOutputDrawer({ qrModel }: QrOutputDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('QR');

  return (
    <div className="qr-output-drawer">
      <div className="qr-drawer-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="qr-drawer-content">
        {activeTab === 'QR' && <QrPreview qrModel={qrModel} />}
        {activeTab === 'URL' && <QrJoinUrlBlock qrModel={qrModel} />}
        {activeTab === 'Export' && <QrExportActions qrModel={qrModel} />}
      </div>
    </div>
  );
}
