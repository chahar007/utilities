import { PDFDocument, degrees } from 'pdf-lib';

export const _rotatePDF = async (file, rotationDegree) => {
    try {
        console.log("Loading PDF...");
        const pdfData = await new Response(file).arrayBuffer(); // Fix for better compatibility
        const pdfDoc = await PDFDocument.load(pdfData);
        const pages = pdfDoc.getPages();

        if (!pages.length) {
            throw new Error("The PDF has no pages.");
        }

        console.log(`Rotating PDF by ${rotationDegree} degrees`);

        pages.forEach((page, index) => {
            const currentRotation = page.getRotation().angle;
            const newRotation = (currentRotation + rotationDegree) % 360;
            console.log(`Page ${index + 1}: Rotating from ${currentRotation}° to ${newRotation}°`);
            page.setRotation(degrees(newRotation));
        });

        console.log("Saving rotated PDF...");
        const modifiedPdfBytes = await pdfDoc.save();
        console.log("Rotation successful!");

        return new Blob([modifiedPdfBytes], { type: "application/pdf" });
    } catch (error) {
        console.error("Error rotating PDF:", error);
        throw error;
    }
};
