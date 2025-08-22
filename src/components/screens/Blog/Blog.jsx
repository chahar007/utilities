import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styles from './Blog.module.scss';
import blogService from '../../../services/blogService';

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  // Get data from blog service
  const blogPosts = blogService.getAllPosts();
  const categories = blogService.getAllCategories();
  const blogStats = blogService.getBlogStats();
  
  const filteredPosts = blogService.getPostsByCategory(selectedCategory);
  const featuredPosts = blogService.getFeaturedPosts();

  const handlePostClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className={styles.blog}>
      <Helmet>
        <title>Expert Blog | Image & PDF Processing Guides | Utilix Pro</title>
        <meta 
          name="description" 
          content="Expert guides on image optimization, PDF management, and file processing. Learn best practices, tips, and techniques from industry professionals." 
        />
        <meta 
          name="keywords" 
          content="image optimization, PDF processing, file conversion, web performance, compression techniques, professional workflows" 
        />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Expert Guides & Tutorials</h1>
          <p className={styles.heroSubtitle}>
            Master image optimization, PDF management, and file processing with our comprehensive guides
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{blogStats.totalPosts}+</span>
              <span className={styles.statLabel}>Expert Articles</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{Math.round(blogStats.totalWordCount / 1000)}K+</span>
              <span className={styles.statLabel}>Words Published</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{blogStats.averageReadTime}</span>
              <span className={styles.statLabel}>Avg Read Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Featured Articles</h2>
            <p>In-depth guides and tutorials from our experts</p>
          </div>
          <div className={styles.featuredGrid}>
            {featuredPosts.map((post) => (
              <article 
                key={post.id} 
                className={styles.featuredCard}
                onClick={() => handlePostClick(post.slug)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.readTime}>{post.readTime}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.tags}>
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    <span className={styles.publishDate}>{post.publishDate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className={styles.allPosts}>
        <div className={styles.container}>
          <div className={styles.postsHeader}>
            <div className={styles.sectionHeader}>
              <h2>All Articles</h2>
              <p>Browse our complete collection of guides and tutorials</p>
            </div>
            <div className={styles.categoryFilter}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className={styles.postCard}
                onClick={() => handlePostClick(post.slug)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.readTime}>{post.readTime}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardDescription}>{post.description}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.tags}>
                      {post.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                    <span className={styles.publishDate}>{post.publishDate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Stay Updated with Latest Tips</h2>
          <p>Get weekly insights on image optimization, PDF management, and web performance.</p>
          <div className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={styles.emailInput}
            />
            <button className={styles.subscribeBtn}>Subscribe</button>
          </div>
          <p className={styles.disclaimer}>No spam, unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
};

export default Blog;
