// 时间转换核心函数 — 纯函数，无副作用，所有计算基于浏览器原生 Intl/Date API

export type TimestampUnit = 'seconds' | 'milliseconds';

export interface TimeZoneResult {
  timezone: string;
  city: string;
  date: string;   // 2024-01-15
  time: string;   // 14:30:00
  full: string;   // 2024-01-15 14:30:00
  weekday: string;
  offset: string; // +08:00
}

export interface TimeDelta {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export interface BatchResult {
  input: string;
  ok: boolean;
  unit?: TimestampUnit;
  ms?: number;
  full?: string;
  error?: string;
}

/** 自动识别时间戳是秒还是毫秒。规则：
 *  - 位数 < 12 位视为秒
 *  - 位数 >= 12 位视为毫秒
 *  - 同时检查数值范围合理性（1970 ~ 2100 之间）
 */
export function normalizeTimestamp(input: number | string): { value: number; unit: TimestampUnit } | null {
  const raw = typeof input === 'number' ? String(input) : input.trim();
  if (!raw) return null;

  // 去除可能的 .xxx 毫秒部分
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return null;

  const str = raw.replace(/\.\d+$/, '');
  const len = str.length;

  let unit: TimestampUnit;
  if (len >= 13) unit = 'milliseconds';
  else if (len <= 10) unit = 'seconds';
  else {
    // 11-12 位：根据范围判断
    // 秒：约 1.0e10 ~ 9.9e11 覆盖 2286-11500 年；毫秒：1.0e11 起为 1973 年
    unit = len === 11 ? 'seconds' : 'milliseconds';
  }

  const value = unit === 'seconds' ? num : num;
  const ms = unit === 'seconds' ? num * 1000 : num;

  // 合理性检查：1000-01-01 ~ 3000-01-01
  if (ms < -30610224000000 || ms > 32503680000000) return null;

  return { value, unit };
}

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function formatOffset(timezone: string, ref: Date): string {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    const parts = dtf.formatToParts(ref);
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value || '';
    // "GMT+08:00" -> "+08:00"
    const m = tz.match(/GMT([+-]\d{2}:\d{2})/);
    return m ? m[1] : tz;
  } catch {
    return '+00:00';
  }
}

export function timestampToTimezones(
  ts: number,
  unit: TimestampUnit,
  zones: { timezone: string; city: string }[],
  locale: string = 'en-US',
): TimeZoneResult[] {
  const ms = unit === 'seconds' ? ts * 1000 : ts;
  const ref = new Date(ms);

  return zones.map(({ timezone, city }) => {
    try {
      const dtf = new Intl.DateTimeFormat(locale === 'zh-CN' ? 'zh-CN' : 'en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        weekday: 'short',
      });
      const parts = dtf.formatToParts(ref);
      const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
      const year = get('year');
      const month = get('month');
      const day = get('day');
      const hour = get('hour') === '24' ? '00' : get('hour');
      const minute = get('minute');
      const second = get('second');
      const weekday = get('weekday');

      return {
        timezone,
        city,
        date: `${year}-${month}-${day}`,
        time: `${hour}:${minute}:${second}`,
        full: `${year}-${month}-${day} ${hour}:${minute}:${second}`,
        weekday,
        offset: formatOffset(timezone, ref),
      };
    } catch {
      return {
        timezone,
        city,
        date: '—',
        time: '—',
        full: '—',
        weekday: '—',
        offset: '—',
      };
    }
  });
}

/** 从 <input type="datetime-local"> 的字符串值（无时区）+ 时区 → 时间戳 */
export function dateToTimestamp(localStr: string, timezone: string): { seconds: number; milliseconds: number } | null {
  if (!localStr) return null;
  // localStr: "2024-01-15T14:30"
  const [datePart, timePart] = localStr.split('T');
  if (!datePart || !timePart) return null;
  const [y, mo, d] = datePart.split('-').map(Number);
  const [h, mi] = timePart.split(':').map(Number);
  if (![y, mo, d, h, mi].every((n) => Number.isFinite(n))) return null;

  // 在指定时区构造 wall-clock，再转为 UTC ms
  // 策略：用 Intl 计算该时区在该 wall-clock 时刻的偏移
  const naive = Date.UTC(y, mo - 1, d, h, mi, 0);
  // 找出该 UTC 时刻下，目标时区的实际 wall-clock 与 UTC 的差值
  const ref = new Date(naive);
  const offsetMin = getOffsetMinutes(timezone, ref);
  const ms = naive - offsetMin * 60 * 1000;
  return { seconds: Math.floor(ms / 1000), milliseconds: ms };
}

function getOffsetMinutes(timezone: string, ref: Date): number {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = dtf.formatToParts(ref);
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT';
    const m = tz.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1] === '+' ? 1 : -1;
    const h = parseInt(m[2], 10);
    const min = m[3] ? parseInt(m[3], 10) : 0;
    return sign * (h * 60 + min);
  } catch {
    return 0;
  }
}

export function shiftTime(base: Date, delta: TimeDelta): Date {
  const d = new Date(base.getTime());
  if (delta.years) d.setUTCFullYear(d.getUTCFullYear() + delta.years);
  if (delta.months) d.setUTCMonth(d.getUTCMonth() + delta.months);
  if (delta.days) d.setUTCDate(d.getUTCDate() + delta.days);
  if (delta.hours) d.setUTCHours(d.getUTCHours() + delta.hours);
  if (delta.minutes) d.setUTCMinutes(d.getUTCMinutes() + delta.minutes);
  if (delta.seconds) d.setUTCSeconds(d.getUTCSeconds() + delta.seconds);
  return d;
}

export function batchConvert(input: string, locale: string = 'en-US'): BatchResult[] {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    const norm = normalizeTimestamp(line);
    if (!norm) {
      return { input: line, ok: false, error: 'invalid' };
    }
    const results = timestampToTimezones(norm.value, norm.unit, [{ timezone: 'UTC', city: 'UTC' }], locale);
    return {
      input: line,
      ok: true,
      unit: norm.unit,
      ms: norm.unit === 'seconds' ? norm.value * 1000 : norm.value,
      full: results[0].full,
    };
  });
}

/** 把当前时间格式化为 datetime-local 输入框所需的值 */
export function toDatetimeLocalValue(d: Date): string {
  const pad2 = (n: number) => (n < 10 ? '0' + n : String(n));
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** 格式化大数字为千分位 */
export function formatThousands(n: number): string {
  return n.toLocaleString('en-US');
}
