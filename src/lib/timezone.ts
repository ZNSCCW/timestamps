// 主流时区数据 — 用于时区矩阵展示
export interface TimeZoneEntry {
  timezone: string;
  city: string;
  cityZh: string;
}

export const TIMEZONES: TimeZoneEntry[] = [
  { timezone: 'UTC', city: 'UTC', cityZh: '协调世界时' },
  { timezone: 'America/Los_Angeles', city: 'Los Angeles', cityZh: '洛杉矶' },
  { timezone: 'America/New_York', city: 'New York', cityZh: '纽约' },
  { timezone: 'America/Sao_Paulo', city: 'São Paulo', cityZh: '圣保罗' },
  { timezone: 'Europe/London', city: 'London', cityZh: '伦敦' },
  { timezone: 'Europe/Paris', city: 'Paris', cityZh: '巴黎' },
  { timezone: 'Europe/Moscow', city: 'Moscow', cityZh: '莫斯科' },
  { timezone: 'Asia/Dubai', city: 'Dubai', cityZh: '迪拜' },
  { timezone: 'Asia/Kolkata', city: 'Mumbai', cityZh: '孟买' },
  { timezone: 'Asia/Singapore', city: 'Singapore', cityZh: '新加坡' },
  { timezone: 'Asia/Shanghai', city: 'Shanghai', cityZh: '上海' },
  { timezone: 'Asia/Hong_Kong', city: 'Hong Kong', cityZh: '香港' },
  { timezone: 'Asia/Tokyo', city: 'Tokyo', cityZh: '东京' },
  { timezone: 'Australia/Sydney', city: 'Sydney', cityZh: '悉尼' },
  { timezone: 'Pacific/Auckland', city: 'Auckland', cityZh: '奥克兰' },
];

/** 用于下拉选择器 */
export const SELECTABLE_TIMEZONES: TimeZoneEntry[] = [
  { timezone: 'UTC', city: 'UTC', cityZh: 'UTC' },
  ...TIMEZONES.filter((t) => t.timezone !== 'UTC'),
];
