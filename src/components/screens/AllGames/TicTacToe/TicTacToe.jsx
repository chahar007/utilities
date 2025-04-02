import React, { useState, useEffect } from 'react';
import styles from './TicTacToe.module.scss';
import VerticalSideAd from '../../../shared/GoogleAds/VerticalSideAd';

const TicTacToe = () => {
  // Game states
  const [gamePhase, setGamePhase] = useState('playing'); // 'welcome', 'playing', 'gameOver'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [showBanner, setShowBanner] = useState(true);

  // Animation states
  const [activePlayerHighlight, setActivePlayerHighlight] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // Calculate winner whenever board changes
  useEffect(() => {
    const newWinner = calculateWinner(board);
    if (newWinner) {
      handleWin(newWinner);
    } else if (!board.includes(null)) {
      handleDraw();
    }
  }, [board]);

  // Active player pulse animation
  useEffect(() => {
    if (gamePhase === 'playing') {
      const interval = setInterval(() => {
        setActivePlayerHighlight(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gamePhase]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (gamePhase !== 'playing' || winner || board[i]) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleWin = (player) => {
    setWinner(player);
    setScore(prev => ({
      ...prev,
      [player]: prev[player] + 1
    }));
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 3000);
    setGamePhase('gameOver');
  };

  const handleDraw = () => {
    setWinner('draw');
    setScore(prev => ({
      ...prev,
      draws: prev.draws + 1
    }));
    setGamePhase('gameOver');
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGamePhase('playing');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGamePhase('playing');
  };

  const returnToWelcome = () => {
    setGamePhase('welcome');
  };

  const renderSquare = (i) => {
    const isWinningSquare = winner && 
      (winner === 'X' || winner === 'O') && 
      calculateWinner(board) === board[i] && 
      board[i] !== null;

    return (
      <button
        className={`${styles.square} ${board[i] ? styles[`square${board[i]}`] : ''} ${
          isWinningSquare ? styles.winningSquare : ''
        }`}
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  // Responsive banner handling
  useEffect(() => {
    const handleResize = () => {
      setShowBanner(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`${styles.ticTacToeContainer} ${celebrate ? styles.celebrate : ''}`}>
      {showBanner && (
        <div className={`${styles.sideBanner} ${styles.leftBanner}`}>
       {/* <VerticalSideAd id={551} /> */}
        </div>
      )}
      
      <div className={styles.gameArea}>
        <div className={styles.welcomeScreen}>
        <h2 className={styles.mainTitle}>Play Tic Tac Toe</h2>

        </div>

        {/* <h2>Tic Tac Tow</h2> */}

        {/* Game Screen */}
        {gamePhase === 'playing' && (
          <div className={styles.gameScreen}>
            <div className={styles.scoreBoard}>
              <div className={`${styles.score} ${isXNext && activePlayerHighlight ? styles.activePlayer : ''}`}>
                <span>Player X</span>
                <strong>{score.X}</strong>
              </div>
              <div className={styles.score}>
                <span>Draws</span>
                <strong>{score.draws}</strong>
              </div>
              <div className={`${styles.score} ${!isXNext && activePlayerHighlight ? styles.activePlayer : ''}`}>
                <span>Player O</span>
                <strong>{score.O}</strong>
              </div>
            </div>

            <div className={styles.status}>
              {isXNext ? (
                <span className={styles.playerTurn}>X's <span>Turn</span></span>
              ) : (
                <span className={styles.playerTurn}>O's <span>Turn</span></span>
              )}
            </div>
            
            <div className={styles.board}>
              {[0, 1, 2].map((row) => (
                <div key={row} className={styles.boardRow}>
                  {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gamePhase === 'gameOver' && (
          <div className={styles.gameOverScreen}>
            <h2 className={winner === 'draw' ? styles.drawTitle : styles.winTitle}>
              {winner === 'draw' ? 'Game Drawn!' : `Player ${winner} Wins!`}
              {winner !== 'draw' && <span className={styles.winCelebrate}>🎉</span>}
            </h2>
            
            <div className={styles.resultAnimation}>
              {winner !== 'draw' && (
                <div className={`${styles.winnerSymbol} ${styles[`symbol${winner}`]}`}>
                  {winner}
                </div>
              )}
            </div>
            
            <div className={styles.actionButtons}>
              <button 
                className={styles.playAgainButton}
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showBanner && (
        <div className={`${styles.sideBanner} ${styles.rightBanner}`}>
          <VerticalSideAd id={552} />
        </div>
      )}
    </div>
  );
};

export default TicTacToe;