import { useState, useCallback } from 'react';

const useImageProcessor = (options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
    autoProcess = true
  } = options;

  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [processedSize, setProcessedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // Image handling
  const [imageDetails, setImageDetails] = useState({
    name: "",
    dimensions: "",
    type: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // File upload handler with validation
  const handleFileUpload = useCallback((file, customValidation = null) => {
    setError(null);
    setSuccessMessage(null);
    setProcessedSize(null);
    setSizeReduction(null);
    
    if (!file) {
      setError("No file selected.");
      return false;
    }

    // File type validation
    if (!acceptedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, WebP, GIF, BMP).");
      return false;
    }

    // File size validation
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
      setError(`File size must be less than ${maxSizeMB}MB.`);
      return false;
    }

    // Custom validation if provided
    if (customValidation && !customValidation(file)) {
      return false; // Error should be set by custom validation
    }

    // Process file
    const fileSizeInKB = (file.size / 1024).toFixed(2);
    const fileUrl = URL.createObjectURL(file);
    
    const img = new Image();
    img.onload = () => {
      setImageDetails({
        name: file.name,
        dimensions: `${img.width}x${img.height}px`,
        type: file.type.split('/')[1].toUpperCase(),
      });
      setCurrentStep(2);
      setOriginalSize(fileSizeInKB);
      setPreviewUrl(fileUrl);
      setOriginalImageUrl(fileUrl); // Keep original for comparison
    };
    
    img.onerror = () => {
      setError("Error loading image. Please try with a different file.");
      URL.revokeObjectURL(fileUrl);
    };
    
    img.src = fileUrl;
    return true;
  }, [acceptedTypes, maxFileSize]);

  // Calculate size difference
  const calculateSizeReduction = useCallback((originalSizeKB, newSizeKB) => {
    if (!originalSizeKB || !newSizeKB) return null;
    
    const original = parseFloat(originalSizeKB);
    const processed = parseFloat(newSizeKB);
    const reduction = ((original - processed) / original) * 100;
    
    return reduction.toFixed(2);
  }, []);

  // Update processed size and calculate reduction
  const updateProcessedSize = useCallback((newSizeKB) => {
    setProcessedSize(newSizeKB);
    
    if (originalSize && newSizeKB) {
      const reduction = calculateSizeReduction(originalSize, newSizeKB);
      setSizeReduction(reduction);
    }
  }, [originalSize, calculateSizeReduction]);

  // Download handler utility
  const createDownloadLink = useCallback((dataUrl, filename = null) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    
    const downloadName = filename || 
      `${imageDetails.name?.split('.')[0] || 'processed'}_processed.${dataUrl.includes('image/png') ? 'png' : 'jpg'}`;
    
    link.download = downloadName;
    link.click();
    
    setSuccessMessage(`🎉 Successfully processed your image!`);
    setCurrentStep(3);
  }, [imageDetails.name]);

  // Reset all states
  const resetProcessor = useCallback(() => {
    // Cleanup URLs to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (originalImageUrl && originalImageUrl !== previewUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }

    setPreviewUrl(null);
    setOriginalImageUrl(null);
    setOriginalSize(null);
    setProcessedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setImageDetails({ name: "", dimensions: "", type: "" });
    setIsCalculating(false);
    setIsProcessing(false);
  }, [previewUrl, originalImageUrl]);

  // Utility to show error messages
  const showError = useCallback((message) => {
    setError(message);
    setIsProcessing(false);
    setIsCalculating(false);
  }, []);

  // Utility to show success messages
  const showSuccess = useCallback((message) => {
    setSuccessMessage(message);
    setError(null);
  }, []);

  // Start processing indicator
  const startProcessing = useCallback(() => {
    setIsProcessing(true);
    setError(null);
  }, []);

  // Stop processing indicator
  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  // Start calculating indicator
  const startCalculating = useCallback(() => {
    setIsCalculating(true);
  }, []);

  // Stop calculating indicator
  const stopCalculating = useCallback(() => {
    setIsCalculating(false);
  }, []);

  return {
    // States
    originalSize,
    processedSize,
    sizeReduction,
    imageDetails,
    previewUrl,
    originalImageUrl,
    error,
    successMessage,
    currentStep,
    isProcessing,
    isCalculating,
    
    // Actions
    handleFileUpload,
    updateProcessedSize,
    createDownloadLink,
    resetProcessor,
    showError,
    showSuccess,
    startProcessing,
    stopProcessing,
    startCalculating,
    stopCalculating,
    
    // Utilities
    calculateSizeReduction,
    
    // Manual setters (for edge cases)
    setCurrentStep,
    setError,
    setSuccessMessage,
    setIsProcessing,
    setIsCalculating,
    setOriginalSize,
    setProcessedSize,
    setSizeReduction,
    setImageDetails,
    setPreviewUrl,
    setOriginalImageUrl
  };
};

export default useImageProcessor;
