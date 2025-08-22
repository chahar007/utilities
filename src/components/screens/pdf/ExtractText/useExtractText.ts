import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractionOptions {
  preserveFormatting: boolean;
  extractImages: boolean;
  pageRange: string;
}

interface UseExtractTextReturn {
  extractTextFromPDF: (file: File, options: ExtractionOptions) => Promise<string>;
  isExtracting: boolean;
  error: string | null;
  progress: number;
}

const useExtractText = (): UseExtractTextReturn => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const extractTextFromPDF = useCallback(async (file: File, options: ExtractionOptions): Promise<string> => {
    setIsExtracting(true);
    setError(null);
    setProgress(0);

    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      let extractedText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          let pageText = '';
          
          if (options.preserveFormatting) {
            // Preserve formatting by considering text positions
            const textItems = textContent.items;
            let lastY = -1;
            
            textItems.forEach((item: any) => {
              // Add line break if we're on a new line
              if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
                pageText += '\n';
              }
              
              pageText += item.str + ' ';
              lastY = item.transform[5];
            });
          } else {
            // Simple text extraction without formatting
            pageText = textContent.items.map((item: any) => item.str).join(' ');
          }
          
          // Add page separator
          if (pageText.trim()) {
            extractedText += `--- Page ${pageNum} ---\n${pageText.trim()}\n\n`;
          }
          
          // Update progress
          setProgress((pageNum / numPages) * 100);
          
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          extractedText += `--- Page ${pageNum} (Error extracting text) ---\n\n`;
        }
      }
      
      // Clean up the text
      extractedText = extractedText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s+/g, '\n') // Remove spaces at beginning of lines
        .trim();
      
      if (!extractedText) {
        throw new Error('No text could be extracted from this PDF. It might be a scanned document or contain only images.');
      }
      
      setProgress(100);
      return extractedText;
      
    } catch (err) {
      console.error('PDF text extraction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract text from PDF';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return {
    extractTextFromPDF,
    isExtracting,
    error,
    progress
  };
};

export default useExtractText;
export { useExtractText };