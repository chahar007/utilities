export const POPULAR_IMAGE_CONVERSIONS = [
  {
    id: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format',
    icon: '🖼️',
    tag: 'IMAGE',
    route: '/image/conversion',
    color: '#FFC107'
  },
  {
    id: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format',
    icon: '🖼️',
    tag: 'IMAGE',
    route: '/image/conversion',
    color: '#FFC107'
  },
  {
    id: 'jpg-to-webp',
    title: 'JPG to WebP',
    description: 'Convert JPG images to WebP format',
    icon: '🖼️',
    tag: 'IMAGE',
    route: '/image/conversion',
    color: '#FFC107'
  },
  {
    id: 'webp-to-jpg',
    title: 'WebP to JPG',
    description: 'Convert WebP images to JPG format',
    icon: '🖼️',
    tag: 'IMAGE',
    route: '/image/conversion',
    color: '#FFC107'
  },
  {
    id: 'compress-jpg',
    title: 'Compress JPG',
    description: 'Reduce JPG file size without losing quality',
    icon: '📦',
    tag: 'IMAGE',
    route: '/image/compression',
    color: '#28A745'
  },
  {
    id: 'compress-png',
    title: 'Compress PNG',
    description: 'Reduce PNG file size without losing quality',
    icon: '📦',
    tag: 'IMAGE',
    route: '/image/compression',
    color: '#28A745'
  },
  {
    id: 'resize-image',
    title: 'Resize Image',
    description: 'Resize images to custom dimensions',
    icon: '📏',
    tag: 'IMAGE',
    route: '/image/resizing',
    color: '#17A2B8'
  },
  {
    id: 'crop-image',
    title: 'Crop Image',
    description: 'Crop images to remove unwanted areas',
    icon: '✂️',
    tag: 'IMAGE',
    route: '/image/crop-image',
    color: '#DC3545'
  }
];

export const POPULAR_PDF_CONVERSIONS = [
  {
    id: 'merge-pdfs',
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into one',
    icon: '📄',
    tag: 'PDF',
    route: '/pdf/merge-pdf',
    color: '#E83E8C'
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    description: 'Convert images to PDF documents',
    icon: '🖼️',
    tag: 'PDF',
    route: '/pdf/image-to-pdf',
    color: '#28A745'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Split PDF into multiple documents',
    icon: '✂️',
    tag: 'PDF',
    route: '/pdf/split-pdf',
    color: '#6F42C1'
  },
  {
    id: 'watermark-pdf',
    title: 'Watermark PDF',
    description: 'Add watermarks to PDF documents',
    icon: '💧',
    tag: 'PDF',
    route: '/pdf/watermark-pdf',
    color: '#17A2B8'
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate PDF pages to correct orientation',
    icon: '🔄',
    tag: 'PDF',
    route: '/pdf/rotate-pdf',
    color: '#FD7E14'
  },
  {
    id: 'reorder-pdf',
    title: 'Reorder PDF',
    description: 'Reorder pages in PDF documents',
    icon: '📋',
    tag: 'PDF',
    route: '/pdf/reorder-pdf',
    color: '#6F42C1'
  },
  {
    id: 'edit-metadata',
    title: 'Edit PDF Metadata',
    description: 'Edit PDF document properties',
    icon: '✏️',
    tag: 'PDF',
    route: '/pdf/edit-meta-data-pdf',
    color: '#20C997'
  },
  {
    id: 'extract-text',
    title: 'Extract Text',
    description: 'Extract text from PDF documents',
    icon: '📝',
    tag: 'PDF',
    route: '/pdf/extract-text',
    color: '#6F42C1'
  }
];

export const ALL_TOOLS_DATA = [
  // Image to Image Conversions
  {
    category: 'Image to Image Conversions',
    description: 'Convert between different image formats',
    conversions: [
      {
        id: 'jpg-to-png',
        title: 'JPG to PNG',
        description: 'Convert JPG images to PNG format',
        route: '/image/conversion',
        icon: '🖼️',
        tag: 'IMAGE'
      },
      {
        id: 'png-to-jpg',
        title: 'PNG to JPG',
        description: 'Convert PNG images to JPG format',
        route: '/image/conversion',
        icon: '🖼️',
        tag: 'IMAGE'
      },
      {
        id: 'jpg-to-webp',
        title: 'JPG to WebP',
        description: 'Convert JPG images to WebP format',
        route: '/image/conversion',
        icon: '🖼️',
        tag: 'IMAGE'
      },
      {
        id: 'webp-to-jpg',
        title: 'WebP to JPG',
        description: 'Convert WebP images to JPG format',
        route: '/image/conversion',
        icon: '🖼️',
        tag: 'IMAGE'
      },
      {
        id: 'png-to-webp',
        title: 'PNG to WebP',
        description: 'Convert PNG images to WebP format',
        route: '/image/conversion',
        icon: '🖼️',
        tag: 'IMAGE'
      },
      {
        id: 'webp-to-png',
        title: 'WebP to PNG',
        description: 'Convert WebP images to PNG format',
        route: '/image/conversion',
        icon: '🖼️',
        tag: 'IMAGE'
      }
    ]
  },
  // Image Optimization Tools
  {
    category: 'Image Optimization Tools',
    description: 'Compress and optimize images for better performance',
    conversions: [
      {
        id: 'compress-jpg',
        title: 'Compress JPG',
        description: 'Reduce JPG file size without losing quality',
        route: '/image/compression',
        icon: '📦',
        tag: 'IMAGE'
      },
      {
        id: 'compress-png',
        title: 'Compress PNG',
        description: 'Reduce PNG file size without losing quality',
        route: '/image/compression',
        icon: '📦',
        tag: 'IMAGE'
      },
      {
        id: 'compress-webp',
        title: 'Compress WebP',
        description: 'Reduce WebP file size without losing quality',
        route: '/image/compression',
        icon: '📦',
        tag: 'IMAGE'
      },
      {
        id: 'resize-jpg',
        title: 'Resize JPG',
        description: 'Resize JPG images to custom dimensions',
        route: '/image/resizing',
        icon: '📏',
        tag: 'IMAGE'
      },
      {
        id: 'resize-png',
        title: 'Resize PNG',
        description: 'Resize PNG images to custom dimensions',
        route: '/image/resizing',
        icon: '📏',
        tag: 'IMAGE'
      },
      {
        id: 'resize-webp',
        title: 'Resize WebP',
        description: 'Resize WebP images to custom dimensions',
        route: '/image/resizing',
        icon: '📏',
        tag: 'IMAGE'
      }
    ]
  },
  // Image Manipulation Tools
  {
    category: 'Image Manipulation Tools',
    description: 'Edit and transform images',
    conversions: [
      {
        id: 'crop-image',
        title: 'Crop Images',
        description: 'Crop images to remove unwanted areas',
        route: '/image/crop-image',
        icon: '✂️',
        tag: 'IMAGE'
      },
      {
        id: 'rotate-image',
        title: 'Rotate Images',
        description: 'Rotate images to correct orientation',
        route: '/image/rotate-image',
        icon: '🔄',
        tag: 'IMAGE'
      },
      {
        id: 'base64-conversion',
        title: 'Base64 Conversion',
        description: 'Convert images to Base64 string format',
        route: '/image/base64-converter',
        icon: '🔢',
        tag: 'IMAGE'
      }
    ]
  },
  // Image to PDF Conversions
  {
    category: 'Image to PDF Conversions',
    description: 'Convert images to PDF documents',
    conversions: [
      {
        id: 'images-to-pdf',
        title: 'Images to PDF',
        description: 'Convert multiple images to PDF documents',
        route: '/pdf/image-to-pdf',
        icon: '📄',
        tag: 'PDF'
      },
      {
        id: 'jpg-to-pdf',
        title: 'JPG to PDF',
        description: 'Convert JPG images to PDF format',
        route: '/pdf/image-to-pdf',
        icon: '📄',
        tag: 'PDF'
      },
      {
        id: 'png-to-pdf',
        title: 'PNG to PDF',
        description: 'Convert PNG images to PDF format',
        route: '/pdf/image-to-pdf',
        icon: '📄',
        tag: 'PDF'
      },
      {
        id: 'webp-to-pdf',
        title: 'WebP to PDF',
        description: 'Convert WebP images to PDF format',
        route: '/pdf/image-to-pdf',
        icon: '📄',
        tag: 'PDF'
      }
    ]
  },
  // PDF to PDF Tools
  {
    category: 'PDF to PDF Tools',
    description: 'Manipulate and edit PDF documents',
    conversions: [
      {
        id: 'merge-pdfs',
        title: 'Merge PDFs',
        description: 'Combine multiple PDF files into one',
        route: '/pdf/merge-pdf',
        icon: '🔗',
        tag: 'PDF'
      },
      {
        id: 'split-pdf',
        title: 'Split PDF',
        description: 'Split PDF into multiple documents',
        route: '/pdf/split-pdf',
        icon: '✂️',
        tag: 'PDF'
      },
      {
        id: 'watermark-pdf',
        title: 'Watermark PDF',
        description: 'Add watermarks to PDF documents',
        route: '/pdf/watermark-pdf',
        icon: '💧',
        tag: 'PDF'
      },
      {
        id: 'rotate-pdf',
        title: 'Rotate PDF Pages',
        description: 'Rotate PDF pages to correct orientation',
        route: '/pdf/rotate-pdf',
        icon: '🔄',
        tag: 'PDF'
      },
      {
        id: 'reorder-pdf',
        title: 'Reorder PDF Pages',
        description: 'Reorder pages in PDF documents',
        route: '/pdf/reorder-pdf',
        icon: '📋',
        tag: 'PDF'
      },
      {
        id: 'edit-metadata',
        title: 'Edit PDF Metadata',
        description: 'Edit PDF document properties',
        route: '/pdf/edit-meta-data-pdf',
        icon: '✏️',
        tag: 'PDF'
      }
    ]
  }
];
