import {useEffect, useRef, useImperativeHandle, forwardRef, CSSProperties} from 'react';
import {ChekinGuestSDK, ChekinGuestSDKConfig} from '@chekinapp/guest-sdk';

export interface ChekinGuestSDKViewProps extends ChekinGuestSDKConfig {
  className?: string;
  style?: CSSProperties;
}

export interface ChekinGuestSDKViewHandle {
  sdk: ChekinGuestSDK | null;
  container: HTMLDivElement | null;
}

export const ChekinGuestSDKView = forwardRef<
  ChekinGuestSDKViewHandle,
  ChekinGuestSDKViewProps
>((props, ref) => {
  const {className, style, ...sdkConfig} = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const sdkRef = useRef<ChekinGuestSDK | null>(null);

  useImperativeHandle(ref, () => ({
    sdk: sdkRef.current,
    container: containerRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current || !sdkConfig.apiKey) return;

    sdkRef.current = new ChekinGuestSDK(sdkConfig);

    const renderPromise = sdkRef.current.render(containerRef.current);

    renderPromise.catch(error => {
      console.error('Failed to render ChekinGuestSDK:', error);
      if (sdkConfig.onError) {
        sdkConfig.onError(error);
      }
    });

    return () => {
      if (sdkRef.current) {
        sdkRef.current.destroy();
        sdkRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sdkRef.current) {
      sdkRef.current.updateConfig(sdkConfig);
    }
  }, [
    sdkConfig.baseUrl,
    sdkConfig.version,
    sdkConfig.reservationId,
    sdkConfig.externalId,
    sdkConfig.housingId,
    sdkConfig.prefillData,
    sdkConfig.enableGuestsRemoval,
    sdkConfig.canEditReservationDetails,
    sdkConfig.canShareRegistrationLink,
    sdkConfig.autoHeight,
    sdkConfig.mode,
    sdkConfig.defaultLanguage,
    sdkConfig.styles,
    sdkConfig.stylesLink,
    sdkConfig.enableLogging,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        minHeight: '400px',
        ...style,
      }}
    />
  );
});

ChekinGuestSDKView.displayName = 'ChekinGuestSDKView';

// Legacy export for backward compatibility
export const ChekinHostSDKView = ChekinGuestSDKView;
export type ChekinHostSDKViewProps = ChekinGuestSDKViewProps;
export type ChekinHostSDKViewHandle = ChekinGuestSDKViewHandle;
