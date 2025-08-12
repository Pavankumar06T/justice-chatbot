const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Justice-focused system prompt
const SYSTEM_PROMPT = `
You are a legal assistant chatbot for the Justice Department. Your role is to:
1. Provide general legal information about laws, rights, and procedures
2. Explain legal concepts in simple terms
3. Guide users to appropriate legal resources
4. Clarify common legal misconceptions
5. Offer information about justice department services

Important guidelines:
- Always clarify that you're not a lawyer and can't provide legal advice
- Never generate false or misleading legal information
- For complex legal issues, recommend consulting an attorney
- Maintain a professional and empathetic tone
- Focus on justice department related matters
`;

const generateResponse = async (userMessage) => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm ready to assist with justice department related inquiries while following all guidelines." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm sorry, I'm having trouble responding right now. Please try again later.";
  }
};

module.exports = { generateResponse };