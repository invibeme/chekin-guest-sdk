# Migration Guide: From ChekinPro to Chekin Guest SDK

This guide will help you migrate from the legacy ChekinPro SDK to the new Chekin Guest SDK. The new SDK offers improved TypeScript support, better error handling, React components, and enhanced functionality.

## Overview of Changes

### Package Changes

- **Old**: `ChekinPro` class from CDN
- **New**: `@chekinapp/guest-sdk` (vanilla JS/TS) and `@chekinapp/guest-sdk-react` (React. In development) npm packages

### Key Improvements

- ✅ **TypeScript Support**: Full type definitions and better IDE experience
- ✅ **Framework Agnostic**: Core SDK works with any framework
- ✅ **React Components**: Dedicated React package with hooks
- ✅ **Better Error Handling**: Comprehensive validation and logging
- ✅ **Modern Build System**: ESM/CJS support, tree-shaking
- ✅ **Enhanced Communication**: Improved parent-iframe messaging
- ✅ **Route Synchronization**: Built-in URL sync capabilities

## Installation

### Old SDK (CDN)

```html
<script src="https://cdn.chekin.com/v{VERSION}/ChekinPro.js"></script>
```

### New SDK (npm packages)

**Vanilla JS/TypeScript:**

```bash
npm install @chekinapp/guest-sdk
```

**React:**

```bash
npm install @chekinapp/guest-sdk-react
```

## API Key Generation

API key generation remains the same:

1. Visit https://dashboard.chekin.com/account/online-checkin/
2. Click "New API Key"
3. Enter application name and DNS
4. Choose application type:
   - **Guestapp**: For guest registration and check-in
   - **Housings**: For property management
5. Configure "Has access to all" if needed
6. Generate and copy the API key

## Migration Steps

### 1. Class Name and Import Changes

**Old (ChekinPro):**

```javascript
const api = new ChekinPro();
```

**New (Vanilla JS):**

```javascript
import {ChekinGuestSDK} from '@chekinapp/guest-sdk';

const sdk = new ChekinGuestSDK({
  apiKey: 'your-api-key',
  // other config options
});
```

**New (React. IN DEVELOPMENT and NOT READY):**

```jsx
import {ChekinGuestSDKView} from '@chekinapp/guest-sdk-react';

<ChekinGuestSDKView
  apiKey="your-api-key"
  // other props
/>;
```

### 2. Initialization Changes

**Old:**

```javascript
sdk.initialize({
  apiKey: API_KEY,
  reservationId: RESERVATION_ID,
});

sdk.renderApp({targetNode: 'root'});
```

**New (Vanilla JS):**

```javascript
// Option 1: Constructor + render
const sdk = new ChekinGuestSDK({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
});

await sdk.render('root');

// Option 2: initAndRender (similar to old pattern)
await sdk.initAndRender({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
  targetNode: 'root',
});

// Option 3: Separate initialization (backward compatible)
sdk.initialize({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
});
await sdk.renderApp({targetNode: 'root'});
```

**New (React):**

```jsx
function MyComponent() {
  return (
    <ChekinGuestSDKView
      apiKey="your-api-key"
      reservationId="reservation-123"
      onGuestRegistered={guest => console.log(guest)}
    />
  );
}
```

### 3. Configuration Property Mapping

| Old Property                    | New Property                    | Notes                                    |
| ------------------------------- | ------------------------------- | ---------------------------------------- |
| `apiKey`                        | `apiKey`                        | ✅ Same                                  |
| `reservationId`                 | `reservationId`                 | ✅ Same                                  |
| `externalId`                    | `externalId`                    | ✅ Same                                  |
| `housingId`                     | `housingId`                     | ✅ Same                                  |
| `prefillData`                   | `prefillData`                   | ✅ Same structure                        |
| `enableGuestsRemoval`           | `enableGuestsRemoval`           | ✅ Same                                  |
| `canEditReservationDetails`     | `canEditReservationDetails`     | ✅ Same                                  |
| `canShareRegistrationLink`      | `canShareRegistrationLink`      | ✅ Same                                  |
| `autoHeight`                    | `autoHeight`                    | ✅ Same                                  |
| `mode`                          | `mode`                          | ✅ Same values                           |
| `styles`                        | `styles`                        | ✅ Same                                  |
| `stylesLink`                    | `stylesLink`                    | ✅ Same                                  |
| `defaultLanguage`               | `defaultLanguage`               | ✅ Same                                  |
| `onGuestRegistered`             | `onGuestRegistered`             | ✅ Same                                  |
| `onAllGuestsRegistered`         | `onAllGuestsRegistered`         | ✅ Same                                  |
| `onReservationFound`            | `onReservationFound`            | ✅ Same                                  |
| `onReservationFetched`          | `onReservationFetched`          | ✅ Same                                  |
| `onIVFinished`                  | `onIVFinished`                  | ✅ Same                                  |
| `onReservationCreated`          | `onReservationCreated`          | ✅ Same                                  |
| `onReservationFoundFromHousing` | `onReservationFoundFromHousing` | ✅ Same                                  |
| `onHeightChanged`               | `onHeightChanged`               | ✅ Same                                  |
| `onConnectionError`             | `onConnectionError`             | ✅ Same                                  |
| `onError`                       | `onError`                       | ✅ Same                                  |
| `onScreenChanged`               | `onScreenChanged`               | ✅ Same                                  |
| N/A                             | `enableLogging`                 | 🆕 **New**: Enable comprehensive logging |
| N/A                             | `baseUrl`                       | 🆕 **New**: Custom base URL support      |
| N/A                             | `version`                       | 🆕 **New**: Pin to specific version      |
| N/A                             | `guestId`                       | 🆕 **New**: Direct guest targeting       |
| N/A                             | `routeSync`                     | 🆕 **New**: URL synchronization          |

### 4. Method Changes

| Old Method                | New Method                 | Notes                                  |
| ------------------------- | -------------------------- | -------------------------------------- |
| `initialize(config)`      | `initialize(config)`       | ✅ Same (optional)                     |
| `renderApp({targetNode})` | `renderApp({targetNode})`  | ✅ Same                                |
| `renderApp({targetNode})` | `render(element)`          | 🆕 **New**: Accepts element or string  |
| `initAndRender(config)`   | `initAndRender(config)`    | ✅ Same                                |
| `unmount()`               | `unmount()`                | ✅ Same                                |
| `unmount()`               | `destroy()`                | 🆕 **New**: More comprehensive cleanup |
| N/A                       | `updateConfig(config)`     | 🆕 **New**: Runtime config updates     |
| N/A                       | `navigate(path)`           | 🆕 **New**: Programmatic navigation    |
| N/A                       | `enableRouteSync(options)` | 🆕 **New**: Enable URL sync            |
| N/A                       | `disableRouteSync()`       | 🆕 **New**: Disable URL sync           |
| N/A                       | `getCurrentRoute()`        | 🆕 **New**: Get current route          |
| N/A                       | `on(event, callback)`      | 🆕 **New**: Event listeners            |
| N/A                       | `off(event, callback)`     | 🆕 **New**: Remove event listeners     |
| N/A                       | `getLogger()`              | 🆕 **New**: Access logger instance     |

## Complete Migration Examples

### Vanilla JavaScript Migration

**Old Implementation:**

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.chekin.com/latest/ChekinPro.js"></script>
  </head>
  <body>
    <div id="chekin-container"></div>

    <script>
      const api = new ChekinPro();

      api.initialize({
        apiKey: 'your-api-key',
        reservationId: 'reservation-123',
        mode: 'ALL',
        autoHeight: true,
        defaultLanguage: 'en',
        onGuestRegistered: guest => {
          console.log('Guest registered:', guest);
        },
        onHeightChanged: height => {
          console.log('Height changed:', height);
        },
      });

      api.renderApp({targetNode: 'chekin-container'});
    </script>
  </body>
</html>
```

**New Implementation:**

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import {ChekinGuestSDK} from 'https://unpkg.com/@chekinapp/guest-sdk/dist/index.js';

      const sdk = new ChekinGuestSDK({
        apiKey: 'your-api-key',
        reservationId: 'reservation-123',
        mode: 'ALL',
        autoHeight: true,
        defaultLanguage: 'en',
        enableLogging: true, // New feature
        onGuestRegistered: guest => {
          console.log('Guest registered:', guest);
        },
        onHeightChanged: height => {
          console.log('Height changed:', height);
        },
      });

      // Option 1: Same as old pattern
      await sdk.renderApp({targetNode: 'chekin-container'});

      // Option 2: New simplified pattern
      // await sdk.render('chekin-container');
    </script>
  </head>
  <body>
    <div id="chekin-container"></div>
  </body>
</html>
```

**Or using npm:**

```javascript
import {ChekinGuestSDK} from '@chekinapp/guest-sdk';

const sdk = new ChekinGuestSDK({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
  mode: 'ALL',
  autoHeight: true,
  enableLogging: true,
  onGuestRegistered: guest => {
    console.log('Guest registered:', guest);
  },
});

await sdk.render('chekin-container');
```

### React Migration

**Old (with ChekinPro):**

```jsx
import React, {useEffect, useRef} from 'react';

function ChekinContainer({reservationId}) {
  const containerRef = useRef(null);
  const sdkRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      sdkRef.current = new ChekinPro();

      sdkRef.current.initialize({
        apiKey: 'your-api-key',
        reservationId: reservationId,
        onGuestRegistered: guest => {
          console.log('Guest registered:', guest);
        },
      });

      sdkRef.current.renderApp({
        targetNode: containerRef.current.id,
      });
    }

    return () => {
      if (sdkRef.current) {
        sdkRef.current.unmount();
      }
    };
  }, [reservationId]);

  return <div ref={containerRef} id="chekin-container" />;
}
```

**New (with React components):**

```jsx
import React from 'react';
import {ChekinGuestSDKView} from '@chekinapp/guest-sdk-react';

function ChekinContainer({reservationId}) {
  const handleGuestRegistered = guest => {
    console.log('Guest registered:', guest);
  };

  return (
    <ChekinGuestSDKView
      apiKey="your-api-key"
      reservationId={reservationId}
      mode="ALL"
      autoHeight={true}
      enableLogging={true}
      onGuestRegistered={handleGuestRegistered}
      style={{minHeight: '600px'}}
    />
  );
}
```

**With React ref access:**

```jsx
import React, {useRef} from 'react';
import {ChekinGuestSDKView} from '@chekinapp/guest-sdk-react';

function ChekinContainer() {
  const sdkRef = useRef();

  const handleNavigate = () => {
    // Access the SDK instance directly
    if (sdkRef.current?.sdk) {
      sdkRef.current.sdk.navigate('/payments');
    }
  };

  return (
    <div>
      <button onClick={handleNavigate}>Go to Payments</button>
      <ChekinGuestSDKView
        ref={sdkRef}
        apiKey="your-api-key"
        reservationId="reservation-123"
      />
    </div>
  );
}
```

## Breaking Changes

### 1. Import Changes

- Replace CDN script tag with npm package imports
- `new ChekinPro()` → `new ChekinGuestSDK(config)`

### 2. Initialization Pattern

- Old: Separate `initialize()` and `renderApp()` calls required
- New: Can initialize via constructor, optional separate calls

### 3. TypeScript

- Old: No type definitions
- New: Full TypeScript support with strict typing

### 4. Error Handling

- Old: Limited error reporting
- New: Comprehensive validation with detailed error messages

## Troubleshooting

### Common Issues

**1. "Container element not found"**

```javascript
// Ensure element exists before rendering
const element = document.getElementById('container');
if (element) {
  await sdk.render(element);
} else {
  console.error('Container not found');
}
```

**2. API Key validation errors**

```javascript
// Use static validation before creating instance
const validation = ChekinGuestSDK.validateConfig({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
});

if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}
```

**3. React component not rendering**

```jsx
// Ensure all required props are provided
<ChekinGuestSDKView
  apiKey="your-api-key" // Required
  // reservationId or externalId recommended
  reservationId="reservation-123"
/>
```

### Migration Checklist

- [ ] Replace CDN script with npm package
- [ ] Update class name from `ChekinPro` to `ChekinGuestSDK`
- [ ] Move configuration to constructor or use new methods
- [ ] Update import statements
- [ ] Test all event handlers work correctly
- [ ] Enable logging for debugging if needed
- [ ] Consider using React components if applicable
- [ ] Update TypeScript definitions if using TypeScript
- [ ] Test in production environment

## Need Help?

- **GitHub Issues**: Report bugs or ask questions
- **Support**: Contact the Chekin development team

The new SDK maintains backward compatibility for most use cases, making migration straightforward while providing enhanced functionality and better developer experience.
