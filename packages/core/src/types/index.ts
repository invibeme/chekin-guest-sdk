import {CHEKIN_EVENTS} from '../constants';

type ConnectionState =
  | 'CONNECTION_VALIDATION_FAILED'
  | 'CONNECTION_ERROR'
  | 'DISCONNECTION_ERROR'
  | 'CONNECTED'
  | 'DISCONNECTED';

export interface IVResult {
  ocrPassed: boolean;
  biomatchPassed: boolean;
  distance: number | null;
  imagesDetails: any;
}

export interface PrefillData {
  guestForm?: {
    name?: string;
    surname?: string;
    second_surname?: string;
    gender?: 'M' | 'F';
    birth_date?: Date | string;
    nationality?: {label: string; value: string};
    document_type?: string;
    document_number?: string;
    visa_number?: string;
    document_issue_date?: Date | string;
    document_expiration_date?: Date | string;
    birth_place_country?: {label: string; value: string};
    birth_place_address?: string;
    residence_country?: {label: string; value: string};
    document_expedition_country?: {label: string; value: string};
    residence_address?: string;
    next_destination_country?: {label: string; value: string};
    next_destination_district?: {label: string; value: string};
    next_destination_municipality?: {label: string; value: string};
    next_destination_address?: string;
    residence_postal_code?: string;
    citizenship?: {label: string; value: string};
    purpose_of_stay?: string;
    arrived_from_country?: {label: string; value: string};
    arrived_from_district?: {label: string; value: string};
    phone?: {code: string; number: string};
    document_support_number?: string;
    kinship_relationship?: string;
    fiscal_code?: string;
    email?: string;
    [key: string]: any;
  };
}

export interface ChekinGuestSDKConfig {
  apiKey: string;
  baseUrl?: string;
  version?: string;
  reservationId?: string;
  externalId?: string;
  housingId?: string;
  prefillData?: PrefillData;
  enableGuestsRemoval?: boolean;
  canEditReservationDetails?: boolean;
  canShareRegistrationLink?: boolean;
  autoHeight?: boolean;
  mode?: 'ALL' | 'ONLY_GUEST_FORM' | 'ONLY_IV' | 'PROPERTY_LINK';
  defaultLanguage?: 'en' | 'es' | 'it' | 'de' | 'fr' | 'hu' | 'ru' | 'cs' | 'bg' | 'pt' | 'ro' | 'et' | 'pl' | 'ca';
  styles?: string;
  stylesLink?: string;
  disableLogging?: boolean;
  routeSync?: boolean;
  // Guest-specific event callbacks
  onGuestRegistered?: (guest: any) => void;
  onAllGuestsRegistered?: () => void;
  onReservationFound?: (reservation: any) => void;
  onReservationFetched?: (result: any) => void;
  onIVFinished?: (result: IVResult) => void;
  onReservationCreated?: (reservation: any) => void;
  onReservationFoundFromHousing?: (reservation: any) => void;
  onHeightChanged?: (height: number) => void;
  onConnectionError?: (error: string) => void;
  onError?: (error: any) => void;
  onScreenChanged?: (type: 'PAYMENTS_CART' | 'ORDER_HISTORY', reservationId: string, meta: any) => void;
}

// Legacy alias for backward compatibility
export interface ChekinSDKConfig extends ChekinGuestSDKConfig {}

export interface ChekinMessage {
  type: keyof typeof CHEKIN_EVENTS | string;
  payload: unknown;
}

export interface ChekinEventType {
  [CHEKIN_EVENTS.HEIGHT_CHANGED]: number;
  [CHEKIN_EVENTS.ERROR]: any;
  [CHEKIN_EVENTS.CONNECTION_ERROR]: string;
  [CHEKIN_EVENTS.GUEST_REGISTERED]: any;
  [CHEKIN_EVENTS.ALL_GUESTS_REGISTERED]: void;
  [CHEKIN_EVENTS.RESERVATION_FOUND]: any;
  [CHEKIN_EVENTS.RESERVATION_FETCHED]: any;
  [CHEKIN_EVENTS.IV_FINISHED]: IVResult;
  [CHEKIN_EVENTS.RESERVATION_CREATED]: any;
  [CHEKIN_EVENTS.RESERVATION_FOUND_FROM_HOUSING]: any;
  [CHEKIN_EVENTS.SCREEN_CHANGED]: {type: string; reservationId: string; meta: any};
}

export type ChekinEventCallback<T = unknown> = (payload: T) => void;
