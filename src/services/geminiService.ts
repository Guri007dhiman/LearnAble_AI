import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyCSw2CyUFEW8b6DVssQgBGRqGdkoK9HcjQ';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const simplifyText = async (text: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Please simplify the following text to make it more accessible for people with dyslexia. Use shorter sentences, simpler words, and clearer structure while maintaining the original meaning:

${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error simplifying text:', error);
    throw new Error('Failed to simplify text');
  }
};

export const generateTeachingPlan = async (topic: string, grade: string, duration: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Create a comprehensive dyslexia-friendly teaching plan for the topic "${topic}" for grade ${grade} students, with a duration of ${duration}. Include:

1. Learning objectives (clear and simple)
2. Materials needed
3. Step-by-step activities (with visual aids suggestions)
4. Assessment methods (dyslexia-friendly)
5. Differentiation strategies
6. Extension activities

Please use simple language, bullet points, and clear structure.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating teaching plan:', error);
    throw new Error('Failed to generate teaching plan');
  }
};

export const generateQuiz = async (content: string, difficulty: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Based on the following content, create a ${difficulty} level quiz that is dyslexia-friendly. Include:

1. 5 multiple choice questions with clear, simple language
2. 3 short answer questions
3. 1 visual/diagram question suggestion
4. Answer key

Content: ${content}

Please use simple vocabulary, clear formatting, and avoid complex sentence structures.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};