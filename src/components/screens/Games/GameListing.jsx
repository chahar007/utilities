import styles from './styles/Games.module.scss';
import { GAMES_LIST } from '../../../assets/constants/games.constant';
import { useNavigate } from 'react-router-dom';
import MultipleFlexAd from '../../shared/GoogleAds/MultipleFlexAd';
import AdBanner from '../../shared/GoogleAds/AdBanner';
const AllGamesListing = () => {
  const navigate = useNavigate();

  const handleNavigation = (slug) => {
    navigate(`/games/${slug}`)
  }

  const handleImageError = (e, title) => {
    const parent = e.target.parentElement;
    const fallback = document.createElement('div');
    fallback.className = styles.fallbackTitle;
    fallback.textContent = title;
    parent.replaceChild(fallback, e.target);
  };
  
  return (
    <div className={styles.gamesContainer}>
      <div className={styles.gamesContainerWrapper}>
        <iframe
          src='https://brain.gameplay.in.net?utm_source=mobile&utm_medium=web&utm_campaign=brain_games'
          frameBorder={0} 
          title='Brain Games'
          className={styles.iframeGame}
        ></iframe>


        {/* <h2 className={styles.sectionTitle}>All Games</h2>
        {Object.entries(GAMES_LIST).map(([category, games], categoryIndex) => (
          <div key={categoryIndex}>
            <div className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <div className={styles.gamesGrid}>
                {games.map((game) => (
                  <div key={game.id} className={styles.gameCard}>
                    <div className={styles.imageContainer}>
                      <img
                        src={game.image}
                        alt={game.title}
                        className={styles.gameImage}
                        onError={(e) => handleImageError(e, game.title)}
                      />
                    </div>
                    <div className={styles.gameContent}>
                      <h3 className={styles.gameTitle}>{game.title}</h3>
                      <a onClick={() => handleNavigation(game.slug)} className={styles.playButton}>
                        Play Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            {/* {(categoryIndex) % 2 === 0 && (
              // <MultipleFlexAd
              //   client="ca-pub-3758217602745916"
              //   slot="4265384347"
              //   format="auto"
              // />
              <AdBanner id={(categoryIndex*0.332)} />

            )} */}
          {/* </div>
        ))} */}
      </div>
    </div>
  );
};

export default AllGamesListing;