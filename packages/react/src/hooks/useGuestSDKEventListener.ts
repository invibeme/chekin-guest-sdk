import {useEffect, useRef} from 'react';
import {CHEKIN_EVENTS, ChekinGuestSDKConfig} from '@chekinapp/guest-sdk';

export interface GuestSDKEventCallbacks
  extends Pick<
    ChekinGuestSDKConfig,
    | 'onHeightChanged'
    | 'onError'
    | 'onConnectionError'
    | 'onGuestRegistered'
    | 'onAllGuestsRegistered'
    | 'onReservationFound'
    | 'onReservationFetched'
    | 'onIVFinished'
    | 'onReservationCreated'
    | 'onReservationFoundFromHousing'
    | 'onScreenChanged'
  > {}

export function useGuestSDKEventListener(eventHandlers: GuestSDKEventCallbacks) {
  const callbacksRef = useRef(eventHandlers);

  useEffect(() => {
    callbacksRef.current = eventHandlers;
  }, [eventHandlers]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      const {type, payload} = event.data;

      switch (type) {
        case CHEKIN_EVENTS.HEIGHT_CHANGED:
          callbacksRef.current.onHeightChanged?.(payload);
          break;
        case CHEKIN_EVENTS.ERROR:
          callbacksRef.current.onError?.(payload);
          break;
        case CHEKIN_EVENTS.CONNECTION_ERROR:
          callbacksRef.current.onConnectionError?.(payload);
          break;
        case CHEKIN_EVENTS.GUEST_REGISTERED:
          callbacksRef.current.onGuestRegistered?.(payload);
          break;
        case CHEKIN_EVENTS.ALL_GUESTS_REGISTERED:
          callbacksRef.current.onAllGuestsRegistered?.();
          break;
        case CHEKIN_EVENTS.RESERVATION_FOUND:
          callbacksRef.current.onReservationFound?.();
          break;
        case CHEKIN_EVENTS.RESERVATION_FETCHED:
          callbacksRef.current.onReservationFetched?.(payload);
          break;
        case CHEKIN_EVENTS.IV_FINISHED:
          callbacksRef.current.onIVFinished?.(payload);
          break;
        case CHEKIN_EVENTS.RESERVATION_CREATED:
          callbacksRef.current.onReservationCreated?.(payload);
          break;
        case CHEKIN_EVENTS.RESERVATION_FOUND_FROM_HOUSING:
          callbacksRef.current.onReservationFoundFromHousing?.(payload);
          break;
        case CHEKIN_EVENTS.SCREEN_CHANGED:
          if (payload && callbacksRef.current.onScreenChanged) {
            callbacksRef.current.onScreenChanged(payload);
          }
          break;
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);
}

// Legacy export for backward compatibility
export const useHostSDKEventListener = useGuestSDKEventListener;
export type HostSDKEventCallbacks = GuestSDKEventCallbacks;
