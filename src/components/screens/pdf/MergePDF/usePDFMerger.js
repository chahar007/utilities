import { PDFDocument } from "pdf-lib";

const usePdfMerger = () => {
  const mergePDFs = async (files) => {
    if (files.length < 2) {
      console.error("At least two PDFs are required for merging.");
      return null;
    }

    const mergedPdf = await PDFDocument.create();

    for (let file of files) {
      const existingPdf = await PDFDocument.load(await file.arrayBuffer());
      const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save(); // Returns merged PDF bytes
  };

  // Helper function to detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  return { mergePDFs, isMobile };
};

export default usePdfMerger;
