export const APP_NAME = 'QuanLyChiTieu';

export const STORAGE_KEYS = {
  THEME: '@theme',
  LANGUAGE: '@language',
  USER_SETTINGS: '@user_settings',
  PASSWORD: '@password',
  TRANSACTIONS: '@transactions',
  CATEGORIES: '@categories',
} as const;

export const NOTIFICATION = {
  DAILY_REMINDER_ID: 'daily-reminder',
  REMINDER_HOUR: 20,
  REMINDER_MINUTE: 0,
} as const;

export const DATE_FORMAT = {
  FULL: 'DD/MM/YYYY HH:mm:ss',
  DATE_ONLY: 'DD/MM/YYYY',
  MONTH_YEAR: 'MM/YYYY',
} as const;

export const CURRENCY = {
  DEFAULT: 'VND',
  SYMBOL: '₫',
  LOCALE: 'vi-VN',
} as const;