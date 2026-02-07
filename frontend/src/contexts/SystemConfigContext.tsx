import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getThaiSwitches, ThaiSwitches as ApiThaiSwitches } from '../services/api';
import { sharedSSE } from '../services/sharedSSE';

interface ThaiSwitch {
    thaiId: string;
    isOpen: boolean;
}

interface SystemConfigContextType {
    isSystemActive: boolean;
    maintenanceMessage: string;
    thaiSwitches: ThaiSwitch[];
    loading: boolean;
    toggleSystem: () => void;
    setMaintenanceMessage: (message: string) => void;
    toggleThai: (thaiId: string) => void;
    isThaiOpen: (thaiId: string) => boolean;
    updateSwitchesFromApi: (switches: ApiThaiSwitches) => void;
    refreshSwitches: () => Promise<void>;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

const defaultConfig = {
    isSystemActive: true,
    maintenanceMessage: 'Hệ thống Cổ Nhơn đang trong mùa nghỉ. Hẹn gặp lại vào Tết năm sau!',
    thaiSwitches: [
        { thaiId: 'an-nhon', isOpen: true },
        { thaiId: 'nhon-phong', isOpen: true },
        { thaiId: 'hoai-nhon', isOpen: true },
    ],
};

export const SystemConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSystemActive, setIsSystemActive] = useState<boolean>(true);
    const [maintenanceMessage, setMaintenanceMessageState] = useState<string>(defaultConfig.maintenanceMessage);
    const [thaiSwitches, setThaiSwitches] = useState<ThaiSwitch[]>(defaultConfig.thaiSwitches);
    const [loading, setLoading] = useState<boolean>(true);

    // Helper to convert API format to internal format
    const apiToInternal = (apiSwitches: ApiThaiSwitches): ThaiSwitch[] => {
        return [
            { thaiId: 'an-nhon', isOpen: apiSwitches['an-nhon'] ?? true },
            { thaiId: 'nhon-phong', isOpen: apiSwitches['nhon-phong'] ?? true },
            { thaiId: 'hoai-nhon', isOpen: apiSwitches['hoai-nhon'] ?? true },
        ];
    };

    // Load from API on mount
    const refreshSwitches = useCallback(async () => {
        try {
            setLoading(true);
            const apiSwitches = await getThaiSwitches();
            setIsSystemActive(apiSwitches.master);
            setThaiSwitches(apiToInternal(apiSwitches));
        } catch (e) {
            console.error('Failed to load switches from API, using defaults', e);
            // Keep current values on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSwitches();
    }, [refreshSwitches]);

    // SSE: Listen for real-time switch updates via shared SSE service
    useEffect(() => {
        const unsubscribeSwitchUpdate = sharedSSE.subscribe('switch_update', (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('SSE switch_update received:', data);
                setIsSystemActive(data.master);
                setThaiSwitches(apiToInternal(data));
            } catch (e) {
                console.error('Failed to parse SSE switch_update:', e);
            }
        });

        const unsubscribeConnected = sharedSSE.subscribe('connected', () => {
            console.log('SSE connected to /sse/switches (via shared service)');
        });

        return () => {
            unsubscribeSwitchUpdate();
            unsubscribeConnected();
        };
    }, []);

    // Update switches from API response (used after admin saves)
    const updateSwitchesFromApi = (apiSwitches: ApiThaiSwitches) => {
        setIsSystemActive(apiSwitches.master);
        setThaiSwitches(apiToInternal(apiSwitches));
    };

    const toggleSystem = () => {
        setIsSystemActive((prev) => !prev);
    };

    const setMaintenanceMessage = (message: string) => {
        setMaintenanceMessageState(message);
    };

    const toggleThai = (thaiId: string) => {
        setThaiSwitches((prev) =>
            prev.map((t) => (t.thaiId === thaiId ? { ...t, isOpen: !t.isOpen } : t))
        );
    };

    const isThaiOpen = (thaiId: string): boolean => {
        if (!isSystemActive) return false;
        const thai = thaiSwitches.find((t) => t.thaiId === thaiId);
        return thai ? thai.isOpen : true;
    };

    return (
        <SystemConfigContext.Provider
            value={{
                isSystemActive,
                maintenanceMessage,
                thaiSwitches,
                loading,
                toggleSystem,
                setMaintenanceMessage,
                toggleThai,
                isThaiOpen,
                updateSwitchesFromApi,
                refreshSwitches,
            }}
        >
            {children}
        </SystemConfigContext.Provider>
    );
};

export const useSystemConfig = () => {
    const context = useContext(SystemConfigContext);
    if (context === undefined) {
        throw new Error('useSystemConfig must be used within a SystemConfigProvider');
    }
    return context;
};
