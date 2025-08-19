import React from 'react';
import type { StudyGuideContent } from '../types';
import { Card } from './Card';

interface StudyGuideProps {
    content: StudyGuideContent;
}

export const StudyGuide: React.FC<StudyGuideProps> = ({ content }) => {
    return (
        <div className="space-y-6">
            {content.summary && (
                <Card title="Topic Summary">
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{content.summary}</p>
                </Card>
            )}

            <Card title="Key Concepts">
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                    {content.keyConcepts.map((concept, index) => <li key={index}>{concept}</li>)}
                </ul>
            </Card>

            <Card title="Definitions">
                <div className="space-y-4">
                    {content.definitions.map((def, index) => (
                        <div key={index}>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{def.term}</h4>
                            <p className="text-slate-600 dark:text-slate-300">{def.definition}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Examples">
                 <ul className="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-300">
                    {content.examples.map((example, index) => <li key={index} className="pl-2">{example}</li>)}
                </ul>
            </Card>

            {content.practiceProblems && content.practiceProblems.length > 0 && (
                 <Card title="Practice Problems">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Test your knowledge with these questions. Answers are not provided.</p>
                    <ul className="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-300">
                        {content.practiceProblems.map((problem, index) => <li key={index} className="pl-2">{problem}</li>)}
                    </ul>
                </Card>
            )}
        </div>
    );
};