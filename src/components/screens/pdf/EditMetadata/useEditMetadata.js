import { PDFDocument } from "pdf-lib";

/**
 * Extract metadata from a PDF file
 * @param {File} file - The uploaded PDF file
 * @returns {Promise<Object>} - Extracted metadata (title, author, keywords)
 */
export const extractMetadata = async (file) => {
  if (!file) return null;

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const pdfBytes = reader.result;
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const metadata = {
          title: pdfDoc.getTitle() || "",
          author: pdfDoc.getAuthor() || "",
          keywords: pdfDoc.getKeywords() || "",
        };

        resolve(metadata);
      } catch (error) {
        reject("Failed to extract metadata: " + error.message);
      }
    };

    reader.onerror = () => reject("Error reading the file");
  });
};

/**
 * Update metadata of a PDF file
 * @param {File} file - The original PDF file
 * @param {Object} newMetadata - Metadata to update
 * @returns {Promise<Blob>} - Updated PDF file as a Blob
 */
export const updateMetadata = async (file, metadata) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
  
      // Ensure keywords are stored as an array
      const updatedMetadata = {
        ...metadata,
        keywords: Array.isArray(metadata.keywords)
          ? metadata.keywords
          : metadata.keywords.split(",").map((keyword) => keyword.trim()), // Convert string to an array
      };
  
      pdfDoc.setTitle(updatedMetadata.title || "");
      pdfDoc.setAuthor(updatedMetadata.author || "");
      pdfDoc.setKeywords(updatedMetadata.keywords); // Ensure it's an array
  
      const updatedPdfBytes = await pdfDoc.save();
      return new Blob([updatedPdfBytes], { type: "application/pdf" });
    } catch (error) {
      console.error("Failed to update metadata:", error);
      throw error;
    }
  };
  
