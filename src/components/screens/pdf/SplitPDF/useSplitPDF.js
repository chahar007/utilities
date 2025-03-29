import { useState } from "react";
import { PDFDocument } from "pdf-lib";

const useSplitPDF = () => {
  const [splitPdfFiles, setSplitPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const parsePageRanges = (splitOptions, totalPages) => {
    console.log("🔹 Split Options:", splitOptions);

    if (!splitOptions || typeof splitOptions !== "object") {
      console.error("❌ Error: Invalid splitOptions format!");
      return [];
    }

    let parsedPages = [];

    switch (splitOptions.type) {
      case "evenOdd":
        // ✅ Split into even and odd pages
        parsedPages.push(
          [...Array(totalPages)].map((_, i) => i + 1).filter((p) => p % 2 !== 0), // Odd pages
          [...Array(totalPages)].map((_, i) => i + 1).filter((p) => p % 2 === 0)  // Even pages
        );
        break;

      case "equal":
        // ✅ Split into equal parts
        if (!splitOptions.parts || isNaN(splitOptions.parts) || splitOptions.parts <= 0) {
          console.error("❌ Invalid parts count for 'equal' split!");
          return [];
        }

        const parts = splitOptions.parts;
        const pagesPerPart = Math.ceil(totalPages / parts);
        let currentPage = 1;

        for (let i = 0; i < parts; i++) {
          let partPages = [];
          for (let j = 0; j < pagesPerPart && currentPage <= totalPages; j++) {
            partPages.push(currentPage++);
          }
          parsedPages.push(partPages);
        }
        break;

      case "range":
      case "custom":
        // ✅ Handle both "range" and "custom" since they both use "ranges"
        if (!splitOptions.ranges || !Array.isArray(splitOptions.ranges) || splitOptions.ranges.length === 0) {
          console.error("❌ Error: Missing or invalid page ranges!");
          return [];
        }

        splitOptions.ranges.forEach((range) => {
          if (typeof range !== "string") {
            console.error("❌ Invalid range format:", range);
            return;
          }

          let pages = [];
          range.split(",").forEach((segment) => {
            segment = segment.trim();
            if (segment.includes("-")) {
              // Handle range "X-Y"
              const [start, end] = segment.split("-").map(Number);
              if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > totalPages) {
                console.error(`❌ Invalid range detected: ${segment}`);
                return;
              }
              pages.push(...Array.from({ length: end - start + 1 }, (_, i) => start + i));
            } else if (!isNaN(segment)) {
              // Handle single page numbers
              const pageNum = Number(segment);
              if (pageNum >= 1 && pageNum <= totalPages) {
                pages.push(pageNum);
              } else {
                console.warn(`⚠ Skipping out-of-range page: ${segment}`);
              }
            }
          });

          if (pages.length > 0) {
            parsedPages.push(pages);
          }
        });

        break;

      default:
        console.error("❌ Unsupported split type:", splitOptions.type);
        return [];
    }

    return parsedPages.filter((part) => part.length > 0);
  };

  const splitPDF = async (pdfFile, splitOptions) => {
    if (!pdfFile) {
      console.error("❌ No PDF file provided!");
      return;
    }

    console.log("📂 Received PDF File:", pdfFile.name);
    console.log("📑 Split Options:", splitOptions);

    setIsProcessing(true);
    setSplitPdfFiles([]);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const totalPages = pdfDoc.getPageCount();
      console.log("📄 Total Pages in PDF:", totalPages);

      const parsedRanges = parsePageRanges(splitOptions, totalPages);
      console.log("✅ Parsed Page Ranges:", parsedRanges);

      if (!parsedRanges.length) {
        console.error("❌ No valid page ranges found!");
        alert("Error: No valid page ranges found.");
        return;
      }

      const newPdfFiles = [];

      for (let i = 0; i < parsedRanges.length; i++) {
        const newPdfDoc = await PDFDocument.create();
        for (let pageNumber of parsedRanges[i]) {
          if (pageNumber <= totalPages) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
            newPdfDoc.addPage(copiedPage);
          } else {
            console.warn(`⚠ Skipping invalid page: ${pageNumber} (out of range)`);
          }
        }

        if (newPdfDoc.getPageCount() === 0) {
          console.warn(`⚠ Skipping empty PDF part: split_part_${i + 1}`);
          continue;
        }

        const newPdfBytes = await newPdfDoc.save({
          useObjectStreams: true,
          updateFieldAppearances: false,
        });

        // ✅ Assign custom names if available
        let fileName = `split_part_${i + 1}.pdf`;
        if (splitOptions.type === "custom" && splitOptions.names && splitOptions.names[i]) {
          fileName = `${splitOptions.names[i]}.pdf`;
        }

        newPdfFiles.push({
          name: fileName,
          bytes: newPdfBytes,
        });
      }

      console.log("✅ Final Split PDFs:", newPdfFiles);
      setSplitPdfFiles(newPdfFiles);
    } catch (error) {
      console.error("❌ Error splitting PDF:", error);
      alert("Failed to split PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset function
  const reset = () => {
    setSplitPdfFiles([]);
    setIsProcessing(false);
  };

  return { splitPdfFiles, splitPDF, isProcessing, reset };
};

export default useSplitPDF;
