
declare module 'pdf-parse' {
    import { Buffer } from 'buffer';
  
    interface PDFInfo {
      numpages: number;
      numrender: number;
      info: Record<string, any>;
      metadata: any;
      version: string;
      text: string;
    }
    function pdfParse(dataBuffer: Buffer | Uint8Array): Promise<PDFInfo>;
    export default pdfParse;
  }