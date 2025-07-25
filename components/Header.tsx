import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

const BookOpenIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const UserIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white dark:bg-slate-900/70 shadow-md backdrop-blur-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <BookOpenIcon className="h-8 w-8 text-indigo-500" />
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            Mackson Study Buddy
                        </h1>
                    </div>
                     {user && (
                         <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <UserIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                                <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">Welcome, {user.username}</span>
                            </div>
                            <Button onClick={logout} variant="secondary" size="sm">
                                Log Out
                            </Button>
                         </div>
                     )}
                </div>
            </div>
        </header>
    );
};