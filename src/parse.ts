import { GeneratorConfig, HostEntry, Mode, uuidRegex } from './model';

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

function decodeName(value: string | null): string {
  return value ? decodeURIComponent(value) : '';
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
