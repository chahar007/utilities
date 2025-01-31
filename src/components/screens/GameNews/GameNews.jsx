import React from 'react';
import styles from './GameNews.module.scss';

const GameNews = () => {
  // Dummy data for new game releases or version updates
  const newsItems = [
    {
      title: 'New Game "Cyber Odyssey" Released!',
      description: 'The much-awaited cyberpunk RPG is out now! Explore a futuristic city filled with danger, mystery, and high-tech gadgets.',
      link: '#'
    },
    {
      title: 'Version 2.0 Update for "Battle Arena"',
      description: 'The Battle Arena game just received a huge update with new maps, characters, and abilities! Check out the patch notes for full details.',
      link: '#'
    },
    {
      title: 'Join the "Virtual Reality League" Beta!',
      description: 'Sign up for the VR League beta and experience the next level of competitive gaming in a fully immersive virtual world.',
      link: '#'
    }
  ];

  return (
    <div className={styles['game-news-container']}>
      <h2 className={styles['news-header']}>Latest Game News</h2>
      
      {newsItems.map((item, index) => (
        <div className={styles['news-item']} key={index}>
          <h3 className={styles['news-item-title']}>{item.title}</h3>
          <p className={styles['news-item-description']}>{item.description}</p>
          <a href={item.link} className={styles['read-more']}>Read more</a>
        </div>
      ))}

      <div className={styles['news-footer']}>
        &copy; 2025 Gaming Universe | All Rights Reserved
      </div>
    </div>
  );
};

export default GameNews;
