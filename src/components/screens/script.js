// create-games-structure.js
const fs = require('fs');
const path = require('path');

// Games ordered by implementation sequence
const GAMES_SEQUENCE = [
  // Multiplayer (easiest first)
  { 
    id: 2, 
    title: "Rock Paper Scissors", 
    slug: "rock-paper-scissors",
    componentName: "RockPaperScissors" 
  },
  
  // Board & Puzzle
  { 
    id: 1, 
    title: "Tic Tac Toe", 
    slug: "tic-tac-toe",
    componentName: "TicTacToe" 
  },
  { 
    id: 5, 
    title: "Matching Tiles", 
    slug: "matching-tiles",
    componentName: "MatchingTiles" 
  },
  { 
    id: 4, 
    title: "2048", 
    slug: "2048",
    componentName: "Game2048" // Numbers can't start a component name
  },
  { 
    id: 3, 
    title: "Minesweeper", 
    slug: "minesweeper",
    componentName: "Minesweeper" 
  },
  { 
    id: 2, 
    title: "Sudoku", 
    slug: "sudoku",
    componentName: "Sudoku" 
  },
  
  // Arcade & Casual
  { 
    id: 1, 
    title: "Snake Game", 
    slug: "snake-game",
    componentName: "SnakeGame" 
  },
  { 
    id: 2, 
    title: "Brick Breaker", 
    slug: "brick-breaker",
    componentName: "BrickBreaker" 
  },
  { 
    id: 4, 
    title: "Dino Run", 
    slug: "dino-run",
    componentName: "DinoRun" 
  },
  { 
    id: 3, 
    title: "Flappy Bird Clone", 
    slug: "flappy-bird-clone",
    componentName: "FlappyBird" // Shortened for convenience
  },
  
  // Card & Casino
  { 
    id: 1, 
    title: "Solitaire", 
    slug: "solitaire",
    componentName: "Solitaire" 
  },
  
  // Strategy & Logic
  { 
    id: 3, 
    title: "Reversi (Othello)", 
    slug: "reversi-othello",
    componentName: "Reversi" // Using the simpler name
  },
  { 
    id: 2, 
    title: "Chess", 
    slug: "chess",
    componentName: "Chess" 
  },
  
  // Multiplayer (more complex)
  { 
    id: 1, 
    title: "Ludo", 
    slug: "ludo",
    componentName: "Ludo" 
  },
  
  // Most complex games last
  { 
    id: 1, 
    title: "Tower Defense", 
    slug: "tower-defense",
    componentName: "TowerDefense" 
  },
  { 
    id: 2, 
    title: "Poker", 
    slug: "poker",
    componentName: "Poker" 
  }
];

const GAMES_DIR = path.join(__dirname, 'AllGames');

function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function createGameFiles(game) {
  const gameDir = path.join(GAMES_DIR, game.componentName);
  createDirIfNotExists(gameDir);
  const componentName = game.componentName;
  
  // Create SCSS module
  const scssContent = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  .title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .gameArea {
    width: 100%;
    max-width: 800px;
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}`;
  
  fs.writeFileSync(
    path.join(gameDir, `${componentName}.module.scss`),
    scssContent
  );

  // Create component file
  const componentContent = `import { useState } from 'react';
import styles from './${game.componentName}.module.scss';

const ${componentName} = () => {
  const [score, setScore] = useState(0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>${game.title}</h1>
      
      <div className={styles.gameArea}>
        <p>${game.title} game will be implemented here</p>
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

export default ${componentName};`;

  fs.writeFileSync(
    path.join(gameDir, `${componentName}.jsx`),
    componentContent
  );

  console.log(`Created game: ${game.slug}`);
}

function createIndexFile() {
  let imports = '';
  let exports = 'const GAMES = {\n';

  GAMES_SEQUENCE.forEach(game => {
    const componentName = game.title.replace(/\s+/g, '');
    imports += `import ${componentName} from './${game.slug}';\n`;
    exports += `  '${game.slug}': ${componentName},\n`;
  });

  exports += '};\n\nexport default GAMES;';

  fs.writeFileSync(
    path.join(GAMES_DIR, 'index.js'),
    `${imports}\n${exports}`
  );

  console.log('Created games index file');
}

// Create all game folders
createDirIfNotExists(GAMES_DIR);
GAMES_SEQUENCE.forEach(createGameFiles);
createIndexFile();

console.log(`
✅ Game structure created successfully!
📁 Location: ${GAMES_DIR}
✨ ${GAMES_SEQUENCE.length} games prepared in implementation sequence
`);