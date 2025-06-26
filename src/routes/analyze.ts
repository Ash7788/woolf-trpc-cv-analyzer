import { z } from "zod";
import { publicProcedure } from "../trpc";
import { parsePdf } from "../utils/pdfUtils";
import { analyzeWithAI } from "../utils/aiClient";

export const analyzeRoute = publicProcedure
  .input(z.object({
    jdPath: z.string(),
    cvPath: z.string()
  }))
  .mutation(async ({ input }) => {
    const jobDescriptionContent = await parsePdf(input.jdPath);
    const resumeContent = await parsePdf(input.cvPath);
    const analysisResult = await analyzeWithAI(jobDescriptionContent, resumeContent);
    return { analysis: analysisResult };
  });