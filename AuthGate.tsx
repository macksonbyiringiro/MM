import React from 'react';
import App from './App';
import { Login } from './components/Login';
import { useAuth } from './context/AuthContext';

const FullPageSpinner: React.FC = () => (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-indigo-500"></div>
    </div>
);


export const AuthGate: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <FullPageSpinner />; 
    }

    return user ? <App /> : <Login />;
};
