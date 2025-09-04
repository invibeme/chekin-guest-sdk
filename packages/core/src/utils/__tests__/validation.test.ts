import { describe, it, expect, beforeEach } from 'vitest';
import { ChekinSDKValidator } from '../validation';
import { SDK_MODE, SUPPORTED_LANGUAGES } from '../../constants';
import type { ChekinGuestSDKConfig } from '../../types';

describe('ChekinSDKValidator', () => {
  let validator: ChekinSDKValidator;

  beforeEach(() => {
    validator = new ChekinSDKValidator();
  });

  describe('validateConfig', () => {
    describe('apiKey validation', () => {
      it('should return error when apiKey is missing', () => {
        const config = {} as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: 'apiKey',
          message: 'API key is required',
          value: undefined,
        });
      });

      it('should return error when apiKey is not a string', () => {
        const config = { apiKey: 123 } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          field: 'apiKey',
          message: 'API key must be a string',
          value: 123,
        });
      });

      it('should return warning when apiKey is too short', () => {
        const config = { apiKey: 'short' } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.warnings).toContainEqual({
          field: 'apiKey',
          message: 'API key seems too short, please verify it is correct',
          value: 5,
        });
      });

      it('should pass with valid apiKey', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'apiKey')).toHaveLength(0);
        expect(result.warnings.filter(w => w.field === 'apiKey')).toHaveLength(0);
      });
    });

    describe('baseUrl validation', () => {
      it('should pass when baseUrl is not provided', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'baseUrl')).toHaveLength(0);
      });

      it('should return error when baseUrl is not a string', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          baseUrl: 123,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'baseUrl',
          message: 'Base URL must be a string',
          value: 123,
        });
      });

      it('should return error when baseUrl is invalid URL', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          baseUrl: 'invalid-url',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'baseUrl',
          message: 'Base URL must be a valid URL',
          value: 'invalid-url',
        });
      });

      it('should pass with valid baseUrl', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          baseUrl: 'https://example.com',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'baseUrl')).toHaveLength(0);
      });
    });

    describe('version validation', () => {
      it('should pass when version is not provided', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'version')).toHaveLength(0);
      });

      it('should return error when version is not a string', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          version: 123,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'version',
          message: 'Version must be a string',
          value: 123,
        });
      });

      it('should return warning when version format is invalid', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          version: 'invalid-version',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.warnings).toContainEqual({
          field: 'version',
          message: 'Version format should be "latest" or "development" or semantic version (e.g., "1.0.0", "v2.1.3")',
          value: 'invalid-version',
        });
      });

      it('should pass with valid version formats', () => {
        const validVersions = ['latest', 'development', '1.0.0', 'v2.1.3', '1.0.0-alpha'];
        
        for (const version of validVersions) {
          const config = { 
            apiKey: 'valid-api-key-123456789',
            version,
            reservationId: 'res-123'
          } as ChekinGuestSDKConfig;
          const result = validator.validateConfig(config);

          expect(result.warnings.filter(w => w.field === 'version')).toHaveLength(0);
        }
      });
    });

    describe('ID validation', () => {
      it('should validate all ID fields', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          housingId: 123,
          reservationId: '',
          externalId: 'x'.repeat(101),
          guestId: 'valid-guest-id'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'housingId',
          message: 'housingId must be a string',
          value: 123,
        });

        expect(result.errors).toContainEqual({
          field: 'reservationId',
          message: 'reservationId cannot be empty',
          value: '',
        });

        expect(result.warnings).toContainEqual({
          field: 'externalId',
          message: 'externalId is unusually long (101 characters)',
          value: 101,
        });
      });

      it('should pass with valid IDs', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          housingId: 'housing-123',
          mode: SDK_MODE.propertyLink,
          reservationId: 'reservation-456',
          externalId: 'external-789'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => 
          ['housingId', 'reservationId', 'externalId'].includes(e.field)
        )).toHaveLength(0);
      });
    });

    describe('defaultLanguage validation', () => {
      it('should return error when defaultLanguage is not a string', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          defaultLanguage: 123,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'defaultLanguage',
          message: 'Default language must be a string',
          value: 123,
        });
      });

      it('should return warning when defaultLanguage is not supported', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          defaultLanguage: 'xx',
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.warnings).toContainEqual({
          field: 'defaultLanguage',
          message: `Unsupported language "xx". Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`,
          value: 'xx',
        });
      });

      it('should pass with supported languages', () => {
        for (const lang of SUPPORTED_LANGUAGES) {
          const config = { 
            apiKey: 'valid-api-key-123456789',
            defaultLanguage: lang,
            reservationId: 'res-123'
          } as ChekinGuestSDKConfig;
          const result = validator.validateConfig(config);

          expect(result.warnings.filter(w => w.field === 'defaultLanguage')).toHaveLength(0);
        }
      });
    });

    describe('styles validation', () => {
      it('should return error when styles is not a string', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          styles: 123,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'styles',
          message: 'Styles must be a string',
          value: 123,
        });
      });

      it('should pass with valid styles', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          styles: '.custom { color: red; }',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'styles')).toHaveLength(0);
      });
    });

    describe('stylesLink validation', () => {
      it('should return error when stylesLink is not a string', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          stylesLink: 123,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'stylesLink',
          message: 'Styles link must be a string',
          value: 123,
        });
      });

      it('should return error when stylesLink is invalid URL', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          stylesLink: 'invalid-url',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'stylesLink',
          message: 'Styles link must be a valid URL',
          value: 'invalid-url',
        });
      });

      it('should pass with valid stylesLink', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          stylesLink: 'https://example.com/styles.css',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'stylesLink')).toHaveLength(0);
      });
    });

    describe('boolean field validation', () => {
      const booleanFields = [
        'autoHeight',
        'enableLogging', 
        'enableGuestsRemoval',
        'canEditReservationDetails',
        'canShareRegistrationLink',
        'routeSync'
      ] as const;

      it('should return error when boolean fields are not boolean', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          autoHeight: 'true',
          enableLogging: 1,
          enableGuestsRemoval: null,
          canEditReservationDetails: {},
          canShareRegistrationLink: [],
          routeSync: 'false',
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        for (const field of booleanFields) {
          expect(result.errors).toContainEqual(
            expect.objectContaining({
              field,
              message: `${field} must be a boolean`,
            })
          );
        }
      });

      it('should pass with valid boolean values', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          autoHeight: true,
          enableLogging: false,
          enableGuestsRemoval: true,
          canEditReservationDetails: false,
          canShareRegistrationLink: true,
          routeSync: false,
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        for (const field of booleanFields) {
          expect(result.errors.filter(e => e.field === field)).toHaveLength(0);
        }
      });

      it('should pass when boolean fields are undefined', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        for (const field of booleanFields) {
          expect(result.errors.filter(e => e.field === field)).toHaveLength(0);
        }
      });
    });

    describe('mode validation', () => {
      it('should return error when mode is not a string', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          mode: 123,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'mode',
          message: 'Mode must be a string',
          value: 123,
        });
      });

      it('should return error when mode is not supported', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          mode: 'INVALID_MODE',
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'mode',
          message: `Unsupported mode "INVALID_MODE". Supported modes: ${Object.values(SDK_MODE).join(', ')}`,
          value: 'INVALID_MODE',
        });
      });

      it('should pass with valid modes', () => {
        for (const mode of Object.values(SDK_MODE)) {
          const config = { 
            apiKey: 'valid-api-key-123456789',
            mode,
            reservationId: 'res-123'
          } as ChekinGuestSDKConfig;
          const result = validator.validateConfig(config);

          expect(result.errors.filter(e => e.field === 'mode')).toHaveLength(0);
        }
      });
    });

    describe('prefillData validation', () => {
      it('should return error when prefillData is not an object', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          prefillData: 'invalid',
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'prefillData',
          message: 'Prefill data must be an object',
          value: 'invalid',
        });
      });

      it('should pass when prefillData is null or undefined', () => {
        const config1 = { 
          apiKey: 'valid-api-key-123456789',
          prefillData: null,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result1 = validator.validateConfig(config1);

        const config2 = { 
          apiKey: 'valid-api-key-123456789',
          prefillData: undefined,
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result2 = validator.validateConfig(config2);

        expect(result1.errors.filter(e => e.field === 'prefillData')).toHaveLength(0);
        expect(result2.errors.filter(e => e.field === 'prefillData')).toHaveLength(0);
      });

      it('should pass with valid prefillData', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          prefillData: { guestForm: { name: 'John' } },
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'prefillData')).toHaveLength(0);
      });
    });

    describe('callback validation', () => {
      const callbacks = [
        'onGuestRegistered',
        'onAllGuestsRegistered',
        'onReservationFound',
        'onReservationFetched',
        'onReservationCreated',
        'onReservationFoundFromHousing',
        'onHeightChanged',
        'onConnectionError',
        'onError',
        'onIVFinished',
        'onScreenChanged'
      ] as const;

      it('should return error when callbacks are not functions', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          onGuestRegistered: 'not-a-function',
          onAllGuestsRegistered: 123,
          onReservationFound: {},
          onReservationFetched: [],
          onReservationCreated: null,
          onReservationFoundFromHousing: true,
          onHeightChanged: 'callback',
          onConnectionError: 456,
          onError: false,
          onIVFinished: 'handler',
          onScreenChanged: 789,
          reservationId: 'res-123'
        } as unknown as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        for (const callback of callbacks) {
          expect(result.errors).toContainEqual(
            expect.objectContaining({
              field: callback,
              message: `${callback} must be a function`,
            })
          );
        }
      });

      it('should pass with valid callback functions', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          onGuestRegistered: () => {},
          onAllGuestsRegistered: () => {},
          onReservationFound: () => {},
          onReservationFetched: () => {},
          onReservationCreated: () => {},
          onReservationFoundFromHousing: () => {},
          onHeightChanged: () => {},
          onConnectionError: () => {},
          onError: () => {},
          onIVFinished: () => {},
          onScreenChanged: () => {},
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        for (const callback of callbacks) {
          expect(result.errors.filter(e => e.field === callback)).toHaveLength(0);
        }
      });

      it('should pass when callbacks are undefined', () => {
        const config = {
          apiKey: 'valid-api-key-123456789',
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        for (const callback of callbacks) {
          expect(result.errors.filter(e => e.field === callback)).toHaveLength(0);
        }
      });
    });

    describe('business logic validation', () => {
      it('should return error when no required IDs are provided', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'none',
          message: 'At least one of reservationId, housingId, or externalId is required',
          value: '',
        });
      });

      it('should pass when at least one required ID is provided', () => {
        const configs = [
          { apiKey: 'valid-api-key-123456789', reservationId: 'res-123' },
          { apiKey: 'valid-api-key-123456789', housingId: 'housing-456', mode: SDK_MODE.propertyLink },
          { apiKey: 'valid-api-key-123456789', externalId: 'ext-789' }
        ];

        for (const config of configs) {
          const result = validator.validateConfig(config as ChekinGuestSDKConfig);
          expect(result.errors.filter(e => e.field === 'none')).toHaveLength(0);
        }
      });

      it('should return error when guestId is used outside ONLY_GUEST_FORM mode', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          guestId: 'guest-123',
          mode: SDK_MODE.all,
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'guestId',
          message: 'The guestId can be used only in "ONLY_GUEST_FORM" mode',
          value: 'guest-123',
        });
      });

      it('should pass when guestId is used in ONLY_GUEST_FORM mode', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          guestId: 'guest-123',
          mode: SDK_MODE.onlyGuestForm,
          reservationId: 'res-123'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'guestId' && e.message.includes('ONLY_GUEST_FORM'))).toHaveLength(0);
      });

      it('should return error when guestId is used without reservationId or externalId', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          guestId: 'guest-123',
          mode: SDK_MODE.onlyGuestForm,
          housingId: 'housing-456'
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'guestId',
          message: 'The guestId should be passed with reservationId or externalId',
          value: 'guest-123',
        });
      });

      it('should return error when housingId is missing in PROPERTY_LINK mode', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          mode: SDK_MODE.propertyLink
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'housingId',
          message: 'The housingId is required in "PROPERTY_LINK" mode',
          value: undefined,
        });
      });

      it('should return error when housingId is used outside PROPERTY_LINK mode', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          housingId: 'housing-123',
          mode: SDK_MODE.all
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors).toContainEqual({
          field: 'housingId',
          message: 'The housingId can be used only in "PROPERTY_LINK" mode',
          value: 'housing-123',
        });
      });

      it('should pass when housingId is used in PROPERTY_LINK mode', () => {
        const config = { 
          apiKey: 'valid-api-key-123456789',
          housingId: 'housing-123',
          mode: SDK_MODE.propertyLink
        } as ChekinGuestSDKConfig;
        const result = validator.validateConfig(config);

        expect(result.errors.filter(e => e.field === 'housingId')).toHaveLength(0);
      });
    });
  });

  describe('static validateLanguage', () => {
    it('should return true for supported languages', () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        expect(ChekinSDKValidator.validateLanguage(lang)).toBe(true);
      }
    });

    it('should return false for unsupported languages', () => {
      const unsupportedLangs = ['xx', 'invalid', ''];
      for (const lang of unsupportedLangs) {
        expect(ChekinSDKValidator.validateLanguage(lang)).toBe(false);
      }
    });
  });

  describe('static validateMode', () => {
    it('should return true for supported modes', () => {
      for (const mode of Object.values(SDK_MODE)) {
        expect(ChekinSDKValidator.validateMode(mode)).toBe(true);
      }
    });

    it('should return false for unsupported modes', () => {
      const unsupportedModes = ['INVALID', 'TEST_MODE', ''];
      for (const mode of unsupportedModes) {
        expect(ChekinSDKValidator.validateMode(mode)).toBe(false);
      }
    });
  });

  describe('ValidationResult interface', () => {
    it('should return correct structure for valid config', () => {
      const config = { 
        apiKey: 'valid-api-key-123456789',
        reservationId: 'res-123'
      } as ChekinGuestSDKConfig;
      const result = validator.validateConfig(config);

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.isValid).toBe(true);
    });

    it('should return correct structure for invalid config', () => {
      const config = {} as ChekinGuestSDKConfig;
      const result = validator.validateConfig(config);

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle config with only warnings', () => {
      const config = { 
        apiKey: 'short',
        reservationId: 'res-123'
      } as ChekinGuestSDKConfig;
      const result = validator.validateConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should handle complex config with multiple errors and warnings', () => {
      const config = {
        apiKey: 'short',
        baseUrl: 'invalid-url',
        version: 'invalid-version',
        mode: 'INVALID_MODE',
        defaultLanguage: 'xx',
        housingId: 'housing-123',
        guestId: 'guest-123',
        autoHeight: 'true',
        onError: 'not-a-function'
      } as unknown as ChekinGuestSDKConfig;
      const result = validator.validateConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should handle null and undefined values correctly', () => {
      const config = {
        apiKey: 'valid-api-key-123456789',
        baseUrl: undefined,
        version: 'invalid-version',
        mode: undefined,
        reservationId: 'res-123'
      } as unknown as ChekinGuestSDKConfig;
      const result = validator.validateConfig(config);

      expect(result.warnings).toContainEqual({
        field: 'version',
        message: 'Version format should be "latest" or "development" or semantic version (e.g., "1.0.0", "v2.1.3")',
        value: 'invalid-version',
      });
    });
  });
});