import React from 'react';
import styles from './styles/LatestNews.module.scss';

const TopPics = () => {
  const news = [
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
      title: 'Fortnite Chapter 4 Launches',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1942650/header.jpg',
      title: 'Elden Ring DLC Announced: Shadow of the Erdtree',
    },
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
      title: 'Cyberpunk 2077: Phantom Liberty Expansion Released',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
      title: 'Starfield Becomes Bethesda’s Biggest Hit',
    },
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
      title: 'Cyberpunk 2077: Phantom Liberty Expansion Released',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
      title: 'Starfield Becomes Bethesda’s Biggest Hit',
    },
  ];

  return (
    <div className={styles.topPics}>
      {news.map((item, index) => (
        <div key={index} className={styles.topPicsCard}>
          <img src={item.image} alt={item.title} className={styles.cardImage} />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>{item.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopPics;
