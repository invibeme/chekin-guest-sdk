# Chekin Guest SDK

A modern, framework-agnostic SDK for integrating Chekin's guest registration platform into your applications. Enables seamless guest check-in workflows including registration forms, payment processing, ID verification, and booking management. Built with TypeScript and designed for security, performance, and developer experience.

## Features

- 🚀 **Framework Agnostic** - Works with vanilla JavaScript, React, Vue, Angular, and more
- 🔒 **Secure by Default** - Proper iframe sandboxing and CSP compliance
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🎨 **Customizable** - Flexible styling and configuration options
- 🌍 **CDN Distributed** - Fast global delivery with version management
- 📦 **Tree Shakeable** - Import only what you need
- 🔧 **TypeScript First** - Full type safety and IntelliSense support

## Quick Start

### Installation

```bash
# For vanilla JavaScript/TypeScript
npm install chekin-guest-sdk

# For React applications - NOT READY YET (In development)
# npm install chekin-guest-sdk-react
```

### Basic Usage

#### Vanilla JavaScript

```javascript
import {ChekinGuestSDK} from 'chekin-guest-sdk';

const sdk = new ChekinGuestSDK({
  apiKey: 'your-api-key',
  reservationId: 'reservation-123',
  mode: 'ALL',
  autoHeight: true,
});

sdk.render('chekin-container').then(() => {
  console.log('SDK loaded successfully');
});
```

#### React (🚧 In Development - Not Ready Yet)

> **Note**: The React package is currently in development and not yet available for production use. Use the vanilla JavaScript SDK for now.

```jsx
// Coming soon - React package is in development
import {ChekinGuestSDKView} from 'chekin-guest-sdk-react';

function MyComponent() {
  return (
    <ChekinGuestSDKView
      apiKey="your-api-key"
      reservationId="reservation-123"
      mode="ALL"
      autoHeight={true}
      onHeightChanged={height => console.log(height)}
    />
  );
}
```

#### React with Event Handling (🚧 In Development)

```jsx
// Coming soon - React package is in development
import {useGuestSDKEventListener, ChekinGuestSDKView} from 'chekin-guest-sdk-react';

function MyComponent() {
  useGuestSDKEventListener({
    onHeightChanged: height => console.log('Height:', height),
    onError: error => console.error('SDK Error:', error),
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

## Package Structure

This repository contains multiple packages:

- **[`chekin-guest-sdk`](./packages/core/README.md)** - Core framework-agnostic SDK (Ready for production)
- **[`chekin-guest-sdk-react`](./packages/react/README.md)** - React components and hooks (🚧 In development)
- **`apps/guest-sdk`** - Iframe application (deployed to CDN)

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Your App      │    │   NPM Package    │    │  Iframe App     │
│                 │    │                  │    │                 │
│  ┌───────────┐  │    │  ┌────────────┐  │    │  ┌───────────┐  │
│  │Integration│  │◄──►│  │ChekinGuest │  │◄──►│  │Guest UI   │  │
│  │Component  │  │    │  │    SDK     │  │    │  │ (React)   │  │
│  └───────────┘  │    │  └────────────┘  │    │  └───────────┘  │
│                 │    │        │         │    │                 │
└─────────────────┘    │  ┌────────────┐  │    └─────────────────┘
                       │  │postMessage │  │            ▲
                       │  │Communication│  │            │
                       │  └────────────┘  │            │
                       └──────────────────┘            │
                                                       │
                          CDN: https://cdn.chekin.com/
```

## Configuration

For a complete list of all configuration parameters with detailed descriptions, see the [Complete Parameters Table](./packages/core/README.md#complete-parameters-table) in the core SDK documentation.

### Basic Configuration

```javascript
{
  apiKey: 'your-api-key',          // Required: Your Chekin API key
  mode: 'ALL',                     // Required: SDK mode
  reservationId: 'res-456',        // Optional: Pre-load reservation
  housingId: 'housing-123',        // Optional: Pre-select housing (PROPERTY_LINK mode only)
  defaultLanguage: 'en'            // Optional: Default language
}
```

### Advanced Configuration

```javascript
{
  version: '1.6.2',                // Pin to specific version
  baseUrl: 'https://custom.com/',  // Custom hosting URL
  styles: 'body { font-family: Arial, sans-serif; } .primary-color { color: #007cba; }',  // Custom CSS styles as string
  stylesLink: 'https://yoursite.com/custom.css',  // External stylesheet
  autoHeight: true,                // Auto-adjust iframe height
  enableLogging: false,            // Disable SDK logging (default)
  prefillData: {                   // Pre-fill guest form data
    guestForm: {
      name: 'John',
      surname: 'Doe'
    }
  }
}
```

## Event Handling

Listen to SDK events for better integration:

```javascript
sdk.on('chekin:height-changed', height => {
  console.log(`SDK height: ${height}px`);
});

sdk.on('chekin:error', error => {
  console.error('SDK Error:', error.message);
});

sdk.on('chekin:guest-registered', (guest) => {
  console.log('Guest registered:', guest);
});
```

## React Components (🚧 In Development)

> **Note**: React components are currently in development and not yet ready for production use. The examples below show the planned API.

### ChekinGuestSDKView

The main React component that embeds the SDK directly in your application:

```jsx
// Coming soon - React package is in development
import { useRef } from 'react';
import { ChekinGuestSDKView } from 'chekin-guest-sdk-react';
import type { ChekinGuestSDKViewHandle } from 'chekin-guest-sdk-react';

function MyComponent() {
  const sdkRef = useRef<ChekinGuestSDKViewHandle>(null);

  return (
    <ChekinGuestSDKView
      ref={sdkRef}
      apiKey="your-api-key"
      reservationId="reservation-123"
      mode="ALL"
      autoHeight={true}
      onHeightChanged={(height) => console.log(height)}
      onError={(error) => console.error(error)}
      className="my-sdk-container"
      style={{ minHeight: '400px' }}
    />
  );
}
```

## React Hooks (🚧 In Development)

### useGuestSDKEventListener

Listen to SDK events with automatic cleanup:

```jsx
// Coming soon - React package is in development
import {useGuestSDKEventListener} from 'chekin-guest-sdk-react';

function MyComponent() {
  useGuestSDKEventListener({
    onHeightChanged: height => {
      console.log('Height changed:', height);
    },
    onError: error => {
      console.error('SDK Error:', error.message);
    },
    onConnectionError: error => {
      console.error('Connection Error:', error);
    },
    onGuestRegistered: guest => {
      console.log('Guest registered:', guest);
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

## Security

### Content Security Policy

Add to your CSP headers:

```
frame-src https://sdk.chekin.com;
connect-src https://api.chekin.com;
```

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
git clone https://github.com/chekin/chekin-guest-sdk.git
cd chekin-guest-sdk
npm install
```

### Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build:core
npm run build:react
npm run build:guest-sdk
```

### Development

```bash
# Start all dev servers
npm run dev

# Start specific package
nx dev core
nx dev react
nx serve guest-sdk
```

### Testing

```bash
npm run test
npm run lint
npm run typecheck
```

## Documentation

For detailed API documentation and examples:

- **[Core SDK Documentation](./packages/core/README.md)** - Complete guide to the framework-agnostic SDK
- **[React Documentation](./packages/react/README.md)** - React components, hooks, and examples
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Migrate from legacy ChekinPro SDK to the new Chekin Guest SDK
- **[Project Architecture](./CLAUDE.md)** - Developer guide and architecture overview

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@chekin.com
- 🐛 Issues: https://github.com/invibeme/chekin-guest-sdk/issues