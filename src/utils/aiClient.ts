import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://intertest.woolf.engineering/invoke';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface GenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    role?: string;
  }>;
}

const buildPrompt = (jobDescription: string, resume: string): string => {
  return `
You are an expert career coach and technical recruiter.

Here is a **Job Description**:
---
${jobDescription}
---

And here is a **Candidate's Resume**:
---
${resume}
---

1. 🔍 Extract the key skills, qualifications, experience, and responsibilities from the job description.
2. 📋 Analyze the resume and identify matching skills, technologies, job roles, and responsibilities.
3. ✅ Highlight the candidate’s strengths with respect to the job requirements.
4. ⚠️ Point out gaps or weaknesses in experience, qualifications, or skills.
5. 📈 Rate the alignment on a scale of 1–10 with a short justification.
6. 🧠 Suggest one or two specific ways the candidate can improve their fit for this role.

Return your response in **structured Markdown** format under the following headings:

- **Summary**
- **Strengths**
- **Weaknesses**
- **Score (out of 10)**
- **Suggestions for Improvement**
`;
};

export const analyzeWithAI = async (jobDescription: string, resume: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables.');
    return 'Failed to analyze with AI: API key missing.';
  }

  const prompt = buildPrompt(jobDescription, resume);

  try {
    const response = await axios.post<GenerateContentResponse>(
      GEMINI_API_URL,
      {
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${GEMINI_API_KEY}`,
        },
      }
    );

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return result || 'No valid analysis received from AI.';
  } catch (error: any) {
    console.error('AI Analysis error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message);
    }
    return `Failed to analyze with AI: ${error.message || 'Unknown error'}`;
  }
};
