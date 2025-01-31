// src/components/Header.js
import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss'; // Import the CSS for the header
import { useNavigate } from 'react-router-dom';
import { imageMappings } from '../../../assets/images/ImageKeyMapping';
import { GAME_SUMMARY } from '../../../assets/constants/app.constant';

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const handleNavigation = (slug = '/') => {
    setSearchOpen(false);
    navigate(slug);
  };

  const handleSearchSubmit = () => {
    // Assuming GAME_DETAILS is an object, and we need to filter over the values of the object
    const results = GAME_SUMMARY.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log("resulst",)
    setSearchResults(results);
  };
  


  useEffect(() => {
    if(searchQuery) {
      handleSearchSubmit();
    }
  }, [searchQuery])

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <i className="fas fa-image"></i>
        <span onClick={() => handleNavigation('/')}>Gamers Zone</span>
      </div>
      <nav>
        <img
          src={imageMappings.searchIcon}
          alt="search"
          width={25}
          height={25}
          className={styles.searchIcon}
          onClick={() => setSearchOpen(true)}
        />
        <a onClick={() => handleNavigation('/about-us')}>About Us</a>
        <a>Help</a>
      </nav>
      {searchOpen && (
        <div className={styles.searchPopup}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* <button onClick={handleSearchSubmit} className={styles.searchButton}>
              <img
                src={imageMappings.searchIcon}
                alt="search"
                width={20}
                height={20}
              />
            </button> */}
            <button
              className={styles.closeButton}
              onClick={() => setSearchOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className={styles.searchResults}>
            {searchResults.map((result) => (
              <div
                key={result.id}
                className={styles.searchItem}
                onClick={() => handleNavigation(`/game-detail/${result.slug}`)}
              >
                {result.title}
              </div>
            ))}
            {searchResults.length === 0 && searchQuery && (
              <div className={styles.noResults}>No Result Found ...</div>
            )}

          {searchResults.length === 0 && !searchQuery && (
              <div className={styles.noResults}>Search your query ...</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
