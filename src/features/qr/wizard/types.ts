import React from 'react';
import { BrandingOptions } from '../qr';
import { GeneratorConfig, HostEntry, ValidationResult } from '../model';

export interface QrModel {
  config: GeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneratorConfig>>;
  hostInput: string;
  setHostInput: (value: string) => void;
  manualUuid: string;
  setManualUuid: (value: string) => void;
  manualDevice: string;
  setManualDevice: (value: string) => void;
  svgMarkup: string;
  validation: ValidationResult;
  joinUrl: string;
  deviceNames: string[];
  transportHintNote: string | null;
  copyMessage: string;
  branding: BrandingOptions;
  actions: {
    handleParse: () => void;
    handleManualAdd: () => void;
    updateHost: (idx: number, patch: Partial<HostEntry>) => void;
    removeHost: (idx: number) => void;
    moveHost: (idx: number, delta: number) => void;
    handleCopy: (text: string) => Promise<void>;
    handleCopyGeneratorLink: () => Promise<void>;
    handlePrint: () => void;
  };
}
