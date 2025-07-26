// import * as pdfjsLib from 'pdfjs-dist';
import pdf2md from '@opendocsg/pdf2md';

// Set the worker source
// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Use pdf2md to extract markdown from PDF
    const markdown = await pdf2md(arrayBuffer);
    // Optionally, you can return markdown or strip markdown to plain text
    // For now, return as plain text
    return markdown.replace(/[#*_`>\-]/g, '').trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};