import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import QrOutputMonitor from './QrOutputMonitor';
import StepHosts from './steps/StepHosts';
import StepMode from './steps/StepMode';
import StepReview from './steps/StepReview';
import StepRoomOptions from './steps/StepRoomOptions';
import { HostEntry, uuidRegex } from '../../qr/model';
import type { BrandingCorner } from '../qr';

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
      corner: BrandingCorner;
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
}: {
  qrModel: QrModel;
}) {
  const [showManualHostEditor, setShowManualHostEditor] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const onAfterPrint = () => {
      qrModel.setters.setConfig((prev) => ({ ...prev, printMode: false }));
    };
    window.addEventListener('afterprint', onAfterPrint);
    return () => window.removeEventListener('afterprint', onAfterPrint);
  }, [qrModel.setters]);

  const reducedMotion = useReducedMotion();
  const transition = reducedMotion
    ? { duration: 0.15 }
    : {
        type: 'spring',
        stiffness: 260,
        damping: 28,
      };

  const steps = [
    { title: 'Connection', label: 'Mode' },
    { title: 'Hosts', label: 'Hosts' },
    { title: 'Room', label: 'Room + options' },
    { title: 'Review', label: 'Review' },
    { title: 'Deploy', label: 'Deploy' },
  ];

  const hostUuidsOk = qrModel.state.config.hosts.every((host) => uuidRegex.test(host.uuid));
  const hostsReady = qrModel.state.config.hosts.length > 0 && hostUuidsOk;
  const minBuildError = qrModel.derived.validation.errors.includes('min_build must be a positive integer.');
  const minVersionError = qrModel.derived.validation.errors.includes('min_version must look like x.y or x.y.z.');
  const roomOptionsReady = !minBuildError && !minVersionError;
  const reviewReady = qrModel.derived.validation.valid;

  const canAdvance = useMemo(() => {
    switch (activeStep) {
      case 0:
        return qrModel.state.config.mode === 'wifi' || qrModel.state.config.mode === 'nearby';
      case 1:
        return hostsReady;
      case 2:
        return roomOptionsReady;
      case 3:
        return reviewReady;
      default:
        return false;
    }
  }, [activeStep, hostsReady, roomOptionsReady, reviewReady, qrModel.state.config.mode]);

  const primaryLabel = useMemo(() => {
    if (activeStep === steps.length - 1) return 'Generate another';
    if (activeStep === steps.length - 2) return 'Deploy';
    return activeStep === 0 ? 'Continue' : 'Next';
  }, [activeStep, steps.length]);

  const handleNext = useCallback(() => {
    if (activeStep === steps.length - 1) {
      setActiveStep(0);
      return;
    }
    if (!canAdvance) return;
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [activeStep, canAdvance, steps.length]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTextArea = target instanceof HTMLTextAreaElement;
      const isContentEditable = Boolean(target?.isContentEditable);
      if (event.key === 'Enter' && !isTextArea && !isContentEditable) {
        event.preventDefault();
        handleNext();
      }
      if (event.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleBack, handleNext]);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepMode qrModel={qrModel} />;
      case 1:
        return (
          <StepHosts
            qrModel={qrModel}
            showManualHostEditor={showManualHostEditor}
            onShowManualHostEditor={setShowManualHostEditor}
          />
        );
      case 2:
        return <StepRoomOptions qrModel={qrModel} />;
      case 3:
        return <StepReview qrModel={qrModel} />;
      case 4:
        return <QrOutputMonitor qrModel={qrModel} />;
      default:
        return null;
    }
  };

  // Manual test checklist:
  // 1) Step through Mode → Hosts → Room → Review → Deploy and confirm only one step body shows at a time.
  // 2) Verify the Deploy step shows the Output Monitor QR and no other QR is visible on earlier steps.
  // 3) Confirm Next/Back buttons and Enter/Escape navigation work without affecting textarea input.
  // 4) Ensure the join URL in Review matches expectations and copy/download actions still work.

  return (
    <div className="qr-wizard">
      <header className="qr-wizard__top">
        <div className="qr-wizard__chrome">
          <div className="qr-wizard__brand">
            <span className="qr-wizard__brand-mark">SyncTimer</span>
            <span className="qr-wizard__title">Join QR</span>
          </div>
          <a className="qr-wizard__help" href="/support">
            Help
          </a>
        </div>

        <div className="qr-wizard__rail">
          {activeStep > 0 && (
            <button type="button" className="qr-wizard__back" onClick={handleBack}>
              Back
            </button>
          )}
          <div className="qr-steps" role="list">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              const canJump = idx <= activeStep;
              return (
                <button
                  key={step.title}
                  type="button"
                  className={`qr-steps__node ${isActive ? 'is-active' : ''} ${canJump ? 'is-ready' : ''}`}
                  onClick={() => canJump && setActiveStep(idx)}
                  disabled={!canJump}
                >
                  <span className="qr-steps__index">{idx + 1}</span>
                  <span className="qr-steps__label">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="qr-wizard__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            className="qr-wizard__screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="qr-wizard__nav">
        <button
          type="button"
          className="secondary"
          data-testid="wizard-back"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </button>
        <button
          type="button"
          className="primary"
          data-testid="wizard-next"
          onClick={handleNext}
          disabled={activeStep < 4 && !canAdvance}
        >
          {primaryLabel}
        </button>
      </div>

      {activeStep === 4 && qrModel.state.config.printMode && qrModel.derived.validation.valid && (
        <div className="print-area" id="print-area">
          <div className="label">
            <p className="room">{qrModel.state.config.roomLabel || 'SyncTimer room'}</p>
            <p className="subtitle">Scan to join SyncTimer</p>
            <div className="qr" dangerouslySetInnerHTML={{ __html: qrModel.derived.svgMarkup }} />
          </div>
        </div>
      )}
    </div>
  );
}
