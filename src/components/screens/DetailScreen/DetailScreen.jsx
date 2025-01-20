import React from 'react';
import styles from './DetailScreen.module.scss';

const DetailedScreen = () => {
  // Static Data for the DetailedScreen
  const [showTrailer, setShowTrailer] = React.useState(false);

  const game = {
    title: 'Cyberpunk 2077',
    subtitle: 'The Future of RPGs',
    bannerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    description: 'Cyberpunk 2077 is an open-world RPG set in the dystopian Night City. As a mercenary, players will take on a journey of hacking, combat, and uncovering hidden truths in the futuristic world.',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate: 'December 10, 2020',
    images: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_1.jpg',
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_2.jpg',
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_3.jpg'
    ],
    reviews: [
      { text: 'Amazing game with a great story!', rating: 5 },
      { text: 'Good game, but some bugs need to be fixed.', rating: 3.5 },
      { text: 'An immersive world, but it needs optimization.', rating: 4 }
    ],
    systemRequirements: {
      minimum: [
        'OS: Windows 7 or 10 (64-bit)',
        'Processor: Intel Core i5-3570K or AMD Ryzen 3 2300X',
        'Memory: 8 GB RAM',
        'Graphics: Nvidia GTX 780 3GB or AMD Radeon RX 470 4GB',
        'Storage: 70 GB available space'
      ],
      recommended: [
        'OS: Windows 10 (64-bit)',
        'Processor: Intel Core i7-4790 or AMD Ryzen 3 3200G',
        'Memory: 12 GB RAM',
        'Graphics: Nvidia GTX 1060 6GB or AMD Radeon RX 590',
        'Storage: 70 GB available space'
      ]
    },
    relatedGames: [
      { title: 'Watch Dogs: Legion', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/978800/header.jpg' },
      { title: 'Deus Ex: Mankind Divided', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/337000/header.jpg' },
      { title: 'The Witcher 3: Wild Hunt', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg' }
    ]
  };

  // Header Section
  const Header = () => (
    <div className={styles.header}>
      <div className={styles.headerImage} style={{ backgroundImage: `url(${game.bannerImage})` }} />
      <div className={styles.headerDetails}>
        <h1>{game.title}</h1>
        <p className={styles.subtitle}>{game.subtitle}</p>
        <p>{game.description}</p>
        <div className={styles.gameInfo}>
          <div><strong>Developer: </strong>{game.developer}</div>
          <div><strong>Publisher: </strong>{game.publisher}</div>
          <div><strong>Release Date: </strong>{game.releaseDate}</div>
          <button className={styles.watchTrailerButton} onClick={() => setShowTrailer(true)}>
            Watch Trailer
          </button>
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

  const TrailerModal = () => (
    showTrailer && (
      <div className={styles.trailerModal}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={() => setShowTrailer(false)}>×</button>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/qIcTM8WXFjk"
            title="Cyberpunk 2077 Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    )
  );

  return (
    <div className={styles.detailedScreen}>
      <Header />
     
     {/* trailer modal */}
      <TrailerModal/>

      
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
              <ul>
              <strong>Minimum:</strong>
                {game.systemRequirements.minimum.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <ul>
              <strong>Recommended:</strong>
                {game.systemRequirements.recommended.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
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
              <div key={index} className={styles.relatedGameCard}>
                <img src={relatedGame.image} alt={relatedGame.title} />
                <p>{relatedGame.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DetailedScreen;
