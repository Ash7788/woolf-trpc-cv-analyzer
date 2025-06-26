import { promises as fs } from 'fs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdf from 'pdf-parse';

export const parsePdf = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    if (!data || !data.text) {
        throw new Error('PDF parsing failed or returned no text.');
    }
    return data.text;
  } catch (error: any) {
    console.error(`Error parsing PDF file ${filePath}:`, error.message);
    throw new Error(`Could not parse PDF: ${filePath}. Error: ${error.message}`);
  }
};