import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function generateTrainingPlan(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`
      Create a detailed teacher training session plan based on the following input: ${prompt}
      
      Include the following sections:
      1. Session Title
      2. Learning Objectives
      3. Duration
      4. Required Materials
      5. Step-by-step Activities
      6. Assessment Methods
      7. Follow-up Tasks
      
      Make it practical and engaging for teachers.
      Keep the tone professional but approachable

    `);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in generateTrainingPlan:", error);
    throw new Error("Failed to generate training plan. Please try again later.");
  }
}