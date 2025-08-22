# Component Design & Layout Template

## Overview

This document defines the standardized design pattern and layout structure for all image processing components in the application. The **Conversion Component** serves as the reference implementation that has been finalized and approved for consistent user experience across all similar features.

## Table of Contents

1. [Design Principles](#design-principles)
2. [Component Architecture](#component-architecture)
3. [State Management Pattern](#state-management-pattern)
4. [UI Structure Template](#ui-structure-template)
5. [Functional Flow Pattern](#functional-flow-pattern)
6. [Styling Guidelines](#styling-guidelines)
7. [Implementation Checklist](#implementation-checklist)
8. [Component Variations](#component-variations)

---

## Design Principles

### Core Philosophy
- **Simplicity First**: Clean, minimal code without unnecessary complexity
- **Immediate Feedback**: Show results and progress instantly to users
- **Progressive Enhancement**: Step-by-step guided user journey
- **Error Resilience**: Graceful error handling with helpful user messages
- **Performance Optimization**: Efficient state management and canvas processing

### User Experience Goals
- **Intuitive Flow**: Upload → Process → Preview → Download
- **Visual Feedback**: Clear progress indicators and loading states
- **Instant Gratification**: Show results immediately after upload
- **Professional Feel**: Modern, clean interface with proper spacing
- **Accessibility**: Semantic HTML, clear labels, and visual hierarchy

---

## Component Architecture

### File Structure
```
ComponentName/
├── ComponentName.jsx          # Main component file
├── ComponentName.module.scss  # Component-specific styles
└── useComponentName.js        # Custom hook (if needed)
```

### Dependencies Pattern
```jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./ComponentName.module.scss";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import { ComponentHelmet } from "../../seo/TabsHelment";
```

---

## State Management Pattern

### Essential State Variables
```jsx
const ComponentName = () => {
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
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Feature-specific states (customize per component)
  const [featureOption, setFeatureOption] = useState("default");
  // Add component-specific states here
};
```

### State Management Rules
1. **Single Source of Truth**: Each piece of data has one state variable
2. **Predictable Updates**: Use functional updates for complex state changes
3. **Performance Optimization**: Use `useCallback` for functions passed as props
4. **Clean Reset**: Always reset all relevant states when starting over

---

## UI Structure Template

### Complete Layout Structure
```jsx
return (
  <div className={styles.componentName}>
    <ComponentHelmet />
    
    {/* 1. COMPACT HEADER */}
    <section className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.pageTitle}>
          <i className="fas fa-icon-name"></i>
          Feature Name Tool
        </h1>
        <p className={styles.pageDescription}>
          Brief description • 100% Private • Fast & Secure
        </p>
      </div>
    </section>

    {/* 2. MAIN PROCESSING SECTION */}
    <section className={styles.processingSection}>
      <div className={styles.container}>
        
        {/* 2.1 Progress Indicator */}
        <div className={styles.progressIndicator}>
          <div className={styles.progressSteps}>
            <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>
                {currentStep > 1 ? <i className="fas fa-check"></i> : '1'}
              </div>
              <span className={styles.stepLabel}>Upload</span>
            </div>
            <div className={`${styles.progressLine} ${currentStep > 1 ? styles.active : ''}`}></div>
            <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>
                {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
              </div>
              <span className={styles.stepLabel}>Process</span>
            </div>
            <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
            <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
              <div className={styles.stepNumber}>3</div>
              <span className={styles.stepLabel}>Download</span>
            </div>
          </div>
          
          {previewUrl && (
            <button onClick={resetProcessor} className={styles.resetButton}>
              <i className="fas fa-redo"></i>
              Start Over
            </button>
          )}
        </div>

        {/* 2.2 Alert Messages */}
        {error && (
          <div className={styles.alertMessage}>
            <div className={styles.errorAlert}>
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
              <button onClick={() => setError(null)} className={styles.alertClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className={styles.alertMessage}>
            <div className={styles.successAlert}>
              <i className="fas fa-check-circle"></i>
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className={styles.alertClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        {/* 2.3 Upload Step */}
        {currentStep === 1 && (
          <div className={styles.uploadStep}>
            <UploadFileHandling 
              onFileUpload={handleFileUpload}
              acceptedFormats={["image/*"]}
            />
            <div className={styles.uploadInfo}>
              <div className={styles.formatSupport}>
                <span>Supported: JPG, PNG, WebP, GIF, BMP</span>
                <span>Max: 10MB</span>
                <span>🔒 Private & Secure</span>
              </div>
            </div>
          </div>
        )}

        {/* 2.4 Processing Workspace */}
        {currentStep >= 2 && previewUrl && (
          <div className={styles.processingWorkspace}>
            {/* Image Preview Panel */}
            <div className={styles.imagePreview}>
              <div className={styles.previewHeader}>
                <span className={styles.fileName}>{imageDetails.name}</span>
                <button onClick={resetProcessor} className={styles.changeBtn}>
                  <i className="fas fa-upload"></i> Change
                </button>
              </div>
              <div className={styles.imageContainer}>
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                <div className={styles.imageDetails}>
                  <span>{imageDetails.dimensions}</span>
                  <span>{originalSize >= 1024 ? (originalSize / 1024).toFixed(2) + ' MB' : originalSize + ' KB'}</span>
                  <span>{imageDetails.type}</span>
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <div className={styles.settingsPanel}>
              {/* Feature-Specific Controls */}
              <div className={styles.featureSelector}>
                <label>Feature Options:</label>
                {/* Add component-specific controls here */}
              </div>

              {/* Size Comparison (Always Include) */}
              {originalSize && (
                <div className={styles.sizeComparison}>
                  <div className={styles.sizeInfo}>
                    <span>Original: {originalSize} KB</span>
                    <span>→</span>
                    {processedSize ? (
                      <>
                        <span>New: {processedSize} KB</span>
                        {sizeReduction && !isCalculating ? (
                          <span className={parseFloat(sizeReduction) > 0 ? styles.reduction : styles.increase}>
                            ({parseFloat(sizeReduction) > 0 ? '-' : '+'}{Math.abs(parseFloat(sizeReduction)).toFixed(2)}%)
                          </span>
                        ) : (
                          <span className={styles.calculating}>Calculating...</span>
                        )}
                      </>
                    ) : (
                      <span className={styles.calculating}>Processing...</span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={handleDownload} 
                className={styles.actionButton}
                disabled={isProcessing || !processedSize}
              >
                {isProcessing ? (
                  <>
                    <div className={styles.spinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i>
                    Download Processed Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>

    {/* 3. ADDITIONAL RESOURCES SECTION */}
    <section className={styles.resourcesSection}>
      <div className={styles.container}>
        <div className={styles.resourcesContent}>
          {/* Related Tools */}
          <div className={styles.relatedTools}>
            <h3><i className="fas fa-tools"></i> More Image Tools</h3>
            <div className={styles.toolsGrid}>
              {/* Add related tool links */}
            </div>
          </div>

          {/* Feature Tips */}
          <div className={styles.featureTips}>
            <h3><i className="fas fa-lightbulb"></i> Pro Tips</h3>
            <div className={styles.tipsGrid}>
              {/* Add feature-specific tips */}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
```

---

## Functional Flow Pattern

### Core Functions Template

#### 1. File Upload Handler
```jsx
const handleFileUpload = useCallback((file) => {
  setError(null);
  setSuccessMessage(null);
  setProcessedSize(null);
  setSizeReduction(null);
  
  if (file) {
    // Validation
    const fileType = file.type.split('/')[0];
    if (fileType !== 'image') {
      setError("Please upload a valid image file (JPG, PNG, WebP, GIF, BMP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
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
    };
    
    img.onerror = () => {
      setError("Error loading image. Please try with a different file.");
    };
    
    img.src = fileUrl;
  }
}, []);
```

#### 2. Processing Function Template
```jsx
const processImage = useCallback(async () => {
  if (!previewUrl || !originalSize) return;
  
  setIsCalculating(true);
  
  try {
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // CUSTOMIZE THIS SECTION FOR EACH COMPONENT
      // Apply specific image processing here
      let processedImageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate new size
      const byteString = atob(processedImageData.split(',')[1]);
      const newSizeKB = (byteString.length / 1024).toFixed(2);
      
      setProcessedSize(newSizeKB);
      
      // Calculate percentage change
      const original = parseFloat(originalSize);
      const processed = parseFloat(newSizeKB);
      const reduction = ((original - processed) / original) * 100;
      setSizeReduction(reduction.toFixed(2));
      
      setIsCalculating(false);
    };
    
    img.src = previewUrl;
  } catch (error) {
    setIsCalculating(false);
    setError("Error processing image. Please try again.");
  }
}, [previewUrl, originalSize, /* feature-specific dependencies */]);
```

#### 3. Download Handler
```jsx
const handleDownload = useCallback(() => {
  if (!previewUrl) {
    setError("No image selected for processing.");
    return;
  }

  setIsProcessing(true);
  setError(null);
  setCurrentStep(3);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.src = previewUrl;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // CUSTOMIZE THIS SECTION FOR EACH COMPONENT
    // Apply the same processing as in processImage function
    let processedImageData = canvas.toDataURL('image/jpeg', 0.8);

    const link = document.createElement("a");
    link.href = processedImageData;
    link.download = `${imageDetails.name.split('.')[0]}_processed.jpg`;
    link.click();
    
    setSuccessMessage(`🎉 Successfully processed your image!`);
    setIsProcessing(false);
  };
  
  img.onerror = () => {
    setError("Error processing image. Please try again.");
    setIsProcessing(false);
  };
}, [previewUrl, imageDetails.name, /* feature-specific dependencies */]);
```

#### 4. Reset Function
```jsx
const resetProcessor = useCallback(() => {
  setPreviewUrl(null);
  setOriginalSize(null);
  setProcessedSize(null);
  setSizeReduction(null);
  setError(null);
  setSuccessMessage(null);
  setCurrentStep(1);
  setImageDetails({ name: "", dimensions: "", type: "" });
  setIsCalculating(false);
  setIsProcessing(false);
  // Reset feature-specific states
}, []);
```

#### 5. Auto-trigger Processing
```jsx
useEffect(() => {
  if (previewUrl && originalSize) {
    processImage();
  }
}, [previewUrl, originalSize, /* feature-specific dependencies */, processImage]);
```

---

## Styling Guidelines

### CSS Class Naming Convention
- Component wrapper: `.componentName`
- Section containers: `.sectionName + Section`
- Interactive elements: `.elementName + Btn/Input/Selector`
- State classes: `.active`, `.completed`, `.disabled`, `.calculating`

### Responsive Breakpoints
```scss
// Mobile First Approach
.componentName {
  // Base mobile styles
  
  @media (min-width: 768px) {
    // Tablet styles
  }
  
  @media (min-width: 1024px) {
    // Desktop styles
  }
}
```

### Color Scheme (Use CSS Variables)
```scss
:root {
  --primary-color: #3B82F6;
  --success-color: #10B981;
  --error-color: #EF4444;
  --warning-color: #F59E0B;
  --background-color: #F8FAFC;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --border-color: #E5E7EB;
}
```

---

## Implementation Checklist

### Before Starting
- [ ] Define component-specific features and options
- [ ] Identify the core processing algorithm needed
- [ ] Plan the settings/controls required
- [ ] Determine file format support

### Core Implementation
- [ ] Set up state management using the template
- [ ] Implement file upload handler with validation
- [ ] Create the core processing function
- [ ] Add auto-trigger processing with useEffect
- [ ] Implement download functionality
- [ ] Add reset functionality

### UI Implementation
- [ ] Create the basic layout structure
- [ ] Add progress indicator
- [ ] Implement alert message system
- [ ] Create upload step UI
- [ ] Build processing workspace with preview and settings
- [ ] Add size comparison display
- [ ] Style action button with loading states

### Testing & Polish
- [ ] Test with various image formats and sizes
- [ ] Verify error handling and edge cases
- [ ] Ensure responsive design works on all devices
- [ ] Test accessibility with screen readers
- [ ] Optimize performance and loading states

### Documentation
- [ ] Add component-specific documentation
- [ ] Update related tool links
- [ ] Create feature-specific pro tips
- [ ] Test and document any limitations

---

## Component Variations

### Base64 Encoder Component
**Special Requirements:**
- No format selection needed
- Show Base64 output in a text area
- Copy to clipboard functionality
- Data URL vs raw Base64 options

**Processing Function:**
```jsx
const generateBase64 = useCallback(async () => {
  // Convert image to Base64 string
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const base64String = canvas.toDataURL('image/png');
    setBase64Output(base64String);
    // Calculate size of Base64 string
    const base64Size = (base64String.length * 0.75 / 1024).toFixed(2);
    setProcessedSize(base64Size);
  };
  img.src = previewUrl;
}, [previewUrl]);
```

### Image Compression Component
**Special Requirements:**
- Quality slider (10-100%)
- Compression level presets
- Multiple format support
- Before/after size comparison

### Image Resizing Component
**Special Requirements:**
- Width/height input controls
- Aspect ratio lock toggle
- Preset dimension options
- Scale percentage option

### Image Cropping Component
**Special Requirements:**
- Interactive crop area selection
- Aspect ratio presets
- Crop preview
- Coordinate display

### Image Rotation Component
**Special Requirements:**
- Rotation angle slider or preset buttons
- 90° quick rotation buttons
- Flip horizontal/vertical options
- Auto-crop to fit option

---

## Performance Considerations

### Canvas Optimization
- Use `OffscreenCanvas` when available
- Implement canvas pooling for heavy processing
- Optimize canvas size for preview vs processing

### Memory Management
- Clean up object URLs with `URL.revokeObjectURL()`
- Reset heavy state variables when not needed
- Implement debouncing for real-time previews

### User Experience
- Show progress indicators for operations > 100ms
- Implement chunked processing for large files
- Add keyboard shortcuts for common actions

---

## Accessibility Guidelines

### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3)
- Include ARIA labels for interactive elements
- Ensure proper form labeling

### Visual Accessibility
- Maintain 4.5:1 color contrast ratio
- Support high contrast mode
- Include focus indicators for keyboard navigation

### Screen Reader Support
- Add descriptive alt text for images
- Include ARIA live regions for dynamic content
- Provide text alternatives for visual feedback

---

## Future Enhancements

### Potential Features
- Batch processing multiple files
- Undo/redo functionality
- Processing history
- Custom presets saving
- Export settings profiles

### Performance Improvements
- Web Workers for heavy processing
- Service Worker for offline capability
- Progressive Web App features
- Advanced caching strategies

---

## Conclusion

This template provides a solid foundation for building consistent, user-friendly image processing components. Each new component should follow this structure while customizing the processing logic and specific controls for its unique functionality.

**Key Success Factors:**
1. **Consistency**: Follow the same patterns across all components
2. **User Experience**: Prioritize immediate feedback and clear progress indication
3. **Performance**: Optimize for speed and responsiveness
4. **Accessibility**: Ensure all users can effectively use the tools
5. **Maintainability**: Keep code clean, documented, and well-structured

For any questions or clarifications about implementing this template, refer to the **Conversion Component** as the reference implementation.
