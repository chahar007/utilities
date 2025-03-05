import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import Conversion from './Tabs/Conversion';
import Compression from './Tabs/Compression';
import Base64 from './Tabs/Base64';
import Resizing from './Tabs/Resizing';
import HomeHelmet from './seo/HomeHelmet';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('conversion');

  const location = useLocation();

  useEffect(() => {
    // if(location)
    let path = location.pathname.split('/')[1];
    console.log('location', location, path)
    if(path) {
      if(path == 'image-resizer') {
        setActiveTab('resizing')
      } else if(path == 'image-compression') {
        setActiveTab('compression')
      } else if(path == 'image-optimisation') {
        setActiveTab('conversion')
      } else {
        setActiveTab('base 64');
      }
    }
  }, [location])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'conversion':
        return <Conversion />;
      case 'compression':
        return <Compression />;
      case 'resizing':
        return <Resizing />;
      case 'base 64 conversion':
        return <Base64 />;
      default:
        return null;
    }
  };

  return (
    
    <div className={styles.home}>
   
    <HomeHelmet />

      <main className={styles.main}>
        <div className={styles.tabContainer}>
          {['conversion', 'compression', 'resizing', 'base 64 conversion'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default Home;
