// Central blog data management system
// This file contains all blog posts and their metadata

export const BLOG_CATEGORIES = {
  IMAGE_FORMATS: 'Image Formats',
  OPTIMIZATION: 'Optimization', 
  PDF_TOOLS: 'PDF Tools',
  WEB_DEVELOPMENT: 'Web Development',
  TUTORIALS: 'Tutorials',
  BEST_PRACTICES: 'Best Practices'
};

export const BLOG_TAGS = {
  IMAGE_OPTIMIZATION: 'Image Optimization',
  WEB_PERFORMANCE: 'Web Performance',
  FILE_FORMATS: 'File Formats',
  COMPRESSION: 'Compression',
  PDF: 'PDF',
  WORKFLOW: 'Workflow',
  PRODUCTIVITY: 'Productivity',
  SEO: 'SEO',
  TUTORIALS: 'Tutorials',
  BEST_PRACTICES: 'Best Practices'
};

// Blog post status for content management
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  FEATURED: 'featured',
  ARCHIVED: 'archived'
};

// Main blog posts data
export const BLOG_POSTS = [
  {
    id: 'png-vs-jpg-vs-webp-complete-guide',
    slug: 'png-vs-jpg-vs-webp-complete-guide',
    title: 'PNG vs JPG vs WebP: Complete Image Format Guide 2024',
    description: 'Comprehensive guide to choosing the right image format for your needs. Learn when to use PNG, JPG, or WebP for optimal web performance and quality.',
    excerpt: 'Choosing the right image format can make or break your website\'s performance. This comprehensive guide covers everything you need to know about PNG, JPG, and WebP formats, including detailed comparisons, use cases, and optimization tips.',
    category: BLOG_CATEGORIES.IMAGE_FORMATS,
    tags: [BLOG_TAGS.IMAGE_OPTIMIZATION, BLOG_TAGS.WEB_PERFORMANCE, BLOG_TAGS.FILE_FORMATS],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-18',
    lastModified: '2024-03-18',
    readTime: '12 min read',
    wordCount: 2500,
    status: POST_STATUS.FEATURED,
    featured: true,
    seo: {
      metaTitle: 'PNG vs JPG vs WebP: Complete Image Format Guide 2024 | Utilix Pro',
      metaDescription: 'Learn when to use PNG, JPG, or WebP formats. Comprehensive comparison with performance data, use cases, and optimization tips for web developers.',
      keywords: ['PNG vs JPG', 'WebP format', 'image formats', 'web optimization', 'image compression'],
      canonicalUrl: '/blog/png-vs-jpg-vs-webp-complete-guide'
    },
    relatedTools: [
      '/image/conversion',
      '/image/compression', 
      '/image/resizing'
    ],
    relatedPosts: [
      'image-compression-best-practices',
      'web-image-optimization-checklist'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Why Image Format Choice Matters', level: 2 },
      { id: 'compression-types', title: 'Understanding Image Compression', level: 2 },
      { id: 'png-format', title: 'PNG Format: Perfect Quality Champion', level: 2 },
      { id: 'jpeg-format', title: 'JPG/JPEG Format: Photography Standard', level: 2 },
      { id: 'webp-format', title: 'WebP Format: Modern Web Champion', level: 2 },
      { id: 'comparison', title: 'Direct Format Comparison', level: 2 },
      { id: 'use-cases', title: 'Real-World Use Cases', level: 2 },
      { id: 'implementation', title: 'Implementation Best Practices', level: 2 },
      { id: 'conclusion', title: 'Conclusion and Recommendations', level: 2 }
    ]
  },
  {
    id: 'image-compression-best-practices',
    slug: 'image-compression-best-practices',
    title: 'Image Compression Best Practices: Quality vs File Size',
    description: 'Master the art of image compression with our comprehensive guide. Learn how to reduce file sizes while maintaining visual quality.',
    excerpt: 'Image compression is crucial for web performance, but finding the right balance between quality and file size can be challenging. Learn professional techniques and tools.',
    category: BLOG_CATEGORIES.OPTIMIZATION,
    tags: [BLOG_TAGS.COMPRESSION, BLOG_TAGS.WEB_PERFORMANCE, BLOG_TAGS.BEST_PRACTICES],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-17',
    lastModified: '2024-03-17',
    readTime: '10 min read',
    wordCount: 1800,
    status: POST_STATUS.FEATURED,
    featured: true,
    seo: {
      metaTitle: 'Image Compression Best Practices: Quality vs File Size | Utilix Pro',
      metaDescription: 'Master image compression techniques. Learn how to reduce file sizes while maintaining quality. Professional tips for web optimization.',
      keywords: ['image compression', 'file size optimization', 'web performance', 'image quality', 'compression techniques'],
      canonicalUrl: '/blog/image-compression-best-practices'
    },
    relatedTools: [
      '/image/compression',
      '/image/conversion',
      '/image/resizing'
    ],
    relatedPosts: [
      'png-vs-jpg-vs-webp-complete-guide',
      'web-image-optimization-checklist'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'The Art of Image Compression', level: 2 },
      { id: 'compression-types', title: 'Understanding Compression Types', level: 2 },
      { id: 'jpeg-science', title: 'The Science Behind JPEG Compression', level: 2 },
      { id: 'png-optimization', title: 'Advanced PNG Optimization', level: 2 },
      { id: 'webp-solution', title: 'WebP: The Modern Solution', level: 2 },
      { id: 'real-world', title: 'Real-World Scenarios', level: 2 }
    ]
  },
  {
    id: 'pdf-management-workflow-guide',
    slug: 'pdf-management-workflow-guide',
    title: 'Professional PDF Management Workflow: Complete Guide',
    description: 'Streamline your document workflow with professional PDF management techniques. From creation to optimization.',
    excerpt: 'Learn how to create an efficient PDF workflow that saves time and ensures consistency across all your documents.',
    category: BLOG_CATEGORIES.PDF_TOOLS,
    tags: [BLOG_TAGS.PDF, BLOG_TAGS.WORKFLOW, BLOG_TAGS.PRODUCTIVITY],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-16',
    lastModified: '2024-03-16',
    readTime: '15 min read',
    wordCount: 3200,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'Professional PDF Management Workflow: Complete Guide | Utilix Pro',
      metaDescription: 'Streamline your PDF workflow with professional management techniques. Learn organization, optimization, and automation strategies.',
      keywords: ['PDF workflow', 'document management', 'PDF optimization', 'business productivity', 'file organization'],
      canonicalUrl: '/blog/pdf-management-workflow-guide'
    },
    relatedTools: [
      '/pdf/merge-pdf',
      '/pdf/split-pdf',
      '/pdf/rotate-pdf',
      '/pdf/edit-meta-data-pdf'
    ],
    relatedPosts: [
      'web-image-optimization-checklist'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Mastering PDF Workflows', level: 2 },
      { id: 'challenges', title: 'Understanding Workflow Challenges', level: 2 },
      { id: 'creation', title: 'Building Your Creation Workflow', level: 2 },
      { id: 'editing', title: 'Advanced Editing Techniques', level: 2 },
      { id: 'organization', title: 'Professional Organization Systems', level: 2 }
    ]
  },
  {
    id: 'web-image-optimization-checklist',
    slug: 'web-image-optimization-checklist',
    title: 'Ultimate Web Image Optimization Checklist for 2024',
    description: 'Complete checklist for optimizing images for web performance. Covers formats, sizes, loading strategies, and SEO.',
    excerpt: 'A comprehensive checklist covering every aspect of web image optimization, from choosing the right format to implementing lazy loading.',
    category: BLOG_CATEGORIES.WEB_DEVELOPMENT,
    tags: [BLOG_TAGS.WEB_DEVELOPMENT, BLOG_TAGS.SEO, BLOG_TAGS.WEB_PERFORMANCE],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-15',
    lastModified: '2024-03-15',
    readTime: '8 min read',
    wordCount: 1500,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'Ultimate Web Image Optimization Checklist 2024 | Utilix Pro',
      metaDescription: 'Complete checklist for web image optimization. Improve performance, SEO, and user experience with our comprehensive guide.',
      keywords: ['web image optimization', 'image SEO', 'website performance', 'image loading', 'lazy loading'],
      canonicalUrl: '/blog/web-image-optimization-checklist'
    },
    relatedTools: [
      '/image/compression',
      '/image/conversion',
      '/image/resizing'
    ],
    relatedPosts: [
      'png-vs-jpg-vs-webp-complete-guide',
      'image-compression-best-practices'
    ],
    tableOfContents: [
      { id: 'checklist-overview', title: 'Optimization Checklist Overview', level: 2 },
      { id: 'format-selection', title: 'Format Selection Strategy', level: 2 },
      { id: 'sizing-optimization', title: 'Sizing and Compression', level: 2 },
      { id: 'loading-strategies', title: 'Loading Strategies', level: 2 },
      { id: 'seo-optimization', title: 'SEO Optimization', level: 2 }
    ]
  },
  {
    id: 'pdf-compression-techniques',
    slug: 'pdf-compression-techniques',
    title: 'PDF Compression Techniques: Reduce File Size Without Losing Quality',
    description: 'Learn professional PDF compression techniques to reduce file sizes while maintaining document quality. Complete guide with step-by-step instructions.',
    excerpt: 'Discover how to compress PDF files effectively using various techniques. Learn when to use lossless vs lossy compression and optimize your documents for sharing and storage.',
    category: BLOG_CATEGORIES.PDF_TOOLS,
    tags: [BLOG_TAGS.PDF, BLOG_TAGS.COMPRESSION, BLOG_TAGS.BEST_PRACTICES],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-14',
    lastModified: '2024-03-14',
    readTime: '9 min read',
    wordCount: 2000,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'PDF Compression Techniques: Reduce File Size Without Losing Quality | Utilix Pro',
      metaDescription: 'Learn professional PDF compression techniques. Reduce file sizes while maintaining quality. Complete guide with best practices and tools.',
      keywords: ['PDF compression', 'reduce PDF size', 'PDF optimization', 'file compression', 'document optimization'],
      canonicalUrl: '/blog/pdf-compression-techniques'
    },
    relatedTools: [
      '/pdf/merge-pdf',
      '/pdf/split-pdf',
      '/image/compression'
    ],
    relatedPosts: [
      'pdf-management-workflow-guide',
      'image-compression-best-practices'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Why PDF Compression Matters', level: 2 },
      { id: 'compression-methods', title: 'Understanding Compression Methods', level: 2 },
      { id: 'lossless-vs-lossy', title: 'Lossless vs Lossy Compression', level: 2 },
      { id: 'best-practices', title: 'Best Practices for PDF Compression', level: 2 }
    ]
  },
  {
    id: 'image-formats-comparison-guide',
    slug: 'image-formats-comparison-guide',
    title: 'Complete Image Format Comparison: Choosing the Right Format for Every Use Case',
    description: 'Comprehensive comparison of all major image formats including JPEG, PNG, WebP, GIF, SVG, and emerging formats. Make informed decisions for your projects.',
    excerpt: 'Navigate the complex world of image formats with our detailed comparison guide. Learn the strengths and weaknesses of each format and when to use them.',
    category: BLOG_CATEGORIES.IMAGE_FORMATS,
    tags: [BLOG_TAGS.FILE_FORMATS, BLOG_TAGS.IMAGE_OPTIMIZATION, BLOG_TAGS.WEB_DEVELOPMENT],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-13',
    lastModified: '2024-03-13',
    readTime: '11 min read',
    wordCount: 2300,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'Complete Image Format Comparison Guide 2024 | Utilix Pro',
      metaDescription: 'Compare JPEG, PNG, WebP, GIF, SVG and more. Learn which image format to use for different scenarios. Complete guide with examples.',
      keywords: ['image formats', 'format comparison', 'JPEG vs PNG', 'WebP vs JPEG', 'image format guide'],
      canonicalUrl: '/blog/image-formats-comparison-guide'
    },
    relatedTools: [
      '/image/conversion',
      '/image/compression',
      '/image/resizing'
    ],
    relatedPosts: [
      'png-vs-jpg-vs-webp-complete-guide',
      'web-image-optimization-checklist'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Understanding Image Formats', level: 2 },
      { id: 'raster-formats', title: 'Raster Image Formats', level: 2 },
      { id: 'vector-formats', title: 'Vector Image Formats', level: 2 },
      { id: 'comparison-table', title: 'Format Comparison Table', level: 2 }
    ]
  },
  {
    id: 'responsive-images-implementation',
    slug: 'responsive-images-implementation',
    title: 'Responsive Images Implementation: Complete Guide for Modern Web Development',
    description: 'Learn how to implement responsive images correctly using srcset, sizes, and picture elements. Improve performance and user experience across all devices.',
    excerpt: 'Master responsive image implementation with our comprehensive guide. Learn about srcset, sizes attributes, and the picture element for optimal performance.',
    category: BLOG_CATEGORIES.WEB_DEVELOPMENT,
    tags: [BLOG_TAGS.WEB_DEVELOPMENT, BLOG_TAGS.WEB_PERFORMANCE, BLOG_TAGS.TUTORIALS],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-12',
    lastModified: '2024-03-12',
    readTime: '13 min read',
    wordCount: 2800,
    status: POST_STATUS.PUBLISHED,
    featured: true,
    seo: {
      metaTitle: 'Responsive Images Implementation Guide 2024 | Utilix Pro',
      metaDescription: 'Learn responsive image implementation with srcset, sizes, and picture elements. Complete tutorial with code examples and best practices.',
      keywords: ['responsive images', 'srcset', 'picture element', 'web development', 'mobile optimization'],
      canonicalUrl: '/blog/responsive-images-implementation'
    },
    relatedTools: [
      '/image/resizing',
      '/image/compression',
      '/image/conversion'
    ],
    relatedPosts: [
      'web-image-optimization-checklist',
      'png-vs-jpg-vs-webp-complete-guide'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Why Responsive Images Matter', level: 2 },
      { id: 'srcset-attribute', title: 'Using srcset Attribute', level: 2 },
      { id: 'sizes-attribute', title: 'Understanding sizes Attribute', level: 2 },
      { id: 'picture-element', title: 'Picture Element for Art Direction', level: 2 }
    ]
  },
  {
    id: 'pdf-security-best-practices',
    slug: 'pdf-security-best-practices',
    title: 'PDF Security Best Practices: Protecting Your Documents',
    description: 'Learn how to secure your PDF documents with passwords, encryption, and permission settings. Protect sensitive information effectively.',
    excerpt: 'Comprehensive guide to PDF security. Learn about encryption, password protection, and permission settings to keep your documents safe.',
    category: BLOG_CATEGORIES.PDF_TOOLS,
    tags: [BLOG_TAGS.PDF, BLOG_TAGS.BEST_PRACTICES, BLOG_TAGS.TUTORIALS],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-11',
    lastModified: '2024-03-11',
    readTime: '10 min read',
    wordCount: 2100,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'PDF Security Best Practices: Protecting Your Documents | Utilix Pro',
      metaDescription: 'Learn PDF security best practices including encryption, password protection, and permission settings. Keep your documents safe and secure.',
      keywords: ['PDF security', 'PDF encryption', 'password protect PDF', 'document security', 'PDF protection'],
      canonicalUrl: '/blog/pdf-security-best-practices'
    },
    relatedTools: [
      '/pdf/edit-meta-data-pdf',
      '/pdf/watermark-pdf',
      '/pdf/merge-pdf'
    ],
    relatedPosts: [
      'pdf-management-workflow-guide',
      'pdf-compression-techniques'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Why PDF Security Matters', level: 2 },
      { id: 'encryption-methods', title: 'PDF Encryption Methods', level: 2 },
      { id: 'password-protection', title: 'Password Protection Strategies', level: 2 },
      { id: 'permissions', title: 'Setting Document Permissions', level: 2 }
    ]
  },
  {
    id: 'batch-image-processing-guide',
    slug: 'batch-image-processing-guide',
    title: 'Batch Image Processing: Process Multiple Images Efficiently',
    description: 'Learn how to process multiple images at once using batch processing techniques. Save time and improve workflow efficiency.',
    excerpt: 'Master batch image processing to handle multiple files efficiently. Learn techniques, tools, and best practices for processing large image collections.',
    category: BLOG_CATEGORIES.OPTIMIZATION,
    tags: [BLOG_TAGS.IMAGE_OPTIMIZATION, BLOG_TAGS.PRODUCTIVITY, BLOG_TAGS.WORKFLOW],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-10',
    lastModified: '2024-03-10',
    readTime: '8 min read',
    wordCount: 1700,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'Batch Image Processing Guide: Process Multiple Images Efficiently | Utilix Pro',
      metaDescription: 'Learn batch image processing techniques to handle multiple files efficiently. Save time with automated workflows and tools.',
      keywords: ['batch processing', 'bulk image processing', 'image automation', 'workflow efficiency', 'productivity'],
      canonicalUrl: '/blog/batch-image-processing-guide'
    },
    relatedTools: [
      '/image/compression',
      '/image/conversion',
      '/image/resizing',
      '/image/merger'
    ],
    relatedPosts: [
      'image-compression-best-practices',
      'web-image-optimization-checklist'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Benefits of Batch Processing', level: 2 },
      { id: 'preparation', title: 'Preparing Your Images', level: 2 },
      { id: 'techniques', title: 'Batch Processing Techniques', level: 2 },
      { id: 'automation', title: 'Automation Strategies', level: 2 }
    ]
  },
  {
    id: 'web-performance-image-optimization',
    slug: 'web-performance-image-optimization',
    title: 'Web Performance Optimization: The Impact of Images on Page Speed',
    description: 'Understand how images affect website performance and learn strategies to optimize loading times. Improve Core Web Vitals and SEO rankings.',
    excerpt: 'Discover how image optimization directly impacts web performance metrics. Learn strategies to improve page speed and Core Web Vitals scores.',
    category: BLOG_CATEGORIES.WEB_DEVELOPMENT,
    tags: [BLOG_TAGS.WEB_PERFORMANCE, BLOG_TAGS.SEO, BLOG_TAGS.IMAGE_OPTIMIZATION],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-09',
    lastModified: '2024-03-09',
    readTime: '12 min read',
    wordCount: 2600,
    status: POST_STATUS.PUBLISHED,
    featured: true,
    seo: {
      metaTitle: 'Web Performance Optimization: Image Impact on Page Speed | Utilix Pro',
      metaDescription: 'Learn how images affect website performance and Core Web Vitals. Discover optimization strategies to improve page speed and SEO rankings.',
      keywords: ['web performance', 'page speed', 'Core Web Vitals', 'image optimization', 'SEO performance'],
      canonicalUrl: '/blog/web-performance-image-optimization'
    },
    relatedTools: [
      '/image/compression',
      '/image/conversion',
      '/image/resizing'
    ],
    relatedPosts: [
      'image-compression-best-practices',
      'responsive-images-implementation',
      'web-image-optimization-checklist'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Images and Web Performance', level: 2 },
      { id: 'core-web-vitals', title: 'Impact on Core Web Vitals', level: 2 },
      { id: 'optimization-strategies', title: 'Optimization Strategies', level: 2 },
      { id: 'measuring-performance', title: 'Measuring Performance Impact', level: 2 }
    ]
  },
  {
    id: 'pdf-creation-best-practices',
    slug: 'pdf-creation-best-practices',
    title: 'PDF Creation Best Practices: Creating Professional Documents',
    description: 'Learn best practices for creating professional PDF documents. From formatting to metadata, create documents that impress.',
    excerpt: 'Master the art of PDF creation with our comprehensive guide. Learn formatting, structure, and metadata best practices for professional documents.',
    category: BLOG_CATEGORIES.PDF_TOOLS,
    tags: [BLOG_TAGS.PDF, BLOG_TAGS.BEST_PRACTICES, BLOG_TAGS.PRODUCTIVITY],
    author: {
      name: 'Utilix Pro Team',
      bio: 'Expert developers and designers passionate about web performance and user experience.',
      avatar: '/images/team-avatar.jpg'
    },
    publishDate: '2024-03-08',
    lastModified: '2024-03-08',
    readTime: '9 min read',
    wordCount: 1900,
    status: POST_STATUS.PUBLISHED,
    featured: false,
    seo: {
      metaTitle: 'PDF Creation Best Practices: Professional Document Guide | Utilix Pro',
      metaDescription: 'Learn PDF creation best practices for professional documents. Master formatting, structure, and metadata to create impressive PDFs.',
      keywords: ['PDF creation', 'professional PDFs', 'document formatting', 'PDF best practices', 'document design'],
      canonicalUrl: '/blog/pdf-creation-best-practices'
    },
    relatedTools: [
      '/pdf/edit-meta-data-pdf',
      '/pdf/image-to-pdf',
      '/pdf/merge-pdf'
    ],
    relatedPosts: [
      'pdf-management-workflow-guide',
      'pdf-security-best-practices'
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Professional PDF Creation', level: 2 },
      { id: 'formatting', title: 'Formatting Best Practices', level: 2 },
      { id: 'structure', title: 'Document Structure', level: 2 },
      { id: 'metadata', title: 'Metadata and Properties', level: 2 }
    ]
  }
];

// Helper functions for data management
export const getBlogPostBySlug = (slug) => {
  return BLOG_POSTS.find(post => post.slug === slug);
};

export const getBlogPostById = (id) => {
  return BLOG_POSTS.find(post => post.id === id);
};

export const getFeaturedPosts = () => {
  return BLOG_POSTS.filter(post => post.featured && post.status === POST_STATUS.FEATURED);
};

export const getPublishedPosts = () => {
  return BLOG_POSTS.filter(post => 
    post.status === POST_STATUS.PUBLISHED || post.status === POST_STATUS.FEATURED
  );
};

export const getPostsByCategory = (category) => {
  return getPublishedPosts().filter(post => post.category === category);
};

export const getPostsByTag = (tag) => {
  return getPublishedPosts().filter(post => post.tags.includes(tag));
};

export const getRelatedPosts = (currentPostId, limit = 3) => {
  const currentPost = getBlogPostById(currentPostId);
  if (!currentPost) return [];
  
  return getPublishedPosts()
    .filter(post => 
      post.id !== currentPostId && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
};

export const getAllCategories = () => {
  return Object.values(BLOG_CATEGORIES);
};

export const getAllTags = () => {
  return Object.values(BLOG_TAGS);
};

export const searchPosts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return getPublishedPosts().filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Blog statistics
export const getBlogStats = () => {
  const publishedPosts = getPublishedPosts();
  return {
    totalPosts: publishedPosts.length,
    featuredPosts: getFeaturedPosts().length,
    totalWordCount: publishedPosts.reduce((total, post) => total + post.wordCount, 0),
    averageReadTime: Math.round(
      publishedPosts.reduce((total, post) => 
        total + parseInt(post.readTime.replace(' min read', '')), 0
      ) / publishedPosts.length
    ),
    categoriesCount: [...new Set(publishedPosts.map(post => post.category))].length,
    tagsCount: [...new Set(publishedPosts.flatMap(post => post.tags))].length
  };
};
