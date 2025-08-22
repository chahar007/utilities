import React from 'react';
import styles from './UsefulLinks.module.scss';

const imageToolsData = {
  'base64-converter': {
    title: 'Base64 Converter',
    related: [
      { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' },
      { url: '/image/filters', icon: 'fas fa-magic', title: 'Image Filters', desc: 'Apply stunning effects' },
      { url: '/image/conversion', icon: 'fas fa-exchange-alt', title: 'Format Conversion', desc: 'Convert between formats' },
      { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' }
    ]
  },
  'compression': {
    title: 'Image Compression',
    related: [
      { url: '/image/base64-converter', icon: 'fas fa-code', title: 'Base64 Encoder', desc: 'Convert to Base64' },
      { url: '/image/resizing', icon: 'fas fa-expand-arrows-alt', title: 'Image Resizing', desc: 'Change dimensions' },
      { url: '/image/conversion', icon: 'fas fa-exchange-alt', title: 'Format Conversion', desc: 'Convert between formats' },
      { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' }
    ]
  },
  'resizing': {
    title: 'Image Resizing',
    related: [
      { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' },
      { url: '/image/base64-converter', icon: 'fas fa-code', title: 'Base64 Encoder', desc: 'Convert to Base64' },
      { url: '/image/conversion', icon: 'fas fa-exchange-alt', title: 'Format Conversion', desc: 'Convert between formats' },
      { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' }
    ]
  },
  'rotate-image': {
    title: 'Image Rotation',
    related: [
      { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' },
      { url: '/image/resizing', icon: 'fas fa-expand-arrows-alt', title: 'Image Resizing', desc: 'Change dimensions' },
      { url: '/image/conversion', icon: 'fas fa-exchange-alt', title: 'Format Conversion', desc: 'Convert between formats' },
      { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' }
    ]
  },
  'crop-image': {
    title: 'Image Cropping',
    related: [
      { url: '/image/resizing', icon: 'fas fa-expand-arrows-alt', title: 'Image Resizing', desc: 'Change dimensions' },
      { url: '/image/rotate-image', icon: 'fas fa-redo', title: 'Image Rotation', desc: 'Rotate and flip' },
      { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' },
      { url: '/image/conversion', icon: 'fas fa-exchange-alt', title: 'Format Conversion', desc: 'Convert between formats' }
    ]
  },
  'conversion': {
    title: 'Format Conversion',
    related: [
      { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' },
      { url: '/image/resizing', icon: 'fas fa-expand-arrows-alt', title: 'Image Resizing', desc: 'Change dimensions' },
      { url: '/image/base64-converter', icon: 'fas fa-code', title: 'Base64 Encoder', desc: 'Convert to Base64' },
      { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' }
    ]
     },
   'filters': {
     title: 'Image Filters',
     related: [
       { url: '/image/watermark', icon: 'fas fa-shield-alt', title: 'Add Watermark', desc: 'Protect your images' },
       { url: '/image/background-tools', icon: 'fas fa-image', title: 'Background Tools', desc: 'Remove or blur backgrounds' },
       { url: '/image/color-palette', icon: 'fas fa-palette', title: 'Color Palette', desc: 'Extract color schemes' },
       { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' }
     ]
   },
   'watermark': {
     title: 'Image Watermarking',
     related: [
       { url: '/image/filters', icon: 'fas fa-magic', title: 'Image Filters', desc: 'Apply stunning effects' },
       { url: '/image/merger', icon: 'fas fa-object-group', title: 'Image Merger', desc: 'Combine multiple images' },
       { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' },
       { url: '/image/resizing', icon: 'fas fa-expand-arrows-alt', title: 'Image Resizing', desc: 'Change dimensions' }
     ]
   },
   'merger': {
     title: 'Image Merger',
     related: [
       { url: '/image/filters', icon: 'fas fa-magic', title: 'Image Filters', desc: 'Apply stunning effects' },
       { url: '/image/watermark', icon: 'fas fa-shield-alt', title: 'Add Watermark', desc: 'Protect your images' },
       { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' },
       { url: '/image/background-tools', icon: 'fas fa-image', title: 'Background Tools', desc: 'Remove or blur backgrounds' }
     ]
   },
   'background-tools': {
     title: 'Background Tools',
     related: [
       { url: '/image/filters', icon: 'fas fa-magic', title: 'Image Filters', desc: 'Apply stunning effects' },
       { url: '/image/crop-image', icon: 'fas fa-crop', title: 'Image Cropping', desc: 'Crop to perfect size' },
       { url: '/image/watermark', icon: 'fas fa-shield-alt', title: 'Add Watermark', desc: 'Protect your images' },
       { url: '/image/color-palette', icon: 'fas fa-palette', title: 'Color Palette', desc: 'Extract color schemes' }
     ]
   },
   'color-palette': {
     title: 'Color Palette Extractor',
     related: [
       { url: '/image/filters', icon: 'fas fa-magic', title: 'Image Filters', desc: 'Apply stunning effects' },
       { url: '/image/background-tools', icon: 'fas fa-image', title: 'Background Tools', desc: 'Remove or blur backgrounds' },
       { url: '/image/conversion', icon: 'fas fa-exchange-alt', title: 'Format Conversion', desc: 'Convert between formats' },
       { url: '/image/compression', icon: 'fas fa-compress-alt', title: 'Image Compression', desc: 'Reduce file size' }
     ]
   },
   'image-to-pdf': {
     title: 'Images to PDF',
     related: [
       { url: '/pdf/merge-pdf', icon: 'fas fa-object-group', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
       { url: '/pdf/split-pdf', icon: 'fas fa-cut', title: 'Split PDF', desc: 'Extract specific pages' },
       { url: '/pdf/extract-text', icon: 'fas fa-file-alt', title: 'Extract Text', desc: 'Get text from PDF' },
       { url: '/pdf/rotate-pdf', icon: 'fas fa-redo', title: 'Rotate PDF', desc: 'Fix PDF orientation' }
     ]
   },
   'merge-pdf': {
     title: 'PDF Merger',
     related: [
       { url: '/pdf/split-pdf', icon: 'fas fa-cut', title: 'Split PDF', desc: 'Extract specific pages' },
       { url: '/pdf/reorder-pdf', icon: 'fas fa-sort', title: 'Reorder Pages', desc: 'Rearrange PDF pages' },
       { url: '/pdf/rotate-pdf', icon: 'fas fa-redo', title: 'Rotate PDF', desc: 'Fix PDF orientation' },
       { url: '/pdf/extract-text', icon: 'fas fa-file-alt', title: 'Extract Text', desc: 'Get text from PDF' }
     ]
   },
   'split-pdf': {
     title: 'PDF Splitter',
     related: [
       { url: '/pdf/merge-pdf', icon: 'fas fa-object-group', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
       { url: '/pdf/reorder-pdf', icon: 'fas fa-sort', title: 'Reorder Pages', desc: 'Rearrange PDF pages' },
       { url: '/pdf/rotate-pdf', icon: 'fas fa-redo', title: 'Rotate PDF', desc: 'Fix PDF orientation' },
       { url: '/pdf/watermark-pdf', icon: 'fas fa-shield-alt', title: 'Watermark PDF', desc: 'Add watermarks' }
     ]
   },
   'reorder-pdf': {
     title: 'PDF Page Reorder',
     related: [
       { url: '/pdf/split-pdf', icon: 'fas fa-cut', title: 'Split PDF', desc: 'Extract specific pages' },
       { url: '/pdf/merge-pdf', icon: 'fas fa-object-group', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
       { url: '/pdf/rotate-pdf', icon: 'fas fa-redo', title: 'Rotate PDF', desc: 'Fix PDF orientation' },
       { url: '/pdf/extract-text', icon: 'fas fa-file-alt', title: 'Extract Text', desc: 'Get text from PDF' }
     ]
   },
   'rotate-pdf': {
     title: 'PDF Rotation Tool',
     related: [
       { url: '/pdf/reorder-pdf', icon: 'fas fa-sort', title: 'Reorder Pages', desc: 'Rearrange PDF pages' },
       { url: '/pdf/split-pdf', icon: 'fas fa-cut', title: 'Split PDF', desc: 'Extract specific pages' },
       { url: '/pdf/merge-pdf', icon: 'fas fa-object-group', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
       { url: '/pdf/watermark-pdf', icon: 'fas fa-shield-alt', title: 'Watermark PDF', desc: 'Add watermarks' }
     ]
   },
   'watermark-pdf': {
     title: 'PDF Watermark Tool',
     related: [
       { url: '/pdf/rotate-pdf', icon: 'fas fa-redo', title: 'Rotate PDF', desc: 'Fix PDF orientation' },
       { url: '/pdf/split-pdf', icon: 'fas fa-cut', title: 'Split PDF', desc: 'Extract specific pages' },
       { url: '/pdf/merge-pdf', icon: 'fas fa-object-group', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
       { url: '/pdf/edit-metadata', icon: 'fas fa-tags', title: 'Edit Metadata', desc: 'Update PDF properties' }
     ]
   },
   'edit-metadata': {
     title: 'PDF Metadata Editor',
     related: [
       { url: '/pdf/watermark-pdf', icon: 'fas fa-shield-alt', title: 'Watermark PDF', desc: 'Add watermarks' },
       { url: '/pdf/split-pdf', icon: 'fas fa-cut', title: 'Split PDF', desc: 'Extract specific pages' },
       { url: '/pdf/merge-pdf', icon: 'fas fa-object-group', title: 'Merge PDF', desc: 'Combine multiple PDFs' },
       { url: '/pdf/extract-text', icon: 'fas fa-file-alt', title: 'Extract Text', desc: 'Get text from PDF' }
     ]
   }
};

const UsefulLinks = ({ currentTool }) => {
  const toolData = imageToolsData[currentTool];
  
  if (!toolData) {
    console.warn(`No tool data found for: ${currentTool}`);
    return null;
  }

  return (
    <div className={styles.usefulLinks}>
      <h3><i className="fas fa-tools"></i> More Tools</h3>
      <div className={styles.linksGrid}>
        {toolData.related.map((tool, index) => (
          <a key={index} href={tool.url} className={styles.linkCard}>
            <i className={tool.icon}></i>
            <div>
              <span className={styles.linkTitle}>{tool.title}</span>
              <span className={styles.linkDesc}>{tool.desc}</span>
            </div>
            <i className="fas fa-arrow-right"></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default UsefulLinks;
