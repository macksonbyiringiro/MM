import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

const BookOpenIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error: authError } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(username, password);
            // On success, the AuthGate will switch to the App component
        } catch (err) {
            // Error is handled in the auth context, just need to stop submitting state
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
             <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <BookOpenIcon className="h-12 w-12 text-indigo-500" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">
                        Mackson Study Buddy
                    </h1>
                     <p className="text-slate-500 dark:text-slate-400 mt-1">Please sign in to continue</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>
                        
                        {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}

                        <div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        <p>Demo credentials:</p>
                        <p>Username: <strong className="font-medium text-slate-600 dark:text-slate-300">mackson</strong></p>
                        <p>Password: <strong className="font-medium text-slate-600 dark:text-slate-300">password123</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};