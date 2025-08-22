// Blog service for managing blog data and operations
// This service provides a clean API for components to interact with blog data

import { 
  BLOG_POSTS, 
  BLOG_CATEGORIES,
  BLOG_TAGS,
  POST_STATUS,
  getBlogPostBySlug,
  getBlogPostById,
  getFeaturedPosts,
  getPublishedPosts,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts,
  getAllCategories,
  getAllTags,
  searchPosts,
  getBlogStats
} from '../data/blog/blogData';

import { getBlogContentBySlug } from '../data/blog/blogContent';

/**
 * Blog Service Class
 * Provides centralized methods for blog data management
 */
class BlogService {
  constructor() {
    this.posts = BLOG_POSTS;
    this.categories = BLOG_CATEGORIES;
    this.tags = BLOG_TAGS;
    this.status = POST_STATUS;
  }

  // ===== BASIC DATA RETRIEVAL =====

  /**
   * Get all published posts
   * @returns {Array} Array of published blog posts
   */
  getAllPosts() {
    return getPublishedPosts();
  }

  /**
   * Get featured posts for homepage/highlights
   * @returns {Array} Array of featured blog posts
   */
  getFeaturedPosts() {
    return getFeaturedPosts();
  }

  /**
   * Get a single post by slug
   * @param {string} slug - Post slug
   * @returns {Object|null} Blog post object or null if not found
   */
  getPostBySlug(slug) {
    const post = getBlogPostBySlug(slug);
    if (!post) return null;

    // Add content to the post object
    const content = getBlogContentBySlug(slug);
    return {
      ...post,
      content
    };
  }

  /**
   * Get a single post by ID
   * @param {string} id - Post ID
   * @returns {Object|null} Blog post object or null if not found
   */
  getPostById(id) {
    return getBlogPostById(id);
  }

  // ===== FILTERING AND SEARCH =====

  /**
   * Get posts by category
   * @param {string} category - Category name
   * @returns {Array} Array of posts in the category
   */
  getPostsByCategory(category) {
    if (category === 'All') {
      return this.getAllPosts();
    }
    return getPostsByCategory(category);
  }

  /**
   * Get posts by tag
   * @param {string} tag - Tag name
   * @returns {Array} Array of posts with the tag
   */
  getPostsByTag(tag) {
    return getPostsByTag(tag);
  }

  /**
   * Search posts by query
   * @param {string} query - Search query
   * @returns {Array} Array of matching posts
   */
  searchPosts(query) {
    if (!query || query.trim() === '') {
      return this.getAllPosts();
    }
    return searchPosts(query.trim());
  }

  /**
   * Get related posts for a given post
   * @param {string} postId - Current post ID
   * @param {number} limit - Maximum number of related posts
   * @returns {Array} Array of related posts
   */
  getRelatedPosts(postId, limit = 3) {
    return getRelatedPosts(postId, limit);
  }

  // ===== METADATA AND CATEGORIES =====

  /**
   * Get all available categories
   * @returns {Array} Array of category names
   */
  getAllCategories() {
    return ['All', ...getAllCategories()];
  }

  /**
   * Get all available tags
   * @returns {Array} Array of tag names
   */
  getAllTags() {
    return getAllTags();
  }

  /**
   * Get blog statistics
   * @returns {Object} Blog statistics object
   */
  getBlogStats() {
    return getBlogStats();
  }

  // ===== CONTENT VALIDATION =====

  /**
   * Validate if a post exists and is published
   * @param {string} slug - Post slug
   * @returns {boolean} True if post exists and is published
   */
  isValidPost(slug) {
    const post = getBlogPostBySlug(slug);
    return post && (post.status === POST_STATUS.PUBLISHED || post.status === POST_STATUS.FEATURED);
  }

  /**
   * Check if a category exists
   * @param {string} category - Category name
   * @returns {boolean} True if category exists
   */
  isValidCategory(category) {
    return category === 'All' || Object.values(BLOG_CATEGORIES).includes(category);
  }

  // ===== SEO AND METADATA =====

  /**
   * Get SEO data for a post
   * @param {string} slug - Post slug
   * @returns {Object|null} SEO data object or null
   */
  getPostSEO(slug) {
    const post = getBlogPostBySlug(slug);
    return post ? post.seo : null;
  }

  /**
   * Generate breadcrumb data for a post
   * @param {string} slug - Post slug
   * @returns {Array} Breadcrumb array
   */
  getBreadcrumbs(slug) {
    const post = getBlogPostBySlug(slug);
    if (!post) return [];

    return [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.category, url: `/blog?category=${encodeURIComponent(post.category)}` },
      { name: post.title, url: `/blog/${slug}`, current: true }
    ];
  }

  // ===== PAGINATION =====

  /**
   * Get paginated posts
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Posts per page
   * @param {string} category - Optional category filter
   * @returns {Object} Pagination object with posts and metadata
   */
  getPaginatedPosts(page = 1, limit = 10, category = 'All') {
    const allPosts = this.getPostsByCategory(category);
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;
    const posts = allPosts.slice(offset, offset + limit);

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      }
    };
  }

  // ===== CONTENT MANAGEMENT HELPERS =====

  /**
   * Get post reading time in minutes
   * @param {string} content - Post content HTML
   * @returns {number} Reading time in minutes
   */
  calculateReadingTime(content) {
    if (!content) return 0;
    
    // Remove HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    
    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(words / 200);
    return readingTime;
  }

  /**
   * Format publish date for display
   * @param {string} dateString - Date string
   * @param {string} format - Format type ('short', 'long', 'relative')
   * @returns {string} Formatted date string
   */
  formatDate(dateString, format = 'long') {
    const date = new Date(dateString);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'relative':
        return this.getRelativeTime(date);
      default:
        return dateString;
    }
  }

  /**
   * Get relative time string (e.g., "2 days ago")
   * @param {Date} date - Date object
   * @returns {string} Relative time string
   */
  getRelativeTime(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }

  // ===== URL GENERATION =====

  /**
   * Generate canonical URL for a post
   * @param {string} slug - Post slug
   * @returns {string} Canonical URL
   */
  getCanonicalUrl(slug) {
    return `${window.location.origin}/blog/${slug}`;
  }

  /**
   * Generate category filter URL
   * @param {string} category - Category name
   * @returns {string} Category URL
   */
  getCategoryUrl(category) {
    if (category === 'All') return '/blog';
    return `/blog?category=${encodeURIComponent(category)}`;
  }

  /**
   * Generate tag filter URL
   * @param {string} tag - Tag name
   * @returns {string} Tag URL
   */
  getTagUrl(tag) {
    return `/blog?tag=${encodeURIComponent(tag)}`;
  }
}

// Create and export a singleton instance
const blogService = new BlogService();
export default blogService;

// Export individual methods for direct use
export {
  blogService,
  BLOG_CATEGORIES,
  BLOG_TAGS,
  POST_STATUS
};
