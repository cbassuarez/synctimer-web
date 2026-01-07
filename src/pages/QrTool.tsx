import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page';
import { buildJoinUrl } from '../features/qr/buildJoinUrl';
import { BrandingOptions, generateSvgMarkup } from '../features/qr/qr';
import {
  GeneratorConfig,
  HostEntry,
  ValidationResult,
  defaultConfig,
  normalizeDeviceNames,
  uuidRegex,
  validateConfig,
} from '../features/qr/model';
import { parseAnyInput, parseHostShareLinks, parseJoinLink } from '../features/qr/parse';
import { copyText } from '../features/qr/ui';
import { decodeState, encodeState, loadPersistedConfig, persistConfig } from '../features/qr/storage';
import QrWizardPage from '../features/qr/wizard/QrWizardPage';
import { QrModel } from '../features/qr/wizard/types';

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
  const [branding] = useState<BrandingOptions>({
    enabled: true,
    corner: 'bottom-right',
    sizePct: 0.13,
    patchPaddingPct: 0.12,
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

  const handleParse = () => {
    const parsedJoin = parseJoinLink(hostInput.trim());
    if (parsedJoin) {
      const next: GeneratorConfig = {
        ...config,
        ...parsedJoin.config,
        hosts: parsedJoin.config.hosts || [],
        displayMode: false,
      } as GeneratorConfig;
      setConfig(next);
      if (parsedJoin.transportHintWarning) {
        setTransportHintNote('Transport hint set to bonjour for Wi-Fi mode.');
      } else {
        setTransportHintNote(null);
      }
      return;
    }
    const { hosts, join } = parseAnyInput(hostInput.trim());
    if (join && join.config.hosts) {
      setConfig((prev) => ({ ...prev, ...join.config, hosts: join.config.hosts } as GeneratorConfig));
      return;
    }
    const { errors } = parseHostShareLinks(hostInput.trim());
    if (errors.length) {
      setTransportHintNote(errors.join('\n'));
    } else {
      setTransportHintNote(null);
    }
    addHosts(hosts);
    setHostInput('');
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

  const handlePrint = () => {
    window.print();
  };

  return {
    config,
    setConfig,
    hostInput,
    setHostInput,
    manualUuid,
    setManualUuid,
    manualDevice,
    setManualDevice,
    svgMarkup,
    validation,
    joinUrl,
    deviceNames,
    transportHintNote,
    copyMessage,
    branding,
    actions: {
      handleParse,
      handleManualAdd,
      updateHost,
      removeHost,
      moveHost,
      handleCopy,
      handleCopyGeneratorLink,
      handlePrint,
    },
  };
}

export default function QrTool() {
  const qrModel = useQrModel();
  const { config, setConfig, svgMarkup, validation } = qrModel;

  return (
    <Page className="qr-page qr-wizard">
      <header className="page-header">
        <div>
          <h1>QR generator</h1>
          <p>Create reliable join links and QR codes for SyncTimer sessions.</p>
        </div>
      </header>

      <QrWizardPage qrModel={qrModel} />

      <AnimatePresence>
        {config.displayMode && validation.valid && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfig({ ...config, displayMode: false })}
          >
            <div className="overlay-inner" onClick={(e) => e.stopPropagation()}>
              <div className="overlay-content">
                <div className="qr" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
                <p className="room">{config.roomLabel || 'SyncTimer'}</p>
                <button onClick={() => setConfig({ ...config, displayMode: false })}>Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
