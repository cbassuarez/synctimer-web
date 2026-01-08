import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page';
import { buildJoinUrl } from '../features/qr/buildJoinUrl';
import { BrandingOptions, downloadPng, downloadSvg, generateSvgMarkup } from '../features/qr/qr';
import {
  GeneratorConfig,
  HostEntry,
  ValidationResult,
  defaultConfig,
  normalizeDeviceNames,
  uuidRegex,
  validateConfig,
} from '../features/qr/model';
import { importFromPastedText } from '../features/qr/parse';
import { copyText } from '../features/qr/ui';
import { decodeState, encodeState, loadPersistedConfig, persistConfig } from '../features/qr/storage';
import QrWizardPage, { QrModel } from '../features/qr/wizard/QrWizardPage';

function usePersistentConfig(): [GeneratorConfig, React.Dispatch<React.SetStateAction<GeneratorConfig>>] {
  const [config, setConfig] = useState<GeneratorConfig>(() => {
    const fromHash = decodeState(window.location.hash);
    if (fromHash) return fromHash;
    try {
      return loadPersistedConfig();
    } catch (err) {
      return { ...defaultConfig };
    }
  });

  useEffect(() => {
    persistConfig(config);
    const encoded = encodeState(config);
    const newHash = `#${encoded}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [config]);

  return [config, setConfig];
}

function useQrModel(): QrModel {
  const [config, setConfig] = usePersistentConfig();
  const [hostInput, setHostInput] = useState('');
  const [manualUuid, setManualUuid] = useState('');
  const [manualDevice, setManualDevice] = useState('');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [validation, setValidation] = useState<ValidationResult>(validateConfig(config));
  const [transportHintNote, setTransportHintNote] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
    const hydratedFromUrlRef = useRef(
        window.location.href.includes('prefill=') || window.location.href.includes('#state=')
      );
      const [lastImportNonce, setLastImportNonce] = useState(0);
  const [branding] = useState<BrandingOptions>({
    enabled: true,
    corner: 'center',
    sizePct: 0.24,
    patchPaddingPct: 0.1,
    printSafe: false,
  });

  const joinUrl = useMemo(() => buildJoinUrl(config), [config]);
  const deviceNames = useMemo(() => normalizeDeviceNames(config.hosts), [config.hosts]);

  useEffect(() => {
    setValidation(validateConfig(config));
  }, [config]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfig((prev) => ({ ...prev, displayMode: false }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setConfig]);

  useEffect(() => {
    async function buildSvg() {
      try {
        const svg = await generateSvgMarkup(joinUrl, 320, branding);
        setSvgMarkup(svg);
      } catch (err) {
        console.error('Failed to generate QR', err);
      }
    }
    if (validation.valid) {
      buildSvg();
    } else {
      setSvgMarkup('');
    }
  }, [joinUrl, validation.valid, branding]);

  const addHosts = (newHosts: HostEntry[]) => {
    if (!newHosts.length) return;
    setConfig((prev) => {
      const merged = [...prev.hosts];
      for (const host of newHosts) {
        if (merged.some((h) => h.uuid === host.uuid)) continue;
        merged.push(host);
      }
      return { ...prev, hosts: merged };
    });
  };

  const importFromText = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setTransportHintNote(null);
      return false;
    }
    let result: ReturnType<typeof importFromPastedText> | null = null;
    setConfig((prev) => {
      result = importFromPastedText(trimmed, prev);
      return result.ok ? result.state : prev;
    });
    if (result?.ok) {
        setLastImportNonce((n) => n + 1);
      setTransportHintNote(null);
      return true;
    }
    if (result) {
      setTransportHintNote(result.error);
    }
    return false;
  };

  const parseHostInput = (value: string) => {
    importFromText(value);
  };

  const handleHostInputChange = (value: string) => {
    setHostInput(value);
    if (value.trim()) {
      importFromText(value);
    } else {
      setTransportHintNote(null);
    }
  };

  const handleManualAdd = () => {
    if (!uuidRegex.test(manualUuid.trim())) {
      setTransportHintNote('Enter a valid UUID for manual host.');
      return;
    }
    addHosts([{ uuid: manualUuid.trim(), deviceName: manualDevice.trim() }]);
    setManualUuid('');
    setManualDevice('');
    setTransportHintNote(null);
  };

  const updateHost = (idx: number, patch: Partial<HostEntry>) => {
    setConfig((prev) => {
      const copy = [...prev.hosts];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, hosts: copy };
    });
  };

  const removeHost = (idx: number) => {
    setConfig((prev) => ({ ...prev, hosts: prev.hosts.filter((_, i) => i !== idx) }));
  };

  const moveHost = (idx: number, delta: number) => {
    setConfig((prev) => {
      const copy = [...prev.hosts];
      const newIndex = idx + delta;
      if (newIndex < 0 || newIndex >= copy.length) return prev;
      const [item] = copy.splice(idx, 1);
      copy.splice(newIndex, 0, item);
      return { ...prev, hosts: copy };
    });
  };

  const handleCopy = async (text: string) => {
    const ok = await copyText(text);
    setCopyMessage(ok ? 'Copied!' : 'Copy failed');
    setTimeout(() => setCopyMessage(''), 1500);
  };

  const handleCopyGeneratorLink = async () => {
    const encoded = encodeState(config);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    await handleCopy(url);
  };

  const handleDisplayMode = () => {
    setConfig((prev) => ({ ...prev, displayMode: true }));
  };

  const handlePrintLabel = () => {
    setConfig((prev) => ({ ...prev, printMode: !prev.printMode }));
  };

  return {
    state: {
      config,
      hostInput,
      manualUuid,
      manualDevice,
      copyMessage,
      transportHintNote,
        hydratedFromUrl: hydratedFromUrlRef.current,
            lastImportNonce,
    },
    setters: {
      setConfig,
      setHostInput: handleHostInputChange,
      setManualUuid,
      setManualDevice,
    },
    derived: {
      joinUrl,
      deviceNames,
      svgMarkup,
      validation,
      branding,
    },
    actions: {
      addHosts,
      parseHostInput,
      importFromText,
      handleManualAdd,
      updateHost,
      removeHost,
      moveHost,
      handleCopy,
      handleCopyGeneratorLink,
      handleDisplayMode,
      handlePrintLabel,
      downloadSvg,
      downloadPng,
    },
  };
}

export default function QrTool() {
  const qrModel = useQrModel();

  return (
    <Page className="qr-page">
      <QrWizardPage qrModel={qrModel} />

      <AnimatePresence>
        {qrModel.state.config.displayMode && qrModel.derived.validation.valid && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => qrModel.setters.setConfig({ ...qrModel.state.config, displayMode: false })}
          >
            <div className="overlay-inner" onClick={(e) => e.stopPropagation()}>
              <div className="overlay-content">
                <div className="qr" dangerouslySetInnerHTML={{ __html: qrModel.derived.svgMarkup }} />
                <p className="room">{qrModel.state.config.roomLabel || 'SyncTimer'}</p>
                <button onClick={() => qrModel.setters.setConfig({ ...qrModel.state.config, displayMode: false })}>
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
