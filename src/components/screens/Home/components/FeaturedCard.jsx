import React from 'react';
import styles from './styles/FeaturedCard.module.scss';
import { useNavigate } from 'react-router-dom';

const FeaturedCard = ({title}) => {

  const navigate = useNavigate();


  const handleNavigation = () => {
    navigate('/game-detail');
  }
  
  const news = [
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
      title: 'Fortnite Chapter 4 Launches',
      description:
        'Epic Games has unveiled Chapter 4 of Fortnite, featuring a new map, skins, and game mechanics.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1942650/header.jpg',
      title: 'Elden Ring DLC Announced',
      description:
        'FromSoftware has announced "Shadow of the Erdtree," an expansion for the critically acclaimed Elden Ring.',
    },
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
      title: 'Cyberpunk 2077: Phantom Liberty',
      description:
        'CD Projekt Red has released the highly anticipated "Phantom Liberty" expansion for Cyberpunk 2077.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg',
      title: 'Terraria Update 1.4.5',
      description:
        'Re-Logic has announced the final update for Terraria, bringing new content and quality-of-life improvements.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
      title: 'Starfield Becomes Bethesda’s Biggest Hit',
      description:
        'Bethesda’s Starfield has broken records with millions of active players exploring the vast universe.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg',
      title: 'Terraria Update 1.4.5',
      description:
        'Re-Logic has announced the final update for Terraria, bringing new content and quality-of-life improvements.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
      title: 'Starfield Becomes Bethesda’s Biggest Hit',
      description:
        'Bethesda’s Starfield has broken records with millions of active players exploring the vast universe.',
    },
  ];

  return (
    <div className={styles.topPics}>
      <h2>{title}</h2>
      <div className={styles.topPicsWrapper}>
        {news.map((item, index) => (
          <div key={index} className={styles.topPicsCard} onClick={handleNavigation} >
            <img src={item.image} alt={item.title} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
              <a href={item.link} className={styles.readMore}>
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default FeaturedCard;
