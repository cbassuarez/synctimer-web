export type Mode = 'wifi' | 'nearby';

export interface HostEntry {
  uuid: string;
  deviceName?: string;
}

export interface GeneratorConfig {
  mode: Mode;
  roomLabel: string;
  hosts: HostEntry[];
  minBuild?: string;
  minVersion?: string;
  displayMode: boolean;
  printMode: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  checklist: { label: string; ok: boolean }[];
}

export const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const defaultConfig: GeneratorConfig = {
  mode: 'wifi',
  roomLabel: '',
  hosts: [],
  minBuild: '',
  minVersion: '',
  displayMode: false,
  printMode: false,
};

export function normalizeDeviceNames(hosts: HostEntry[]): string[] {
  return hosts.map((h, idx) => (h.deviceName && h.deviceName.trim() ? h.deviceName.trim() : `Host ${idx + 1}`));
}

export function validateConfig(config: GeneratorConfig): ValidationResult {
  const errors: string[] = [];
  const checklist: { label: string; ok: boolean }[] = [];

  const hasMode = config.mode === 'wifi' || config.mode === 'nearby';
  checklist.push({ label: 'Mode selected', ok: hasMode });
  if (!hasMode) errors.push('Mode is required.');

  const hostValid = config.hosts.length > 0;
  checklist.push({ label: 'At least one host added', ok: hostValid });
  if (!hostValid) errors.push('Add at least one host.');

  const uuidIssues = config.hosts.filter((h) => !uuidRegex.test(h.uuid));
  const uuidsOk = uuidIssues.length === 0;
  checklist.push({ label: 'Host UUIDs valid', ok: uuidsOk });
  if (!uuidsOk) errors.push('One or more host UUIDs are invalid.');

  const minBuildOk = !config.minBuild || (/^\d+$/.test(config.minBuild) && Number(config.minBuild) > 0);
  checklist.push({ label: 'Minimum build (if set) is numeric', ok: minBuildOk });
  if (!minBuildOk) errors.push('min_build must be a positive integer.');

  const minVersionOk = !config.minVersion || /^\d+\.\d+(\.\d+)?$/.test(config.minVersion);
  checklist.push({ label: 'Minimum version (if set) looks like x.y or x.y.z', ok: minVersionOk });
  if (!minVersionOk) errors.push('min_version must look like x.y or x.y.z.');

  return { valid: errors.length === 0, errors, checklist };
}
