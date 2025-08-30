# Migration Plan: Host SDK → Guest SDK

## Executive Summary

This document outlines the complete migration plan from the **Chekin Host SDK** to the **Chekin Guest SDK**. The migration involves adapting the existing monorepo structure to support guest-specific functionality while maintaining the same architectural patterns and development standards.

## Current State Analysis

### Existing Project Structure
```
chekin-host-sdk/
├── packages/
│   ├── core/                    # chekin-host-sdk (vanilla JS/TS)
│   │   ├── src/
│   │   │   ├── ChekinHostSDK.ts        # Main SDK class
│   │   │   ├── communication/          # postMessage handling
│   │   │   ├── utils/                  # Utilities
│   │   │   └── types/                  # TypeScript definitions
│   │   └── sandbox.html               # Development sandbox
│   └── react/                   # chekin-host-sdk-react (React components)
│       ├── src/components/             # ChekinHostSDKView
│       └── src/hooks/                  # useHostSDKEventListener
```

### Current Features (Host SDK)
- Iframe management with sandboxing
- postMessage communication
- Route synchronization
- Height auto-adjustment
- Configuration validation
- React components and hooks
- Comprehensive logging system
- URL formatting with length limits
- Event handling system

## Target State: Guest SDK Requirements

### Core Functionality Changes
Based on sdk.md analysis, the Guest SDK needs:

1. **Different API Surface**: ChekinPro class instead of ChekinHostSDK
2. **Different Methods**:
   - `initialize()` - Initialize with config
   - `renderApp()` - Render to target node
   - `unmount()` - Remove SDK
   - `initAndRender()` - Combined initialize and render

3. **Guest-Specific Configuration**:
   - `reservationId` (required or optional based on mode)
   - `externalId` (PMS clients)
   - `housingId` (for PROPERTY_LINK mode)
   - `prefillData` (BETA - guest form prefilling)
   - `enableGuestsRemoval`
   - `canEditReservationDetails`
   - `canShareRegistrationLink`
   - `mode`: 'ALL' | 'ONLY_GUEST_FORM' | 'ONLY_IV' | 'PROPERTY_LINK'

4. **Guest-Specific Events**:
   - `onGuestRegistered`
   - `onAllGuestsRegistered`
   - `onReservationFound`
   - `onReservationFetched`
   - `onIVFinished`
   - `onReservationCreated`
   - `onReservationFoundFromHousing`

5. **CDN Distribution**:
   - Must build as `ChekinPro.js` for CDN
   - Support version-specific URLs

## Migration Steps

### Phase 1: Project Renaming and Setup

#### 1.1 Update Package Names and Metadata
- [ ] Update root `package.json`:
  - Name: `chekin-host-sdk` → `chekin-guest-sdk`
  - Description: Update to reflect guest SDK
  - Repository: Update GitHub URL if needed
- [ ] Update `packages/core/package.json`:
  - Name: `chekin-host-sdk` → `chekin-guest-sdk`
  - Update exports and main fields
- [ ] Update `packages/react/package.json`:
  - Name: `chekin-host-sdk-react` → `chekin-guest-sdk-react`
  - Update peerDependencies to reference new core package

#### 1.2 Update Documentation Files
- [ ] Update `CLAUDE.md`:
  - Change all references from Host SDK to Guest SDK
  - Update project description and architecture docs
  - Update usage examples
- [ ] Update `README.md` files:
  - Root README
  - Core package README
  - React package README
- [ ] Update build script names:
  - `build:host-sdk` → `build:guest-sdk`

### Phase 2: Core SDK Transformation

#### 2.1 Rename and Adapt Main SDK Class
- [ ] Rename `ChekinHostSDK.ts` → `ChekinGuestSDK.ts`
- [ ] Update class name: `ChekinHostSDK` → `ChekinGuestSDK`
- [ ] Add legacy `ChekinPro` class that extends/wraps `ChekinGuestSDK`
- [ ] Implement guest-specific API methods:
  - `initialize(config)` - Update config and validate
  - `renderApp({targetNode})` - Render to specific element ID
  - `unmount()` - Remove SDK from DOM
  - `initAndRender(config)` - Combined operation

#### 2.2 Update Type Definitions
- [ ] Update `types/index.ts`:
  - Rename `ChekinSDKConfig` → `ChekinGuestSDKConfig`
  - Add guest-specific configuration options:
    - `reservationId?: string`
    - `externalId?: string`
    - `housingId?: string`
    - `prefillData?: { guestForm: Record<string, any> }`
    - `enableGuestsRemoval?: boolean`
    - `canEditReservationDetails?: boolean`
    - `canShareRegistrationLink?: boolean`
    - `mode?: 'ALL' | 'ONLY_GUEST_FORM' | 'ONLY_IV' | 'PROPERTY_LINK'`
  - Add guest-specific event callbacks:
    - `onGuestRegistered?: (guest: any) => void`
    - `onAllGuestsRegistered?: () => void`
    - `onReservationFound?: (reservation: any) => void`
    - `onReservationFetched?: (result: any) => void`
    - `onIVFinished?: (result: IVResult) => void`
    - `onReservationCreated?: (reservation: any) => void`
    - `onReservationFoundFromHousing?: (reservation: any) => void`

#### 2.3 Update Constants and Events
- [ ] Update `constants/index.ts`:
  - Add guest-specific event constants
  - Update iframe naming/IDs to reflect guest SDK
- [ ] Add new event types for guest-specific functionality

#### 2.4 Update URL Formatting
- [ ] Update `utils/formatChekinUrl.ts`:
  - Ensure compatibility with guest app endpoints
  - Handle guest-specific parameters
  - Update base URL if different from host SDK

### Phase 3: Communication Layer Updates

#### 3.1 Update ChekinCommunicator
- [ ] Update event handling for guest-specific events
- [ ] Ensure compatibility with guest app message protocol
- [ ] Add support for guest-specific postMessage events

### Phase 4: React Components Transformation

#### 4.1 Rename and Update React Components
- [ ] Rename `ChekinHostSDKView.tsx` → `ChekinGuestSDKView.tsx`
- [ ] Update component props to use `ChekinGuestSDKConfig`
- [ ] Update component to use `ChekinGuestSDK` instead of `ChekinHostSDK`
- [ ] Ensure all guest-specific props are properly handled

#### 4.2 Update React Hooks
- [ ] Rename `useHostSDKEventListener.ts` → `useGuestSDKEventListener.ts`
- [ ] Update hook to work with guest-specific events
- [ ] Ensure type safety with new event types

#### 4.3 Update React Package Exports
- [ ] Update `packages/react/src/index.ts`:
  - Export `ChekinGuestSDKView` instead of `ChekinHostSDKView`
  - Export `useGuestSDKEventListener` instead of `useHostSDKEventListener`
  - Maintain backward compatibility if needed

### Phase 5: Build System and CDN Preparation

#### 5.1 Update Build Configuration
- [ ] Update `tsup.config.ts` in core package:
  - Ensure output generates `ChekinPro.js` for CDN compatibility
  - Configure UMD build for browser global access
  - Set global variable name to `ChekinPro`

#### 5.2 CDN Build Target
- [ ] Create separate build configuration for CDN distribution:
  - Single file output: `ChekinPro.js`
  - Minified version: `ChekinPro.min.js`
  - Source maps for debugging
  - Ensure `window.ChekinPro` global availability

#### 5.3 Update Package Scripts
- [ ] Add CDN-specific build scripts:
  - `build:cdn` - Build for CDN distribution
  - `build:cdn:production` - Minified production build
  - `build:cdn:staging` - Development build

### Phase 6: Testing and Validation

#### 6.1 Update Test Files
- [ ] Update test files to use new class names and APIs
- [ ] Add tests for guest-specific functionality
- [ ] Update test imports and references

#### 6.2 Update Sandbox Files
- [ ] Update `packages/core/sandbox.html`:
  - Use `ChekinPro` API instead of `ChekinHostSDK`
  - Test guest-specific configuration options
  - Validate CDN loading scenario

#### 6.3 Create Guest-Specific Test Scenarios
- [ ] Test different modes: 'ALL', 'ONLY_GUEST_FORM', 'ONLY_IV', 'PROPERTY_LINK'
- [ ] Test guest registration workflows
- [ ] Test IV (Identity Verification) functionality
- [ ] Test prefillData functionality

### Phase 7: Documentation Updates

#### 7.1 API Documentation
- [ ] Update all API documentation to reflect guest SDK
- [ ] Create migration guide for users switching from host to guest SDK
- [ ] Document new guest-specific features and configuration options

#### 7.2 Usage Examples
- [ ] Create comprehensive usage examples:
  - Basic guest registration
  - IV-only mode
  - Property link mode
  - React integration examples
  - CDN integration examples

## Backward Compatibility Strategy

### Legacy Support
- [ ] Create `ChekinPro` class that wraps `ChekinGuestSDK` for exact API compatibility
- [ ] Maintain original method signatures where possible
- [ ] Provide clear deprecation warnings for removed features

### Migration Path for Existing Users
- [ ] Create automated migration script for configuration objects
- [ ] Provide clear mapping between old and new configuration options
- [ ] Document breaking changes and mitigation strategies

## Risk Mitigation

### Testing Strategy
- [ ] Comprehensive unit tests for all new functionality
- [ ] Integration tests with actual guest app endpoints
- [ ] Cross-browser testing for CDN distribution
- [ ] Performance testing for iframe loading and communication

### Rollback Plan
- [ ] Maintain separate branch with original host SDK
- [ ] Tag current state before beginning migration
- [ ] Document rollback procedures

## Timeline Estimation

- **Phase 1-2**: 2-3 days (Project setup and core transformation)
- **Phase 3-4**: 2-3 days (Communication and React components)
- **Phase 5**: 1-2 days (Build system and CDN)
- **Phase 6**: 2-3 days (Testing and validation)
- **Phase 7**: 1-2 days (Documentation)

**Total Estimated Time**: 8-13 days

## Success Criteria

1. ✅ All existing functionality works with new guest-specific API
2. ✅ CDN distribution works with `ChekinPro.js`
3. ✅ React components integrate seamlessly
4. ✅ All guest-specific events and callbacks function correctly
5. ✅ Build system generates proper outputs for all use cases
6. ✅ Comprehensive test coverage for new functionality
7. ✅ Documentation is complete and accurate

## Next Steps

1. Review this migration plan with stakeholders
2. Begin Phase 1: Project renaming and setup
3. Implement changes incrementally with testing at each phase
4. Validate functionality against actual guest app integration
5. Prepare for CDN deployment and distribution

---

*This migration plan will be updated as implementation progresses and new requirements are discovered.*