import React, { useEffect, useState } from 'react';
import styles from './DetailScreen.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { GAME_DETAILS } from '../../../assets/constants/app.constant';
const DetailedScreen = () => {
  // Static Data for the DetailedScreen
  const [showTrailer, setShowTrailer] = React.useState(false);
  const [game, setGame] = useState({});
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let _game = GAME_DETAILS[slug] || GAME_DETAILS['the-witcher-3-wild-hunt'];
    console.log("game", _game, slug);
    setGame(_game);

  }, [])


  const Header = () => (
    <div className={styles.header}>
    
        <div className={styles.headerImage}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/qIcTM8WXFjk?autoplay=1&mute=1`}
            title="Cyberpunk 2077 Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
    
      <div className={styles.headerDetails}>
        <h1>{game.title}</h1>
        <p className={styles.subtitle}>{game.subtitle}</p>
        <div className={styles.gameInfo}>
          <div><strong>Developer: </strong>{game.developer}</div>
          <div><strong>Publisher: </strong>{game.publisher}</div>
          <div><strong>Release Date: </strong>{game.releaseDate}</div>
          {/* <button
            className={styles.watchTrailerButton}
            onClick={() => setShowTrailer(true)}
          >
            Watch Trailer
          </button> */}
        </div>
      </div>
    </div>
  );
  

  // Game Details Card Section
  const GameCard = ({ title, content, extraClass }) => (
    <div className={`${styles.gameCard} ${extraClass}`}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );

  

  const handleGameRedirection = (slug) => {
    // navigate(`/game-detail/${slug}`);
    let _route = window.location.origin + '/game-detail/' +slug;
    window.open(_route, '_self');
  }

  return (
    <div className={styles.detailedScreen}>
      {(game?.description || game?.title) && (
        <>
          <Header />
          <div className={styles.mainContent}>
            {/* Game Details Card */}
            <GameCard
              title="About Game"
              content={game.description}
              extraClass={styles.gameDetailsCard}
            />

            {/* System Requirements */}
            <GameCard
              title="System Requirements"
              content={
                <>
                  <div className={styles.systemRequirement} >
                    {
                      game?.systemRequirements?.minimum.length > 0 && (

                        <ul>
                      <strong>Minimum:</strong>
                      {game?.systemRequirements?.minimum?.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                    )
                  }
                    {
                      game?.systemRequirements?.recommended?.length > 0 && (

                        <ul>
                      <strong>Recommended:</strong>
                      {game?.systemRequirements?.recommended?.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                    )
                  }
                  </div>

                </>
              }
              extraClass={styles.systemRequirementsCard}
            />
            {/* Related Games Section */}
            <section className={styles.relatedGames}>
              <h2>Related Games</h2>
              <div className={styles.relatedGamesList}>
                {game.relatedGames.map((relatedGame, index) => (
                  <div key={index} className={styles.relatedGameCard} onClick={() => handleGameRedirection(relatedGame?.slug)}  >
                    <img src={relatedGame.image} alt={relatedGame.title} />
                    <p>{relatedGame.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>

      )}

    </div>
  );
};

export default DetailedScreen;
