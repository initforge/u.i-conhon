import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SystemConfigContextType {
    isSystemActive: boolean;
    maintenanceMessage: string;
    toggleSystem: () => void;
    setMaintenanceMessage: (message: string) => void;
}

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

// localStorage key
const SYSTEM_CONFIG_KEY = 'conhon_system_config';

interface StoredConfig {
    isSystemActive: boolean;
    maintenanceMessage: string;
}

const defaultConfig: StoredConfig = {
    isSystemActive: true,
    maintenanceMessage: 'Hệ thống Cổ Nhơn đang trong mùa nghỉ. Hẹn gặp lại vào Tết năm sau!',
};

export const SystemConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSystemActive, setIsSystemActive] = useState<boolean>(true);
    const [maintenanceMessage, setMaintenanceMessageState] = useState<string>(defaultConfig.maintenanceMessage);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(SYSTEM_CONFIG_KEY);
            if (stored) {
                const config: StoredConfig = JSON.parse(stored);
                setIsSystemActive(config.isSystemActive);
                setMaintenanceMessageState(config.maintenanceMessage);
            }
        } catch (e) {
            console.error('Failed to load system config from localStorage', e);
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            const config: StoredConfig = { isSystemActive, maintenanceMessage };
            localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(config));
        } catch (e) {
            console.error('Failed to save system config to localStorage', e);
        }
    }, [isSystemActive, maintenanceMessage]);

    const toggleSystem = () => {
        setIsSystemActive((prev) => !prev);
    };

    const setMaintenanceMessage = (message: string) => {
        setMaintenanceMessageState(message);
    };

    return (
        <SystemConfigContext.Provider
            value={{
                isSystemActive,
                maintenanceMessage,
                toggleSystem,
                setMaintenanceMessage,
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
