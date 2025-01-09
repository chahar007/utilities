import React, { useState } from 'react';
import styles from './Home.module.scss';
import Conversion from './Tabs/Conversion';
import Compression from './Tabs/Compression';
import Resizing from './Tabs/Resizing';

const Home = () => {
  const [activeTab, setActiveTab] = useState('conversion');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'conversion':
        return <Conversion />;
      case 'compression':
        return <Compression />;
      case 'resizing':
        return <Resizing />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.home}>
      <main className={styles.main}>
        <div className={styles.tabContainer}>
          {['conversion', 'compression', 'resizing'].map((tab) => (
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
