export const CHEKIN_ROOT_IFRAME_ID = 'chekin-sdk-iframe';
export const CHEKIN_IFRAME_TITLE = 'Chekin SDK';
export const CHEKIN_IFRAME_NAME = 'chekin-sdk-frame';

export const CHEKIN_EVENTS = {
  HANDSHAKE: 'handshake',
  HEIGHT_CHANGED: 'height-changed',//
  ERROR: 'error',//
  CONNECTION_ERROR: 'connection-error',//
  CONFIG_UPDATE: 'config-update',
  ROUTE_CHANGED: 'route-changed',
  INIT_ROUTE: 'init-route',
  // Guest-specific events
  GUEST_REGISTERED: 'guest-registered', //
  ALL_GUESTS_REGISTERED: 'all-guests-registered',//
  RESERVATION_FOUND: 'reservation-found',//
  RESERVATION_FETCHED: 'reservation-fetched',//
  IV_FINISHED: 'iv-finished',//
  RESERVATION_CREATED: 'reservation-created',//
  RESERVATION_FOUND_FROM_HOUSING: 'reservation-found-from-housing',//
  SCREEN_CHANGED: 'screen-changed',//
} as const;

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
