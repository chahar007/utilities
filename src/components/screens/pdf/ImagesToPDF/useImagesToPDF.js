import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

const useImagesToPDF = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const supportedFormats = [
    'image/png', 
    'image/jpeg', 
    'image/jpg', 
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml'
  ];

  // Enhanced mobile detection
  const isMobile = useCallback(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
           window.innerWidth < 768;
  }, []);

  const convertImagesToPDF = useCallback(async (images, options) => {
    setIsConverting(true);
    setError(null);
    setProgress(0);

    try {
      if (images.length === 0) {
        throw new Error('No images provided for conversion');
      }

      const pdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < images.length; i++) {
        const imageObj = images[i];
        setProgress((i / images.length) * 90); // 90% for processing, 10% for final steps
        
        try {
          const imageBytes = await imageObj.file.arrayBuffer();
          let embeddedImage;
          
          switch(imageObj.type) {
            case 'png':
              embeddedImage = await pdfDoc.embedPng(imageBytes);
              break;
            case 'jpg':
            case 'jpeg':
              embeddedImage = await pdfDoc.embedJpg(imageBytes);
              break;
            case 'webp':
            case 'gif':
            case 'bmp':
            case 'tiff':
              embeddedImage = await convertViaCanvas(imageBytes, pdfDoc, options.quality);
              break;
            case 'svg':
            case 'svg+xml':
              embeddedImage = await convertSvgToPdf(imageBytes, pdfDoc);
              break;
            default:
              console.warn(`Unsupported image format: ${imageObj.type}`);
              continue;
          }

          // Calculate page dimensions based on options
          const { width, height } = calculatePageDimensions(
            embeddedImage.width, 
            embeddedImage.height, 
            options.pageSize,
            options.orientation
          );

          const page = pdfDoc.addPage([width, height]);
          
          // Calculate image position to center it on the page
          const imageWidth = Math.min(width - (options.margin * 2), embeddedImage.width);
          const imageHeight = Math.min(height - (options.margin * 2), embeddedImage.height);
          
          // Maintain aspect ratio
          const aspectRatio = embeddedImage.width / embeddedImage.height;
          let finalWidth = imageWidth;
          let finalHeight = imageHeight;
          
          if (imageWidth / imageHeight > aspectRatio) {
            finalWidth = imageHeight * aspectRatio;
          } else {
            finalHeight = imageWidth / aspectRatio;
          }
          
          const x = (width - finalWidth) / 2;
          const y = (height - finalHeight) / 2;

          page.drawImage(embeddedImage, { 
            x, 
            y, 
            width: finalWidth, 
            height: finalHeight 
          });
        } catch (imageError) {
          console.error(`Error processing image ${imageObj.name}:`, imageError);
          // Continue with other images instead of failing completely
          continue;
        }
      }

      if (pdfDoc.getPageCount() === 0) {
        throw new Error('No images could be processed successfully');
      }

      setProgress(95);

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Calculate PDF size
      const sizeInKB = (pdfBytes.length / 1024).toFixed(2);
      const sizeInMB = (parseFloat(sizeInKB) / 1024).toFixed(2);
      const size = parseFloat(sizeInMB) >= 1 ? `${sizeInMB} MB` : `${sizeInKB} KB`;

      setProgress(100);

      return {
        pdfUrl,
        size,
        pageCount: pdfDoc.getPageCount()
      };

    } catch (err) {
      console.error('PDF conversion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert images to PDF';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsConverting(false);
    }
  }, []);

  const convertViaCanvas = async (imageBytes, pdfDoc, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(new Blob([imageBytes]));
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to PNG blob with quality
        canvas.toBlob(async (blob) => {
          try {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }
            
            const pngBytes = await blob.arrayBuffer();
            const embeddedImage = await pdfDoc.embedPng(pngBytes);
            URL.revokeObjectURL(url);
            resolve(embeddedImage);
          } catch (err) {
            reject(new Error(`Failed to convert image: ${err instanceof Error ? err.message : 'Unknown error'}`));
          }
        }, 'image/png', quality / 100);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for conversion'));
      };
      
      img.src = url;
    });
  };

  const convertSvgToPdf = async (svgBytes, pdfDoc) => {
    return new Promise((resolve, reject) => {
      const svgBlob = new Blob([svgBytes], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set reasonable default dimensions if not specified
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Ensure SVG has proper dimensions
        const svgContent = new TextDecoder().decode(svgBytes);
        const svgWithDimensions = svgContent.includes('viewBox') ? 
          svgContent : 
          svgContent.replace('<svg', `<svg viewBox="0 0 ${canvas.width} ${canvas.height}"`);
        
        const svgBlob = new Blob([svgWithDimensions], { type: 'image/svg+xml' });
        const newUrl = URL.createObjectURL(svgBlob);
        
        // Create new image with updated SVG
        const newImg = new Image();
        newImg.onload = () => {
          try {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(async (blob) => {
              try {
                if (!blob) {
                  reject(new Error('Failed to create blob from canvas'));
                  return;
                }
                
                const pngBytes = await blob.arrayBuffer();
                const embeddedImage = await pdfDoc.embedPng(pngBytes);
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(newUrl);
                resolve(embeddedImage);
              } catch (err) {
                reject(err);
              }
            }, 'image/png');
          } catch (err) {
            reject(err);
          }
        };
        
        newImg.onerror = () => {
          URL.revokeObjectURL(newUrl);
          reject(new Error('Failed to load processed SVG'));
        };
        
        newImg.src = newUrl;
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      
      img.src = url;
    });
  };

  const calculatePageDimensions = (
    imageWidth, 
    imageHeight, 
    pageSize,
    orientation
  ) => {
    // Standard page sizes in points (72 points = 1 inch)
    const pageSizes = {
      'a4': { width: 595, height: 842 },
      'letter': { width: 612, height: 792 },
      'legal': { width: 612, height: 1008 },
      'auto': { width: imageWidth, height: imageHeight }
    };

    let { width, height } = pageSizes[pageSize] || pageSizes.auto;

    // Handle orientation
    if (orientation === 'landscape' && pageSize !== 'auto') {
      [width, height] = [height, width];
    } else if (orientation === 'auto' && pageSize !== 'auto') {
      // Auto-detect orientation based on image aspect ratio
      const imageAspectRatio = imageWidth / imageHeight;
      if (imageAspectRatio > 1) {
        // Image is wider than tall, use landscape
        [width, height] = [height, width];
      }
    }

    return { width, height };
  };

  return {
    convertImagesToPDF,
    supportedFormats,
    isMobile,
    isConverting,
    error,
    progress
  };
};

export default useImagesToPDF;