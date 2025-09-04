# chekin-guest-sdk (Core Package)

The core framework-agnostic SDK package for integrating Chekin's guest registration and check-in platform into web applications through secure iframe embedding.

## Overview

This package provides the foundational `ChekinGuestSDK` class that can be used in any JavaScript/TypeScript environment, regardless of framework. It handles iframe creation, secure communication via postMessage, configuration validation, and comprehensive logging.

> **Migrating from ChekinPro?** See our comprehensive [Migration Guide](../../MIGRATION_GUIDE.md) for step-by-step instructions to upgrade from the legacy ChekinPro SDK.

## Key Features

- **Framework Agnostic** - Works with vanilla JS, React, Vue, Angular, Svelte, or any web framework
- **Secure Iframe Embedding** - Proper sandboxing and CSP compliance
- **Smart URL Management** - Handles query parameter limits with postMessage fallback
- **Type-Safe Configuration** - Full TypeScript support with runtime validation
- **Event System** - Comprehensive event handling for iframe communication
- **Logging & Debugging** - Built-in logger with remote log shipping capabilities
- **Route Synchronization** - Optional URL sync between parent and iframe

## Installation

```bash
npm install chekin-guest-sdk
```

## Quick Start

```javascript
import {ChekinGuestSDK} from 'chekin-guest-sdk';

const sdk = new ChekinGuestSDK({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
  mode: 'ALL',
  autoHeight: true,
  onHeightChanged: height => console.log(`Height: ${height}px`),
  onGuestRegistered: guest => console.log('Guest registered:', guest),
});

// Render into a DOM element
await sdk.render('container-element-id');
// or
await sdk.render(document.getElementById('container'));
```

## Core Architecture

### ChekinGuestSDK Class (`src/ChekinGuestSDK.ts`)

Main SDK class providing:

- Iframe lifecycle management (creation, loading, destruction)
- Configuration validation and error handling
- Event system with type-safe callbacks
- Route synchronization capabilities
- Logger integration

### Communication Layer (`src/communication/`)

- **ChekinCommunicator** - Handles bidirectional postMessage communication
- Message validation and origin checking
- Event dispatching and listener management

### Utilities (`src/utils/`)

- **formatChekinUrl.ts** - Smart URL building with parameter limit handling
- **validation.ts** - Configuration validation with detailed error reporting
- **ChekinLogger.ts** - Comprehensive logging system with levels and remote shipping
- **packageInfo.ts** - Package metadata utilities

### Types (`src/types/`)

- Complete TypeScript definitions for all SDK interfaces
- Event type definitions and callback signatures
- Configuration interfaces with JSDoc documentation

## API Reference

### Constructor

```typescript
new ChekinGuestSDK(config: ChekinGuestSDKConfig & { logger?: ChekinLoggerConfig })
```

### Methods

#### Complete Methods Reference

| Method           | Parameters                                     | Returns                      | Description                                                                                               |
| ---------------- | ---------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| **render**       | `container: string \| HTMLElement`             | `Promise<HTMLIFrameElement>` | Renders the SDK iframe into the specified container. Accepts element ID (string) or HTMLElement reference |
| **initialize**   | `config: ChekinGuestSDKConfig`                 | `void`                       | Initialize/update SDK configuration                                                                       |
| **initAndRender** | `config & {targetNode: string}`               | `Promise<HTMLIFrameElement>` | Initialize and render in one call (backward compatibility)                                               |
| **destroy**      | -                                              | `void`                       | Destroys the SDK instance, removes iframe from DOM, and cleans up event listeners                        |
| **unmount**      | -                                              | `void`                       | Legacy method, same as destroy()                                                                          |
| **updateConfig** | `newConfig: Partial<ChekinGuestSDKConfig>`     | `void`                       | Updates SDK configuration and sends changes to iframe. Validates new config before applying              |
| **on**           | `event: string, callback: ChekinEventCallback` | `void`                       | Adds event listener for SDK events. Supports all SDK event types with type-safe callbacks               |
| **off**          | `event: string, callback: ChekinEventCallback` | `void`                       | Removes specific event listener. Must pass same callback reference used in `on()`                       |

### Configuration

#### Complete Parameters Table

| Parameter                                | Type                                                                               | Required | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **apiKey**                               | `string`                                                                           | ✅       | -       | API key created in the Chekin dashboard                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **mode**                                 | `string`                                                                           | ❌       | `'ALL'` | SDK mode: `'ALL'` (full functionality), `'ONLY_GUEST_FORM'` (guest registration only), `'IV_ONLY'` (identity verification only), `'PROPERTY_LINK'` (property selection)                                                                                                                                                                                                                                                                                                                                                  |
| **reservationId**                        | `string`                                                                           | ❌       | -       | ID of specific reservation to pre-load in the SDK                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **externalId**                           | `string`                                                                           | ❌       | -       | External ID for PMS integrations. If both reservationId and externalId are provided, externalId takes priority                                                                                                                                                                                                                                                                                                                                                                                                               |
| **guestId**                              | `string`                                                                           | ❌       | -       | Specific guest ID. Can only be used in 'ONLY_GUEST_FORM' mode with reservationId or externalId                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **housingId**                            | `string`                                                                           | ❌       | -       | ID of the particular housing/property. Required for 'PROPERTY_LINK' mode only                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **baseUrl**                              | `string`                                                                           | ❌       | -       | Custom base URL for SDK hosting (for self-hosted deployments)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **version**                              | `string`                                                                           | ❌       | -       | Pin to specific SDK version (e.g., '1.6.2'). If not provided, uses latest version                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **defaultLanguage**                      | `string`                                                                           | ❌       | `'en'`  | Default interface language. Supported: `'en', 'es', 'el', 'uk', 'it', 'de', 'fr', 'hu', 'ru', 'cs', 'bg', 'pt', 'ro', 'et', 'pl', 'ca'`                                                                                                                                                                                                                                                                                                                                                                                    |
| **styles**                               | `string`                                                                           | ❌       | -       | CSS styles injected into the SDK iframe for custom theming                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **stylesLink**                           | `string`                                                                           | ❌       | -       | URL to external CSS stylesheet for advanced customization                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **autoHeight**                           | `boolean`                                                                          | ❌       | `true`  | Automatically adjust iframe height based on content                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **enableLogging**                        | `boolean`                                                                          | ❌       | `false` | Enable SDK internal logging (logs are disabled by default)                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **prefillData**                          | `object`                                                                           | ❌       | -       | Pre-fill guest form data to reduce manual entry                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **prefillData.guestForm**                | `object`                                                                           | ❌       | -       | Guest form pre-fill data (name, surname, email, etc.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **enableGuestsRemoval**                  | `boolean`                                                                          | ❌       | `false` | Allow guests to be removed from reservations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **canEditReservationDetails**            | `boolean`                                                                          | ❌       | `true`  | Allow editing of reservation details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **canShareRegistrationLink**             | `boolean`                                                                          | ❌       | `false` | Enable sharing of registration links                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **routeSync**                            | `boolean`                                                                          | ❌       | `false` | Enable URL synchronization between parent and iframe                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **onHeightChanged**                      | `function`                                                                         | ❌       | -       | Callback when iframe height changes. Receives `(height: number)`                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **onError**                              | `function`                                                                         | ❌       | -       | Error callback. Receives `(error: { message: string; code?: string })`                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **onConnectionError**                    | `function`                                                                         | ❌       | -       | Connection/network error callback. Receives `(error: any)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **onGuestRegistered**                    | `function`                                                                         | ❌       | -       | Callback when a guest completes registration. Receives guest data object                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **onAllGuestsRegistered**                | `function`                                                                         | ❌       | -       | Callback when all guests in a reservation complete registration                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **onReservationFound**                   | `function`                                                                         | ❌       | -       | Callback when a reservation is successfully loaded                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **onReservationFetched**                 | `function`                                                                         | ❌       | -       | Callback when reservation fetch completes (success or failure). Receives {isSuccess: boolean}                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **onReservationCreated**                 | `function`                                                                         | ❌       | -       | Callback when a new reservation is created. Receives reservation object with ID                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **onReservationFoundFromHousing**       | `function`                                                                         | ❌       | -       | Callback when reservation is found via housing search. Receives reservation object                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **onIVFinished**                         | `function`                                                                         | ❌       | -       | Callback when identity verification completes. Receives verification results                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **onScreenChanged**                      | `function`                                                                         | ❌       | -       | Callback when screen/route changes in SDK. Receives screen information                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

#### Configuration Interface

```typescript
interface ChekinGuestSDKConfig {
  // Required
  apiKey: string;

  // Optional Core Settings
  baseUrl?: string;
  version?: string;
  mode?: 'ALL' | 'ONLY_GUEST_FORM' | 'IV_ONLY' | 'PROPERTY_LINK';

  // Context
  reservationId?: string;
  externalId?: string;
  housingId?: string;
  guestId?: string;
  defaultLanguage?: string;

  // UI Customization
  styles?: string;
  stylesLink?: string;
  autoHeight?: boolean;
  prefillData?: {
    guestForm?: {
      name?: string;
      surname?: string;
      email?: string;
      // ... other guest form fields
    };
  };

  // Features
  enableGuestsRemoval?: boolean;
  canEditReservationDetails?: boolean;
  canShareRegistrationLink?: boolean;
  routeSync?: boolean;

  // Advanced
  enableLogging?: boolean;

  // Event Callbacks
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

#### Configuration Examples

**Basic Configuration:**

```javascript
{
  apiKey: 'pk_live_your_api_key',
  reservationId: 'reservation-123',
  mode: 'ALL',
  defaultLanguage: 'en'
}
```

**Advanced Configuration:**

```javascript
{
  apiKey: 'pk_live_your_api_key',
  version: '1.6.2',
  reservationId: 'reservation-123',
  mode: 'ALL',
  defaultLanguage: 'es',
  styles: `
    .primary-button { background: #007cba; }
    .container { max-width: 800px; }
  `,
  autoHeight: true,
  enableLogging: true,
  prefillData: {
    guestForm: {
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com'
    }
  },
  onHeightChanged: (height) => console.log(`Height: ${height}px`),
  onError: (error) => console.error('SDK Error:', error),
  onGuestRegistered: (guest) => console.log('Guest registered:', guest)
}
```

### Events

The SDK emits the following events:

- `chekin:height-changed` - Iframe content height changes
- `chekin:error` - Error occurs in SDK or iframe
- `chekin:connection-error` - Network or communication error
- `chekin:guest-registered` - Guest completes registration
- `chekin:all-guests-registered` - All guests complete registration
- `chekin:reservation-found` - Reservation successfully loaded
- `chekin:reservation-fetched` - Reservation fetch completes
- `chekin:iv-finished` - Identity verification completes
- `chekin:screen-changed` - Screen/route changes

## Advanced Usage

### Custom Event Handling

```javascript
sdk.on('chekin:height-changed', height => {
  document.getElementById('container').style.height = `${height}px`;
});

sdk.on('chekin:error', error => {
  console.error('SDK Error:', error.message);
  // Handle error appropriately
});

sdk.on('chekin:guest-registered', guest => {
  console.log('Guest registered:', guest.name, guest.surname);
});
```

### Configuration Updates

```javascript
// Update configuration after initialization
sdk.updateConfig({
  reservationId: 'new-reservation-456',
  styles: 'body { background: #f5f5f5; }',
  enableLogging: true
});
```

## Framework Integration Examples

### Vanilla JavaScript

```html
<div id="chekin-container"></div>
<script>
  const sdk = new ChekinGuestSDK({
    apiKey: 'your-key',
    reservationId: 'reservation-123',
    mode: 'ALL'
  });
  sdk.render('chekin-container');
</script>
```

### Vue.js

```vue
<template>
  <div ref="container" class="chekin-container"></div>
</template>

<script>
import {ChekinGuestSDK} from 'chekin-guest-sdk';

export default {
  mounted() {
    this.sdk = new ChekinGuestSDK({
      apiKey: 'your-key',
      reservationId: 'reservation-123',
      mode: 'ALL'
    });
    this.sdk.render(this.$refs.container);
  },
  beforeUnmount() {
    this.sdk?.destroy();
  },
};
</script>
```

### Angular

```typescript
import {Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {ChekinGuestSDK} from 'chekin-guest-sdk';

@Component({
  template: '<div #container class="chekin-container"></div>',
})
export class ChekinComponent implements OnInit, OnDestroy {
  @ViewChild('container', {static: true}) container!: ElementRef;
  private sdk!: ChekinGuestSDK;

  ngOnInit() {
    this.sdk = new ChekinGuestSDK({
      apiKey: 'your-key',
      reservationId: 'reservation-123',
      mode: 'ALL'
    });
    this.sdk.render(this.container.nativeElement);
  }

  ngOnDestroy() {
    this.sdk?.destroy();
  }
}
```

## Development

### Building

```bash
# Build the package
npm run build

# Development mode with watching
npm run dev
```

### Testing

The core package includes comprehensive tests for all functionality. Use the sandbox.html file for manual testing during development.

## Security

- All iframe communication uses secure postMessage protocol
- Origin validation ensures communication only with trusted domains
- API keys are validated but never logged in plain text
- CSP-compliant iframe sandboxing prevents malicious code execution

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- No Internet Explorer support

## Related Packages

- **[chekin-guest-sdk-react](../react/README.md)** - React components and hooks built on this core package