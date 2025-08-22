import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ImageMerger.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { ImageMergerHelmet } from '../../seo/TabsHelment';

const ImageMerger = () => {
  // Use shared image processor hook - Following Compression.jsx pattern exactly
  const {
    originalSize,
    processedSize,
    sizeReduction,
    imageDetails,
    previewUrl,
    error,
    successMessage,
    currentStep,
    isProcessing,
    isCalculating,
    handleFileUpload: baseHandleFileUpload,
    updateProcessedSize,
    createDownloadLink,
    resetProcessor: baseResetProcessor,
    setError,
    setSuccessMessage,
    setIsProcessing,
    setIsCalculating,
    setOriginalSize,
    setProcessedSize,
    setSizeReduction,
    setImageDetails,
    setPreviewUrl,
    setCurrentStep
  } = useImageProcessor();

  // Refs
  const canvasRef = useRef(null);

  // Image merger specific states
  const [uploadedImages, setUploadedImages] = useState([]);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  // Merger-specific states
  const [mergeLayout, setMergeLayout] = useState('side-by-side');
  const [collageTemplate, setCollageTemplate] = useState('classic'); // 'classic', 'creative', 'magazine', 'polaroid'
  const [mergeSettings, setMergeSettings] = useState({
    spacing: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    maxWidth: 1920,
    maxHeight: 1080,
    borderRadius: 0,
    shadow: false,
    aspectRatio: 'auto' // 'auto', 'square', '16:9', '4:3'
  });

  const handleMultipleFileUpload = useCallback((files) => {
    if (!files || files.length === 0) {
      setError('Please select at least 2 images to merge');
      return;
    }

    if (files.length < 2) {
      setError('You need at least 2 images to create a collage');
      return;
    }

    if (files.length > 9) {
      setError('Maximum 9 images allowed for merging');
      return;
    }

    // Validate file types and sizes
    const invalidFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        return true;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      setError(`Invalid files detected: ${invalidFiles.map(f => f.name).join(', ')}. Please ensure all files are images under 10MB.`);
      return;
    }

    const imagePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          reject(new Error(`${file.name} is not a valid image file`));
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          reject(new Error(`${file.name} is too large (max 10MB)`));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              file,
              url: e.target.result,
              width: img.width,
              height: img.height,
              name: file.name,
              size: (file.size / 1024).toFixed(2)
            });
          };
          img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    setIsProcessing(true);
    setError(null);

    Promise.all(imagePromises)
      .then((images) => {
        console.log('🐛 DEBUG: Uploaded images:', images.map(img => img.name));
        console.log('🐛 DEBUG: Total images count:', images.length);
        
        setUploadedImages(images);
        
        // Calculate total original size - Following Compression.jsx pattern
        const totalOriginalSize = images.reduce((total, img) => total + parseFloat(img.size), 0).toFixed(2);
        setOriginalSize(totalOriginalSize);
        
        // Set preview URL to first image - Following Compression.jsx pattern
        setPreviewUrl(images[0].url);
        
        // Set image details for preview
        setImageDetails({
          name: `${images.length}_images_to_merge`,
          type: 'Multiple Images',
          dimensions: `${images.length} images`
        });
        
        setCurrentStep(2);
        setIsProcessing(false);
        setSuccessMessage(`Successfully loaded ${images.length} images!`);
      })
      .catch((err) => {
        setError(err.message);
        setIsProcessing(false);
      });
  }, [setError, setIsProcessing, setCurrentStep, setSuccessMessage, setOriginalSize, setPreviewUrl, setImageDetails]);

  const mergeImages = useCallback(async () => {
    if (uploadedImages.length < 2) {
      setError('Please upload at least 2 images to merge');
      return;
    }

    if (uploadedImages.length > 9) {
      setError('Maximum 9 images allowed for merging');
      return;
    }

    // Validate that all images are loaded
    const invalidImages = uploadedImages.filter(img => !img.url || !img.width || !img.height);
    if (invalidImages.length > 0) {
      setError('Some images failed to load. Please try uploading again.');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas not available');
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Calculate layout dimensions
      const { canvasWidth, canvasHeight, imagePositions } = calculateLayout(uploadedImages, mergeLayout, mergeSettings);
      
      if (!canvasWidth || !canvasHeight) {
        throw new Error('Invalid canvas dimensions');
      }
      
      // Validate canvas dimensions are reasonable
      if (canvasWidth < 100 || canvasHeight < 100) {
        throw new Error(`Canvas dimensions too small: ${canvasWidth}x${canvasHeight}. Minimum size is 100x100.`);
      }
      
      if (canvasWidth > 4000 || canvasHeight > 4000) {
        throw new Error(`Canvas dimensions too large: ${canvasWidth}x${canvasHeight}. Maximum size is 4000x4000.`);
      }
      
      // Validate image positions
      if (!imagePositions || imagePositions.length !== uploadedImages.length) {
        throw new Error(`Layout calculation failed: expected ${uploadedImages.length} positions, got ${imagePositions ? imagePositions.length : 0}`);
      }
      
      // Validate each position
      imagePositions.forEach((pos, idx) => {
        if (!pos || typeof pos.x === 'undefined' || typeof pos.y === 'undefined' || 
            typeof pos.width === 'undefined' || typeof pos.height === 'undefined') {
          throw new Error(`Invalid position for image ${idx + 1}: ${JSON.stringify(pos)}`);
        }
        
        // Ensure position is within canvas bounds
        if (pos.x < 0 || pos.y < 0 || pos.x + pos.width > canvasWidth || pos.y + pos.height > canvasHeight) {
          console.warn(`Image ${idx + 1} position (${pos.x}, ${pos.y}) with size (${pos.width}x${pos.height}) may be outside canvas bounds (${canvasWidth}x${canvasHeight})`);
        }
      });
      
      console.log(`Creating collage with dimensions: ${canvasWidth}x${canvasHeight}, aspect ratio: ${(canvasWidth/canvasHeight).toFixed(2)}`);
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill background
      ctx.fillStyle = mergeSettings.backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Load and draw all images
      const imagePromises = uploadedImages.map((imageData, index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const position = imagePositions[index];
            
            // Validate position before drawing
            if (!position || typeof position.x === 'undefined' || typeof position.y === 'undefined' || 
                typeof position.width === 'undefined' || typeof position.height === 'undefined') {
              console.error('Invalid position for image:', index, position);
              reject(new Error(`Invalid position calculated for image ${index + 1}`));
              return;
            }
            
            try {
              ctx.drawImage(img, position.x, position.y, position.width, position.height);
              resolve();
            } catch (drawError) {
              console.error('Error drawing image:', drawError);
              reject(new Error(`Failed to draw image ${index + 1}`));
            }
          };
          img.onerror = () => reject(new Error(`Failed to load image ${index + 1}`));
          img.src = imageData.url;
        });
      });

      await Promise.all(imagePromises);

      // Create merged image URL
      const mergedDataUrl = canvas.toDataURL('image/png', 0.9);
      setProcessedImageUrl(mergedDataUrl);

      // Calculate processed size - Following Compression.jsx pattern
      const byteString = atob(mergedDataUrl.split(',')[1]);
      const sizeKB = (byteString.length / 1024).toFixed(2);
      updateProcessedSize(sizeKB);
      
      // Calculate size reduction like Compression.jsx
      if (originalSize) {
        const original = parseFloat(originalSize);
        const processed = parseFloat(sizeKB);
        const reduction = ((original - processed) / original) * 100;
        setSizeReduction(reduction.toFixed(2));
      }

      // Update image details for merged result - Following Compression.jsx pattern
      setImageDetails({
        name: 'merged_collage.png',
        type: 'PNG',
        dimensions: `${canvasWidth}×${canvasHeight}`
      });

      setCurrentStep(3);
      setIsCalculating(false);
      setSuccessMessage('Collage created successfully! Ready to download.');
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Merge error:', err);
      setError(`Failed to merge images: ${err.message}. Please try again.`);
      setIsCalculating(false);
    }
  }, [uploadedImages, mergeLayout, mergeSettings, setError, setIsCalculating, setCurrentStep, setSuccessMessage, updateProcessedSize, setSizeReduction, setImageDetails, originalSize]);

  const calculateLayout = useCallback((images, layout, settings) => {
    const { spacing, padding, maxWidth, maxHeight } = settings;
    let rows, cols;

    // Validate input
    if (!images || images.length === 0) {
      throw new Error('No images provided for layout calculation');
    }

    // Determine grid layout
    switch (layout) {
      case 'side-by-side':
        rows = 1;
        cols = images.length;
        break;
      case 'vertical':
        rows = images.length;
        cols = 1;
        break;
      case '2x2':
        rows = 2;
        cols = 2;
        // Ensure we have enough images for this layout
        if (images.length > 4) {
          console.warn(`2x2 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '3x3':
        rows = 3;
        cols = 3;
        // Ensure we have enough images for this layout
        if (images.length > 9) {
          console.warn(`3x3 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '2x3':
        rows = 2;
        cols = 3;
        // Ensure we have enough images for this layout
        if (images.length > 6) {
          console.warn(`2x3 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '3x2':
        rows = 3;
        cols = 2;
        // Ensure we have enough images for this layout
        if (images.length > 6) {
          console.warn(`3x2 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '2x4':
        rows = 2;
        cols = 4;
        // Ensure we have enough images for this layout
        if (images.length > 8) {
          console.warn(`2x4 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '4x2':
        rows = 4;
        cols = 2;
        // Ensure we have enough images for this layout
        if (images.length > 8) {
          console.warn(`4x2 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '4x1':
        rows = 1;
        cols = 4;
        // Ensure we have enough images for this layout
        if (images.length > 4) {
          console.warn(`4x1 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case '1x4':
        rows = 4;
        cols = 1;
        // Ensure we have enough images for this layout
        if (images.length > 4) {
          console.warn(`1x4 layout selected but have ${images.length} images. Some images may not be displayed.`);
        }
        break;
      case 'circle':
        return calculateCircleLayout(images, settings);
      case 'diamond':
        return calculateDiamondLayout(images, settings);
      case 'heart':
        return calculateHeartLayout(images, settings);
      case 'creative-mix':
        return calculateCreativeMixLayout(images, settings);
      default:
        // Smart auto layout based on image count
        if (images.length <= 4) {
          rows = 2; cols = 2;
        } else if (images.length <= 6) {
          rows = 2; cols = 3;
        } else if (images.length <= 9) {
          rows = 3; cols = 3;
        } else {
          rows = 4; cols = Math.ceil(images.length / 4);
        }
        console.log(`Auto layout selected: ${rows}x${cols} for ${images.length} images`);
    }

    // Calculate individual image size with proper aspect ratio
    const availableWidth = maxWidth - (padding * 2) - (spacing * (cols - 1));
    const availableHeight = maxHeight - (padding * 2) - (spacing * (rows - 1));
    
    // Calculate image dimensions maintaining aspect ratio
    let imageWidth, imageHeight;
    
    if (availableWidth / cols > availableHeight / rows) {
      // Height is the limiting factor
      imageHeight = Math.floor(availableHeight / rows);
      imageWidth = Math.floor(imageHeight * (maxWidth / maxHeight));
    } else {
      // Width is the limiting factor
      imageWidth = Math.floor(availableWidth / cols);
      imageHeight = Math.floor(imageWidth * (maxHeight / maxWidth));
    }
    
    // Ensure minimum dimensions
    imageWidth = Math.max(imageWidth, 50);
    imageHeight = Math.max(imageHeight, 50);

    // Calculate actual canvas size maintaining aspect ratio
    let canvasWidth = Math.min(maxWidth, (imageWidth * cols) + (spacing * (cols - 1)) + (padding * 2));
    let canvasHeight = Math.min(maxHeight, (imageHeight * rows) + (spacing * (rows - 1)) + (padding * 2));
    
    // Ensure canvas maintains proper aspect ratio
    const targetAspectRatio = maxWidth / maxHeight;
    const currentAspectRatio = canvasWidth / canvasHeight;
    
    if (Math.abs(currentAspectRatio - targetAspectRatio) > 0.1) {
      // Adjust canvas size to maintain aspect ratio
      if (currentAspectRatio > targetAspectRatio) {
        // Too wide, reduce width
        canvasWidth = canvasHeight * targetAspectRatio;
      } else {
        // Too tall, reduce height
        canvasHeight = canvasWidth / targetAspectRatio;
      }
      
      // Ensure we don't exceed maximum dimensions
      canvasWidth = Math.min(canvasWidth, maxWidth);
      canvasHeight = Math.min(canvasHeight, maxHeight);
    }

    // Calculate positions for each image
    const imagePositions = images.map((_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // Ensure we don't exceed the layout bounds
      if (row >= rows || col >= cols) {
        console.warn(`Image ${index + 1} exceeds layout bounds (${rows}x${cols}). Using fallback position.`);
        // Use a fallback position (stacked at the bottom)
        const fallbackRow = Math.floor(index / cols);
        const fallbackCol = index % cols;
        return {
          x: padding + (fallbackCol * (imageWidth + spacing)),
          y: padding + (fallbackRow * (imageHeight + spacing)),
          width: imageWidth,
          height: imageHeight
        };
      }
      
      return {
        x: padding + (col * (imageWidth + spacing)),
        y: padding + (row * (imageHeight + spacing)),
        width: imageWidth,
        height: imageHeight
      };
    });

    return { canvasWidth, canvasHeight, imagePositions };
  }, []);

  // Creative layout calculations
  const calculateCircleLayout = useCallback((images, settings) => {
    const { padding, maxWidth, maxHeight } = settings;
    const centerX = maxWidth / 2;
    const centerY = maxHeight / 2;
    
    // Calculate proper radius and image size based on canvas dimensions
    const radius = Math.min(maxWidth, maxHeight) / 3;
    const imageSize = Math.min(150, Math.min(maxWidth, maxHeight) / 4);
    
    // Ensure images don't overlap
    const adjustedRadius = Math.max(radius, (imageSize * images.length) / (2 * Math.PI));
    
    const imagePositions = images.map((_, index) => {
      const angle = (2 * Math.PI * index) / images.length;
      const x = centerX + adjustedRadius * Math.cos(angle) - imageSize / 2;
      const y = centerY + adjustedRadius * Math.sin(angle) - imageSize / 2;
      
      // Ensure images stay within canvas bounds
      const boundedX = Math.max(padding, Math.min(maxWidth - imageSize - padding, x));
      const boundedY = Math.max(padding, Math.min(maxHeight - imageSize - padding, y));
      
      return { x: boundedX, y: boundedY, width: imageSize, height: imageSize };
    });
    
    return { canvasWidth: maxWidth, canvasHeight: maxHeight, imagePositions };
  }, []);

  const calculateDiamondLayout = useCallback((images, settings) => {
    const { maxWidth, maxHeight, padding } = settings;
    const centerX = maxWidth / 2;
    const centerY = maxHeight / 2;
    
    // Calculate proper image size based on canvas dimensions
    const imageSize = Math.min(120, Math.min(maxWidth, maxHeight) / 5);
    
    // Diamond positions with proper bounds checking
    const positions = [
      { x: centerX - imageSize/2, y: centerY - 150 }, // top
      { x: centerX - 150, y: centerY - imageSize/2 }, // left
      { x: centerX - imageSize/2, y: centerY - imageSize/2 }, // center
      { x: centerX + 30, y: centerY - imageSize/2 }, // right
      { x: centerX - imageSize/2, y: centerY + 30 }, // bottom
      { x: centerX + 150, y: centerY - imageSize/2 }, // right extended
      { x: centerX - imageSize/2, y: centerY + 150 }, // bottom extended
      { x: centerX + 150, y: centerY + 150 }, // bottom right
    ];
    
    const imagePositions = images.map((_, index) => {
      const pos = positions[index % positions.length];
      
      // Ensure images stay within canvas bounds
      const boundedX = Math.max(padding, Math.min(maxWidth - imageSize - padding, pos.x));
      const boundedY = Math.max(padding, Math.min(maxHeight - imageSize - padding, pos.y));
      
      return {
        x: boundedX,
        y: boundedY,
        width: imageSize,
        height: imageSize
      };
    });
    
    return { canvasWidth: maxWidth, canvasHeight: maxHeight, imagePositions };
  }, []);

  const calculateHeartLayout = useCallback((images, settings) => {
    const { maxWidth, maxHeight, padding } = settings;
    const centerX = maxWidth / 2;
    const centerY = maxHeight / 2;
    
    // Calculate proper image size based on canvas dimensions
    const imageSize = Math.min(100, Math.min(maxWidth, maxHeight) / 6);
    
    // Heart shape positions with proper bounds checking
    const heartPositions = [
      { x: centerX - 60, y: centerY - 80 }, // top left
      { x: centerX + 10, y: centerY - 80 }, // top right
      { x: centerX - 80, y: centerY - 30 }, // middle left
      { x: centerX - 25, y: centerY - 30 }, // center
      { x: centerX + 30, y: centerY - 30 }, // middle right
      { x: centerX - 50, y: centerY + 20 }, // bottom left
      { x: centerX, y: centerY + 20 }, // bottom center
      { x: centerX - 25, y: centerY + 60 }, // bottom point
      { x: centerX + 50, y: centerY + 20 }, // bottom right extended
      { x: centerX + 80, y: centerY - 30 }, // top right extended
    ];
    
    const imagePositions = images.map((_, index) => {
      const pos = heartPositions[index % heartPositions.length];
      
      // Ensure images stay within canvas bounds
      const boundedX = Math.max(padding, Math.min(maxWidth - imageSize - padding, pos.x));
      const boundedY = Math.max(padding, Math.min(maxHeight - imageSize - padding, pos.y));
      
      return {
        x: boundedX,
        y: boundedY,
        width: imageSize,
        height: imageSize
      };
    });
    
    return { canvasWidth: maxWidth, canvasHeight: maxHeight, imagePositions };
  }, []);

  const calculateCreativeMixLayout = useCallback((images, settings) => {
    const { maxWidth, maxHeight, spacing, padding } = settings;
    const imagePositions = [];
    
    // Calculate proper aspect ratio for images
    const aspectRatio = maxWidth / maxHeight;
    const baseImageWidth = maxWidth * 0.3;
    const baseImageHeight = baseImageWidth / aspectRatio;
    
    // Creative asymmetrical layout with proper dimensions
    const layouts = [
      // For 2-3 images: Magazine style
      { x: padding, y: padding, width: maxWidth * 0.6 - padding, height: maxHeight * 0.7 },
      { x: maxWidth * 0.6 + spacing, y: padding, width: maxWidth * 0.35 - padding, height: maxHeight * 0.3 },
      { x: maxWidth * 0.6 + spacing, y: maxHeight * 0.3 + spacing, width: maxWidth * 0.35 - padding, height: maxHeight * 0.4 },
      // Additional positions for more images
      { x: padding, y: maxHeight * 0.7 + spacing, width: baseImageWidth, height: baseImageHeight },
      { x: baseImageWidth + spacing, y: maxHeight * 0.7 + spacing, width: baseImageWidth, height: baseImageHeight },
      { x: maxWidth * 0.6 + spacing, y: maxHeight * 0.7 + spacing, width: maxWidth * 0.35, height: maxHeight * 0.25 },
      // Additional positions for 7+ images
      { x: maxWidth * 0.3 + spacing, y: padding, width: baseImageWidth * 0.8, height: baseImageHeight * 0.8 },
      { x: padding, y: maxHeight * 0.35, width: baseImageWidth * 0.8, height: baseImageHeight * 0.8 },
      { x: maxWidth * 0.7 + spacing, y: maxHeight * 0.35, width: baseImageWidth * 0.8, height: baseImageHeight * 0.8 },
    ];
    
    images.forEach((_, index) => {
      if (layouts[index]) {
        imagePositions.push(layouts[index]);
      }
    });
    
    return { canvasWidth: maxWidth, canvasHeight: maxHeight, imagePositions };
  }, []);

  // Calculate preview positions for live preview
  const calculatePreviewPosition = useCallback((index, layout, settings) => {
    const { spacing, padding, maxWidth, maxHeight } = settings;
    let x, y, width, height;

    // Debug logging for troubleshooting
    if (process.env.NODE_ENV === 'development') {
      console.log(`Calculating position for image ${index}, layout: ${layout}, settings:`, settings);
    }

    switch (layout) {
      case 'side-by-side':
        width = (maxWidth - (padding * 2) - (spacing * (uploadedImages.length - 1))) / uploadedImages.length;
        height = maxHeight - (padding * 2);
        x = padding + (index * (width + spacing));
        y = padding;
        break;

      case 'vertical':
        width = maxWidth - (padding * 2);
        height = (maxHeight - (padding * 2) - (spacing * (uploadedImages.length - 1))) / uploadedImages.length;
        x = padding;
        y = padding + (index * (height + spacing));
        break;

      case '2x2':
        const cols2x2 = 2;
        const rows2x2 = 2;
        width = (maxWidth - (padding * 2) - (spacing * (cols2x2 - 1))) / cols2x2;
        height = (maxHeight - (padding * 2) - (spacing * (rows2x2 - 1))) / rows2x2;
        const row2x2 = Math.floor(index / cols2x2);
        const col2x2 = index % cols2x2;
        x = padding + (col2x2 * (width + spacing));
        y = padding + (row2x2 * (height + spacing));
        break;

      case '3x3':
        const cols3x3 = 3;
        const rows3x3 = 3;
        width = (maxWidth - (padding * 2) - (spacing * (cols3x3 - 1))) / cols3x3;
        height = (maxHeight - (padding * 2) - (spacing * (rows3x3 - 1))) / rows3x3;
        const row3x3 = Math.floor(index / cols3x3);
        const col3x3 = index % cols3x3;
        x = padding + (col3x3 * (width + spacing));
        y = padding + (row3x3 * (height + spacing));
        break;

      case '2x3':
        const cols2x3 = 2;
        const rows2x3 = 3;
        width = (maxWidth - (padding * 2) - (spacing * (cols2x3 - 1))) / cols2x3;
        height = (maxHeight - (padding * 2) - (spacing * (rows2x3 - 1))) / rows2x3;
        const row2x3 = Math.floor(index / cols2x3);
        const col2x3 = index % cols2x3;
        x = padding + (col2x3 * (width + spacing));
        y = padding + (row2x3 * (height + spacing));
        break;

      case '3x2':
        const cols3x2 = 3;
        const rows3x2 = 2;
        width = (maxWidth - (padding * 2) - (spacing * (cols3x2 - 1))) / cols3x2;
        height = (maxHeight - (padding * 2) - (spacing * (rows3x2 - 1))) / rows3x2;
        const row3x2 = Math.floor(index / cols3x2);
        const col3x2 = index % cols3x2;
        x = padding + (col3x2 * (width + spacing));
        y = padding + (row3x2 * (height + spacing));
        break;

      case '2x4':
        const cols2x4 = 2;
        const rows2x4 = 4;
        width = (maxWidth - (padding * 2) - (spacing * (cols2x4 - 1))) / cols2x4;
        height = (maxHeight - (padding * 2) - (spacing * (rows2x4 - 1))) / rows2x4;
        const row2x4 = Math.floor(index / cols2x4);
        const col2x4 = index % cols2x4;
        x = padding + (col2x4 * (width + spacing));
        y = padding + (row2x4 * (height + spacing));
        break;

      case '4x2':
        const cols4x2 = 4;
        const rows4x2 = 2;
        width = (maxWidth - (padding * 2) - (spacing * (cols4x2 - 1))) / cols4x2;
        height = (maxHeight - (padding * 2) - (spacing * (rows4x2 - 1))) / rows4x2;
        const row4x2 = Math.floor(index / cols4x2);
        const col4x2 = index % cols4x2;
        x = padding + (col4x2 * (width + spacing));
        y = padding + (row4x2 * (height + spacing));
        break;

      case '4x1':
        width = (maxWidth - (padding * 2) - (spacing * 3)) / 4;
        height = maxHeight - (padding * 2);
        x = padding + (index * (width + spacing));
        y = padding;
        break;

      case '1x4':
        width = maxWidth - (padding * 2);
        height = (maxHeight - (padding * 2) - (spacing * 3)) / 4;
        x = padding;
        y = padding + (index * (height + spacing));
        break;

      case 'creative-mix':
        // Magazine style layout with support for up to 9 images
        if (index === 0) {
          // Main large image
          width = maxWidth * 0.6 - padding;
          height = maxHeight * 0.7;
          x = padding;
          y = padding;
        } else if (index === 1) {
          // Top right small image
          width = maxWidth * 0.35 - padding;
          height = maxHeight * 0.3;
          x = maxWidth * 0.6 + spacing;
          y = padding;
        } else if (index === 2) {
          // Middle right image
          width = maxWidth * 0.35 - padding;
          height = maxHeight * 0.4;
          x = maxWidth * 0.6 + spacing;
          y = maxHeight * 0.3 + spacing;
        } else if (index === 3) {
          // Bottom left image
          width = maxWidth * 0.3;
          height = maxHeight * 0.25;
          x = padding;
          y = maxHeight * 0.7 + spacing;
        } else if (index === 4) {
          // Bottom middle image
          width = maxWidth * 0.3;
          height = maxHeight * 0.25;
          x = maxWidth * 0.3 + spacing;
          y = maxHeight * 0.7 + spacing;
        } else if (index === 5) {
          // Bottom right image
          width = maxWidth * 0.35;
          height = maxHeight * 0.25;
          x = maxWidth * 0.6 + spacing;
          y = maxHeight * 0.7 + spacing;
        } else if (index === 6) {
          // Additional image - top center
          width = maxWidth * 0.3;
          height = maxHeight * 0.25;
          x = maxWidth * 0.3 + spacing;
          y = padding;
        } else if (index === 7) {
          // Additional image - center left
          width = maxWidth * 0.25;
          height = maxHeight * 0.3;
          x = padding;
          y = maxHeight * 0.35;
        } else if (index === 8) {
          // Additional image - center right
          width = maxWidth * 0.25;
          height = maxHeight * 0.3;
          x = maxWidth * 0.7 + spacing;
          y = maxHeight * 0.35;
        } else {
          // Fallback for any additional images
          width = maxWidth * 0.2;
          height = maxHeight * 0.2;
          x = padding + (index * (width + spacing * 0.5));
          y = maxHeight * 0.8 + spacing;
        }
        break;

      case 'circle':
        const centerX = maxWidth / 2;
        const centerY = maxHeight / 2;
        const radius = Math.min(maxWidth, maxHeight) / 3;
        const imageSize = Math.min(150, Math.min(maxWidth, maxHeight) / 4);
        const angle = (2 * Math.PI * index) / uploadedImages.length;
        x = centerX + radius * Math.cos(angle) - imageSize / 2;
        y = centerY + radius * Math.sin(angle) - imageSize / 2;
        width = imageSize;
        height = imageSize;
        break;

      case 'diamond':
        const centerXD = maxWidth / 2;
        const centerYD = maxHeight / 2;
        const imageSizeD = Math.min(120, Math.min(maxWidth, maxHeight) / 5);
        const positions = [
          { x: centerXD - imageSizeD/2, y: centerYD - 150 },
          { x: centerXD - 150, y: centerYD - imageSizeD/2 },
          { x: centerXD - imageSizeD/2, y: centerYD - imageSizeD/2 },
          { x: centerXD + 30, y: centerYD - imageSizeD/2 },
          { x: centerXD - imageSizeD/2, y: centerYD + 30 },
          { x: centerXD + 150, y: centerYD - imageSizeD/2 },
          { x: centerXD - imageSizeD/2, y: centerYD + 150 },
          { x: centerXD + 150, y: centerYD + 150 },
        ];
        const pos = positions[index % positions.length];
        x = pos.x;
        y = pos.y;
        width = imageSizeD;
        height = imageSizeD;
        break;

      case 'heart':
        const centerXH = maxWidth / 2;
        const centerYH = maxHeight / 2;
        const imageSizeH = Math.min(100, Math.min(maxWidth, maxHeight) / 6);
        const heartPositions = [
          { x: centerXH - 60, y: centerYH - 80 },
          { x: centerXH + 10, y: centerYH - 80 },
          { x: centerXH - 80, y: centerYH - 30 },
          { x: centerXH - 25, y: centerYH - 30 },
          { x: centerXH + 30, y: centerYH - 30 },
          { x: centerXH - 50, y: centerYH + 20 },
          { x: centerXH, y: centerYH + 20 },
          { x: centerXH - 25, y: centerYH + 60 },
          { x: centerXH + 50, y: centerYH + 20 },
          { x: centerXH + 80, y: centerYH - 30 },
        ];
        const heartPos = heartPositions[index % heartPositions.length];
        x = heartPos.x;
        y = heartPos.y;
        width = imageSizeH;
        height = imageSizeH;
        break;

      default:
        // Smart auto layout based on image count
        let cols, rows;
        
        if (uploadedImages.length <= 4) {
          cols = 2;
          rows = 2;
        } else if (uploadedImages.length <= 6) {
          cols = 3;
          rows = 2;
        } else if (uploadedImages.length <= 9) {
          cols = 3;
          rows = 3;
        } else {
          // Fallback to square root
          cols = Math.ceil(Math.sqrt(uploadedImages.length));
          rows = Math.ceil(uploadedImages.length / cols);
        }
        
        width = (maxWidth - (padding * 2) - (spacing * (cols - 1))) / cols;
        height = (maxHeight - (padding * 2) - (spacing * (rows - 1))) / rows;
        const row = Math.floor(index / cols);
        const col = index % cols;
        x = padding + (col * (width + spacing));
        y = padding + (row * (height + spacing));
        break;
    }

    // Ensure all values are defined and valid
    if (typeof x === 'undefined' || typeof y === 'undefined' || typeof width === 'undefined' || typeof height === 'undefined') {
      console.error('Invalid position calculated for index:', index, 'layout:', layout, 'settings:', settings);
      
      // Comprehensive fallback system
      const totalImages = uploadedImages.length;
      let fallbackCols, fallbackRows;
      
      // Smart grid layout based on image count
      if (totalImages <= 4) {
        fallbackCols = 2;
        fallbackRows = 2;
      } else if (totalImages <= 6) {
        fallbackCols = 3;
        fallbackRows = 2;
      } else if (totalImages <= 9) {
        fallbackCols = 3;
        fallbackRows = 3;
      } else {
        // For more than 9 images, use a wider grid
        fallbackCols = 4;
        fallbackRows = Math.ceil(totalImages / 4);
      }
      
      // Calculate fallback dimensions
      const fallbackWidth = Math.max(50, (maxWidth - (padding * 2) - (spacing * (fallbackCols - 1))) / fallbackCols);
      const fallbackHeight = Math.max(50, (maxHeight - (padding * 2) - (spacing * (fallbackRows - 1))) / fallbackRows);
      
      // Calculate position in grid
      const fallbackRow = Math.floor(index / fallbackCols);
      const fallbackCol = index % fallbackCols;
      
      // Ensure position is within bounds
      x = Math.max(padding, Math.min(maxWidth - fallbackWidth - padding, padding + (fallbackCol * (fallbackWidth + spacing))));
      y = Math.max(padding, Math.min(maxHeight - fallbackHeight - padding, padding + (fallbackRow * (fallbackHeight + spacing))));
      width = fallbackWidth;
      height = fallbackHeight;
      
      console.log(`Applied comprehensive fallback: ${fallbackCols}x${fallbackRows} grid for image ${index} at (${x}, ${y})`);
    }

    // Final validation - ensure values are within bounds
    x = Math.max(0, Math.min(maxWidth - width, x));
    y = Math.max(0, Math.min(maxHeight - height, y));
    width = Math.max(20, Math.min(maxWidth - x, width));
    height = Math.max(20, Math.min(maxHeight - y, height));

    return { x, y, width, height };
  }, [uploadedImages.length]);

  const removeImage = useCallback((index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    
    if (newImages.length === 0) {
      setCurrentStep(1);
      setProcessedImageUrl(null);
    }
  }, [uploadedImages, setCurrentStep]);

  const handleDownload = useCallback(() => {
    if (!processedImageUrl) {
      setError('No merged image to download');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create download link
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `collage_${mergeLayout}_${mergeSettings.maxWidth}x${mergeSettings.maxHeight}.png`;
      link.style.display = 'none';
      
      // Append to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMessage('Collage downloaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Download failed. Please try again.');
      console.error('Download error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [processedImageUrl, mergeLayout, mergeSettings.maxWidth, mergeSettings.maxHeight, setError, setIsProcessing, setSuccessMessage]);

  // Custom reset processor
  const resetProcessor = useCallback(() => {
    baseResetProcessor();
    
    // Reset merger-specific states
    setUploadedImages([]);
    setProcessedImageUrl(null);
    setMergeLayout('side-by-side');
    setCollageTemplate('classic');
    setMergeSettings({
      spacing: 20,
      backgroundColor: '#ffffff',
      padding: 20,
      maxWidth: 1920,
      maxHeight: 1080,
      borderRadius: 0,
      shadow: false,
      aspectRatio: 'auto'
    });
    
    // Reset to step 1
    setCurrentStep(1);
    
    // Clear any errors or success messages
    setError(null);
    setSuccessMessage(null);
  }, [baseResetProcessor, setCurrentStep, setError, setSuccessMessage]);

  // Real-time preview updates when settings change
  useEffect(() => {
    if (uploadedImages.length >= 2) {
      // Force re-render of preview when settings change
      const timeoutId = setTimeout(() => {
        // This will trigger a re-render of the preview
        setCurrentStep(currentStep); // Force re-render
      }, 100); // Small delay for smooth updates
      
      return () => clearTimeout(timeoutId);
    }
  }, [uploadedImages, mergeLayout, mergeSettings.spacing, mergeSettings.maxWidth, mergeSettings.maxHeight, mergeSettings.padding, mergeSettings.backgroundColor, mergeSettings.borderRadius, mergeSettings.shadow, currentStep]);

  // Auto-adjust layout when aspect ratio changes significantly
  useEffect(() => {
    if (uploadedImages.length >= 2) {
      const currentAspectRatio = mergeSettings.maxWidth / mergeSettings.maxHeight;
      
      // Suggest better layout based on aspect ratio
      if (currentAspectRatio > 1.5) {
        // Wide layout - suggest horizontal arrangements
        if (mergeLayout === 'vertical' || mergeLayout === '1x4') {
          console.log('Wide canvas detected, consider using horizontal layouts like side-by-side or 4x1');
        }
      } else if (currentAspectRatio < 0.7) {
        // Tall layout - suggest vertical arrangements
        if (mergeLayout === 'side-by-side' || mergeLayout === '4x1') {
          console.log('Tall canvas detected, consider using vertical layouts like vertical or 1x4');
        }
      }
    }
  }, [mergeSettings.maxWidth, mergeSettings.maxHeight, mergeLayout, uploadedImages.length]);

  // Layout templates with descriptions
  const layoutTemplates = [
    {
      id: 'side-by-side',
      name: 'Side by Side',
      description: 'Classic horizontal layout',
      icon: '↔️',
      category: 'basic'
    },
    {
      id: 'vertical',
      name: 'Vertical Stack',
      description: 'Stacked vertically',
      icon: '↕️',
      category: 'basic'
    },
    {
      id: '2x2',
      name: '2×2 Grid',
      description: 'Perfect square grid',
      icon: '⊞',
      category: 'matrix'
    },
    {
      id: '3x3',
      name: '3×3 Matrix',
      description: 'Instagram-style grid',
      icon: '⊡',
      category: 'matrix'
    },
    {
      id: '2x3',
      name: '2×3 Layout',
      description: 'Photo album style',
      icon: '⊞',
      category: 'matrix'
    },
    {
      id: '3x2',
      name: '3×2 Layout',
      description: 'Landscape grid',
      icon: '⊞',
      category: 'matrix'
    },
    {
      id: '2x4',
      name: '2×4 Layout',
      description: 'Vertical stack',
      icon: '⊞',
      category: 'matrix'
    },
    {
      id: '4x2',
      name: '4×2 Layout',
      description: 'Horizontal strip',
      icon: '⊞',
      category: 'matrix'
    },
    {
      id: '4x1',
      name: '4×1 Strip',
      description: 'Photo strip layout',
      icon: '━',
      category: 'creative'
    },
    {
      id: '1x4',
      name: '1×4 Column',
      description: 'Vertical photo column',
      icon: '┃',
      category: 'creative'
    },
    {
      id: 'circle',
      name: 'Circle Collage',
      description: 'Circular arrangement',
      icon: '○',
      category: 'creative'
    },
    {
      id: 'diamond',
      name: 'Diamond Shape',
      description: 'Diamond formation',
      icon: '◆',
      category: 'creative'
    },
    {
      id: 'heart',
      name: 'Heart Shape',
      description: 'Romantic heart layout',
      icon: '♥️',
      category: 'creative'
    },
    {
      id: 'creative-mix',
      name: 'Magazine Mix',
      description: 'Asymmetrical creative layout',
      icon: '🎨',
      category: 'creative'
    },
    {
      id: 'auto',
      name: 'Smart Auto',
      description: 'AI-optimized layout',
      icon: '🤖',
      category: 'basic'
    }
  ];

  return (
    <div className={styles.imageMerger}>
      <ImageMergerHelmet />

      {/* 1. PROFESSIONAL HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-object-group"></i>
            Professional Image Merger
          </h1>
          <p className={styles.pageDescription}>
            Create stunning collages with multiple images • Professional layouts • Instant results
          </p>
        </div>
      </section>

      {/* 2. MAIN PROCESSING SECTION */}
      <section className={styles.processingSection}>
        <div className={styles.container}>
          
          {/* Progress Indicator */}
          <ProgressIndicator 
            currentStep={currentStep}
            onReset={resetProcessor}
            steps={[
              { number: 1, label: 'Upload Images', description: 'Select 2-9 images' },
              { number: 2, label: 'Arrange Layout', description: 'Choose layout & settings' },
              { number: 3, label: 'Download', description: 'Get your collage' }
            ]}
          />

          {/* Alert Messages */}
          <AlertMessage 
            type="error"
            message={error}
            onClose={() => setError(null)}
            closeable={true}
          />
          
          <AlertMessage 
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
            closeable={true}
            autoClose={true}
          />

          {/* Upload Step - Professional Design */}
          {currentStep === 1 && (
            <div className={styles.uploadStep}>
              <div className={styles.uploadHeader}>
                <h3>
                  <i className="fas fa-cloud-upload-alt"></i>
                  Upload Your Images
                </h3>
                <p>Select 2-9 images to create a beautiful collage</p>
                
                {/* User Guidance */}
                <div className={styles.uploadGuidance}>
                  <div className={styles.guidanceItem}>
                    <i className="fas fa-info-circle"></i>
                    <span><strong>Requirements:</strong> 2-9 images • Max 10MB each</span>
                  </div>
                  <div className={styles.guidanceItem}>
                    <i className="fas fa-lightbulb"></i>
                    <span><strong>Tip:</strong> Use similar aspect ratios for best results</span>
                  </div>
                  <div className={styles.guidanceItem}>
                    <i className="fas fa-check-circle"></i>
                    <span><strong>Supported:</strong> JPG, PNG, WebP, GIF, BMP</span>
                  </div>
                </div>
              </div>
              
              <UploadFileHandling 
                onFileUpload={handleMultipleFileUpload}
                acceptedFormats={["image/*"]}
                multiple={true}
              />
              
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>
                    <i className="fas fa-image"></i>
                    JPG, PNG, WebP, GIF, BMP
                  </span>
                  <span>
                    <i className="fas fa-weight-hanging"></i>
                    Max 10MB per image
                  </span>
                  <span>
                    <i className="fas fa-layer-group"></i>
                    2-9 images required
                  </span>
                  <span>
                    <i className="fas fa-shield-alt"></i>
                    Private & Secure
                  </span>
                </div>
                
                {/* Upload Status */}
                {uploadedImages.length > 0 && (
                  <div className={styles.uploadStatus}>
                    <span className={styles.statusBadge}>
                      <i className="fas fa-check-circle"></i>
                      {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
                    </span>
                    {uploadedImages.length < 2 && (
                      <span className={styles.statusWarning}>
                        <i className="fas fa-exclamation-triangle"></i>
                        Need at least 2 images
                      </span>
                    )}
                    {uploadedImages.length >= 2 && (
                      <span className={styles.statusSuccess}>
                        <i className="fas fa-arrow-right"></i>
                        Ready to create collage
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Creative Collage Workspace */}
          {currentStep >= 2 && uploadedImages.length > 0 && (
            <div className={styles.collageWorkspace}>
              
              {/* Smart Preview Area */}
              <div className={styles.previewArea}>
                <div className={styles.previewHeader}>
                  <h3>
                    {processedImageUrl ? '✨ Your Collage Result' : '🎨 Layout Preview'}
                  </h3>
                  <div className={styles.previewActions}>
                    <button onClick={() => setCurrentStep(1)} className={styles.addImagesBtn}>
                      <i className="fas fa-plus"></i>
                      Add More Images
                    </button>
                  </div>
                </div>
                
                <div className={styles.smartPreview}>
                  {processedImageUrl ? (
                    <div className={styles.finalResult}>
                      <div className={styles.resultBadge}>
                        <i className="fas fa-check-circle"></i>
                        Collage Complete
                      </div>
                      <img src={processedImageUrl} alt="Merged collage" className={styles.resultImage} />
                      <div className={styles.resultMeta}>
                        <span>
                          <i className="fas fa-expand-arrows-alt"></i>
                          {mergeSettings.maxWidth}×{mergeSettings.maxHeight}
                        </span>
                        <span>
                          <i className="fas fa-file-image"></i>
                          {processedSize} KB
                        </span>
                        <span>
                          <i className="fas fa-palette"></i>
                          {mergeLayout.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.layoutPreview}>
                      <div className={styles.previewBadge}>
                        <i className="fas fa-eye"></i>
                        Live Layout Preview
                      </div>
                      
                      {/* Dynamic Live Preview Canvas */}
                      <div className={styles.livePreviewCanvas}>
                        <div 
                          className={styles.previewContainer}
                          style={{
                            width: '100%',
                            maxWidth: '500px',
                            height: 'auto',
                            aspectRatio: `${mergeSettings.maxWidth}/${mergeSettings.maxHeight}`,
                            backgroundColor: mergeSettings.backgroundColor,
                            padding: `${mergeSettings.padding * 0.15}px`,
                            borderRadius: `${mergeSettings.borderRadius}px`,
                            position: 'relative',
                            border: '2px solid #e1e8ed',
                            boxShadow: mergeSettings.shadow ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                            margin: '0 auto'
                          }}
                        >
                          {/* Render images based on actual layout */}
                          {uploadedImages.map((image, index) => {
                            const position = calculatePreviewPosition(index, mergeLayout, mergeSettings);
                            
                            // Calculate optimal scale to fit all images
                            const containerWidth = 500;
                            const containerHeight = 400;
                            const scaleX = containerWidth / mergeSettings.maxWidth;
                            const scaleY = containerHeight / mergeSettings.maxHeight;
                            const scale = Math.min(scaleX, scaleY, 0.8); // Ensure images fit with margin
                            
                            // Ensure position exists and has valid values
                            if (!position || typeof position.x === 'undefined') {
                              console.warn('Invalid position for image:', index, position);
                              return null;
                            }
                            
                            return (
                              <div
                                key={`preview-${image.name}-${index}`}
                                className={styles.livePreviewImage}
                                style={{
                                  position: 'absolute',
                                  left: `${position.x * scale}px`,
                                  top: `${position.y * scale}px`,
                                  width: `${position.width * scale}px`,
                                  height: `${position.height * scale}px`,
                                  backgroundImage: `url(${image.url})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(255,255,255,0.8)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                  minWidth: '20px',
                                  minHeight: '20px'
                                }}
                                title={`Image ${index + 1}: ${image.name}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className={styles.previewInfo}>
                        <span className={styles.liveIndicator}>
                          <i className="fas fa-broadcast-tower"></i>
                          Live Preview
                        </span>
                        <span>
                          <i className="fas fa-info-circle"></i>
                          {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} • {mergeLayout.replace('-', ' ')} layout
                        </span>
                        <span>
                          <i className="fas fa-expand-arrows-alt"></i>
                          Spacing: {mergeSettings.spacing}px
                        </span>
                        <span>
                          <i className="fas fa-tv"></i>
                          {mergeSettings.maxWidth}×{mergeSettings.maxHeight}
                        </span>
                        <span>
                          <i className="fas fa-ratio"></i>
                          {(mergeSettings.maxWidth / mergeSettings.maxHeight).toFixed(2)}:1
                        </span>
                        
                        {/* Layout Suggestion for different image counts */}
                        {uploadedImages.length >= 6 && (
                          <span className={styles.layoutSuggestion}>
                            <i className="fas fa-lightbulb"></i>
                            {uploadedImages.length === 6 ? 'Try 3×2 layout for best fit' : 
                             uploadedImages.length === 7 ? 'Try 3×3 or creative-mix layout' :
                             uploadedImages.length === 8 ? 'Try 3×3 or 4×2 layout' :
                             'Try 3×3 layout for optimal arrangement'}
                          </span>
                        )}
                        
                        {/* Debug Info (Development Only) */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className={styles.debugInfo}>
                            <details>
                              <summary>Debug Info</summary>
                              <div className={styles.debugContent}>
                                <p><strong>Layout:</strong> {mergeLayout}</p>
                                <p><strong>Images:</strong> {uploadedImages.length}</p>
                                <p><strong>Canvas:</strong> {mergeSettings.maxWidth}×{mergeSettings.maxHeight}</p>
                                <p><strong>Spacing:</strong> {mergeSettings.spacing}px</p>
                                <p><strong>Padding:</strong> {mergeSettings.padding}px</p>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Creative Controls Panel */}
              <div className={styles.controlsPanel}>
                
                {/* Compact Image Strip */}
                <div className={styles.imageStrip}>
                  <h4>
                    <i className="fas fa-images"></i>
                    Your Images ({uploadedImages.length})
                  </h4>
                  <div className={styles.horizontalImages}>
                    {uploadedImages.map((image, index) => (
                      <div key={`image-${image.name}-${index}`} className={styles.imageCard}>
                        <img src={image.url} alt={image.name} />
                        <div className={styles.imageOverlay}>
                          <span className={styles.imageIndex}>{index + 1}</span>
                          <button 
                            onClick={() => removeImage(index)} 
                            className={styles.removeBtn}
                            title="Remove image"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Layout Gallery */}
                <div className={styles.layoutGallery}>
                  <h4>
                    <i className="fas fa-th-large"></i>
                    Layout Templates
                  </h4>
                  
                  {/* Popular Layouts */}
                  <div className={styles.popularLayouts}>
                    {[
                      { id: 'side-by-side', name: 'Side by Side', icon: '↔️', desc: 'Classic horizontal' },
                      { id: '2x2', name: '2×2 Grid', icon: '⊞', desc: 'Perfect square' },
                      { id: 'creative-mix', name: 'Magazine', icon: '🎨', desc: 'Creative mix' },
                      { id: 'vertical', name: 'Vertical', icon: '↕️', desc: 'Stacked layout' }
                    ].map((layout) => (
                      <div 
                        key={layout.id}
                        className={`${styles.layoutCard} ${mergeLayout === layout.id ? styles.selectedLayout : ''}`}
                        onClick={() => setMergeLayout(layout.id)}
                      >
                        <div className={styles.layoutVisual}>
                          <div className={`${styles.layoutPreviewMini} ${styles[`preview_${layout.id.replace('-', '_')}`]}`}>
                            <div className={styles.miniBox}></div>
                            <div className={styles.miniBox}></div>
                            <div className={styles.miniBox}></div>
                            <div className={styles.miniBox}></div>
                          </div>
                        </div>
                        <div className={styles.layoutMeta}>
                          <span className={styles.layoutTitle}>{layout.name}</span>
                          <span className={styles.layoutSubtitle}>{layout.desc}</span>
                        </div>
                        {mergeLayout === layout.id && (
                          <div className={styles.selectedBadge}>
                            <i className="fas fa-check"></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Creative Layouts */}
                  <div className={styles.creativeLayouts}>
                    <h5>🌟 Creative Styles</h5>
                    <div className={styles.creativeGrid}>
                      {[
                        { id: 'circle', name: 'Circle', icon: '○' },
                        { id: 'diamond', name: 'Diamond', icon: '◆' },
                        { id: 'heart', name: 'Heart', icon: '♥️' },
                        { id: '3x3', name: '3×3', icon: '⊡' }
                      ].map((layout) => (
                        <button 
                          key={layout.id}
                          className={`${styles.creativeBtn} ${mergeLayout === layout.id ? styles.activeCreative : ''}`}
                          onClick={() => setMergeLayout(layout.id)}
                          title={layout.name}
                        >
                          <span className={styles.creativeIcon}>{layout.icon}</span>
                          <span className={styles.creativeName}>{layout.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Professional Settings */}
                <div className={styles.quickSettings}>
                  <div className={styles.settingRow}>
                    <div className={styles.settingGroup}>
                      <label>
                        <i className="fas fa-expand-arrows-alt"></i>
                        Spacing
                      </label>
                      <div className={styles.compactSlider}>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={mergeSettings.spacing}
                          onChange={(e) => setMergeSettings(prev => ({
                            ...prev,
                            spacing: parseInt(e.target.value)
                          }))}
                          className={styles.slider}
                        />
                        <span className={styles.sliderValue}>{mergeSettings.spacing}px</span>
                      </div>
                    </div>

                    <div className={styles.settingGroup}>
                      <label>
                        <i className="fas fa-tv"></i>
                        Canvas Size
                      </label>
                      <select 
                        value={`${mergeSettings.maxWidth}x${mergeSettings.maxHeight}`}
                        onChange={(e) => {
                          const [width, height] = e.target.value.split('x').map(Number);
                          setMergeSettings(prev => ({...prev, maxWidth: width, maxHeight: height}));
                        }}
                        className={styles.compactSelect}
                      >
                        <option value="1080x1080">Square (1:1)</option>
                        <option value="1920x1080">HD (16:9)</option>
                        <option value="1080x1920">Portrait (9:16)</option>
                        <option value="1200x900">Photo (4:3)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.settingRow}>
                    <div className={styles.settingGroup}>
                      <label>
                        <i className="fas fa-palette"></i>
                        Background
                      </label>
                      <div className={styles.colorPicker}>
                        <input
                          type="color"
                          value={mergeSettings.backgroundColor}
                          onChange={(e) => setMergeSettings(prev => ({
                            ...prev,
                            backgroundColor: e.target.value
                          }))}
                          className={styles.colorInput}
                        />
                        <span className={styles.colorValue}>{mergeSettings.backgroundColor}</span>
                      </div>
                    </div>

                    <div className={styles.settingGroup}>
                      <label>
                        <i className="fas fa-magic"></i>
                        Effects
                      </label>
                      <div className={styles.effectsToggle}>
                        <label className={styles.toggleLabel}>
                          <input
                            type="checkbox"
                            checked={mergeSettings.shadow}
                            onChange={(e) => setMergeSettings(prev => ({
                              ...prev,
                              shadow: e.target.checked
                            }))}
                            className={styles.toggleInput}
                          />
                          <span className={styles.toggleSlider}></span>
                          <span className={styles.toggleText}>Shadow</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Results Panel */}
                <div className={styles.resultsPanel}>
                  {processedImageUrl ? (
                    <>
                      <div className={styles.resultsHeader}>
                        <h4>
                          <i className="fas fa-check-circle"></i>
                          Collage Ready!
                        </h4>
                        <div className={styles.resultsStats}>
                          <span className={styles.statItem}>
                            <i className="fas fa-images"></i>
                            {uploadedImages.length} images
                          </span>
                          <span className={styles.statItem}>
                            <i className="fas fa-file-download"></i>
                            {processedSize} KB
                          </span>
                          {sizeReduction && (
                            <span className={styles.statItem}>
                              <i className="fas fa-compress"></i>
                              {sizeReduction > 0 ? `${sizeReduction}% smaller` : `${Math.abs(sizeReduction)}% larger`}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.actionButtons}>
                        <ProcessingButton
                          onClick={handleDownload}
                          isProcessing={isProcessing}
                          disabled={!processedImageUrl}
                          defaultText="Download Collage"
                          processingText="Downloading..."
                          icon="fas fa-download"
                          variant="download"
                          size="large"
                          fullWidth={false}
                        />
                        
                        <button 
                          onClick={() => {
                            setProcessedImageUrl(null);
                            setCurrentStep(2);
                            setSuccessMessage('Continue editing your collage layout');
                            setTimeout(() => setSuccessMessage(null), 3000);
                          }}
                          className={styles.editButton}
                          disabled={isProcessing}
                        >
                          <i className="fas fa-edit"></i>
                          Continue Editing
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.createSection}>
                      <ProcessingButton
                        onClick={mergeImages}
                        isProcessing={isCalculating}
                        disabled={uploadedImages.length < 2}
                        defaultText="Create Professional Collage"
                        processingText="Creating your collage..."
                        icon="fas fa-magic"
                        variant="primary"
                        size="large"
                        fullWidth={true}
                      />
                      <p className={styles.createHint}>
                        <i className="fas fa-info-circle"></i>
                        Your collage will be created instantly with professional quality
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. USEFUL SECTION */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="image-merger" />
          <QuickTips currentTool="image-merger" />
        </div>
      </section>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImageMerger;
