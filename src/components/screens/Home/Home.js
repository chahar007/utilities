import React from 'react';
import styles from './Home.module.scss';
import HomeHelmet from '../seo/HomeHelmet';
import { useNavigate } from 'react-router-dom';
import ToolCard from '../../shared/ToolCard/ToolCard';
import useSearch from '../../../hooks/useSearch';
import { 
  POPULAR_IMAGE_CONVERSIONS, 
  POPULAR_PDF_CONVERSIONS,
  ALL_TOOLS_DATA 
} from '../../../assets/constants/tools.constant';

const Home = () => {
  const navigate = useNavigate();

  console.log('Home component rendered');

  // No longer needed - search functionality moved to global comprehensive search

  // Global search that filters through ALL available tools
  const allAvailableTools = ALL_TOOLS_DATA.flatMap(category => category.conversions);
  const {
    searchTerm: globalSearchTerm,
    setSearchTerm: setGlobalSearchTerm,
    filteredData: globalFilteredTools,
    clearSearch: clearGlobalSearch
  } = useSearch(allAvailableTools);

  const handleToolClick = (route) => {
    console.log('Navigating to:', route);
    navigate(route);
  };

  const handleGlobalSearch = (e) => {
    const term = e.target.value;
    setGlobalSearchTerm(term);
  };

  return (
    <div className={styles.home}>
      <HomeHelmet />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Professional Image & PDF Tools
          </h1>
          <p className={styles.heroSubtitle}>
            Simple, fast, and secure processing for all your document and image needs
          </p>
          <div className={styles.heroSearch}>
            <input 
              type="text" 
              placeholder="Search for tools..." 
              className={styles.searchInputHome}
              value={globalSearchTerm}
              onChange={handleGlobalSearch}
            />
            <button className={styles.searchButton} onClick={clearGlobalSearch}>
              <i className={globalSearchTerm ? "fas fa-times" : "fas fa-search"}></i>
            </button>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className={styles.toolCategories}>
        
        {/* Show search results when searching */}
        {globalSearchTerm && (
          <>
            {globalFilteredTools.length === 0 ? (
              <div className={styles.noResults}>
                <h3>No tools found</h3>
                <p>Try searching with different keywords or explore popular searches below:</p>
                
                <div className={styles.popularSearches}>
                  <button onClick={() => setGlobalSearchTerm('PDF')} className={styles.searchTag}>PDF</button>
                  <button onClick={() => setGlobalSearchTerm('convert')} className={styles.searchTag}>Convert</button>
                  <button onClick={() => setGlobalSearchTerm('compress')} className={styles.searchTag}>Compress</button>
                  <button onClick={() => setGlobalSearchTerm('resize')} className={styles.searchTag}>Resize</button>
                  <button onClick={() => setGlobalSearchTerm('merge')} className={styles.searchTag}>Merge</button>
                </div>
                
                <button onClick={clearGlobalSearch} className={styles.clearButton}>
                  Clear Search
                </button>
              </div>
            ) : (
              <div className={styles.searchResults}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryTitle}>
                    <h2>Search Results</h2>
                    <p>Found {globalFilteredTools.length} tools matching "{globalSearchTerm}"</p>
                  </div>
                  <button className={styles.categoryCTA} onClick={clearGlobalSearch}>
                    Clear Search <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className={styles.toolsGrid}>
                  {globalFilteredTools.map((tool) => (
                    <ToolCard 
                      key={tool.id}
                      tool={tool}
                      onClick={handleToolClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Image Tools Section - Only show when not searching */}
        {!globalSearchTerm && (
          <>
            <div className={styles.categoryHeader}>
          <div className={styles.categoryTitle}>
            <h2>Popular Image Conversions</h2>
            <p>Most used image format conversions and optimizations</p>
          </div>
          <button 
            className={styles.categoryCTA}
            onClick={() => navigate('/all-tools')}
          >
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div className={styles.toolsGrid}>
          {POPULAR_IMAGE_CONVERSIONS.map((tool) => (
            <ToolCard 
              key={tool.id}
              tool={tool}
              onClick={handleToolClick}
            />
          ))}
        </div>
          </>
        )}

        {/* PDF Tools Section - Only show when not searching */}
        {!globalSearchTerm && (
          <>
            <div className={styles.categoryHeader}>
          <div className={styles.categoryTitle}>
            <h2>Popular PDF Conversions</h2>
            <p>Most used PDF manipulation and conversion tools</p>
          </div>
          <button 
            className={styles.categoryCTA}
            onClick={() => navigate('/all-tools')}
          >
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div className={styles.toolsGrid}>
          {POPULAR_PDF_CONVERSIONS.map((tool) => (
            <ToolCard 
              key={tool.id}
              tool={tool}
              onClick={handleToolClick}
            />
          ))}
        </div>
          </>
        )}

      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose Our Platform?</h2>
            <p>Discover the advantages that make our tools the preferred choice for millions of users worldwide</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-gift"></i>
              </div>
              <h3>Completely Free to Use</h3>
              <p>Access all our professional-grade image and PDF tools without any cost. No subscriptions, registration, or hidden fees. We believe quality tools should be accessible to everyone, whether you're a student, professional, or business owner.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-mouse-pointer"></i>
              </div>
              <h3>Intuitive User Interface</h3>
              <p>Our tools are designed with simplicity in mind. Drag and drop your files, select your preferences, and get results instantly. No technical knowledge required - just upload, convert, and download in three simple steps.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Privacy & Security First</h3>
              <p>Your files never leave your device. All processing happens locally in your browser using advanced client-side technology. We don't store, access, or share your files. Your privacy and data security are our top priorities.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <h3>Instant Processing</h3>
              <p>Experience lightning-fast conversion speeds with our optimized algorithms. No waiting in queues or processing delays. Our browser-based technology ensures immediate results for files of all sizes.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-devices"></i>
              </div>
              <h3>Universal Compatibility</h3>
              <p>Works seamlessly across all devices and operating systems. Whether you're on Windows, Mac, iOS, or Android, access our tools from any modern browser. Perfect for teams working across different platforms.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <i className="fas fa-expand-arrows-alt"></i>
              </div>
              <h3>No File Size Limits</h3>
              <p>Process files of any size without restrictions. Handle large documents, high-resolution images, and batch conversions with ease. Our tools are optimized to work efficiently with both small files and enterprise-level documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.howItWorksContainer}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Simple 3-step process to get your files converted</p>
          </div>
          
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Upload Your Files</h3>
                <p>Drag and drop your files or click to browse and select them from your device.</p>
                <div className={styles.stepIcon}>
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Choose Your Settings</h3>
                <p>Select output format, quality, size, or other options based on your specific needs.</p>
                <div className={styles.stepIcon}>
                  <i className="fas fa-cogs"></i>
                </div>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Download Results</h3>
                <p>Process your files instantly and download the converted results to your device.</p>
                <div className={styles.stepIcon}>
                  <i className="fas fa-download"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.sectionHeader}>
            <h2>Trusted by Users Worldwide</h2>
            <p>Join millions who trust our tools for their daily file processing needs</p>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>50M+</div>
              <div className={styles.statLabel}>Files Processed</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statNumber}>2M+</div>
              <div className={styles.statLabel}>Happy Users</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statNumber}>25+</div>
              <div className={styles.statLabel}>Available Tools</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2>Ready to Get Started?</h2>
          <p>Try our professional-grade tools for free. No registration required!</p>
          <button 
            className={styles.ctaButton}
            onClick={() => navigate('/all-tools')}
          >
            Explore All Tools <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
