
import React from 'react';
import type { QuizQuestion } from '../types';
import { QuizState } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { LoadingSpinner } from './LoadingSpinner';

interface QuizProps {
    quiz: QuizQuestion[];
    currentQuestionIndex: number;
    quizState: QuizState;
    selectedAnswer: string | null;
    setSelectedAnswer: (answer: string) => void;
    isAnswerSubmitted: boolean;
    onSubmitAnswer: () => void;
    onNextQuestion: () => void;
    score: number;
    onTryAgain: () => void;
    explanation: string | null;
    isLoadingExplanation: boolean;
}

export const Quiz: React.FC<QuizProps> = ({
    quiz, currentQuestionIndex, quizState, selectedAnswer, setSelectedAnswer, isAnswerSubmitted,
    onSubmitAnswer, onNextQuestion, score, onTryAgain, explanation, isLoadingExplanation
}) => {
    const currentQuestion = quiz[currentQuestionIndex];

    if (quizState === QuizState.Finished) {
        return (
            <Card title="Quiz Finished!">
                <div className="text-center">
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                        Your final score is:
                    </p>
                    <p className="text-6xl font-extrabold text-indigo-500 my-4">
                        {score} / {quiz.length}
                    </p>
                    <Button onClick={onTryAgain}>Try a new Topic</Button>
                </div>
            </Card>
        );
    }
    
    return (
        <Card title={`Question ${currentQuestionIndex + 1} of ${quiz.length}`}>
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">{currentQuestion.questionText}</h3>
            
            <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    
                    let buttonClass = 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-500';
                    if (isAnswerSubmitted) {
                        if (isCorrect) {
                            buttonClass = 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-300';
                        } else if (isSelected) {
                            buttonClass = 'bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-300';
                        } else {
                            buttonClass = 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 opacity-70';
                        }
                    } else if (isSelected) {
                        buttonClass = 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => !isAnswerSubmitted && setSelectedAnswer(option)}
                            disabled={isAnswerSubmitted}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${buttonClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {isAnswerSubmitted && explanation && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border-l-4 border-amber-400">
                    <h4 className="font-bold text-amber-800 dark:text-amber-200">Explanation</h4>
                    <p className="text-amber-700 dark:text-amber-300 mt-1">{explanation}</p>
                </div>
            )}
             {isLoadingExplanation && <div className="mt-4"><LoadingSpinner /></div>}

            <div className="mt-6 flex justify-end">
                {isAnswerSubmitted ? (
                    <Button onClick={onNextQuestion}>
                        {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                ) : (
                    <Button onClick={onSubmitAnswer} disabled={!selectedAnswer}>
                        Submit Answer
                    </Button>
                )}
            </div>
        </Card>
    );
};
