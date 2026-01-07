import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import QrOutputDrawer from './QrOutputDrawer';
import QrOutputMonitor from './QrOutputMonitor';
import QrWizardStepper from './QrWizardStepper';
import QrWizardSummaryBar from './QrWizardSummaryBar';
import StepCompatibility from './steps/StepCompatibility';
import StepDeploy from './steps/StepDeploy';
import StepHosts from './steps/StepHosts';
import StepPaste from './steps/StepPaste';
import StepSession from './steps/StepSession';
import { HostEntry } from '../../qr/model';

export type QrModel = {
  state: {
    config: {
      mode: 'wifi' | 'nearby';
      roomLabel: string;
      hosts: HostEntry[];
      minBuild?: string;
      minVersion?: string;
      displayMode: boolean;
      printMode: boolean;
    };
    hostInput: string;
    manualUuid: string;
    manualDevice: string;
    copyMessage: string;
    transportHintNote: string | null;
  };
  setters: {
    setConfig: React.Dispatch<React.SetStateAction<QrModel['state']['config']>>;
    setHostInput: (value: string) => void;
    setManualUuid: (value: string) => void;
    setManualDevice: (value: string) => void;
  };
  derived: {
    joinUrl: string;
    deviceNames: string[];
    svgMarkup: string;
    validation: {
      valid: boolean;
      errors: string[];
      checklist: { label: string; ok: boolean }[];
    };
    branding: {
      enabled: boolean;
      corner: string;
      sizePct: number;
      patchPaddingPct: number;
      printSafe: boolean;
    };
  };
  actions: {
    addHosts: (newHosts: HostEntry[]) => void;
    parseHostInput: (value: string) => void;
    handleManualAdd: () => void;
    updateHost: (idx: number, patch: Partial<HostEntry>) => void;
    removeHost: (idx: number) => void;
    moveHost: (idx: number, delta: number) => void;
    handleCopy: (text: string) => Promise<void>;
    handleCopyGeneratorLink: () => Promise<void>;
    handleDisplayMode: () => void;
    handlePrintLabel: () => void;
    downloadSvg: (filename: string, svgMarkup: string) => void;
    downloadPng: (joinUrl: string, filename: string, size: number, branding: QrModel['derived']['branding']) => void;
  };
};

export default function QrWizardPage({
  qrModel,
  activeStep,
  onStepChange,
  showManualHostEditor,
  onShowManualHostEditor,
}: {
  qrModel: QrModel;
  activeStep: number;
  onStepChange: (step: number) => void;
  showManualHostEditor: boolean;
  onShowManualHostEditor: (value: boolean) => void;
}) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion
    ? { duration: 0.15 }
    : {
        type: 'spring',
        stiffness: 260,
        damping: 28,
      };

  const steps = [
    {
      title: 'Paste links',
      summary: 'Paste host share links',
      content: (
        <StepPaste
          qrModel={qrModel}
          onContinue={() => onStepChange(1)}
          showManualHostEditor={showManualHostEditor}
          onShowManualHostEditor={onShowManualHostEditor}
        />
      ),
    },
    {
      title: 'Session',
      summary: 'Choose mode + room',
      content: <StepSession qrModel={qrModel} />,
    },
    {
      title: 'Hosts',
      summary: 'Edit the host list',
      content: (
        <StepHosts
          qrModel={qrModel}
          showManualHostEditor={showManualHostEditor}
          onShowManualHostEditor={onShowManualHostEditor}
        />
      ),
    },
    {
      title: 'Compatibility',
      summary: 'Optional requirements',
      content: <StepCompatibility qrModel={qrModel} />,
    },
    {
      title: 'Deploy',
      summary: 'Publish the QR',
      content: <StepDeploy qrModel={qrModel} />,
    },
  ];

  return (
    <div className="qr-wizard">
      <header className="qr-wizard__header">
        <div>
          <h1>QR setup</h1>
          <p>Generate a QR that launches SyncTimer with the right session context.</p>
        </div>
      </header>

      <div className="qr-wizard__layout">
        <section className="qr-wizard__rail qr-wizard__rail--left">
          <QrWizardSummaryBar qrModel={qrModel} onJumpToStep={onStepChange} />
          <QrWizardStepper steps={steps} activeStep={activeStep} onStepChange={onStepChange} />
          <details className="qr-wizard__details">
            <summary>What the QR encodes</summary>
            <p>
              The QR stores the session transport choice, the list of host identities to connect to, and optional
              compatibility gates. Picking Wi-Fi or Nearby changes the connectivity requirement for the joiner.
            </p>
          </details>
        </section>

        <section className="qr-wizard__rail qr-wizard__rail--right">
          <AnimatePresence mode="wait">
            <motion.div key={activeStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={transition}>
              <QrOutputMonitor qrModel={qrModel} />
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <QrOutputDrawer qrModel={qrModel} />

      {qrModel.state.config.printMode && qrModel.derived.validation.valid && (
        <div className="print-area" id="print-area">
          <div className="label">
            <p className="room">{qrModel.state.config.roomLabel || 'SyncTimer room'}</p>
            <p className="subtitle">Scan to join SyncTimer</p>
            <div className="qr" dangerouslySetInnerHTML={{ __html: qrModel.derived.svgMarkup }} />
          </div>
          <div className="row">
            <button onClick={() => window.print()}>Print</button>
          </div>
        </div>
      )}
    </div>
  );
}

