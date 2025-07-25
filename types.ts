export interface User {
    username: string;
}

export interface StudyGuideContent {
    keyConcepts: string[];
    definitions: {
        term: string;
        definition: string;
    }[];
    examples: string[];
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
