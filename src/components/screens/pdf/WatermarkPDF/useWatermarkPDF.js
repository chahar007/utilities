import  { useState } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

const useWatermark = () => {
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);

  const applyWatermark = async (pdfFile, watermarkOptions) => {
    if (!pdfFile) {
      setApplyError('No PDF file provided');
      return null;
    }

    setIsApplying(true);
    setApplyError(null);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      const { 
        watermarkType, 
        watermarkText, 
        watermarkImage, 
        opacity, 
        rotation, 
        position, 
        size, 
        color, 
        fontSize 
      } = watermarkOptions;

      const rotationNum = Number(rotation);
      const opacityNum = Number(opacity) / 100;

      if (watermarkType === 'text') {
        const hexToRgb = (hex) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return rgb(r / 255, g / 255, b / 255);
        };

        const colorRgb = hexToRgb(color);

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const page of pages) {
          const { width, height } = page.getSize();

          // Calculate text size
          let textSize;
          switch (size) {
            case 'small':
              textSize = fontSize * 0.5;
              break;
            case 'large':
              textSize = fontSize * 1.5;
              break;
            case 'cover':
              textSize = Math.min(width, height) * 0.08;
              break;
            default:
              textSize = fontSize;
          }

          // Function to wrap text into multiple lines
          const wrapText = (text, maxWidth) => {
            const words = text.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
              const testLine = currentLine + ' ' + words[i];
              const testWidth = font.widthOfTextAtSize(testLine, textSize);

              if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
              } else {
                currentLine = testLine;
              }
            }
            lines.push(currentLine);
            return lines;
          };

          // Define max text width to avoid overflow
          const maxTextWidth = width * 0.8; // Allow some margin
          const textLines = wrapText(watermarkText, maxTextWidth);
          const textHeight = textSize * textLines.length * 1.2; // Line spacing

          // Draw each line of text with proper positioning
          textLines.forEach((line, index) => {
            // Calculate actual width of this line
            const lineWidth = font.widthOfTextAtSize(line, textSize);
            
            // Determine x, y position for this line
            let x, y;
            
            // Base Y position (center of all lines)
            const baseY = (height - textHeight) / 2 + textHeight - textSize;
            y = baseY - index * textSize * 1.2;
            
            switch (position) {
              case 'top-left':
                x = width * 0.1;
                y = height - textSize - index * textSize * 1.2;
                break;
              case 'top-right':
                x = width * 0.9 - lineWidth;
                y = height - textSize - index * textSize * 1.2;
                break;
              case 'bottom-left':
                x = width * 0.1;
                y = textHeight - index * textSize * 1.2;
                break;
              case 'bottom-right':
                x = width * 0.9 - lineWidth;
                y = textHeight - index * textSize * 1.2;
                break;
              default: // Center - use actual line width for perfect centering
                x = (width - lineWidth) / 2;
                // y already calculated above
            }

            page.drawText(line, {
              x,
              y,
              size: textSize,
              color: colorRgb,
              rotate: degrees(rotationNum),
              opacity: opacityNum,
              font,
            });
          });
        }


      } else if (watermarkType === 'image' && watermarkImage) {
        const imageBytes = await watermarkImage.arrayBuffer();
        let image;
        
        if (watermarkImage.type.includes('png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        for (const page of pages) {
          const { width, height } = page.getSize();
          
          let imageWidth, imageHeight, x, y;
          
          switch (size) {
            case 'small':
              imageWidth = width * 0.2;
              imageHeight = image.height * (imageWidth / image.width);
              break;
            case 'large':
              imageWidth = width * 0.6;
              imageHeight = image.height * (imageWidth / image.width);
              break;
            case 'cover':
              imageWidth = width * 0.9;
              imageHeight = height * 0.9;
              break;
            default: // medium
              imageWidth = width * 0.4;
              imageHeight = image.height * (imageWidth / image.width);
          }

          switch (position) {
            case 'top-left':
              x = width * 0.05;
              y = height - imageHeight - (height * 0.05);
              break;
            case 'top-right':
              x = width - imageWidth - (width * 0.05);
              y = height - imageHeight - (height * 0.05);
              break;
            case 'bottom-left':
              x = width * 0.05;
              y = height * 0.05;
              break;
            case 'bottom-right':
              x = width - imageWidth - (width * 0.05);
              y = height * 0.05;
              break;
            default: // center
              x = (width - imageWidth) / 2;
              y = (height - imageHeight) / 2;
          }

          page.drawImage(image, {
            x,
            y,
            width: imageWidth,
            height: imageHeight,
            rotate: degrees(rotationNum),
            opacity: opacityNum,
          });
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setModifiedPdfUrl(url);
      return blob;
    } catch (err) {
      console.error('Error applying watermark:', err);
      setApplyError('Failed to apply watermark. Please try again.');
      return null;
    } finally {
      setIsApplying(false);
    }
  };

  return { applyWatermark, modifiedPdfUrl, isApplying, applyError };
};

export default useWatermark;