import { useState } from 'react';
import styles from './Chess.module.scss';

const Chess = () => {
  const [score, setScore] = useState(0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chess</h1>
      
      <div className={styles.gameArea}>
        <p>Chess game will be implemented here</p>
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

export default Chess;