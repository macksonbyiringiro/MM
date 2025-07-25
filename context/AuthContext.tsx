import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    login: (username: string, pass: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true to check local storage
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check for saved user session on initial load
        try {
            const savedUser = localStorage.getItem('macksonUser');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('macksonUser');
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, pass: string): Promise<void> => {
        setError(null);
        // Simulate API call for demonstration purposes
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username.toLowerCase() === 'mackson' && pass === 'password123') {
                    const userData: User = { username: 'mackson' };
                    setUser(userData);
                    localStorage.setItem('macksonUser', JSON.stringify(userData));
                    resolve();
                } else {
                    const err = 'Invalid username or password.';
                    setError(err);
                    reject(new Error(err));
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('macksonUser');
    };

    const value = { user, login, logout, isLoading, error };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};