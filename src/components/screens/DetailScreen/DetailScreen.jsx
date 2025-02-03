import React, { useEffect, useState, useLayoutEffect} from 'react';
import styles from './DetailScreen.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { GAME_DETAILS } from '../../../assets/constants/app.constant';
import GameHubHelmet from '../seo/GameHubHelmet';
import useIsMobile from '../../../config/hooks/useIsMobile';

const DetailedScreen = () => {
  // Static Data for the DetailedScreen
  const isMobile = useIsMobile();
  const [game, setGame] = useState({});
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isYouTubeError, setIsYouTubeError] = useState(false);

  useEffect(() => {
    let _game = GAME_DETAILS[slug] || GAME_DETAILS['the-witcher-3-wild-hunt'];
    setGame(_game);
  }, [slug]);


  useLayoutEffect(() => {
    const container = document.querySelector(`.${styles.detailedScreen}`);
  
    if (container) {
      setTimeout(() => {
        window.scrollY = 0;
      }, 1000); 
    }
  }, [slug, game]);
  

  const GameHeader = () => (
    <div className={styles.header}>

      <div className={`${styles.headerImage}  ${!isMobile && styles.isDesktopView} `}>
       {!isYouTubeError && game?.youtubeTrailerLink ? (
        <iframe
          width="100%"
          height="100%"
          src={`${game?.youtubeTrailerLink.youtubeLink}?rel=0&autoplay=1&mute=1`} // `rel=0` disables suggested videos
          title={`${game.title} Trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setIsYouTubeError(true)} // Fallback to image on error
        ></iframe>
      ) : (
        <img
          src={game?.bannerImage} // Provide a fallback image URL in the `game` object
          alt={`${game.title} Poster`}
          className={styles.fallbackImage}
        />
      )}
        <div className={`${styles.headerDetails}`}  >
          <h1>{game.title}</h1>
          <p className={styles.subtitle}>{game.subtitle}</p>
          <div className={styles.gameInfo}>
            <div><strong>Developer: </strong>{game.developer}</div>
            <div><strong>Publisher: </strong>{game.publisher}</div>
            <div><strong>Release Date: </strong>{game.releaseDate}</div>
          </div>
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
    navigate(`/game-detail/${slug}`);
  }

  return (
    <div className={styles.detailedScreen}>

      <GameHubHelmet game={game} slug={slug} />
      {(game?.description || game?.title) && (
        <>
          <GameHeader />
          
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
                    <h4>{relatedGame.title}</h4>
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
