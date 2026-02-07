/**
 * Shared SSE Service - Single SSE connection for all contexts
 * Prevents browser connection exhaustion by reusing one EventSource
 */

type SSECallback = (event: MessageEvent) => void;

interface SSESubscription {
    eventType: string;
    callback: SSECallback;
}

class SharedSSEService {
    private eventSource: EventSource | null = null;
    private subscriptions: Map<string, SSESubscription[]> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    constructor() {
        // Auto-connect on creation
        this.connect();
    }

    private connect() {
        const API_BASE = import.meta.env.VITE_API_URL || '/api';

        try {
            this.eventSource = new EventSource(`${API_BASE}/sse/switches`);

            this.eventSource.onopen = () => {
                console.log('🔌 Shared SSE connected');
                this.reconnectAttempts = 0;
            };

            this.eventSource.onerror = (error) => {
                console.error('❌ Shared SSE error:', error);
                // EventSource auto-reconnects, but we track attempts
                this.reconnectAttempts++;

                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.warn('⚠️ SSE max reconnect attempts reached, will retry with backoff');
                    this.reconnectAttempts = 0;
                }
            };

            // Listen for all event types and dispatch to subscribers
            this.eventSource.addEventListener('connected', (event) => {
                this.dispatch('connected', event);
            });

            this.eventSource.addEventListener('switch_update', (event) => {
                this.dispatch('switch_update', event);
            });

            this.eventSource.addEventListener('thai_config_update', (event) => {
                this.dispatch('thai_config_update', event);
            });

            this.eventSource.addEventListener('heartbeat', (event) => {
                this.dispatch('heartbeat', event);
            });

        } catch (error) {
            console.error('Failed to create SSE connection:', error);
        }
    }

    private dispatch(eventType: string, event: MessageEvent) {
        const subs = this.subscriptions.get(eventType) || [];
        subs.forEach(sub => {
            try {
                sub.callback(event);
            } catch (e) {
                console.error(`SSE callback error for ${eventType}:`, e);
            }
        });
    }

    /**
     * Subscribe to an SSE event type
     * @returns Unsubscribe function
     */
    subscribe(eventType: string, callback: SSECallback): () => void {
        const subscription: SSESubscription = { eventType, callback };

        if (!this.subscriptions.has(eventType)) {
            this.subscriptions.set(eventType, []);
        }
        this.subscriptions.get(eventType)!.push(subscription);

        // Return unsubscribe function
        return () => {
            const subs = this.subscriptions.get(eventType);
            if (subs) {
                const index = subs.indexOf(subscription);
                if (index > -1) {
                    subs.splice(index, 1);
                }
            }
        };
    }

    /**
     * Check if SSE is connected
     */
    isConnected(): boolean {
        return this.eventSource?.readyState === EventSource.OPEN;
    }

    /**
     * Force reconnect
     */
    reconnect() {
        this.disconnect();
        setTimeout(() => this.connect(), this.reconnectDelay);
    }

    /**
     * Disconnect SSE
     */
    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}

// Singleton instance
export const sharedSSE = new SharedSSEService();
export default sharedSSE;
