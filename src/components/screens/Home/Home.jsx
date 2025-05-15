import React, { useEffect, useState, useRef } from 'react';
import styles from './Home.module.scss';
import GameHubHelmet from '../seo/GameHubHelmet';
import { useLocation, useNavigate } from 'react-router-dom';
import FeaturedCard from './components/FeaturedCard';
import { GAME_SUMMARY, GAMING_CATEGORY, LATEST_NEWS } from '../../../assets/constants/app.constant';
import useIsMobile from '../../../config/hooks/useIsMobile';
import MultipleFlexAd from '../../shared/GoogleAds/MultipleFlexAd';
import AdBanner from '../../shared/GoogleAds/AdBanner';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [slides, setSlides] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [latestUpdated, setLatestUpdated] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobileScreen = useIsMobile();

  useEffect(() => {
    loadGameCards();
    loadLatestNews();
    loadTopGames();
    loadLatestUpdated();
  }, [location])

  const loadGameCards = () => {
    let category = GAMING_CATEGORY;
    let allCards = GAME_SUMMARY;

    let allCategoryCards = [];

    category.forEach((cat) => {
      let categoryCards = allCards.filter((game) => game.category.includes(cat));
      if (categoryCards.length > 0) {
        let cardObj = {
          title: cat,
          cards: categoryCards
        };
        allCategoryCards.push(cardObj);
      }
    });
    setCards(allCategoryCards);
    setSlides([...allCategoryCards[0]?.cards].slice(0, 5));
  }

  const loadLatestNews = () => {
    const newsData = LATEST_NEWS || [];
    setLatestNews(newsData.slice(0, 3));
  }

  const loadTopGames = () => {
    // Filter games with highest ratings or popularity
    const topGamesData = GAME_SUMMARY.filter(game => game.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    setTopGames(topGamesData);
  }

  const loadLatestUpdated = () => {
    // Filter games with recent update dates
    const latestUpdatedData = [...GAME_SUMMARY]
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 6);
    setLatestUpdated(latestUpdatedData);
  }

  const handleNewsClick = (newsItem) => {
    navigate(`/news/${newsItem.id}`);
  }

  const handleViewAllNews = () => {
    navigate('/news');
  }

  

  return (
    <div className={styles.home}>
      <GameHubHelmet />

      <div className={styles.homePageWrapper}>

        <section className={styles.featuredSection}>
          <FeaturedCard title={cards[1]?.title} cards={cards[1]?.cards || []} />
        </section>


        {/* Latest News Section */}
        {/* <section className={styles.latestNewsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Latest News & Updates</h2>
            <button
              className={styles.viewAllButton}
              onClick={handleViewAllNews}
            >
              View All
            </button>
          </div>
          <div className={styles.newsCardsContainer}>
            {latestNews?.map((newsItem) => (
              <div
                key={newsItem.id}
                className={styles.newsCard}
                onClick={() => handleNewsClick(newsItem)}
              >
                <div className={styles.newsImageContainer}>
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className={styles.newsImage}
                  />
                </div>
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{newsItem.title}</h3>
                  <p className={styles.newsExcerpt}>{newsItem.excerpt}</p>
                  <span className={styles.newsDate}>{newsItem.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* First Ad Banner - After 2 sections (News + Top Games) */}
        {/* <AdBanner id={1} /> */}

        {/* Display ads after every 2 category sections */}
        {cards?.length > 0 &&
          cards?.map((card, index) => (
            index !== 1 && (
              <React.Fragment key={index}>
                <section className={styles.featuredSection}>
                  <FeaturedCard title={card.title} cards={card.cards} />
                </section>

                {/* Show ad after every 2 sections */}
                {/* {(index) % 2 === 0 && (
                  // <MultipleFlexAd
                  //   client="ca-pub-3758217602745916"
                  //   slot="4265384347"
                  //   format="auto"
                  // />
                  <AdBanner id={(index*0.22)} />
                )} */}


              </React.Fragment>
            )
          ))}
      </div>
    </div>
  );
};

export default Home;