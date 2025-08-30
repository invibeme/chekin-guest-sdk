import {ChekinGuestSDK} from './ChekinGuestSDK.js';
import {ChekinGuestSDKConfig} from './types';

/**
 * ChekinPro - Legacy wrapper class that provides the exact API from the original sdk.md specification
 * This class ensures backward compatibility with existing CDN integrations
 */
export class ChekinPro {
  private sdk: ChekinGuestSDK | null = null;
  private config: ChekinGuestSDKConfig | null = null;

  constructor() {
    // Empty constructor as per original specification
  }

  /**
   * Initialize the SDK with configuration
   * @param config - SDK configuration options
   */
  public initialize(config: ChekinGuestSDKConfig): void {
    this.config = config;
    this.sdk = new ChekinGuestSDK(config);
  }

  /**
   * Render the SDK app to a target container
   * @param options - Render options with targetNode
   */
  public renderApp(options: {targetNode: string}): Promise<HTMLIFrameElement> {
    if (!this.sdk || !this.config) {
      throw new Error('SDK must be initialized before rendering');
    }
    return this.sdk.renderApp(options);
  }

  /**
   * Unmount the SDK from the DOM
   */
  public unmount(): void {
    this.sdk?.unmount();
    this.sdk = null;
    this.config = null;
  }

  /**
   * Initialize and render in a single call
   * @param config - Combined configuration and render options
   */
  public initAndRender(config: ChekinGuestSDKConfig & {targetNode: string}): Promise<HTMLIFrameElement> {
    const {targetNode, ...sdkConfig} = config;
    this.initialize(sdkConfig);
    return this.renderApp({targetNode});
  }

  /**
   * Get the underlying SDK instance for advanced usage
   * @returns The ChekinGuestSDK instance or null if not initialized
   */
  public getSDK(): ChekinGuestSDK | null {
    return this.sdk;
  }

  /**
   * Add event listener to the SDK
   * @param event - Event name
   * @param callback - Event callback function
   */
  public on(event: string, callback: (payload: any) => void): void {
    this.sdk?.on(event, callback);
  }

  /**
   * Remove event listener from the SDK
   * @param event - Event name
   * @param callback - Event callback function to remove
   */
  public off(event: string, callback: (payload: any) => void): void {
    this.sdk?.off(event, callback);
  }

  /**
   * Update SDK configuration
   * @param newConfig - Partial configuration to update
   */
  public updateConfig(newConfig: Partial<ChekinGuestSDKConfig>): void {
    if (!this.sdk) {
      throw new Error('SDK must be initialized before updating config');
    }
    this.config = {...(this.config || {} as ChekinGuestSDKConfig), ...newConfig};
    this.sdk.updateConfig(newConfig);
  }

  /**
   * Navigate to a specific route within the SDK
   * @param path - Route path to navigate to
   */
  public navigate(path: string): void {
    this.sdk?.navigate(path);
  }

  /**
   * Get current route from the SDK
   * @returns Current route path
   */
  public getCurrentRoute(): string {
    return this.sdk?.getCurrentRoute() || '/';
  }

  /**
   * Enable route synchronization with parent window
   * @param options - Route sync options
   */
  public enableRouteSync(options: {hashPrefix?: string} = {}): void {
    this.sdk?.enableRouteSync(options);
  }

  /**
   * Disable route synchronization
   */
  public disableRouteSync(): void {
    this.sdk?.disableRouteSync();
  }

  /**
   * Send logs to remote endpoint
   * @param endpoint - Optional endpoint URL
   */
  public async sendLogs(endpoint?: string): Promise<void> {
    await this.sdk?.sendLogs(endpoint);
  }

  /**
   * Destroy the SDK instance completely
   */
  public destroy(): void {
    this.sdk?.destroy();
    this.sdk = null;
    this.config = null;
  }
}

// Make ChekinPro available globally for CDN usage
if (typeof window !== 'undefined') {
  (window as any).ChekinPro = ChekinPro;
}