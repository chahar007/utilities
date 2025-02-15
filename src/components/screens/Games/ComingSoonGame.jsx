import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './styles/ComingSoonGame.module.scss';
import { GAMES_LIST, FALLBACK_IMAGE } from '../../../assets/constants/games.constant';

const ComingSoonGame = () => {
    const { id: slug } = useParams(); // Extract slug from URL params
    const [gameInfo, setGameInfo] = useState(null);

    useEffect(() => {
        if (slug) {
            // Flatten all game categories into a single array
            const allGames = Object.values(GAMES_LIST).flat();
            // Find the game by slug
            const gameDetails = allGames.find(game => game.slug === slug);
            setGameInfo(gameDetails || null);
        }
    }, [slug]);

    return (
        <div className={styles.comingSoonContainer}>
            <div className={styles.comingSoonContent}>
                <h1 className={styles.title}>Coming Soon</h1>
                <p className={styles.subtitle}>Exciting new games are on their way!</p>

                {gameInfo ? (
                    <div className={styles.gameDetails}>
                        <img src={gameInfo.image} alt={gameInfo.title} className={styles.gameImage}
                            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        />

                        <h2 className={styles.gameTitle}>{gameInfo.title}</h2>
                        <p className={styles.gameDescription}>{gameInfo.description}</p>
                        <p className={styles.additionalInfo}>
                            <strong>Difficulty:</strong> {gameInfo.difficulty} | <strong>Playtime:</strong> {gameInfo.playtime}
                        </p>
                    </div>
                ) : (
                    <p className={styles.message}>Game details not found.</p>
                )}

                <div className={styles.progressBar}>
                    <div className={styles.progress}></div>
                </div>
                <p className={styles.message}>Stay tuned for updates. We're working hard to bring you the best gaming experience.</p>
            </div>
        </div>
    );
};

export default ComingSoonGame;
