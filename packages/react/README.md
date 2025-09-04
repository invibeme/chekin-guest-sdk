# chekin-guest-sdk-react

React components and hooks for integrating Chekin's guest registration and check-in platform into React applications. Built on top of the core `chekin-guest-sdk` package.

## Overview

This package provides React-specific components and hooks that make it easy to integrate the Chekin Guest SDK into React applications. It handles component lifecycle, event management, and provides a clean React API.

## Key Features

- **ChekinGuestSDKView Component** - Drop-in React component with full SDK integration
- **useGuestSDKEventListener Hook** - Event listener hook with automatic cleanup
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Ref Support** - Direct access to the underlying SDK instance
- **Automatic Lifecycle Management** - Handles SDK creation and cleanup automatically

## Installation

```bash
npm install chekin-guest-sdk-react
```

**Note**: This package has peer dependencies on `react` and `react-dom` (>=16.8.0), and automatically includes the core `chekin-guest-sdk` package.

## Quick Start

### Basic Component Usage

```jsx
import {ChekinGuestSDKView} from 'chekin-guest-sdk-react';

function MyComponent() {
  return (
    <ChekinGuestSDKView
      apiKey="your-api-key"
      reservationId="reservation-123"
      mode="ALL"
      autoHeight={true}
      onHeightChanged={height => console.log('Height:', height)}
      onError={error => console.error('SDK Error:', error)}
      onGuestRegistered={guest => console.log('Guest registered:', guest)}
    />
  );
}
```

### Using with Ref

```jsx
import { useRef } from 'react';
import { ChekinGuestSDKView } from 'chekin-guest-sdk-react';
import type { ChekinGuestSDKViewHandle } from 'chekin-guest-sdk-react';

function MyComponent() {
  const sdkRef = useRef<ChekinGuestSDKViewHandle>(null);

  const handleButtonClick = () => {
    // Access the underlying SDK instance
    const sdk = sdkRef.current?.sdk;
    if (sdk) {
      sdk.updateConfig({ 
        reservationId: 'new-reservation-456',
        enableLogging: true 
      });
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Update Config</button>
      <ChekinGuestSDKView
        ref={sdkRef}
        apiKey="your-api-key"
        reservationId="reservation-123"
        mode="ALL"
        className="my-sdk-container"
        style={{ minHeight: '400px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
```

### Using Event Listener Hook

```jsx
import {ChekinGuestSDKView, useGuestSDKEventListener} from 'chekin-guest-sdk-react';

function MyComponent() {
  useGuestSDKEventListener({
    onHeightChanged: height => {
      console.log('Height changed:', height);
      // Update your layout or trigger animations
    },
    onError: error => {
      console.error('SDK Error:', error.message);
      // Handle errors, show notifications, etc.
    },
    onConnectionError: error => {
      console.error('Connection Error:', error);
      // Handle network issues
    },
    onGuestRegistered: guest => {
      console.log('Guest registered:', guest.name, guest.surname);
    },
    onAllGuestsRegistered: () => {
      console.log('All guests registered');
    },
  });

  return (
    <ChekinGuestSDKView 
      apiKey="your-api-key" 
      reservationId="reservation-123"
      mode="ALL"
    />
  );
}
```

## API Reference

### ChekinGuestSDKView Component

The main React component for embedding the Chekin Guest SDK.

#### Props

For a complete list of all configuration parameters with detailed descriptions, see the [Complete Parameters Table](../core/README.md#complete-parameters-table) in the core SDK documentation.

The component accepts all configuration options from the core SDK plus additional React-specific props:

| Prop          | Type            | Required | Description                            |
| ------------- | --------------- | -------- | -------------------------------------- |
| `apiKey`      | `string`        | ✅       | Your Chekin API key                    |
| `className`   | `string`        | ❌       | CSS class for the container div        |
| `style`       | `CSSProperties` | ❌       | Inline styles for the container div    |
| ...SDK config | Various         | ❌       | All other props from `ChekinGuestSDKConfig` |

**Core SDK Configuration Props:**

- `baseUrl` - Custom base URL for SDK hosting
- `version` - Pin to specific SDK version
- `mode` - SDK mode: 'ALL', 'ONLY_GUEST_FORM', 'IV_ONLY', 'PROPERTY_LINK'
- `reservationId` - Pre-load specific reservation
- `externalId` - External ID for PMS integrations
- `guestId` - Specific guest ID (ONLY_GUEST_FORM mode only)
- `housingId` - Pre-select specific housing (PROPERTY_LINK mode only)
- `defaultLanguage` - Default interface language
- `styles` - Custom CSS styles as string
- `stylesLink` - URL to external stylesheet
- `autoHeight` - Auto-adjust iframe height
- `enableLogging` - Enable SDK logging (disabled by default)
- `prefillData` - Pre-fill guest form data
- `enableGuestsRemoval` - Allow guests to be removed
- `canEditReservationDetails` - Allow editing reservation details
- `canShareRegistrationLink` - Enable sharing registration links
- `routeSync` - Enable URL synchronization

**Event Callbacks:**

- `onHeightChanged` - Callback for height changes
- `onError` - Error callback
- `onConnectionError` - Connection error callback
- `onGuestRegistered` - Guest registration callback
- `onAllGuestsRegistered` - All guests registered callback
- `onReservationFound` - Reservation loaded callback
- `onReservationFetched` - Reservation fetch completed callback
- `onReservationCreated` - New reservation created callback
- `onReservationFoundFromHousing` - Reservation found via housing callback
- `onIVFinished` - Identity verification completed callback
- `onScreenChanged` - Screen/route changed callback

#### ChekinGuestSDKViewHandle

When using a ref, you get access to:

```typescript
interface ChekinGuestSDKViewHandle {
  sdk: ChekinGuestSDK | null; // Direct access to the SDK instance
  container: HTMLDivElement | null; // The container DOM element
}
```

### useGuestSDKEventListener Hook

A React hook for listening to SDK events with automatic cleanup.

#### Parameters

```typescript
interface GuestSDKEventCallbacks {
  onHeightChanged?: (height: number) => void;
  onError?: (error: {message: string; code?: string}) => void;
  onConnectionError?: (error: any) => void;
  onGuestRegistered?: (guest: Guest) => void;
  onAllGuestsRegistered?: () => void;
  onReservationFound?: () => void;
  onReservationFetched?: (data: {isSuccess: boolean}) => void;
  onReservationCreated?: (reservation: {id: string}) => void;
  onReservationFoundFromHousing?: (reservation: {id: string}) => void;
  onIVFinished?: (details: IdentityVerificationDetails) => void;
  onScreenChanged?: (data: any) => void;
}
```

#### Usage

```jsx
useGuestSDKEventListener({
  onHeightChanged: height => {
    // Handle height changes
  },
  onError: error => {
    // Handle errors
  },
  onGuestRegistered: guest => {
    // Handle guest registration
  },
  // ... other callbacks
});
```

**Note:** The hook automatically adds event listeners when the component mounts and removes them when it unmounts.

## Advanced Examples

### Custom Styling

```jsx
import {ChekinGuestSDKView} from 'chekin-guest-sdk-react';

function StyledSDK() {
  const customStyles = `
    .primary-button {
      background-color: #007cba;
      border-radius: 8px;
      font-weight: 600;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
  `;

  return (
    <ChekinGuestSDKView
      apiKey="your-api-key"
      reservationId="reservation-123"
      mode="ALL"
      styles={customStyles}
      className="custom-sdk-wrapper"
      style={{
        border: '1px solid #e1e5e9',
        borderRadius: '12px',
        overflow: 'hidden',
        minHeight: '500px',
      }}
    />
  );
}
```

### Dynamic Configuration Updates

```jsx
import { useState, useRef } from 'react';
import { ChekinGuestSDKView } from 'chekin-guest-sdk-react';
import type { ChekinGuestSDKViewHandle } from 'chekin-guest-sdk-react';

function DynamicSDK() {
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [currentReservation, setCurrentReservation] = useState('');
  const sdkRef = useRef<ChekinGuestSDKViewHandle>(null);

  const updateMode = (mode: string) => {
    setSelectedMode(mode);
    // Update the SDK configuration
    sdkRef.current?.sdk?.updateConfig({ mode });
  };

  const selectReservation = (reservationId: string) => {
    setCurrentReservation(reservationId);
    sdkRef.current?.sdk?.updateConfig({ reservationId });
  };

  return (
    <div>
      <div className="controls">
        <button onClick={() => updateMode('ALL')}>
          Full Mode
        </button>
        <button onClick={() => updateMode('ONLY_GUEST_FORM')}>
          Guest Form Only
        </button>
        <button onClick={() => updateMode('PROPERTY_LINK')}>
          Property Link Mode
        </button>
        <button onClick={() => selectReservation('reservation-123')}>
          Load Reservation
        </button>
      </div>

      <ChekinGuestSDKView
        ref={sdkRef}
        apiKey="your-api-key"
        mode={selectedMode}
        reservationId={currentReservation}
        autoHeight={true}
        enableLogging={true}
      />
    </div>
  );
}
```

### Error Handling

```jsx
import {useState} from 'react';
import {ChekinGuestSDKView, useGuestSDKEventListener} from 'chekin-guest-sdk-react';

function SDKWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  useGuestSDKEventListener({
    onError: error => {
      setError(error.message);
      console.error('SDK Error:', error);
    },
    onConnectionError: error => {
      setIsConnected(false);
      console.error('Connection Error:', error);
    },
  });

  if (error) {
    return (
      <div className="error-container">
        <h3>SDK Error</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="offline-container">
        <h3>Connection Lost</h3>
        <p>Please check your internet connection and try again.</p>
        <button onClick={() => setIsConnected(true)}>Retry</button>
      </div>
    );
  }

  return (
    <ChekinGuestSDKView 
      apiKey="your-api-key" 
      reservationId="reservation-123"
      mode="ALL"
    />
  );
}
```

### Multiple SDK Modes

```jsx
import { useState } from 'react';
import { ChekinGuestSDKView } from 'chekin-guest-sdk-react';

function MultiModeSDK() {
  const [activeMode, setActiveMode] = useState('property-selection');

  const renderSDK = () => {
    switch (activeMode) {
      case 'property-selection':
        return (
          <ChekinGuestSDKView
            apiKey="your-api-key"
            mode="PROPERTY_LINK"
            housingId="housing-123"
            onReservationFoundFromHousing={(reservation) => {
              console.log('Found reservation:', reservation);
              setActiveMode('guest-form');
            }}
          />
        );
      
      case 'guest-form':
        return (
          <ChekinGuestSDKView
            apiKey="your-api-key"
            mode="ONLY_GUEST_FORM"
            reservationId="reservation-123"
            onAllGuestsRegistered={() => {
              console.log('All guests registered');
              setActiveMode('verification');
            }}
          />
        );
      
      case 'verification':
        return (
          <ChekinGuestSDKView
            apiKey="your-api-key"
            mode="IV_ONLY"
            reservationId="reservation-123"
            onIVFinished={(results) => {
              console.log('Verification completed:', results);
              setActiveMode('complete');
            }}
          />
        );
      
      case 'complete':
        return (
          <div className="completion-message">
            <h2>Check-in Complete!</h2>
            <p>Thank you for completing your registration.</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="multi-mode-sdk">
      <div className="progress-indicator">
        <span className={activeMode === 'property-selection' ? 'active' : ''}>
          Property Selection
        </span>
        <span className={activeMode === 'guest-form' ? 'active' : ''}>
          Guest Registration
        </span>
        <span className={activeMode === 'verification' ? 'active' : ''}>
          ID Verification
        </span>
        <span className={activeMode === 'complete' ? 'active' : ''}>
          Complete
        </span>
      </div>
      
      {renderSDK()}
    </div>
  );
}
```

## TypeScript Support

This package is built with TypeScript and provides comprehensive type definitions:

```typescript
import type {
  ChekinGuestSDKViewProps,
  ChekinGuestSDKViewHandle,
  GuestSDKEventCallbacks,
} from 'chekin-guest-sdk-react';

// All core SDK types are also re-exported
import type {ChekinGuestSDKConfig} from 'chekin-guest-sdk-react';
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- React 16.8+ (hooks support required)

## Development

### Building

```bash
# Build the React package
npm run build

# Development mode with watching
npm run dev
```

### Peer Dependencies

This package requires:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `chekin-guest-sdk` >= 1.0.0

## Related Packages

- **[chekin-guest-sdk](../core/README.md)** - Core framework-agnostic SDK that this package is built on

## License

MIT License - see [LICENSE](../../LICENSE) file for details.