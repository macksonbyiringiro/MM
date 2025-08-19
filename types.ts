export interface StudyGuideContent {
    summary: string;
    keyConcepts: string[];
    definitions: {
        term: string;
        definition: string;
    }[];
    examples: string[];
    practiceProblems: string[];
}

export interface QuizQuestion {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export enum QuizState {
    NotStarted,
    InProgress,
    Finished,
}

export interface User {
    username: string;
}