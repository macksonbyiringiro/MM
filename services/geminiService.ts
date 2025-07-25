
import { GoogleGenAI, Type } from "@google/genai";
import type { StudyGuideContent, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const studyGuideSchema = {
    type: Type.OBJECT,
    properties: {
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
        }
    },
    required: ['keyConcepts', 'definitions', 'examples'],
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

export const generateStudyGuide = async (subject: string, topic: string): Promise<StudyGuideContent> => {
    const prompt = `Create a concise study guide for the topic "${topic}" within the TVET subject of "${subject}". The guide should be tailored for a student preparing for an exam. Focus on providing core information that is easy to digest and remember.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are an expert educator specializing in Technical and Vocational Education and Training (TVET). Your goal is to create clear, concise, and easy-to-understand study materials.",
            responseMimeType: "application/json",
            responseSchema: studyGuideSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as StudyGuideContent;
};

export const generateQuiz = async (subject: string, topic: string): Promise<QuizQuestion[]> => {
    const prompt = `Generate a challenging 5-question multiple-choice quiz about "${topic}" from the TVET subject of "${subject}". Each question must have exactly four unique options, and one must be correct. Ensure the questions test practical knowledge relevant to the field.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are an expert quiz creator for TVET subjects. You design challenging but fair multiple-choice questions.",
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


export const getExplanationForAnswer = async (question: string, incorrectAnswer: string, correctAnswer: string): Promise<string> => {
    const prompt = `A student was asked the following question: "${question}". They incorrectly answered with "${incorrectAnswer}". The correct answer is "${correctAnswer}". Please provide a clear and concise explanation for why their answer is wrong and the correct answer is right. Keep the explanation simple and directly related to the question, suitable for a TVET student.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are a helpful and patient tutor for TVET students.",
            // Disable thinking for faster, more direct responses on this simple task.
            thinkingConfig: { thinkingBudget: 0 } 
        }
    });

    return response.text;
};
