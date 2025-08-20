import React from 'react';
import styles from './AllTools.module.scss';
import { useNavigate } from 'react-router-dom';
import ToolCard from '../../shared/ToolCard/ToolCard';
import useSearch from '../../../hooks/useSearch';
import { ALL_TOOLS_DATA } from '../../../assets/constants/tools.constant';

const AllTools = () => {
  const navigate = useNavigate();

  // Search functionality
  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredCategories,
    clearSearch,
    hasResults
  } = useSearch(ALL_TOOLS_DATA, ['title', 'description']);

  const handleToolClick = (route) => {
    navigate(route);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    clearSearch();
  };

  return (
    <div className={styles.allTools}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>All Available Tools</h1>
          <p>Complete list of all image and PDF conversion tools</p>
          <div className={styles.heroSearch}>
            <input 
              type="text" 
              placeholder="Search for tools..." 
              className={styles.searchInputAllTools}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className={styles.searchButton} onClick={handleSearchClear}>
              <i className={searchTerm ? "fas fa-times" : "fas fa-search"}></i>
            </button>
          </div>
        </div>
      </section>



      {/* Tools by Category */}
      <section className={styles.toolsSection}>
        {searchTerm && !hasResults && (
          <div className={styles.noResults}>
            <h3>No tools found</h3>
            <p>Try searching with different keywords or <button onClick={handleSearchClear} className={styles.clearButton}>clear your search</button></p>
          </div>
        )}
        
        {filteredCategories.map((category) => (
          <div key={category.category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <h2>{category.category}</h2>
              <p>{category.description} • {category.conversions.length} tools {searchTerm ? 'found' : 'available'}</p>
            </div>
            
            <div className={styles.toolsGrid}>
              {category.conversions.map((tool) => (
                <ToolCard 
                  key={tool.id}
                  tool={tool}
                  onClick={handleToolClick}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AllTools;
