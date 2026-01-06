import { GeneratorConfig, defaultConfig } from './model';

const STORAGE_KEY = 'synctimer.qrgen.v1';

function safeParse<T>(text: string | null): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn('Failed to parse stored state', err);
    return null;
  }
}

export function loadPersistedConfig(): GeneratorConfig {
  const stored = safeParse<GeneratorConfig>(localStorage.getItem(STORAGE_KEY));
  const merged = { ...defaultConfig, ...stored } as GeneratorConfig;
  merged.hosts = stored?.hosts || [];
  return merged;
}

export function persistConfig(config: GeneratorConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function encodeState(config: GeneratorConfig): string {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
  return `state=${payload}`;
}

export function decodeState(hash: string): GeneratorConfig | null {
  if (!hash.startsWith('#')) return null;
  const trimmed = hash.slice(1);
  const [key, value] = trimmed.split('=');
  if (key !== 'state' || !value) return null;
  try {
    const json = decodeURIComponent(escape(atob(value)));
    const parsed = JSON.parse(json) as GeneratorConfig;
    return { ...defaultConfig, ...parsed, hosts: parsed.hosts || [] };
  } catch (err) {
    console.warn('Failed to decode shared state', err);
    return null;
  }
}
