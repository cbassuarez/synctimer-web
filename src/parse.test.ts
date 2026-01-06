import { describe, expect, it } from 'vitest';
import { parseHostShareLinks, parseJoinLink } from './parse';
import { buildJoinUrl } from './buildJoinUrl';
import { defaultConfig } from './model';

describe('parse host share links', () => {
  it('extracts uuid and device name', () => {
    const input = 'https://synctimerapp.com/host?v=1&host_uuid=123e4567-e89b-12d3-a456-426614174000&device_name=iPad';
    const result = parseHostShareLinks(input);
    expect(result.hosts[0]).toEqual({ uuid: '123e4567-e89b-12d3-a456-426614174000', deviceName: 'iPad' });
  });
});

describe('parse join link', () => {
  it('populates mode and hosts', () => {
    const link =
      'https://synctimerapp.com/join?v=1&mode=wifi&hosts=123e4567-e89b-12d3-a456-426614174000,923e4567-e89b-12d3-a456-426614174000&device_names=Tab|Desk&transport_hint=ble';
    const parsed = parseJoinLink(link);
    expect(parsed?.config.mode).toBe('wifi');
    expect(parsed?.config.hosts?.length).toBe(2);
    expect(parsed?.transportHintWarning).toBe(true);
  });
});

describe('build join url', () => {
  it('forces bonjour transport hint for wifi', () => {
    const cfg = {
      ...defaultConfig,
      mode: 'wifi' as const,
      hosts: [{ uuid: '123e4567-e89b-12d3-a456-426614174000', deviceName: 'A' }],
    };
    const url = buildJoinUrl(cfg);
    expect(url).toContain('transport_hint=bonjour');
  });
});
