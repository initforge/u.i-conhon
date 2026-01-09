// Game configuration constants
export const GAME_CONFIG = {
  // Prize ratios
  PRIZE_RATIO: 30, // 1 ăn 30
  SPECIAL_PRIZE_RATIO: 70, // Chí Cao (Con Trùn) 1 ăn 70

  // Prize ratio text
  PRIZE_RATIO_TEXT: '1 chung 30',
  SPECIAL_PRIZE_RATIO_TEXT: 'Chí Cao (Con Trùn) chung 70',
  HOAI_NHON_SPECIAL_TEXT: 'Riêng thai Hoài Nhơn, Chí Cao (Con Trùn) chung 70',

  // Example calculation
  EXAMPLE_BET: 10000, // 10.000đ
  getExamplePrize: () => GAME_CONFIG.EXAMPLE_BET * GAME_CONFIG.PRIZE_RATIO, // 300.000đ

  // Button text
  PLAY_BUTTON_TEXT: 'MUA 1 TRÚNG 30 - CHƠI NGAY',

  // Game period
  GAME_START: 'khoảng 25 tháng chạp',
  GAME_END: 'mùng 9 tháng giêng',
  GAME_YEAR: '2025',
  GAME_TITLE: 'Tết Ất Tỵ 2025',

  // Thai time slots
  THAI_AN_NHON_TIMES: ['11h', '17h'],
  THAI_AN_NHON_TET_EXTRA: '21h',
  THAI_NHON_PHONG_TIMES: ['11h', '17h'],
  THAI_NHON_PHONG_TET_EXTRA: '20:30',
  THAI_HOAI_NHON_TIMES: ['13h', '19h'],
} as const;

