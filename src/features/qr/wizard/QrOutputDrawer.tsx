import React, { useState } from 'react';
import { QrModel } from './QrWizardPage';
import { QrExportActions, QrJoinUrlBlock, QrPreviewBlock } from './QrOutputMonitor';

const tabs = ['QR', 'URL', 'Export'] as const;

type Tab = (typeof tabs)[number];

export default function QrOutputDrawer({ qrModel }: { qrModel: QrModel }) {
  const [activeTab, setActiveTab] = useState<Tab>('QR');

  return (
    <div className="qr-drawer">
      <div className="qr-drawer__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`qr-drawer__tab ${activeTab === tab ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="qr-drawer__content">
        {activeTab === 'QR' && <QrPreviewBlock qrModel={qrModel} />}
        {activeTab === 'URL' && <QrJoinUrlBlock qrModel={qrModel} />}
        {activeTab === 'Export' && <QrExportActions qrModel={qrModel} />}
      </div>
    </div>
  );
}

