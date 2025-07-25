import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md';
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors duration-200';
    
    const sizeClasses = {
        md: 'px-4 py-2 text-base',
        sm: 'px-3 py-1.5 text-sm'
    };

    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800/50 disabled:cursor-not-allowed',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:ring-slate-500 disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed'
    };
    
    return (
        <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`} {...props}>
            {children}
        </button>
    );
};
