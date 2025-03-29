import React from "react";
import { useParams, Link } from "react-router-dom";
import { BLOGS_DATA, CATEGORIES } from '../../../assets/constants/blogs.constant';
import classes from './BlogDetails.module.scss';

const GameDetail = () => {
  const { id } = useParams();
  const content = BLOGS_DATA.find(item => item.id === parseInt(id));

  if (!content) return <div className={classes.notFound}>Content not found</div>;

  // Content renderers for different types
  const renderContent = () => {
    switch(content.category) {
      case 'reviews':
        return (
          <>
            <div className={classes.reviewScore}>
              <div className={classes.scoreCircle}>
                {content.meta.score}/10
              </div>
              <div className={classes.scoreVerdict}>
                {content.meta.score >= 9 ? 'Masterpiece' : 
                 content.meta.score >= 7 ? 'Recommended' : 'Mediocre'}
              </div>
            </div>
            
            {content.meta.pros && (
              <div className={classes.prosCons}>
                <div className={classes.pros}>
                  <h3>Pros</h3>
                  <ul>
                    {content.meta.pros.map((pro, i) => (
                      <li key={`pro-${i}`}>{pro}</li>
                    ))}
                  </ul>
                </div>
                {content.meta.cons && (
                  <div className={classes.cons}>
                    <h3>Cons</h3>
                    <ul>
                      {content.meta.cons.map((con, i) => (
                        <li key={`con-${i}`}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        );

      case 'updates':
        return (
          <>
            <div className={classes.updateMeta}>
              <div className={classes.metaItem}>
                <span className={classes.metaLabel}>Platforms:</span>
                <span>{content.meta.platforms.join(', ')}</span>
              </div>
              <div className={classes.metaItem}>
                <span className={classes.metaLabel}>Update Size:</span>
                <span>{content.meta.size}</span>
              </div>
              {content.meta.version && (
                <div className={classes.metaItem}>
                  <span className={classes.metaLabel}>Version:</span>
                  <span>v{content.meta.version}</span>
                </div>
              )}
            </div>
          </>
        );

      case 'industry':
        return (
          <div className={classes.industryHighlights}>
            {content.meta.dealValue && (
              <div className={classes.highlightCard}>
                <h3>Deal Value</h3>
                <p>{content.meta.dealValue}</p>
              </div>
            )}
            {content.meta.employees && (
              <div className={classes.highlightCard}>
                <h3>Employees Affected</h3>
                <p>{content.meta.employees}</p>
              </div>
            )}
          </div>
        );

      case 'hardware':
        return (
          <div className={classes.hardwareSpecs}>
            {Object.entries(content.meta).map(([key, value]) => (
              <div key={key} className={classes.specItem}>
                <span className={classes.specLabel}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</span>
                <span className={classes.specValue}>{value}</span>
              </div>
            ))}
          </div>
        );

      case 'esports':
        return (
          <div className={classes.tournamentInfo}>
            {content.meta.prize && (
              <div className={classes.infoCard}>
                <h3>Prize Pool</h3>
                <p>{content.meta.prize}</p>
              </div>
            )}
            {content.meta.dates && (
              <div className={classes.infoCard}>
                <h3>Dates</h3>
                <p>{content.meta.dates}</p>
              </div>
            )}
            {content.meta.teams && (
              <div className={classes.infoCard}>
                <h3>Featured Teams</h3>
                <div className={classes.teamList}>
                  {content.meta.teams.map((team, i) => (
                    <span key={i} className={classes.teamTag}>{team}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={classes.detailContainer}>
      {/* Hero Section */}
      <div className={classes.heroSection}>
        <div className={classes.heroImageWrapper}>
          <img src={content.image} alt={content.title} className={classes.heroImage} />
          <div className={classes.heroOverlay}>
            <div className={classes.categoryBadge}>
              {CATEGORIES.find(cat => cat.id === content.category)?.name}
            </div>
          </div>
        </div>
        
        <div className={classes.heroContent}>
          <h1>{content.title}</h1>
          <div className={classes.metaInfo}>
            <span className={classes.author}>By {content.author}</span>
            <span className={classes.date}>{content.date}</span>
            <span className={classes.readTime}>{Math.ceil(content.content.split(/\s+/).length / 200)} min read</span>
          </div>
        </div>
      </div>

      {/* Top Ad Banner */}
      <div className={classes.adBanner}>
        <div className={classes.adLabel}>Advertisement</div>
        <div className={classes.adContent}>Leaderboard (970x250)</div>
      </div>

      {/* Main Content */}
      <div className={classes.contentWrapper}>
        <main className={classes.mainContent}>
          {/* Category-specific content */}
          {renderContent()}

          {/* Article Content */}
          <div className={classes.articleContent}>
            {content.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className={classes.tagsSection}>
            <h3>Tags</h3>
            <div className={classes.tagsContainer}>
              {content.tags.map((tag, i) => (
                <span key={i} className={classes.tag}>#{tag}</span>
              ))}
            </div>
          </div>

          {/* Mid-content Ad */}
          <div className={classes.adRectangle}>
            <div className={classes.adLabel}>Advertisement</div>
            <div className={classes.adContent}>Rectangle (300x250)</div>
          </div>

          {/* Related Content */}
          <div className={classes.relatedSection}>
            <h2>More {CATEGORIES.find(cat => cat.id === content.category)?.name}</h2>
            <div className={classes.relatedGrid}>
              {BLOGS_DATA
                .filter(item => item.id !== content.id && item.category === content.category)
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className={classes.relatedCard}>
                    <Link to={`/blog/${item.id}`}>
                      <img src={item.image} alt={item.title} />
                      <h3>{item.title}</h3>
                      <span className={classes.relatedMeta}>
                        {item.date} · {Math.ceil(item.content.split(/\s+/).length / 200)} min read
                      </span>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className={classes.sidebar}>
          {/* About Author */}
          <div className={classes.authorCard}>
            <h3>About the Author</h3>
            <div className={classes.authorInfo}>
              <div className={classes.authorAvatar}>
                {content.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={classes.authorDetails}>
                <h4>{content.author}</h4>
                <p>Gaming journalist with 5+ years experience</p>
              </div>
            </div>
          </div>

          {/* Sidebar Ad */}
          <div className={classes.sidebarAd}>
            <div className={classes.adLabel}>Advertisement</div>
            <div className={classes.adContent}>Square (250x250)</div>
          </div>

          {/* Popular Posts */}
          <div className={classes.popularPosts}>
            <h3>Trending Now</h3>
            {BLOGS_DATA
              .filter(item => item.featured)
              .slice(0, 3)
              .map(item => (
                <div key={item.id} className={classes.popularPost}>
                  <Link to={`/blog/${item.id}`}>
                    <img src={item.image} alt={item.title} />
                    <div>
                      <h4>{item.title}</h4>
                      <span>{item.date}</span>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </aside>
      </div>

      {/* Newsletter */}
      <div className={classes.newsletterSection}>
        <div className={classes.newsletterContent}>
          <h2>Stay Updated</h2>
          <p>Get the latest gaming news delivered to your inbox weekly</p>
          <div className={classes.newsletterForm}>
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;