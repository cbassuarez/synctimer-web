import { GeneratorConfig, HostEntry, Mode, uuidRegex } from './model';
import { decodeState } from './storage';

const HOST_BASE = 'synctimerapp.com/host';
const JOIN_BASE = 'synctimerapp.com/join';

export interface ParseHostsResult {
  hosts: HostEntry[];
  errors: string[];
}

export interface ParseJoinResult {
  config: Partial<GeneratorConfig> & { hosts?: HostEntry[] };
  errors: string[];
  transportHintWarning?: boolean;
}

export type ImportFromPasteResult =
  | { ok: true; state: GeneratorConfig }
  | { ok: false; error: string };

function decodeName(value: string | null): string {
  return value ? decodeURIComponent(value) : '';
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

function extractHashState(input: string): GeneratorConfig | null {
  const url = safeUrl(input);
  if (url?.hash) {
    const decoded = decodeState(url.hash);
    if (decoded) return decoded;
  }

  const match = input.match(/#state=([A-Za-z0-9+/=]+)/);
  if (!match) return null;
  return decodeState(`#state=${match[1]}`);
}

function extractPrefill(input: string): string | null {
  const url = safeUrl(input);
  const fromUrl = url?.searchParams.get('prefill');
  if (fromUrl) return fromUrl;

  const match = input.match(/[?&]prefill=([^&#\s]+)/);
  return match ? match[1] : null;
}

function mergeHosts(existing: HostEntry[], incoming: HostEntry[]): HostEntry[] {
  const merged = [...existing];
  for (const host of incoming) {
    if (merged.some((entry) => entry.uuid === host.uuid)) continue;
    merged.push(host);
  }
  return merged;
}

export function parseHostShareLinks(input: string): ParseHostsResult {
  const hosts: HostEntry[] = [];
  const errors: string[] = [];
  const tokens = input.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    if (!token.includes(HOST_BASE)) continue;
    try {
      const url = new URL(token.trim());
      if (!url.pathname.includes('/host')) continue;
      const uuid = url.searchParams.get('host_uuid');
      const deviceName = decodeName(url.searchParams.get('device_name'));
      if (!uuid || !uuidRegex.test(uuid)) {
        errors.push(`Invalid host_uuid in ${token}`);
        continue;
      }
      // Deterministic de-dupe: keep the first occurrence of each UUID.
      if (hosts.some((h) => h.uuid === uuid)) continue;
      hosts.push({ uuid, deviceName });
    } catch (err) {
      errors.push(`Could not parse host link: ${token}`);
    }
  }

  return { hosts, errors };
}

export function parseJoinLink(raw: string): ParseJoinResult | null {
  if (!raw.includes(JOIN_BASE)) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch (err) {
    return { config: {}, errors: ['Join link is not a valid URL.'] } as ParseJoinResult;
  }

  const params = url.searchParams;
  const mode = (params.get('mode') as Mode) || 'wifi';
  const hostParam = params.get('hosts') || '';
  const hostIds = hostParam.split(',').filter(Boolean);
  const deviceNamesRaw = decodeName(params.get('device_names')).split('|');

  const hosts: HostEntry[] = hostIds
    .filter((id) => uuidRegex.test(id))
    .map((uuid, idx) => ({ uuid, deviceName: deviceNamesRaw[idx] }));

  const minBuild = params.get('min_build') || undefined;
  const minVersion = params.get('min_version') || undefined;
  const roomLabel = decodeName(params.get('room_label') || '');
  const transportHint = params.get('transport_hint');

  return {
    config: {
      mode: mode === 'nearby' ? 'nearby' : 'wifi',
      hosts,
      roomLabel,
      minBuild,
      minVersion,
    },
    errors: hosts.length === 0 ? ['No valid hosts found in join link.'] : [],
    transportHintWarning: mode === 'wifi' && transportHint && transportHint !== 'bonjour',
  };
}

export function parseAnyInput(text: string): { hosts: HostEntry[]; join?: ParseJoinResult } {
  const joinMatch = parseJoinLink(text.trim());
  if (joinMatch) {
    return { hosts: joinMatch.config.hosts || [], join: joinMatch };
  }
  const hostResult = parseHostShareLinks(text);
  return { hosts: hostResult.hosts, join: undefined };
}

export function importFromPastedText(text: string, existingState: GeneratorConfig): ImportFromPasteResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: 'Paste a /qr prefill, /host, or /join link.' };
  }

  const hashState = extractHashState(trimmed);
  let imported: Partial<GeneratorConfig> & { hosts?: HostEntry[] } = {};
  let explicitMode = false;
  let parseErrors: string[] = [];

  if (hashState) {
    imported = hashState;
    explicitMode = true;
  } else {
    const prefill = extractPrefill(trimmed);
    const candidate = prefill ? safeDecode(prefill) : trimmed;
    const joinMatch = parseJoinLink(candidate);
    if (joinMatch) {
      imported = joinMatch.config;
      explicitMode = true;
      parseErrors = joinMatch.errors;
    } else {
      const hostResult = parseHostShareLinks(candidate);
      imported = { hosts: hostResult.hosts };
      parseErrors = hostResult.errors;
    }
  }

  const incomingHosts = imported.hosts || [];
  const nextHosts =
    existingState.hosts.length > 0 ? mergeHosts(existingState.hosts, incomingHosts) : incomingHosts;
  const nextMode =
    explicitMode && imported.mode ? imported.mode : existingState.mode;
  const nextRoomLabel = existingState.roomLabel || imported.roomLabel || '';
  const nextMinBuild = existingState.minBuild || imported.minBuild || '';
  const nextMinVersion = existingState.minVersion || imported.minVersion || '';

  if (nextHosts.length === 0) {
    const error = parseErrors[0] || 'No valid hosts found in the pasted link.';
    return { ok: false, error };
  }

  return {
    ok: true,
    state: {
      ...existingState,
      mode: nextMode,
      hosts: nextHosts,
      roomLabel: nextRoomLabel,
      minBuild: nextMinBuild,
      minVersion: nextMinVersion,
    },
  };
}
