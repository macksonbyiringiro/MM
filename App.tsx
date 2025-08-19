
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { StudyGuide } from './components/StudyGuide';
import { Quiz } from './components/Quiz';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateStudyGuide, generateQuiz, getExplanationForAnswer } from './services/geminiService';
import { QuizQuestion, StudyGuideContent, QuizState } from './types';

const App: React.FC = () => {
    const [subject, setSubject] = useState<string>('');
    const [topic, setTopic] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [studyGuide, setStudyGuide] = useState<StudyGuideContent | null>(null);
    const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [quizState, setQuizState] = useState<QuizState>(QuizState.NotStarted);
    const [explanation, setExplanation] = useState<string | null>(null);
    
    const resetState = () => {
        setStudyGuide(null);
        setQuiz(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setScore(0);
        setQuizState(QuizState.NotStarted);
        setExplanation(null);
        setError(null);
    };

    const handleGenerateStudyGuide = useCallback(async () => {
        if (!topic) {
            setError('Please enter a topic.');
            return;
        }
        resetState();
        setIsLoading(true);
        try {
            const guide = await generateStudyGuide(subject, topic);
            setStudyGuide(guide);
        } catch (e) {
            console.error(e);
            setError('Failed to generate study guide. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [subject, topic]);

    const handleGenerateQuiz = useCallback(async () => {
        if (!topic) {
            setError('Please enter a topic to generate a quiz.');
            return;
        }
        resetState();
        setIsLoading(true);
        try {
            const questions = await generateQuiz(subject, topic);
            setQuiz(questions);
            setQuizState(QuizState.InProgress);
        } catch (e) {
            console.error(e);
            setError('Failed to generate quiz. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [subject, topic]);

    const handleSubmitAnswer = useCallback(async () => {
        if (!selectedAnswer || !quiz) return;

        setIsAnswerSubmitted(true);
        const currentQuestion = quiz[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        } else {
            setIsLoading(true);
            try {
                const expl = await getExplanationForAnswer(currentQuestion.questionText, selectedAnswer, currentQuestion.correctAnswer);
                setExplanation(expl);
            } catch (e) {
                console.error(e);
                setExplanation("Could not load an explanation at this time.");
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedAnswer, quiz, currentQuestionIndex]);

    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerSubmitted(false);
            setExplanation(null);
        } else {
            setQuizState(QuizState.Finished);
        }
    };

    const handleTryAgain = () => {
        resetState();
        // Keep subject and topic for convenience
    };
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <ControlPanel
                        subject={subject}
                        setSubject={setSubject}
                        topic={topic}
                        setTopic={setTopic}
                        onGenerateStudyGuide={handleGenerateStudyGuide}
                        onGenerateQuiz={handleGenerateQuiz}
                        isLoading={isLoading}
                    />

                    {error && (
                        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
                           <p className="font-semibold">Error</p>
                           <p>{error}</p>
                        </div>
                    )}

                    {isLoading && !studyGuide && !quiz && <LoadingSpinner />}
                    
                    {studyGuide && (
                        <div className="mt-8">
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 capitalize">{topic} - Study Guide</h2>
                            <StudyGuide content={studyGuide} />
                        </div>
                    )}

                    {quiz && quizState !== QuizState.NotStarted && (
                         <div className="mt-8">
                            <Quiz
                                quiz={quiz}
                                currentQuestionIndex={currentQuestionIndex}
                                quizState={quizState}
                                selectedAnswer={selectedAnswer}
                                setSelectedAnswer={setSelectedAnswer}
                                isAnswerSubmitted={isAnswerSubmitted}
                                onSubmitAnswer={handleSubmitAnswer}
                                onNextQuestion={handleNextQuestion}
                                score={score}
                                onTryAgain={handleTryAgain}
                                explanation={explanation}
                                isLoadingExplanation={isLoading && isAnswerSubmitted && !explanation}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;