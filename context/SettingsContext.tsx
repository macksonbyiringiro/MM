import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface SettingsContextType {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKey] = useState<string | null>(() => {
        try {
            return localStorage.getItem(API_KEY_STORAGE_KEY);
        } catch (e) {
            console.error("Failed to read API key from localStorage", e);
            return null;
        }
    });

    useEffect(() => {
        try {
            if (apiKey) {
                localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
            } else {
                localStorage.removeItem(API_KEY_STORAGE_KEY);
            }
        } catch (e) {
            console.error("Failed to save API key to localStorage", e);
        }
    }, [apiKey]);
    
    const value = { apiKey, setApiKey };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
