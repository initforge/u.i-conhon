/**
 * Thai Config Context - Dynamic Thai configuration from database
 * Replaces hardcoded THAIS constant
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Thai, THAIS as DEFAULT_THAIS } from '../types';

interface ThaiConfigContextType {
    thais: Thai[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateThai: (thaiId: string, updates: Partial<Thai>) => Promise<boolean>;
    updateAllThais: (thais: Thai[]) => Promise<boolean>;
    getThaiById: (id: string) => Thai | undefined;
    getThaiBySlug: (slug: string) => Thai | undefined;
}

const ThaiConfigContext = createContext<ThaiConfigContextType | undefined>(undefined);

interface ThaiConfigProviderProps {
    children: ReactNode;
}

// API_BASE is set to /api by Dockerfile build arg
// In production: VITE_API_URL=/api, so endpoints should NOT include /api prefix
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const ThaiConfigProvider: React.FC<ThaiConfigProviderProps> = ({ children }) => {
    const [thais, setThais] = useState<Thai[]>(DEFAULT_THAIS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Thai configs from API
    const fetchThais = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_BASE}/thais`);
            if (!response.ok) {
                throw new Error('Failed to fetch Thai configs');
            }

            const data = await response.json();
            setThais(data.thais || DEFAULT_THAIS);
        } catch (err) {
            console.error('Failed to fetch Thai configs:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            // Fallback to default
            setThais(DEFAULT_THAIS);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchThais();
    }, [fetchThais]);

    // SSE: Listen for real-time Thai config updates from server
    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE}/sse/switches`);

        eventSource.addEventListener('thai_config_update', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('SSE thai_config_update received:', data);
                if (data.thais) {
                    setThais(data.thais);
                }
            } catch (e) {
                console.error('Failed to parse SSE thai_config_update:', e);
            }
        });

        eventSource.onerror = (error) => {
            console.error('ThaiConfig SSE connection error:', error);
            // EventSource will auto-reconnect
        };

        return () => {
            eventSource.close();
        };
    }, []);

    // Update a single Thai config (admin only)
    const updateThai = useCallback(async (thaiId: string, updates: Partial<Thai>): Promise<boolean> => {
        try {
            const token = localStorage.getItem('conhon_token');
            const response = await fetch(`${API_BASE}/thais/${thaiId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update Thai config');
            }

            const data = await response.json();
            if (data.thais) {
                setThais(data.thais);
            }
            return true;
        } catch (err) {
            console.error('Failed to update Thai config:', err);
            return false;
        }
    }, []);

    // Update all Thai configs at once (admin only)
    const updateAllThais = useCallback(async (newThais: Thai[]): Promise<boolean> => {
        try {
            const token = localStorage.getItem('conhon_token');
            const response = await fetch(`${API_BASE}/thais`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ thais: newThais }),
            });

            if (!response.ok) {
                throw new Error('Failed to update Thai configs');
            }

            const data = await response.json();
            if (data.thais) {
                setThais(data.thais);
            }
            return true;
        } catch (err) {
            console.error('Failed to update Thai configs:', err);
            return false;
        }
    }, []);

    // Helper: Get Thai by ID
    const getThaiById = useCallback((id: string) => {
        // Handle both "thai-an-nhon" and "an-nhon" formats
        const normalizedId = id.startsWith('thai-') ? id : `thai-${id}`;
        return thais.find(t => t.id === normalizedId || t.id === id);
    }, [thais]);

    // Helper: Get Thai by slug
    const getThaiBySlug = useCallback((slug: string) => {
        return thais.find(t => t.slug === slug);
    }, [thais]);

    const value: ThaiConfigContextType = {
        thais,
        loading,
        error,
        refetch: fetchThais,
        updateThai,
        updateAllThais,
        getThaiById,
        getThaiBySlug,
    };

    return (
        <ThaiConfigContext.Provider value={value}>
            {children}
        </ThaiConfigContext.Provider>
    );
};

export const useThaiConfig = (): ThaiConfigContextType => {
    const context = useContext(ThaiConfigContext);
    if (context === undefined) {
        throw new Error('useThaiConfig must be used within a ThaiConfigProvider');
    }
    return context;
};

export default ThaiConfigContext;
