import { GoogleGenAI, Type } from "@google/genai";
import type { StudyGuideContent, QuizQuestion } from '../types';

const model = "gemini-2.5-flash";

const studyGuideSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A detailed but easy-to-understand summary of the entire topic, at least 3-4 sentences long."
        },
        keyConcepts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of the most important concepts or topics.",
        },
        definitions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { type: Type.STRING, description: "The term to be defined." },
                    definition: { type: Type.STRING, description: "The definition of the term." },
                },
                required: ['term', 'definition'],
            },
            description: "A list of key terms and their definitions."
        },
        examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Practical, real-world examples illustrating the concepts.",
        },
        practiceProblems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 practice problems or thought-provoking questions to help the student test their understanding. Do not provide answers."
        }
    },
    required: ['summary', 'keyConcepts', 'definitions', 'examples', 'practiceProblems'],
};

const quizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            questionText: {
                type: Type.STRING,
                description: "The text of the multiple-choice question.",
            },
            options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "An array of 4 possible answers.",
            },
            correctAnswer: {
                type: Type.STRING,
                description: "The correct answer, which must exactly match one of the items in the 'options' array."
            },
        },
        required: ['questionText', 'options', 'correctAnswer'],
    },
};

const getAiClient = (apiKey: string) => {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateStudyGuide = async (subject: string, topic: string, apiKey: string): Promise<StudyGuideContent> => {
    const ai = getAiClient(apiKey);
    const prompt = `Create a comprehensive and detailed study guide for the topic "${topic}" within the subject of "${subject}". The guide should be tailored for a student preparing for an exam. It needs to be thorough, covering the topic in-depth, but still presented in a way that is easy to digest and remember. Include a detailed summary, key concepts, definitions, practical examples, and a few practice problems.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are an expert educator specializing in creating clear, concise, and easy-to-understand study materials for Rwandan students.",
            responseMimeType: "application/json",
            responseSchema: studyGuideSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as StudyGuideContent;
};

export const generateQuiz = async (subject: string, topic: string, apiKey: string): Promise<QuizQuestion[]> => {
    const ai = getAiClient(apiKey);
    const prompt = `Generate a challenging 5-question multiple-choice quiz about "${topic}" from the subject of "${subject}". Each question must have exactly four unique options, and one must be correct. Ensure the questions test practical knowledge relevant to the field.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are an expert quiz creator for Rwandan educational subjects. You design challenging but fair multiple-choice questions.",
            responseMimeType: "application/json",
            responseSchema: quizSchema,
        },
    });

    const jsonText = response.text.trim();
    const parsedQuiz = JSON.parse(jsonText) as QuizQuestion[];
    if (parsedQuiz.length > 5) {
        return parsedQuiz.slice(0, 5); // Ensure we only have 5 questions
    }
    return parsedQuiz;
};


export const getExplanationForAnswer = async (question: string, incorrectAnswer: string, correctAnswer: string, apiKey: string): Promise<string> => {
    const ai = getAiClient(apiKey);
    const prompt = `A student was asked the following question: "${question}". They incorrectly answered with "${incorrectAnswer}". The correct answer is "${correctAnswer}". Please provide a clear and concise explanation for why their answer is wrong and the correct answer is right. Keep the explanation simple and directly related to the question, suitable for a student in Rwanda.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are a helpful and patient tutor for students.",
            // Disable thinking for faster, more direct responses on this simple task.
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });

    return response.text;
};