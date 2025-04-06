import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function generateTrainingPlan(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(`
      Create a detailed teacher training session plan based on the following input: ${prompt}
      
       The plan should include:
      1. A clear title and duration
      2. Target audience specification
      3. Detailed learning objectives
      4. A session outline with timing for each section
      5. Required materials and resources
      6. Follow-up activities or assessment
      7. do not include tables to present the information
      
    ### Important Formatting Guidelines:
    - do not use any code blocks
    - Use a clear and concise writing style.
    - Use bullet points for lists.
    - Use proper markdown headers (# for main titles, ## for subtitles).
    - Use bullet points for lists.
    - **Bold important terms** for emphasis.
    - Do **not** wrap your entire response in markdown code blocks (\`\`\`).
    - Ensure proper spacing between sections.
    - Format time allocations consistently.
    - Use a friendly and engaging tone.
    
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