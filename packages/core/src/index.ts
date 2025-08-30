// Main SDK exports
export { ChekinGuestSDK } from './ChekinGuestSDK';
export { ChekinPro } from './ChekinPro';

// Legacy export for backward compatibility
export { ChekinGuestSDK as ChekinHostSDK } from './ChekinGuestSDK';

// Communication utilities
export { ChekinCommunicator } from './communication/ChekinCommunicator.js';

// Utility functions
export { formatChekinUrl } from './utils/formatChekinUrl.js';
export { ChekinLogger } from './utils/ChekinLogger.js';
export { ChekinSDKValidator } from './utils/validation.js';

// Constants
export { CHEKIN_ROOT_IFRAME_ID, CHEKIN_EVENTS, LOG_LEVELS, CHEKIN_IFRAME_TITLE, CHEKIN_IFRAME_NAME } from './constants/index.js';

// Type definitions
export type {
  ChekinGuestSDKConfig,
  ChekinSDKConfig,
  ChekinMessage,
  ChekinEventType,
  ChekinEventCallback,
  IVResult,
  PrefillData
} from './types/index.js';

export type {
  LogEntry,
  ChekinLoggerConfig,
  LogLevel
} from './utils/ChekinLogger.js';

export type {
  UrlConfigResult
} from './utils/formatChekinUrl.js';

export type {
  ValidationError,
  ValidationResult
} from './utils/validation.js';
