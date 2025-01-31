import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import GameHubHelmet from '../seo/GameHubHelmet';
import { useLocation } from 'react-router-dom';
import HomeCarousel from '../Carousel/HomeCarousel';
import LatestNews from './components/LatestNews';
import FeaturedCard from './components/FeaturedCard';
import {GAME_SUMMARY, GAMING_CATEGORY } from  '../../../assets/constants/app.constant';  

const Home = () => {
  const [cards, setCards] = useState([]);
  const location = useLocation();

  useEffect(() => {
    loadGameCards();
  }, [location])

  const loadGameCards = () => {
    let category  = GAMING_CATEGORY;
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
  
    console.log(allCategoryCards); // View the final result
    setCards(allCategoryCards);
  } 


  return (

    <div className={styles.home}>
      <GameHubHelmet />

      <div className={styles.homePageWrapper} >
        {/* Top Section with Carousel */}
        <section className={styles.topSection}>
          <div className={styles.homeCaousel} >
            <HomeCarousel />
          </div>
          <div className={styles.topPics} >
            <LatestNews />
          </div>
        </section>

        {/* Rows Section */}
        <section className={styles.featuredSections}>
          {cards.length > 0 && cards.map((card, index) =>(
            <div className={styles.row} key={index} >
              <FeaturedCard title={card.title} cards={card.cards}  />
            </div>
          ))}

        
        </section>
      </div>

    </div>
  );
};

export default Home;
