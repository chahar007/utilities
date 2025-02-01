import React from 'react';
import styles from './styles/FeaturedCard.module.scss';
import { useNavigate } from 'react-router-dom';

const FeaturedCard = ({title, cards}) => {

  const navigate = useNavigate();


  const handleNavigation = (slug) => {
    navigate(`/game-detail/${slug}`);
  }
  

  return (
    <div className={styles.topPics}>
      <h2>{title}</h2>
      <div className={styles.topPicsWrapper}>
        {cards.map((item, index) => (
          <div key={index} className={styles.topPicsCard} onClick={() => handleNavigation(item.slug)} >
            <img src={item.bannerImage} alt={item.title} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item?.description?.slice(0, 100)}</p>  
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
