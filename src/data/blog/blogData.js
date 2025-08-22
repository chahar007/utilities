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
