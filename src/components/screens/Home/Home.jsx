import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import HomeHelmet from '../seo/HomeHelmet';
import { useLocation } from 'react-router-dom';
import HomeCarousel from '../Carousel/HomeCarousel';
import LatestNews from './components/LatestNews';
import FeaturedCard from './components/FeaturedCard';

const Home = () => {
  const [activeTab, setActiveTab] = useState('conversion');

  const location = useLocation();

  useEffect(() => {

  }, [location])


  return (

    <div className={styles.home}>
      <HomeHelmet />

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
          {/* First Row */}
          <div className={styles.row}>
            <FeaturedCard title={'Featured Games'} />
          </div>

          <div className={styles.row}>
            <FeaturedCard title={'Top Games'} />
          </div>
        </section>
      </div>

    </div>
  );
};

export default Home;
