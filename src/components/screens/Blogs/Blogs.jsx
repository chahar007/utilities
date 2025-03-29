import React, { useState } from "react";
import classes from './Blogs.module.scss';
import { Link } from "react-router-dom";
import { BLOGS_DATA, CATEGORIES } from '../../../assets/constants/blogs.constant';

const BlogsListing = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredBlogs = activeCategory === "all" 
    ? BLOGS_DATA 
    : BLOGS_DATA.filter(blog => blog.category === activeCategory);

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Insert ads after every 3 articles
  const contentWithAds = [];
  filteredBlogs.forEach((blog, index) => {
    contentWithAds.push(blog);
    if ((index + 1) % 3 === 0) {
      contentWithAds.push({ type: 'ad', id: `ad-${index}` });
    }
  });

  return (
    <div className={classes.blogContainer}>
      {/* Hero Section */}
      {/* <div className={classes.heroSection}>
        <div className={classes.adLeaderboard}>
          <div className={classes.adLabel}>Advertisement</div>
          <div className={classes.adContent}>Leaderboard (970x250)</div>
        </div>
      </div> */}

      {/* Category Filters */}
      <div className={classes.categoryFilters}>
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`${classes.categoryButton} ${
              activeCategory === category.id ? classes.active : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className={classes.categoryIcon}>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Active Category Title */}
      {activeCategory !== "all" && (
        <h2 className={classes.categoryTitle}>
          {CATEGORIES.find(c => c.id === activeCategory).name}
        </h2>
      )}

      {/* Blog Grid with Ads */}
      <div className={classes.blogGrid}>
        {contentWithAds.map((item) => {
          if (item.type === 'ad') {
            return (
              <div key={item.id} className={classes.adRectangle}>
                <div className={classes.adLabel}>Advertisement</div>
                <div className={classes.adContent}>Rectangle (300x250)</div>
              </div>
            );
          }

          const blog = item;
          return (
            <div key={blog.id} className={classes.blogCard}>
              <Link to={`/blog/${blog.id}`} className={classes.blogLink}>
                <div className={classes.imageWrapper}>
                  <img 
                    src={blog.image || 'https://via.placeholder.com/600x400?text=GameSphere'} 
                    alt={blog.title} 
                    className={classes.blogImage}
                  />
                  <div className={classes.categoryBadge}>
                    {CATEGORIES.find(c => c.id === blog.category).name}
                  </div>
                  <div className={classes.readTime}>
                    {calculateReadingTime(blog.content)} min read
                  </div>
                </div>
                
                <div className={classes.blogContent}>
                  <div className={classes.blogMeta}>
                    <span className={classes.blogAuthor}>By {blog.author}</span>
                    <span className={classes.blogDate}>{blog.date}</span>
                  </div>
                  
                  <h2 className={classes.blogTitle}>{blog.title}</h2>
                  <p className={classes.blogDescription}>{blog.description}</p>
                  
                  <div className={classes.tagsContainer}>
                    {blog.tags.map((tag, index) => (
                      <span key={index} className={classes.blogTag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bottom Ad Banner */}
      <div className={classes.adBanner}>
        <div className={classes.adLabel}>Advertisement</div>
        <div className={classes.adContent}>Banner (728x90)</div>
      </div>

      {/* Newsletter */}
      <div className={classes.newsletterSection}>
        <div className={classes.newsletterContent}>
          <h3>Weekly Gaming Digest</h3>
          <p>Get the hottest gaming news delivered to your inbox</p>
          <div className={classes.newsletterForm}>
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
        
        {/* Sidebar Ad */}
        <div className={classes.newsletterAd}>
          <div className={classes.adLabel}>Advertisement</div>
          <div className={classes.adContent}>Square (250x250)</div>
        </div>
      </div>
    </div>
  );
};

export default BlogsListing;