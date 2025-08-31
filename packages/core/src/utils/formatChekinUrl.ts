import {ChekinGuestSDKConfig} from '../types';

const VersionMapper = {
  latest: 'latest',
  development: 'dev',
  dev: 'dev',
};

const getBaseUrl = (version = 'latest') => {
  const normalizedVersion = VersionMapper[version as keyof typeof VersionMapper]
    ? version
    : version.startsWith('v')
      ? version
      : `v${version}`;
  return `https://cdn.chekin.com/guest-sdk/${normalizedVersion}/`;
};

export interface UrlConfigResult {
  url: string;
  postMessageConfig?: Partial<ChekinGuestSDKConfig>;
  isLengthLimited: boolean;
}

export function formatChekinUrl(config: ChekinGuestSDKConfig): UrlConfigResult {
  const version = config.version || 'latest';
  const baseUrl = config.baseUrl || getBaseUrl(version);

  const url = new URL(baseUrl);

  const essentialParams = {
    apiKey: config.apiKey,
    housingId: config.housingId,
    externalId: config.externalId,
    reservationId: config.reservationId,
    lang: config.defaultLanguage,
    autoHeight: config.autoHeight,
    mode: config.mode,
    enableGuestsRemoval: config.enableGuestsRemoval,
    canEditReservationDetails: config.canEditReservationDetails,
    canShareRegistrationLink: config.canShareRegistrationLink,
  };

  // Add essential parameters to URL
  Object.entries(essentialParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          url.searchParams.set(key, value.join(','));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });

  let postMessageConfig = {};
  let isLengthLimited = false;

  if (config.stylesLink) {
    const encodedStylesLink = encodeURIComponent(config.stylesLink);
    if (encodedStylesLink.length < 500) {
      url.searchParams.set('stylesLink', encodedStylesLink);
    } else {
      postMessageConfig = {
        ...postMessageConfig,
        stylesLink: config.stylesLink,
      };
      isLengthLimited = true;
    }
  }

  if (config.styles) {
    const encodedStyles = encodeURIComponent(config.styles);

    if (encodedStyles.length < 500) {
      url.searchParams.set('styles', encodedStyles);
    } else {
      postMessageConfig = {...postMessageConfig, styles: config.styles};
      isLengthLimited = true;
    }
  }

  if (config.prefillData) {
    postMessageConfig = {...postMessageConfig, prefillData: config.prefillData};
  }

  const finalUrl = url.toString();

  return {
    url: finalUrl,
    postMessageConfig:
      Object.keys(postMessageConfig).length > 0 ? postMessageConfig : undefined,
    isLengthLimited,
  };
}
