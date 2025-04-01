import { useState } from 'react';
import styles from './Reversi.module.scss';

const Reversi = () => {
  const [score, setScore] = useState(0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reversi (Othello)</h1>
      
      <div className={styles.gameArea}>
        <p>Reversi (Othello) game will be implemented here</p>
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

export default Reversi;