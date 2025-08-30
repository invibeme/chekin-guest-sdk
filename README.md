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

# For React applications (In development and not available on npm yet)
npm install chekin-guest-sdk-react
```

### Basic Usage

#### Vanilla JavaScript

```javascript
import {ChekinGuestSDK} from 'chekin-guest-sdk';

const sdk = new ChekinGuestSDK({
  apiKey: 'your-api-key',
  features: ['IV', 'LIVENESS_DETECTION'],
});

sdk.render('chekin-container').then(() => {
  console.log('SDK loaded successfully');
});
```

#### React

```jsx
import {ChekinGuestSDKView} from 'chekin-guest-sdk-react';

function MyComponent() {
  return (
    <ChekinGuestSDKView
      apiKey="your-api-key"
      features={['IV', 'LIVENESS_DETECTION']}
      onHeightChanged={height => console.log(height)}
    />
  );
}
```

#### React with Event Handling

```jsx
import {useGuestSDKEventListener, ChekinGuestSDKView} from 'chekin-guest-sdk-react';

function MyComponent() {
  useGuestSDKEventListener({
    onHeightChanged: height => console.log('Height:', height),
    onError: error => console.error('SDK Error:', error),
  });

  return <ChekinGuestSDKView apiKey="your-api-key" features={['IV']} />;
}
```

## Package Structure

This repository contains multiple packages:

- **[`chekin-guest-sdk`](./packages/core/README.md)** - Core framework-agnostic SDK
- **[`chekin-guest-sdk-react`](./packages/react/README.md)** - React components and hooks
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
  features: ['IV'],                // Optional: Enabled features
  housingId: 'housing-123',        // Optional: Pre-select housing
  reservationId: 'res-456',        // Optional: Pre-load reservation
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
  disableLogging: false,           // Enable SDK logging (default)
  hiddenSections: ['housing_police'],    // Hide specific sections
  hiddenFormFields: {              // Hide specific form fields
    housingInfo: ['field1', 'field2']
  }
}
```

## Event Handling

Listen to SDK events for better integration:

```javascript
sdk.on('height-changed', height => {
  console.log(`SDK height: ${height}px`);
});

sdk.on('error', error => {
  console.error('SDK Error:', error.message);
});

sdk.on('ready', () => {
  console.log('SDK is ready');
});
```

## React Components

### ChekinGuestSDKView

The main React component that embeds the SDK directly in your application:

```jsx
import { useRef } from 'react';
import { ChekinGuestSDKView } from 'chekin-guest-sdk-react';
import type { ChekinGuestSDKViewHandle } from 'chekin-guest-sdk-react';

function MyComponent() {
  const sdkRef = useRef<ChekinGuestSDKViewHandle>(null);

  return (
    <ChekinGuestSDKView
      ref={sdkRef}
      apiKey="your-api-key"
      features={['IV', 'LIVENESS_DETECTION']}
      autoHeight={true}
      onHeightChanged={(height) => console.log(height)}
      onError={(error) => console.error(error)}
      className="my-sdk-container"
      style={{ minHeight: '400px' }}
    />
  );
}
```

## React Hooks

### useGuestSDKEventListener

Listen to SDK events with automatic cleanup:

```jsx
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
    onPoliceAccountConnection: data => {
      console.log('Police account connected:', data);
    },
    onStatAccountConnection: data => {
      console.log('Stat account connected:', data);
    },
  });

  return <ChekinGuestSDKView apiKey="your-api-key" />;
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
- 📖 Documentation: https://docs.chekin.com
- 🐛 Issues: https://github.com/chekin/chekin-guest-sdk/issues
