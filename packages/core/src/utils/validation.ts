import {ChekinGuestSDKConfig} from '../types';
import {SDK_MODES, SUPPORTED_LANGUAGES, SDK_MODE} from '../constants';

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class ChekinSDKValidator {
  public validateConfig(config: ChekinGuestSDKConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required field validation
    if (!config.apiKey) {
      errors.push({
        field: 'apiKey',
        message: 'API key is required',
        value: config.apiKey,
      });
    } else if (typeof config.apiKey !== 'string') {
      errors.push({
        field: 'apiKey',
        message: 'API key must be a string',
        value: config.apiKey,
      });
    } else if (config.apiKey.length < 10) {
      warnings.push({
        field: 'apiKey',
        message: 'API key seems too short, please verify it is correct',
        value: config.apiKey.length,
      });
    }

    // BaseUrl validation
    if (config.baseUrl) {
      if (typeof config.baseUrl !== 'string') {
        errors.push({
          field: 'baseUrl',
          message: 'Base URL must be a string',
          value: config.baseUrl,
        });
      } else {
        try {
          new URL(config.baseUrl);
        } catch {
          errors.push({
            field: 'baseUrl',
            message: 'Base URL must be a valid URL',
            value: config.baseUrl,
          });
        }
      }
    }

    // Version validation
    if (config.version) {
      if (typeof config.version !== 'string') {
        errors.push({
          field: 'version',
          message: 'Version must be a string',
          value: config.version,
        });
      } else if (
        !/^(latest|development|v?\d+\.\d+\.\d+(-[a-z0-9]+)?)$/i.test(config.version)
      ) {
        warnings.push({
          field: 'version',
          message:
            'Version format should be "latest" or "development" or semantic version (e.g., "1.0.0", "v2.1.3")',
          value: config.version,
        });
      }
    }

    // ID validation
    this.validateId(config.housingId, 'housingId', errors, warnings);
    this.validateId(config.reservationId, 'reservationId', errors, warnings);
    this.validateId(config.externalId, 'externalId', errors, warnings);
    this.validateId(config.guestId, 'guestId', errors, warnings);

    // Language validation
    if (config.defaultLanguage) {
      if (typeof config.defaultLanguage !== 'string') {
        errors.push({
          field: 'defaultLanguage',
          message: 'Default language must be a string',
          value: config.defaultLanguage,
        });
      } else if (!ChekinSDKValidator.validateLanguage(config.defaultLanguage)) {
        warnings.push({
          field: 'defaultLanguage',
          message: `Unsupported language "${
            config.defaultLanguage
          }". Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`,
          value: config.defaultLanguage,
        });
      }
    }

    // Styles validation
    if (config.styles) {
      if (typeof config.styles !== 'string') {
        errors.push({
          field: 'styles',
          message: 'Styles must be a string',
          value: config.styles,
        });
      }
    }

    if (config.stylesLink) {
      if (typeof config.stylesLink !== 'string') {
        errors.push({
          field: 'stylesLink',
          message: 'Styles link must be a string',
          value: config.stylesLink,
        });
      } else {
        try {
          new URL(config.stylesLink);
        } catch {
          errors.push({
            field: 'stylesLink',
            message: 'Styles link must be a valid URL',
            value: config.stylesLink,
          });
        }
      }
    }

    // Boolean validation
    this.validateBoolean(config.autoHeight, 'autoHeight', errors);
    this.validateBoolean(config.enableLogging, 'enableLogging', errors);
    this.validateBoolean(config.enableGuestsRemoval, 'enableGuestsRemoval', errors);
    this.validateBoolean(
      config.canEditReservationDetails,
      'canEditReservationDetails',
      errors,
    );
    this.validateBoolean(
      config.canShareRegistrationLink,
      'canShareRegistrationLink',
      errors,
    );
    this.validateBoolean(config.routeSync, 'routeSync', errors);

    // Mode validation
    if (config.mode) {
      if (typeof config.mode !== 'string') {
        errors.push({
          field: 'mode',
          message: 'Mode must be a string',
          value: config.mode,
        });
      } else if (!ChekinSDKValidator.validateMode(config.mode)) {
        errors.push({
          field: 'mode',
          message: `Unsupported mode "${config.mode}". Supported modes: ${SDK_MODES.join(', ')}`,
          value: config.mode,
        });
      }
    }

    if (config.prefillData) {
      this.validatePrefillData(config.prefillData, errors);
    }

    // Callback validation
    this.validateCallback(config.onGuestRegistered, 'onGuestRegistered', errors);
    this.validateCallback(config.onAllGuestsRegistered, 'onAllGuestsRegistered', errors);
    this.validateCallback(config.onReservationFound, 'onReservationFound', errors);
    this.validateCallback(config.onReservationFetched, 'onReservationFetched', errors);
    this.validateCallback(config.onReservationCreated, 'onReservationCreated', errors);
    this.validateCallback(
      config.onReservationFoundFromHousing,
      'onReservationFoundFromHousing',
      errors,
    );
    this.validateCallback(config.onHeightChanged, 'onHeightChanged', errors);
    this.validateCallback(config.onConnectionError, 'onConnectionError', errors);
    this.validateCallback(config.onError, 'onError', errors);
    this.validateCallback(config.onIVFinished, 'onIVFinished', errors);
    this.validateCallback(config.onScreenChanged, 'onScreenChanged', errors);

    // Business logic validation
    if (!config.reservationId && !config.housingId && !config.externalId) {
      errors.push({
        field: 'none',
        message: 'At least one of reservationId, housingId, or externalId is required',
        value: '',
      });
    }
    if (config.guestId && config.mode !== SDK_MODE.onlyGuestForm) {
      errors.push({
        field: 'guestId',
        message: 'The guestId can be used only in "ONLY_GUEST_FORM" mode',
        value: config.guestId,
      });
    }

    if (config.guestId && !config.externalId && !config.reservationId) {
      errors.push({
        field: 'guestId',
        message: 'The guestId should be passed with reservationId or externalId',
        value: config.guestId,
      });
    }

    if (!config.housingId && config.mode === SDK_MODE.propertyLink) {
      errors.push({
        field: 'housingId',
        message: 'The housingId is required in "PROPERTY_LINK" mode',
        value: config.housingId,
      });
    }

    if (config.housingId && config.mode !== SDK_MODE.propertyLink) {
      errors.push({
        field: 'housingId',
        message: 'The housingId can be used only in "PROPERTY_LINK" mode',
        value: config.housingId,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateId(
    value: unknown,
    fieldName: string,
    errors: ValidationError[],
    warnings: ValidationError[],
  ): void {
    if (value !== undefined) {
      if (typeof value !== 'string') {
        errors.push({
          field: fieldName,
          message: `${fieldName} must be a string`,
          value,
        });
      } else if (value.length === 0) {
        errors.push({
          field: fieldName,
          message: `${fieldName} cannot be empty`,
          value,
        });
      } else if (value.length > 100) {
        warnings.push({
          field: fieldName,
          message: `${fieldName} is unusually long (${value.length} characters)`,
          value: value.length,
        });
      }
    }
  }

  private validateBoolean(
    value: unknown,
    fieldName: string,
    errors: ValidationError[],
  ): void {
    if (value !== undefined && typeof value !== 'boolean') {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a boolean`,
        value,
      });
    }
  }

  private validatePrefillData(prefillData: unknown, errors: ValidationError[]): void {
    if (typeof prefillData !== 'object' || prefillData === null) {
      errors.push({
        field: 'prefillData',
        message: 'Prefill data must be an object',
        value: prefillData,
      });
      return;
    }
  }

  private validateCallback(
    callback: unknown,
    fieldName: string,
    errors: ValidationError[],
  ): void {
    if (callback !== undefined && typeof callback !== 'function') {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a function`,
        value: typeof callback,
      });
    }
  }

  public static validateLanguage(lang: string): boolean {
    return SUPPORTED_LANGUAGES.includes(lang as (typeof SUPPORTED_LANGUAGES)[number]);
  }

  public static validateMode(mode: string): boolean {
    return SDK_MODES.includes(mode as (typeof SDK_MODES)[number]);
  }
}
