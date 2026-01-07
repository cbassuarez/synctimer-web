import { GeneratorConfig, normalizeDeviceNames } from './model';

export function buildJoinUrl(config: GeneratorConfig): string {
  const params = new URLSearchParams();
  params.set('v', '1');
  params.set('mode', config.mode);
  params.set('hosts', config.hosts.map((h) => h.uuid).join(','));

  const names = normalizeDeviceNames(config.hosts);
  if (names.some((name) => name.trim().length > 0)) {
    params.set('device_names', names.join('|'));
  }

  if (config.roomLabel.trim()) {
    params.set('room_label', encodeURIComponent(config.roomLabel.trim()));
  }

  if (config.minBuild) params.set('min_build', config.minBuild);
  if (config.minVersion) params.set('min_version', config.minVersion);

  if (config.mode === 'wifi') {
    params.set('transport_hint', 'bonjour');
  }

  return `https://synctimerapp.com/join?${params.toString()}`;
}
