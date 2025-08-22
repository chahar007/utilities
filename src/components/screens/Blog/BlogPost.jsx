import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './BlogPost.module.scss';
import blogService from '../../../services/blogService';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Get post data from blog service
  const post = blogService.getPostBySlug(slug);
  const relatedPosts = post ? blogService.getRelatedPosts(post.id) : [];
  
  if (!post) {
    return (
      <div className={styles.notFound}>
        <h1>Blog Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/blog')} className={styles.backBtn}>
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.blogPost}>
      <Helmet>
        <title>{post.seo?.metaTitle || `${post.title} | Utilix Pro Blog`}</title>
        <meta name="description" content={post.seo?.metaDescription || post.description} />
        <meta name="keywords" content={post.seo?.keywords?.join(', ') || post.tags.join(', ')} />
        <link rel="canonical" href={blogService.getCanonicalUrl(slug)} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={blogService.getCanonicalUrl(slug)} />
        
        {/* Article specific meta */}
        <meta property="article:published_time" content={post.publishDate} />
        <meta property="article:modified_time" content={post.lastModified} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

                  {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.description,
              "wordCount": post.wordCount,
              "author": {
                "@type": "Organization",
                "name": post.author.name
              },
              "publisher": {
                "@type": "Organization",
                "name": "Utilix Pro",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${window.location.origin}/logo.png`
                }
              },
              "datePublished": post.publishDate,
              "dateModified": post.lastModified,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": blogService.getCanonicalUrl(slug)
              },
              "keywords": post.tags.join(', '),
              "articleSection": post.category,
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "about": {
                "@type": "Thing",
                "name": post.category
              }
            })}
          </script>

          {/* FAQ Schema for better rich snippets */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": `When should I use ${post.title.includes('PNG') ? 'PNG' : post.category}?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": post.description
                  }
                },
                {
                  "@type": "Question", 
                  "name": `How does ${post.category.toLowerCase()} affect web performance?`,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Proper optimization can reduce file sizes by 50-80% while maintaining visual quality, significantly improving page load times and user experience."
                  }
                }
              ]
            })}
          </script>
      </Helmet>

      {/* Article Header */}
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <button onClick={() => navigate('/blog')} className={styles.breadcrumbLink}>
            Blog
          </button>
          <span className={styles.breadcrumbSeparator}>→</span>
          <span className={styles.breadcrumbCurrent}>{post.category}</span>
        </div>

        {/* Reading Progress Bar */}
        <div className={styles.readingProgress}>
          <div className={styles.progressBar}></div>
        </div>
        
        <div className={styles.articleMeta}>
          <span className={styles.category}>{post.category}</span>
          <span className={styles.readTime}>{post.readTime}</span>
          <span className={styles.publishDate}>{post.publishDate}</span>
        </div>
        
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.description}>{post.description}</p>
        
        <div className={styles.tags}>
          {post.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>{tag}</span>
          ))}
        </div>

        {/* Social Sharing */}
        <div className={styles.socialShare}>
          <span className={styles.shareLabel}>Share this article:</span>
          <div className={styles.shareButtons}>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareBtn}
              aria-label="Share on Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareBtn}
              aria-label="Share on LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.shareBtn}
              aria-label="Share on Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className={styles.shareBtn}
              aria-label="Copy link"
              title="Copy link"
            >
              <i className="fas fa-link"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      {post.tableOfContents && post.tableOfContents.length > 0 && (
        <aside className={styles.tableOfContents}>
          <div className={styles.tocContainer}>
            <h3 className={styles.tocTitle}>Table of Contents</h3>
            <nav className={styles.tocNav}>
              {post.tableOfContents.map((item, index) => (
                <a 
                  key={index}
                  href={`#${item.id}`}
                  className={`${styles.tocLink} ${styles[`tocLevel${item.level}`]}`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* Article Content */}
      <main className={styles.content}>
        <div 
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>

      {/* Article Footer */}
      <footer className={styles.footer}>
        <div className={styles.authorBox}>
          <h3>About the Author</h3>
          <p>
            {post.author.bio}
          </p>
        </div>

        {/* Related Tools */}
        {post.relatedTools && post.relatedTools.length > 0 && (
          <div className={styles.relatedTools}>
            <h3>Try Our Tools</h3>
            <div className={styles.toolLinks}>
              {post.relatedTools.slice(0, 3).map((toolUrl, index) => {
                const toolNames = {
                  '/image/conversion': { name: 'Image Converter', icon: 'fas fa-exchange-alt' },
                  '/image/compression': { name: 'Image Compressor', icon: 'fas fa-compress-alt' },
                  '/image/resizing': { name: 'Image Resizer', icon: 'fas fa-expand-arrows-alt' },
                  '/pdf/merge-pdf': { name: 'PDF Merger', icon: 'fas fa-object-group' },
                  '/pdf/split-pdf': { name: 'PDF Splitter', icon: 'fas fa-cut' },
                  '/pdf/rotate-pdf': { name: 'PDF Rotator', icon: 'fas fa-redo' },
                  '/pdf/edit-meta-data-pdf': { name: 'PDF Metadata Editor', icon: 'fas fa-edit' }
                };
                const tool = toolNames[toolUrl] || { name: 'Tool', icon: 'fas fa-tools' };
                
                return (
                  <a key={index} href={toolUrl} className={styles.toolLink}>
                    <i className={tool.icon}></i>
                    {tool.name}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className={styles.relatedPosts}>
            <h3>Related Articles</h3>
            <div className={styles.relatedPostsGrid}>
              {relatedPosts.map((relatedPost) => (
                <article 
                  key={relatedPost.id} 
                  className={styles.relatedPostCard}
                  onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                >
                  <div className={styles.relatedPostMeta}>
                    <span className={styles.category}>{relatedPost.category}</span>
                    <span className={styles.readTime}>{relatedPost.readTime}</span>
                  </div>
                  <h4 className={styles.relatedPostTitle}>{relatedPost.title}</h4>
                  <p className={styles.relatedPostDescription}>{relatedPost.description}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className={styles.navigation}>
          <button onClick={() => navigate('/blog')} className={styles.backToList}>
            ← Back to Blog
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
