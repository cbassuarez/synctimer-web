import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function QrWizardStepper({
  steps,
  activeStep,
  onStepChange,
}: {
  steps: { title: string; summary: string; content: React.ReactNode }[];
  activeStep: number;
  onStepChange: (step: number) => void;
}) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion
    ? { duration: 0.15 }
    : {
        type: 'spring',
        stiffness: 280,
        damping: 28,
      };

  return (
    <div className="qr-stepper">
      <div className="qr-stepper__nav">
        {steps.map((step, idx) => (
          <button
            key={step.title}
            className={`qr-stepper__nav-item ${idx === activeStep ? 'is-active' : ''}`}
            onClick={() => onStepChange(idx)}
          >
            <span className="qr-stepper__index">{idx + 1}</span>
            <span>
              <strong>{step.title}</strong>
              <span className="qr-stepper__summary">{step.summary}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="qr-stepper__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
          >
            {steps[activeStep]?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="qr-stepper__controls">
        <button onClick={() => onStepChange(activeStep - 1)} disabled={activeStep === 0}>
          Back
        </button>
        <button
          className="primary"
          onClick={() => onStepChange(Math.min(activeStep + 1, steps.length - 1))}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === 0 ? 'Continue' : 'Next'}
        </button>
      </div>
    </div>
  );
}

