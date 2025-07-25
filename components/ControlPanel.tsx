
import React from 'react';
import { TVET_SUBJECTS } from '../constants';
import { Button } from './Button';

interface ControlPanelProps {
    subject: string;
    setSubject: (subject: string) => void;
    topic: string;
    setTopic: (topic: string) => void;
    onGenerateStudyGuide: () => void;
    onGenerateQuiz: () => void;
    isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    subject,
    setSubject,
    topic,
    setTopic,
    onGenerateStudyGuide,
    onGenerateQuiz,
    isLoading
}) => {
    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Select a Subject (Optional)
                    </label>
                    <select
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                        <option value="">-- General --</option>
                        {TVET_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
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
                <Button onClick={onGenerateStudyGuide} disabled={isLoading || !topic} variant="secondary">
                    Generate Study Guide
                </Button>
                <Button onClick={onGenerateQuiz} disabled={isLoading || !topic}>
                    Generate Quiz
                </Button>
            </div>
        </div>
    );
};
