export const CHEKIN_ROOT_IFRAME_ID = 'chekin-guest-sdk-iframe';
export const CHEKIN_IFRAME_TITLE = 'Chekin Guest SDK';
export const CHEKIN_IFRAME_NAME = 'chekin-guest-sdk-frame';

export const CHEKIN_EVENTS = {
  HANDSHAKE: 'chekin:handshake',
  HEIGHT_CHANGED: 'chekin:height-changed',
  ERROR: 'chekin:error',
  CONNECTION_ERROR: 'chekin:connection-error',
  CONFIG_UPDATE: 'chekin:config-update',
  ROUTE_CHANGED: 'chekin:route-changed',
  READY: 'chekin:ready',
  INIT_ROUTE: 'chekin:init-route',
  // Guest-specific events
  GUEST_REGISTERED: 'chekin:guest-registered',
  ALL_GUESTS_REGISTERED: 'chekin:all-guests-registered',
  RESERVATION_FOUND: 'chekin:reservation-found',
  RESERVATION_FETCHED: 'chekin:reservation-fetched',
  IV_FINISHED: 'chekin:iv-finished',
  RESERVATION_CREATED: 'chekin:reservation-created',
  RESERVATION_FOUND_FROM_HOUSING: 'chekin:reservation-found-from-housing',
  SCREEN_CHANGED: 'chekin:screen-changed',
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
  onlyIV: 'IV_ONLY',
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
