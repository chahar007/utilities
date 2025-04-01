import { useState } from 'react';
import styles from './RockPaperScissors.module.scss';
import VerticalSideAd from '../../../shared/GoogleAds/VerticalSideAd';

const choices = [
  { id: 'rock', emoji: '✊', color: '#dc685a', winAgainst: 'scissors' },
  { id: 'paper', emoji: '✋', color: '#4863d6', winAgainst: 'rock' },
  { id: 'scissors', emoji: '✌️', color: '#eca72f', winAgainst: 'paper' }
];

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePlay = (choice) => {
    setIsAnimating(true);
    setUserChoice(choice);
    
    setTimeout(() => {
      const computer = choices[Math.floor(Math.random() * 3)];
      setComputerChoice(computer);
      
      setTimeout(() => {
        if (choice.id === computer.id) {
          setResult("Tie Game!");
        } else if (choice.winAgainst === computer.id) {
          setResult("You Win!");
          setScore(score + 1);
        } else {
          setResult("You Lose!");
        }
        setIsAnimating(false);
      }, 500);
    }, 800);
  };

  return (
    <div className={styles.layout}>
      {/* Left Ad Banner - Desktop Only */}
      <div className={styles.adContainerLeft}>
       <VerticalSideAd id={151} />
      </div>

      {/* Main Game Content */}
      <div className={styles.gameContainer}>
        <div className={styles.header}>
          <h1>Rock Paper Scissors</h1>
          <div className={styles.score}>
            <span>Score:</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
        </div>
        
        <div className={styles.gameArea}>
          <div className={styles.choiceSection}>
            <h3>Your Choice</h3>
            <div className={styles.choiceDisplay}>
              {userChoice ? (
                <div 
                  className={`${styles.choice} ${styles.userChoice}`}
                  style={{ backgroundColor: userChoice.color }}
                >
                  {userChoice.emoji}
                </div>
              ) : (
                <div className={styles.choicePlaceholder}>?</div>
              )}
            </div>
          </div>
          
          <div className={styles.vs}>
            <span>VS</span>
          </div>
          
          <div className={styles.choiceSection}>
            <h3>Computer</h3>
            <div className={styles.choiceDisplay}>
              {computerChoice ? (
                <div 
                  className={`${styles.choice} ${styles.computerChoice}`}
                  style={{ backgroundColor: computerChoice.color }}
                >
                  {computerChoice.emoji}
                </div>
              ) : isAnimating ? (
                <div className={styles.thinking}>🤔</div>
              ) : (
                <div className={styles.choicePlaceholder}>?</div>
              )}
            </div>
          </div>
        </div>
        
        {result && (
          <div className={`${styles.result} ${
            result.includes('Win') ? styles.win : 
            result.includes('Lose') ? styles.lose : 
            styles.tie
          }`}>
            {result}
          </div>
        )}
        
        <div className={styles.choices}>
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => !isAnimating && handlePlay(choice)}
              disabled={isAnimating}
              className={styles.choiceBtn}
              style={{ backgroundColor: choice.color }}
            >
              {choice.emoji}
              <span>{choice.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Ad Banner - Desktop Only */}
      <div className={styles.adContainerRight}>
        <VerticalSideAd id={152} />
      </div>

    </div>
  );
}