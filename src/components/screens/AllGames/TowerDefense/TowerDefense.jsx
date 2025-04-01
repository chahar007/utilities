import { useState } from 'react';
import styles from './TowerDefense.module.scss';

const TowerDefense = () => {
  const [score, setScore] = useState(0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tower Defense</h1>
      
      <div className={styles.gameArea}>
        <p>Tower Defense game will be implemented here</p>
        <p>Score: {score}</p>
        
        {/* Basic game template - customize as needed */}
        <button 
          onClick={() => setScore(score + 1)}
          style={{ marginTop: '1rem' }}
        >
          Increment Score
        </button>
      </div>
    </div>
  );
};

export default TowerDefense;