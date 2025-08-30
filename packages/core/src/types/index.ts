import {CHEKIN_EVENTS} from '../constants';

export type UseOnScreenChanged<MetaData> = {
  type: 'PAYMENTS_CART' | 'ORDER_HISTORY';
  meta?: MetaData;
  reservationId?: Record<string, unknown>;
  enabled?: boolean;
};

enum IV_DOCUMENT_IMAGE_TYPES {
  front = 'front',
  back = 'back',
  selfie = 'selfie',
}

enum IMAGE_SERVICE_ORIGIN {
  ocr = 'ocr',
  biomatch = 'biomatch',
}

export type ImageDetails = {
  id?: string;
  image: string | null;
  uploaded?: boolean;
  type: IV_DOCUMENT_IMAGE_TYPES;
  mrzDetected?: boolean;
  barcodeDetected?: boolean;
  faceDetected?: boolean;
  service?: IMAGE_SERVICE_ORIGIN;
  extraID?: string;
};

export type IdentityVerificationDetails = {
  imagesDetails: {
    [key in IV_DOCUMENT_IMAGE_TYPES]: Partial<ImageDetails> & {
      type: IV_DOCUMENT_IMAGE_TYPES;
    };
  };
  ocrPassed: boolean;
  biomatchPassed: boolean;
  distance: number | null;
};

enum GUEST_STATUSES {
  incomplete = 'INCOMPLETE',
  error = 'ERROR',
  new = 'NEW',
  complete = 'COMPLETED',
  verification_pending = 'VERIFICATION_PENDING',
}

type SelectOptionType = {label: string; value: string};
type LocationField = {code: string; name: string};

type GuestBaseProperties = {
  id: string;
  name: string;
  surname: string;
  second_surname: string;
  birth_date: string;
  citizenship: string;
  email: string;
  signature: string;
  document_number: string;
  document_issue_date: string;
  document_expedition_municipality: string | undefined;
  document_expiration_date: string;
  birth_place_municipality?: string;
  birth_place_address: string;
  residence_province: string;
  residence_municipality?: string;
  residence_address: string;
  residence_postal_code: string;
  document_support_number: string;
  fiscal_code: string;
  visa_number: string | null;
  is_leader: boolean;
};

type Guest = GuestBaseProperties & {
  reservation_id: string | undefined;
  arrived_from_country: string | LocationField | null;
  arrived_from_district: string | LocationField | null;
  arrived_from_municipality: string | LocationField | null;
  biomatch_doc: string | null;
  biomatch_passed: boolean;
  biomatch_percentage: number;
  biomatch_selfie: string | null;
  external_category_id: string | null;
  external_documents_back_side_scan: string | null;
  external_documents_back_side_scan_service: string | null;
  external_documents_biomatch_doc: string | null;
  external_documents_biomatch_doc_service: string | null;
  external_documents_biomatch_selfie: string | null;
  external_documents_biomatch_selfie_service: string | null;
  external_documents_front_side_scan: string | null;
  external_documents_front_side_scan_service: string | null;
  full_tourist_tax: string | null;
  gender: SelectOptionType;
  is_pre_registered: boolean;
  kinship_relationship: SelectOptionType;
  next_destination_address: string | LocationField | null;
  next_destination_country: string | LocationField | null;
  next_destination_district: string | LocationField | null;
  next_destination_municipality: string | LocationField | null;
  ocr_passed: boolean;
  ocr_was_used?: boolean;
  document_back_side_scan: string | null;
  document_front_side_scan: string | null;
  guestapp_status: GUEST_STATUSES;
  nationality: LocationField;
  document_type: SelectOptionType;
  document_expedition_country: string | LocationField;
  document_expedition_city: string | LocationField;
  tax_exemption: SelectOptionType;
  phone: {code: string; number: string};
  participant_id: string | null;
  birth_place_country: string | LocationField;
  birth_place_city: string | LocationField;
  residence_country: LocationField;
  residence_city: string | LocationField;
};

export interface PrefillData {
  guestForm?: {
    name?: string;
    surname?: string;
    second_surname?: string;
    gender?: 'M' | 'F';
    birth_date?: string;
    nationality?: {label: string; value: string};
    document_type?: string;
    document_number?: string;
    visa_number?: string;
    document_issue_date?: string;
    document_expiration_date?: string;
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
  defaultLanguage?:
    | 'en'
    | 'es'
    | 'el'
    | 'uk'
    | 'it'
    | 'de'
    | 'fr'
    | 'hu'
    | 'ru'
    | 'cs'
    | 'bg'
    | 'pt'
    | 'ro'
    | 'et'
    | 'pl'
    | 'ca';
  styles?: string;
  stylesLink?: string;
  disableLogging?: boolean;
  routeSync?: boolean;
  // Guest-specific event callbacks
  onGuestRegistered?: (guest: Guest) => void;
  onAllGuestsRegistered?: () => void;
  onReservationFound?: () => void;
  onReservationFetched?: (data: {isSuccess: boolean}) => void;
  onReservationCreated?: (reservation: {id: string}) => void;
  onReservationFoundFromHousing?: (reservation: {id: string}) => void;
  onHeightChanged?: (height: number) => void;
  onConnectionError?: (error: unknown) => void;
  onError?: (error: unknown) => void;
  onIVFinished?: (details: IdentityVerificationDetails) => void;
  onScreenChanged?: (data: UseOnScreenChanged<Record<string, unknown>>) => void;
}

// Legacy alias for backward compatibility
export interface ChekinSDKConfig extends ChekinGuestSDKConfig {}

export interface ChekinMessage {
  type: keyof typeof CHEKIN_EVENTS | string;
  payload: unknown;
}

export type ChekinEventCallback<T = unknown> = (payload: T) => void;
