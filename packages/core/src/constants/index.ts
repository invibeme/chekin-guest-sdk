export const CHEKIN_ROOT_IFRAME_ID = 'chekin-guest-sdk-iframe';
export const CHEKIN_IFRAME_TITLE = 'Chekin Guest SDK';
export const CHEKIN_IFRAME_NAME = 'chekin-guest-sdk-frame';

export const CHEKIN_EVENTS = {
  HANDSHAKE: 'handshake',
  HEIGHT_CHANGED: 'height-changed',
  ERROR: 'error',
  CONNECTION_ERROR: 'connection-error',
  CONFIG_UPDATE: 'config-update',
  ROUTE_CHANGED: 'route-changed',
  INIT_ROUTE: 'init-route',
  // Guest-specific events
  GUEST_REGISTERED: 'guest-registered',
  ALL_GUESTS_REGISTERED: 'all-guests-registered',
  RESERVATION_FOUND: 'reservation-found',
  RESERVATION_FETCHED: 'reservation-fetched',
  IV_FINISHED: 'iv-finished',
  RESERVATION_CREATED: 'reservation-created',
  RESERVATION_FOUND_FROM_HOUSING: 'reservation-found-from-housing', //
  SCREEN_CHANGED: 'screen-changed',
} as const;

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export const SDK_MODE = {
  all: 'ALL',
  onlyGuestForm: 'ONLY_GUEST_FORM',
  onlyIV: 'ONLY_IV',
  propertyLink: 'PROPERTY_LINK',
} as const;

export const SDK_MODES = Object.values(SDK_MODE);
export type SDKModes = (typeof SDK_MODES)[number];

export const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'el',
  'uk',
  'it',
  'de',
  'fr',
  'hu',
  'ru',
  'cs',
  'bg',
  'pt',
  'ro',
  'et',
  'pl',
  'ca',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
