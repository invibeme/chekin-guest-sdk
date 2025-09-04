import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {ChekinCommunicator} from '../ChekinCommunicator';
import {CHEKIN_EVENTS} from '../../constants';
import type {ChekinGuestSDKConfig, ChekinMessage} from '../../types';
import {ChekinLogger} from 'chekin-guest-sdk';

// Mock ChekinLogger
vi.mock('../../utils/ChekinLogger');
vi.mock('../../utils/packageInfo.js', () => ({
  PACKAGE_INFO: {
    name: 'chekin-guest-sdk',
    version: '1.0.0',
  },
}));

describe('ChekinCommunicator', () => {
  let communicator: ChekinCommunicator;
  let mockIframe: HTMLIFrameElement;
  let mockConfig: ChekinGuestSDKConfig;
  let mockLogger: {
    debug: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    logCommunicationEvent: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '';

    // Create mock iframe with proper contentWindow mock
    mockIframe = document.createElement('iframe');
    const mockContentWindow = {
      postMessage: vi.fn(),
    } as unknown as Window;

    // Mock contentWindow property descriptor
    Object.defineProperty(mockIframe, 'contentWindow', {
      value: mockContentWindow,
      writable: true,
      configurable: true,
    });

    document.body.appendChild(mockIframe);

    // Setup mock config
    mockConfig = {
      apiKey: 'test-api-key',
      reservationId: 'test-reservation-id',
      routeSync: true,
    };

    // Setup mock logger
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      logCommunicationEvent: vi.fn(),
    };

    // Mock window methods
    Object.defineProperty(window, 'location', {
      value: {
        hash: '',
        origin: 'https://example.com',
      },
      writable: true,
    });

    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn(),
      },
      writable: true,
    });

    // Clear any existing event listeners
    window.removeEventListener('message', vi.fn());
    window.removeEventListener('hashchange', vi.fn());
  });

  afterEach(() => {
    if (communicator) {
      communicator.destroy();
    }
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should initialize with route sync enabled by default', () => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'ChekinCommunicator initialized with automatic route sync',
        undefined,
        'COMMUNICATION',
      );
    });

    it('should initialize with route sync disabled when config.routeSync is false', () => {
      const config = {...mockConfig, routeSync: false};
      communicator = new ChekinCommunicator(
        mockIframe,
        config,
        mockLogger as unknown as ChekinLogger,
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'ChekinCommunicator initialized with route sync disabled',
        undefined,
        'COMMUNICATION',
      );
    });

    it('should add message event listener to window', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    });
  });

  describe('handleMessage', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    it('should ignore messages not from iframe', () => {
      const message: ChekinMessage = {
        type: CHEKIN_EVENTS.HEIGHT_CHANGED,
        payload: {height: 500},
      };

      const event = new MessageEvent('message', {
        data: message,
        source: window, // Different source
      });

      // Simulate message event
      window.dispatchEvent(event);

      expect(mockLogger.logCommunicationEvent).not.toHaveBeenCalled();
    });

    it('should process messages from iframe', () => {
      const message: ChekinMessage = {
        type: CHEKIN_EVENTS.HEIGHT_CHANGED,
        payload: {height: 500},
      };

      const event = new MessageEvent('message', {
        data: message,
        source: mockIframe.contentWindow,
      });

      window.dispatchEvent(event);

      expect(mockLogger.logCommunicationEvent).toHaveBeenCalledWith(
        CHEKIN_EVENTS.HEIGHT_CHANGED,
        {height: 500},
      );
    });

    it('should handle route change events when route sync is enabled', () => {
      const routePayload = {
        path: '/test',
        hash: '#/test-route',
        title: 'Test Page',
        fullUrl: 'https://example.com/#/test-route',
      };

      const message: ChekinMessage = {
        type: CHEKIN_EVENTS.ROUTE_CHANGED,
        payload: routePayload,
      };

      const event = new MessageEvent('message', {
        data: message,
        source: mockIframe.contentWindow,
      });

      window.dispatchEvent(event);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Route synchronized from iframe to parent',
        {route: '#/test-route'},
        'COMMUNICATION',
      );
    });

    it('should call event listeners for matching event types', () => {
      const callback = vi.fn();
      communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback);

      const message: ChekinMessage = {
        type: CHEKIN_EVENTS.HEIGHT_CHANGED,
        payload: {height: 500},
      };

      const event = new MessageEvent('message', {
        data: message,
        source: mockIframe.contentWindow,
      });

      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith({height: 500});
    });

    it('should handle errors in event listeners gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, errorCallback);

      const message: ChekinMessage = {
        type: CHEKIN_EVENTS.HEIGHT_CHANGED,
        payload: {height: 500},
      };

      const event = new MessageEvent('message', {
        data: message,
        source: mockIframe.contentWindow,
      });

      window.dispatchEvent(event);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error in Chekin event listener',
        {
          error: expect.any(Error),
          eventType: CHEKIN_EVENTS.HEIGHT_CHANGED,
        },
        'COMMUNICATION',
      );
    });
  });

  describe('Event Management', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    describe('on', () => {
      it('should add event listener', () => {
        const callback = vi.fn();
        communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback);

        expect(mockLogger.debug).toHaveBeenCalledWith(
          `Event listener added for: ${CHEKIN_EVENTS.HEIGHT_CHANGED}`,
          undefined,
          'COMMUNICATION',
        );
      });

      it('should add multiple listeners for the same event', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback1);
        communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback2);

        // Trigger event
        const message: ChekinMessage = {
          type: CHEKIN_EVENTS.HEIGHT_CHANGED,
          payload: {height: 500},
        };

        const event = new MessageEvent('message', {
          data: message,
          source: mockIframe.contentWindow,
        });

        window.dispatchEvent(event);

        expect(callback1).toHaveBeenCalledWith({height: 500});
        expect(callback2).toHaveBeenCalledWith({height: 500});
      });
    });

    describe('off', () => {
      it('should remove event listener', () => {
        const callback = vi.fn();
        communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback);
        communicator.off(CHEKIN_EVENTS.HEIGHT_CHANGED, callback);

        expect(mockLogger.debug).toHaveBeenCalledWith(
          `Event listener removed for: ${CHEKIN_EVENTS.HEIGHT_CHANGED}`,
          undefined,
          'COMMUNICATION',
        );
      });

      it('should not remove non-existent listener', () => {
        const callback = vi.fn();
        communicator.off(CHEKIN_EVENTS.HEIGHT_CHANGED, callback);

        // Should not log removal since listener doesn't exist
        expect(mockLogger.debug).not.toHaveBeenCalledWith(
          expect.stringContaining('Event listener removed'),
          expect.anything(),
          'COMMUNICATION',
        );
      });

      it('should only remove the specific callback', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback1);
        communicator.on(CHEKIN_EVENTS.HEIGHT_CHANGED, callback2);
        communicator.off(CHEKIN_EVENTS.HEIGHT_CHANGED, callback1);

        // Trigger event
        const message: ChekinMessage = {
          type: CHEKIN_EVENTS.HEIGHT_CHANGED,
          payload: {height: 500},
        };

        const event = new MessageEvent('message', {
          data: message,
          source: mockIframe.contentWindow,
        });

        window.dispatchEvent(event);

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledWith({height: 500});
      });
    });
  });

  describe('Message Sending', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    describe('send', () => {
      it('should send message when iframe contentWindow is available', () => {
        const message: ChekinMessage = {
          type: 'test-message',
          payload: {data: 'test'},
        };

        communicator.send(message);

        expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(message, '*');
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Message sent to iframe: test-message',
          {data: 'test'},
          'COMMUNICATION',
        );
      });

      it('should warn when iframe contentWindow is not available', () => {
        // Mock contentWindow as null
        Object.defineProperty(mockIframe, 'contentWindow', {
          value: null,
          writable: true,
          configurable: true,
        });

        const message: ChekinMessage = {
          type: 'test-message',
          payload: {data: 'test'},
        };

        communicator.send(message);

        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Cannot send message: iframe contentWindow is not available',
          {messageType: 'test-message'},
          'COMMUNICATION',
        );
      });
    });
  });

  describe('Route Synchronization', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    describe('enableRouteSync', () => {
      it('should enable route synchronization with default hash prefix', () => {
        communicator.disableRouteSync(); // Disable first
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

        communicator.enableRouteSync();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
          'hashchange',
          expect.any(Function),
        );
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Route synchronization enabled',
          {hashPrefix: 'chekin'},
          'COMMUNICATION',
        );
      });

      it('should enable route synchronization with custom hash prefix', () => {
        communicator.disableRouteSync();
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

        communicator.enableRouteSync({hashPrefix: 'custom'});

        expect(addEventListenerSpy).toHaveBeenCalledWith(
          'hashchange',
          expect.any(Function),
        );
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Route synchronization enabled',
          {hashPrefix: 'custom'},
          'COMMUNICATION',
        );
      });
    });

    describe('disableRouteSync', () => {
      it('should disable route synchronization', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        communicator.disableRouteSync();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
          'hashchange',
          expect.any(Function),
        );
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Route synchronization disabled',
          undefined,
          'COMMUNICATION',
        );
      });
    });

    describe('navigateToRoute', () => {
      it('should navigate with route sync enabled', () => {
        const route = '#/test-route';

        communicator.navigateToRoute(route);

        expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
          {
            type: 'route-sync',
            payload: {route},
          },
          '*',
        );

        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Programmatic navigation initiated',
          {route},
          'COMMUNICATION',
        );
      });

      it('should navigate without route sync', () => {
        const config = {...mockConfig, routeSync: false};
        communicator.destroy();
        communicator = new ChekinCommunicator(
          mockIframe,
          config,
          mockLogger as unknown as ChekinLogger,
        );

        const route = '/test-route';

        communicator.navigateToRoute(route);

        expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
          {
            type: 'navigate',
            payload: {path: route},
          },
          '*',
        );

        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Programmatic navigation initiated',
          {route},
          'COMMUNICATION',
        );
      });
    });

    describe('getCurrentRoute', () => {
      it('should return current route', () => {
        const currentRoute = communicator.getCurrentRoute();
        expect(currentRoute).toBe('#/');
      });
    });

    describe('Parent Hash Change Handling', () => {
      it('should sync route from parent to iframe on hash change', () => {
        // Set up hash
        Object.defineProperty(window, 'location', {
          value: {
            ...window.location,
            hash: '#chekin=%23%2Ftest-route',
          },
          writable: true,
        });

        // Trigger hash change event
        const event = new HashChangeEvent('hashchange');
        window.dispatchEvent(event);

        expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
          {
            type: 'route-sync',
            payload: {route: '#/test-route'},
          },
          '*',
        );
      });

      it('should not add hash change listener when route sync is disabled', () => {
        // Test that hashchange listener is not added when routeSync is disabled
        const config = {...mockConfig, routeSync: false};
        communicator.destroy();

        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        communicator = new ChekinCommunicator(
          mockIframe,
          config,
          mockLogger as unknown as ChekinLogger,
        );

        // Should not add hashchange listener when route sync is disabled
        expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
        expect(addEventListenerSpy).not.toHaveBeenCalledWith(
          'hashchange',
          expect.any(Function),
        );
      });
    });
  });

  describe('Handshake and Initial Route', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    describe('sendHandshake', () => {
      it('should send handshake with proper payload', () => {
        const mockTimestamp = 1234567890;
        vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

        communicator.sendHandshake();

        expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
          {
            type: CHEKIN_EVENTS.HANDSHAKE,
            payload: {
              timestamp: mockTimestamp,
              sdk: 'chekin-guest-sdk',
              version: '1.0.0',
              origin: 'https://example.com',
            },
          },
          '*',
        );

        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Handshake sent to iframe',
          expect.objectContaining({
            timestamp: mockTimestamp,
            sdk: 'chekin-guest-sdk',
            version: '1.0.0',
            origin: 'https://example.com',
          }),
          'COMMUNICATION',
        );
      });
    });

    describe('sendInitialRoute', () => {
      it('should send initial route when hash matches pattern', () => {
        Object.defineProperty(window, 'location', {
          value: {
            ...window.location,
            hash: '#chekin=%23%2Finitial-route',
          },
          writable: true,
        });

        communicator.sendInitialRoute();

        expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
          {
            type: CHEKIN_EVENTS.INIT_ROUTE,
            payload: {route: '#/initial-route'},
          },
          '*',
        );

        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Initial route sent to iframe',
          {route: '#/initial-route'},
          'COMMUNICATION',
        );
      });

      it('should not send initial route when hash does not match pattern', () => {
        Object.defineProperty(window, 'location', {
          value: {
            ...window.location,
            hash: '#some-other-hash',
          },
          writable: true,
        });

        communicator.sendInitialRoute();

        expect(mockIframe.contentWindow!.postMessage).not.toHaveBeenCalledWith(
          expect.objectContaining({type: CHEKIN_EVENTS.INIT_ROUTE}),
          '*',
        );
      });
    });
  });

  describe('Destruction', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    it('should remove all event listeners and clear internal state', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      communicator.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'hashchange',
        expect.any(Function),
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'ChekinCommunicator destroyed',
        undefined,
        'COMMUNICATION',
      );
    });

    it('should not remove hash change listener if route sync was disabled', () => {
      const config = {...mockConfig, routeSync: false};
      communicator.destroy();
      communicator = new ChekinCommunicator(
        mockIframe,
        config,
        mockLogger as unknown as ChekinLogger,
      );

      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      communicator.destroy();

      // Should remove message listener but not hashchange listener since it was never added
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      );
      expect(removeEventListenerSpy).not.toHaveBeenCalledWith(
        'hashchange',
        expect.any(Function),
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    beforeEach(() => {
      communicator = new ChekinCommunicator(
        mockIframe,
        mockConfig,
        mockLogger as unknown as ChekinLogger,
      );
    });

    it('should handle valid route data from ROUTE_CHANGED events', () => {
      const routePayload = {
        path: '/test',
        hash: '#/test-route',
        title: 'Test Page',
        fullUrl: 'https://example.com/#/test-route',
      };

      const message: ChekinMessage = {
        type: CHEKIN_EVENTS.ROUTE_CHANGED,
        payload: routePayload,
      };

      const event = new MessageEvent('message', {
        data: message,
        source: mockIframe.contentWindow,
      });

      window.dispatchEvent(event);

      expect(mockLogger.logCommunicationEvent).toHaveBeenCalledWith(
        CHEKIN_EVENTS.ROUTE_CHANGED,
        routePayload,
      );
    });

    it('should handle missing window.history.replaceState', () => {
      // Mock missing replaceState
      Object.defineProperty(window, 'history', {
        value: {},
        writable: true,
      });

      const route = '/test-route';
      communicator.navigateToRoute(route);

      // Should still work without replaceState
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Programmatic navigation initiated',
        {route},
        'COMMUNICATION',
      );
    });

    it('should handle routes with and without hash prefix correctly', () => {
      const routesWithHash = '#/route1';
      const routesWithoutHash = '/route2';

      communicator.navigateToRoute(routesWithHash);
      communicator.navigateToRoute(routesWithoutHash);

      expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
        {
          type: 'route-sync',
          payload: {route: '#/route1'},
        },
        '*',
      );

      expect(mockIframe.contentWindow!.postMessage).toHaveBeenCalledWith(
        {
          type: 'route-sync',
          payload: {route: '#/route2'},
        },
        '*',
      );
    });
  });
});
