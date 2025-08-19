
import React from 'react';
import { RTB_SUBJECTS, REB_SUBJECTS } from '../constants';
import { Button } from './Button';

interface ControlPanelProps {
    subject: string;
    setSubject: (subject: string) => void;
    topic: string;
    setTopic: (topic: string) => void;
    onGenerateStudyGuide: () => void;
    onGenerateQuiz: () => void;
    isLoading: boolean;
    isApiKeySet: boolean;
    onOpenSettings: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    subject,
    setSubject,
    topic,
    setTopic,
    onGenerateStudyGuide,
    onGenerateQuiz,
    isLoading,
    isApiKeySet,
    onOpenSettings
}) => {
    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
             {!isApiKeySet && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-500 rounded-lg flex items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-200">API Key Required</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Please set your Gemini API key in the settings to enable content generation.
                        </p>
                    </div>
                    <Button onClick={onOpenSettings} variant="secondary" size="sm">
                       Settings
                    </Button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Select Subject Area (Optional)
                    </label>
                    <select
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                        <option value="">-- General --</option>
                        <optgroup label="RTB (TVET)">
                            {RTB_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </optgroup>
                        <optgroup label="REB (General Education)">
                            {REB_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </optgroup>
                    </select>
                </div>
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Enter a Topic to Study
                    </label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., 'Ohm's Law' or 'Kitchen Safety'"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
                <Button onClick={onGenerateStudyGuide} disabled={isLoading || !topic || !isApiKeySet} variant="secondary">
                    Generate Study Guide
                </Button>
                <Button onClick={onGenerateQuiz} disabled={isLoading || !topic || !isApiKeySet}>
                    Generate Quiz
                </Button>
            </div>
        </div>
    );
};
