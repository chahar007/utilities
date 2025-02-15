import styles from './styles/Games.module.scss';
import { GAMES_LIST, FALLBACK_IMAGE } from '../../../assets/constants/games.constant';
import { useNavigate } from 'react-router-dom';

const AllGamesListing = () => {

  const navigate = useNavigate();

  const handleNavigation = (slug) => {
    navigate(`/games/${slug}`)
  }
  
  return (
    <div className={styles.gamesContainer}>
      <h2 className={styles.sectionTitle}>All Games</h2>
      {Object.entries(GAMES_LIST).map(([category, games], categoryIndex) => (
        <div key={categoryIndex} className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>{category}</h3>
          <div className={styles.gamesGrid}>
            {games.map((game) => (
              <div key={game.id} className={styles.gameCard}>
                <img
                  src={game.image}
                  alt={game.title}
                  className={styles.gameImage}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                />
                <div className={styles.gameContent}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <a onClick={() =>handleNavigation(game.slug)} className={styles.playButton}>
                    Play Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllGamesListing;
