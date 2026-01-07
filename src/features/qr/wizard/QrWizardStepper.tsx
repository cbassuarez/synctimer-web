import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface StepDefinition {
  title: string;
  content: React.ReactNode;
  nextLabel?: string;
  onNext?: () => void;
}

interface QrWizardStepperProps {
  steps: StepDefinition[];
  activeStep: number;
  onStepChange: (step: number) => void;
}

export default function QrWizardStepper({ steps, activeStep, onStepChange }: QrWizardStepperProps) {
  const reduceMotion = useReducedMotion();
  const step = steps[activeStep];
  const handleNext = () => {
    step.onNext?.();
    if (activeStep < steps.length - 1) {
      onStepChange(activeStep + 1);
    }
  };

  return (
    <div className="qr-stepper">
      <div className="qr-stepper-header">
        <span className="step-count">Step {activeStep + 1} of {steps.length}</span>
        <h2>{step.title}</h2>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          className="qr-step"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', duration: 0.18, bounce: 0.2 }}
        >
          {step.content}
        </motion.div>
      </AnimatePresence>
      <div className="qr-stepper-nav">
        <button type="button" onClick={() => onStepChange(activeStep - 1)} disabled={activeStep === 0}>
          Back
        </button>
        <button type="button" className="primary" onClick={handleNext} disabled={activeStep === steps.length - 1}>
          {step.nextLabel ?? 'Next'}
        </button>
      </div>
    </div>
  );
}
