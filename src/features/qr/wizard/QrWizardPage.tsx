import React, { useMemo, useState } from 'react';
import QrOutputDrawer from './QrOutputDrawer';
import QrOutputMonitor from './QrOutputMonitor';
import QrWizardStepper from './QrWizardStepper';
import QrWizardSummaryBar from './QrWizardSummaryBar';
import StepCompatibility from './steps/StepCompatibility';
import StepDeploy from './steps/StepDeploy';
import StepHosts from './steps/StepHosts';
import StepPaste from './steps/StepPaste';
import StepSession from './steps/StepSession';
import { QrModel } from './types';

interface QrWizardPageProps {
  qrModel: QrModel;
}

export default function QrWizardPage({ qrModel }: QrWizardPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [showManualHostEditor, setShowManualHostEditor] = useState(false);

  const steps = useMemo(
    () => [
      {
        title: 'Paste host links',
        content: (
          <StepPaste
            qrModel={qrModel}
            onShowManual={() => setShowManualHostEditor(true)}
          />
        ),
        nextLabel: 'Continue',
        onNext: () => qrModel.actions.handleParse(),
      },
      {
        title: 'Session',
        content: <StepSession qrModel={qrModel} />,
      },
      {
        title: 'Hosts',
        content: <StepHosts qrModel={qrModel} showManualHostEditor={showManualHostEditor} />,
      },
      {
        title: 'Compatibility',
        content: <StepCompatibility qrModel={qrModel} />,
      },
      {
        title: 'Deploy',
        content: <StepDeploy qrModel={qrModel} />,
      },
    ],
    [qrModel, showManualHostEditor],
  );

  return (
    <div className="qr-wizard">
      <div className="qr-wizard-shell">
        <section className="qr-wizard-rail">
          <QrWizardSummaryBar qrModel={qrModel} onJump={setActiveStep} />
          <QrWizardStepper steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
          <details className="qr-expert">
            <summary>What the QR encodes</summary>
            <p>
              The QR includes your mode choice (Wi-Fi or Nearby), a list of the host identities to join, and any
              compatibility gates you enable so older builds can be blocked or warned.
            </p>
          </details>
        </section>
        <aside className="qr-output-rail">
          <QrOutputMonitor qrModel={qrModel} />
        </aside>
      </div>
      <QrOutputDrawer qrModel={qrModel} />
    </div>
  );
}
