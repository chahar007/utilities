import React from 'react';
import styles from './QuickTips.module.scss';

const tipsData = {
  'base64-converter': [
    { icon: '💡', text: '<strong>Data URLs:</strong> Perfect for embedding small images directly in HTML or CSS files.' },
    { icon: '⚡', text: '<strong>Performance:</strong> Base64 images load instantly but are ~33% larger than binary files.' },
    { icon: '🔒', text: '<strong>Privacy:</strong> All processing happens in your browser - no data is sent to servers.' },
    { icon: '📱', text: '<strong>Use Cases:</strong> Icons, small graphics, email signatures, and embedded images.' }
  ],
  'compression': [
    { icon: '🎯', text: '<strong>Quality Balance:</strong> 80% quality offers the best balance between file size and image quality.' },
    { icon: '⚡', text: '<strong>Web Optimization:</strong> Compress images to 80-100KB for faster website loading.' },
    { icon: '🔒', text: '<strong>Privacy:</strong> All compression happens in your browser - no data is sent to servers.' },
    { icon: '📱', text: '<strong>Batch Processing:</strong> Upload multiple images to process them all at once efficiently.' }
  ],
  'resizing': [
    { icon: '📐', text: '<strong>Aspect Ratio:</strong> Keep aspect ratio locked to prevent image distortion.' },
    { icon: '⚡', text: '<strong>Web Images:</strong> Use 800px width for most web content, 1200px for high-res displays.' },
    { icon: '🔒', text: '<strong>Privacy:</strong> All resizing happens in your browser - no data is sent to servers.' },
    { icon: '📱', text: '<strong>Mobile:</strong> Use 300px thumbnails for fast loading on mobile devices.' }
  ],
  'rotate-image': [
    { icon: '🔄', text: '<strong>Quick Fix:</strong> Use 90° rotations to quickly fix portrait/landscape orientation.' },
    { icon: '⚡', text: '<strong>Precise Control:</strong> Use the slider for fine-tuned angle adjustments down to the degree.' },
    { icon: '🔒', text: '<strong>Privacy:</strong> All rotation happens in your browser - no data is sent to servers.' },
    { icon: '📱', text: '<strong>Flip Effects:</strong> Combine rotation with horizontal/vertical flips for creative effects.' }
  ],
  'crop-image': [
    { icon: '✂️', text: '<strong>Precision:</strong> Click and drag to select the exact area you want to keep.' },
    { icon: '📐', text: '<strong>Aspect Ratios:</strong> Use preset ratios for social media, prints, or specific layouts.' },
    { icon: '🔒', text: '<strong>Privacy:</strong> All cropping happens in your browser - no data is sent to servers.' },
    { icon: '📱', text: '<strong>Quality:</strong> Crop before resizing to maintain maximum image quality.' }
  ],
  'conversion': [
    { icon: '🎯', text: '<strong>Quality Settings:</strong> Higher quality preserves details but increases file size.' },
    { icon: '⚡', text: '<strong>Format Choice:</strong> JPEG for photos, PNG for graphics with transparency, WebP for modern browsers.' },
    { icon: '🔒', text: '<strong>Privacy:</strong> All conversion happens in your browser - no data is sent to servers.' },
    { icon: '📱', text: '<strong>Compatibility:</strong> Check browser support before using newer formats like WebP or AVIF.' }
     ],
   'filters': [
     { icon: '🎨', text: '<strong>Presets:</strong> Use filter presets for instant Instagram-style effects on your images.' },
     { icon: '⚡', text: '<strong>Real-time Preview:</strong> See changes instantly as you adjust brightness, contrast, and saturation.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All filtering happens in your browser - no images are uploaded to servers.' },
     { icon: '📱', text: '<strong>Combinations:</strong> Stack multiple filters for unique artistic effects and vintage looks.' }
   ],
   'watermark': [
     { icon: '🛡️', text: '<strong>Protection:</strong> Add watermarks to protect your images from unauthorized use and theft.' },
     { icon: '⚡', text: '<strong>Transparency:</strong> Adjust opacity to make watermarks visible but not distracting.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All watermarking happens in your browser - no images are uploaded to servers.' },
     { icon: '📱', text: '<strong>Positioning:</strong> Use the 9-point grid for consistent watermark placement across images.' }
   ],
   'merger': [
     { icon: '🖼️', text: '<strong>Layouts:</strong> Choose from side-by-side, grid layouts, or create custom arrangements.' },
     { icon: '⚡', text: '<strong>Spacing:</strong> Adjust gaps between images to create professional-looking collages.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All merging happens in your browser - no images are uploaded to servers.' },
     { icon: '📱', text: '<strong>Quality:</strong> Maintain high image quality while creating stunning before/after comparisons.' }
   ],
   'background-tools': [
     { icon: '🎭', text: '<strong>Edge Detection:</strong> Advanced algorithms automatically detect subject boundaries for clean removal.' },
     { icon: '⚡', text: '<strong>Blur Backgrounds:</strong> Create professional portrait effects by blurring backgrounds instead of removing.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All background processing happens in your browser - no images are uploaded to servers.' },
     { icon: '📱', text: '<strong>Fine-tuning:</strong> Adjust edge feathering and detection sensitivity for perfect results.' }
   ],
   'color-palette': [
     { icon: '🎨', text: '<strong>Dominant Colors:</strong> Extract the most prominent colors from any image for design inspiration.' },
     { icon: '⚡', text: '<strong>Export Formats:</strong> Save palettes as HEX, RGB, or HSL values for use in design software.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All color extraction happens in your browser - no images are uploaded to servers.' },
     { icon: '📱', text: '<strong>Palette Size:</strong> Choose between 4-16 colors depending on your project needs.' }
   ],
   'image-to-pdf': [
     { icon: '📑', text: '<strong>Order Matters:</strong> Drag and drop images to reorder them exactly as you want in the PDF.' },
     { icon: '⚡', text: '<strong>Quality Balance:</strong> 80% quality provides excellent results while keeping file size reasonable.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All processing happens in your browser - no images are uploaded to servers.' },
     { icon: '📱', text: '<strong>Page Size:</strong> Use "Auto" for best fit, or choose A4/Letter for standard document sizes.' }
   ],
   'merge-pdf': [
     { icon: '📋', text: '<strong>Order Control:</strong> Drag and drop PDFs to arrange them in the exact order you want in the final document.' },
     { icon: '⚡', text: '<strong>Batch Processing:</strong> Upload multiple PDFs at once for efficient merging of large document sets.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All merging happens in your browser - no PDFs are uploaded to servers.' },
     { icon: '📱', text: '<strong>File Size:</strong> Merged PDFs maintain original quality while combining all content seamlessly.' }
   ],
   'split-pdf': [
     { icon: '✂️', text: '<strong>Split Methods:</strong> Choose from page ranges (1,3,5-8), even/odd pages, equal parts, or custom splits with names.' },
     { icon: '⚡', text: '<strong>Flexible Ranges:</strong> Use commas for individual pages and dashes for ranges (e.g., 1,3,5-8,12-15).' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All splitting happens in your browser - no PDFs are uploaded to servers.' },
     { icon: '📱', text: '<strong>Batch Download:</strong> All split files are automatically downloaded, or download them individually as needed.' }
   ],
   'reorder-pdf': [
     { icon: '🔄', text: '<strong>Drag & Drop:</strong> Simply drag pages up and down to rearrange them in your desired order.' },
     { icon: '⚡', text: '<strong>Visual Feedback:</strong> See the current order vs original page numbers as you reorder pages.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All reordering happens in your browser - no PDFs are uploaded to servers.' },
     { icon: '📱', text: '<strong>Auto Download:</strong> Your reordered PDF is automatically downloaded after processing is complete.' }
   ],
   'rotate-pdf': [
     { icon: '🔄', text: '<strong>Rotation Angles:</strong> Choose from 90°, 180°, or 270° clockwise rotation to fix orientation issues.' },
     { icon: '⚡', text: '<strong>All Pages:</strong> Rotation is applied to all pages in the PDF - perfect for fixing scanned documents.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All rotation happens in your browser - no PDFs are uploaded to servers.' },
     { icon: '📱', text: '<strong>Quality Preserved:</strong> PDF content and quality remain intact during the rotation process.' }
   ],
   'watermark-pdf': [
     { icon: '🛡️', text: '<strong>Protection Options:</strong> Choose between text watermarks (copyright, confidential) or image watermarks (logos, stamps).' },
     { icon: '⚡', text: '<strong>Full Control:</strong> Adjust opacity, rotation, position, and size to perfectly match your needs.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All watermarking happens in your browser - no PDFs are uploaded to servers.' },
     { icon: '📱', text: '<strong>Professional Quality:</strong> Watermarks are embedded directly into the PDF for permanent protection.' }
   ],
   'edit-metadata': [
     { icon: '📝', text: '<strong>Document Properties:</strong> Update title, author, subject, keywords, creator, and producer information.' },
     { icon: '⚡', text: '<strong>Better Organization:</strong> Metadata helps categorize and search for documents more effectively.' },
     { icon: '🔒', text: '<strong>Privacy:</strong> All metadata editing happens in your browser - no PDFs are uploaded to servers.' },
     { icon: '📱', text: '<strong>Professional Documents:</strong> Proper metadata makes PDFs look more professional and organized.' }
   ]
};

const QuickTips = ({ currentTool }) => {
  const tips = tipsData[currentTool];
  
  if (!tips) {
    console.warn(`No tips data found for: ${currentTool}`);
    return null;
  }

  return (
    <div className={styles.quickTips}>
      <h3><i className="fas fa-lightbulb"></i> Pro Tips</h3>
      <div className={styles.tipsGrid}>
        {tips.map((tip, index) => (
          <div key={index} className={styles.tip}>
            <span className={styles.tipIcon}>{tip.icon}</span>
            <span dangerouslySetInnerHTML={{ __html: tip.text }}></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickTips;
