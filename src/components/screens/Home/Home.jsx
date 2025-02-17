import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import GameHubHelmet from '../seo/GameHubHelmet';
import { useLocation } from 'react-router-dom';
import HomeCarousel from '../Carousel/HomeCarousel';
import LatestNews from './components/LatestNews';
import FeaturedCard from './components/FeaturedCard';
import { GAME_SUMMARY, GAMING_CATEGORY } from '../../../assets/constants/app.constant';
import useIsMobile from '../../../config/hooks/useIsMobile';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [slides, setSlides] = useState([]);
  const location = useLocation();
  const isMobileScreen = useIsMobile();

  useEffect(() => {
    loadGameCards();
  }, [location])

  const loadGameCards = () => {
    let category = GAMING_CATEGORY;
    let allCards = GAME_SUMMARY;

    let allCategoryCards = [];

    // Loop through each category
    category.forEach((cat) => {
      // Filter games that match the current category
      let categoryCards = allCards.filter((game) => game.category.includes(cat));

      // Create an object for each category with a title and matching cards
      if (categoryCards.length > 0) {
        let cardObj = {
          title: cat,
          cards: categoryCards
        };
        allCategoryCards.push(cardObj); // Push the card object to the result array
      }
    });
    setCards(allCategoryCards);
    setSlides([...allCategoryCards[0]?.cards].slice(0, 5));
  }

  return (

    <div className={styles.home}>
      <GameHubHelmet />

      <div className={styles.homePageWrapper} >
        {/* Top Section with Carousel */}
        <section className={styles.topSection}>
          <div className={`${styles.homeCaousel}  ${isMobileScreen && styles.mobileScreen} `} >
            <HomeCarousel slides={slides} />
          </div>
          {
            !isMobileScreen && (
              <div className={styles.topPics} >
                <LatestNews />
              </div>
            )
          }
        </section>

        {/* Rows Section */}
        <section className={styles.featuredSections}>
          {cards.length > 0 && cards.map((card, index) => (
            <div className={styles.row} key={index} >
              <FeaturedCard title={card.title} cards={card.cards} />
            </div>
          ))}


        </section>
      </div>

    </div>
  );
};

export default Home;
