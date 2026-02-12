// Game configuration constants
import { getCurrentYear, getLunarYearTitle } from '../utils/yearUtils';

export const GAME_CONFIG = {
  // Game period
  GAME_START: 'khoảng 25 tháng chạp',
  GAME_END: 'mùng 9 tháng giêng',
  get GAME_YEAR(): string { return getCurrentYear().toString(); },
  get GAME_TITLE(): string { return getLunarYearTitle(getCurrentYear()); },

  // Đóng tịch time
  CLOSE_TIME: '17h',

  // Thai time slots
  THAI_AN_NHON_TIMES: ['11h', '17h'] as const,
  THAI_AN_NHON_TET_EXTRA: '21h',
  THAI_NHON_PHONG_TIMES: ['11h', '17h'] as const,
  THAI_NHON_PHONG_TET_EXTRA: '21:00',
  THAI_HOAI_NHON_TIMES: ['13h', '19h'] as const,
};
