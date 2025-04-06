
import { toast } from "sonner";

interface PlanGenerationParams {
  title: string;
  subject: string;
  teachingLevel: string;
  duration: string;
  objectives: string;
  additionalNotes: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateTrainingPlan(params: PlanGenerationParams): Promise<string> {
  try {
    const prompt = `
      Create a detailed teacher training plan with the following specifications:
      
      Title: ${params.title}
      Subject Area: ${params.subject}
      Teaching Level: ${params.teachingLevel}
      Duration: ${params.duration} minutes
      Main Objectives: ${params.objectives}
      Additional Requirements: ${params.additionalNotes}
      
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
    
    `;

    console.log("Sending request to Gemini API with prompt:", prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // Check if the response contains the expected data structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Unexpected API response format:", data);
      throw new Error('Unexpected API response format');
    }

    // Extract the text from the response
    const generatedText = data.candidates[0].content.parts[0].text;
    
    return generatedText;
  } catch (error) {
    console.error('Error generating training plan:', error);
    toast.error('Failed to generate training plan. Please try again.');
    throw error;
  }
}
