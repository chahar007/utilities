import React from 'react';
import styles from './ToolCard.module.scss';

const ToolCard = ({ tool, onClick, showButton = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tool.route);
    }
  };

  return (
    <div 
      className={styles.toolCard}
      onClick={handleClick}
    >
      <div className={styles.toolHeader}>
        <span className={styles.toolIcon}>{tool.icon}</span>
        <span className={styles.toolTag}>{tool.tag}</span>
      </div>
      <h3 className={styles.toolTitle}>{tool.title}</h3>
      <p className={styles.toolDescription}>{tool.description}</p>
      {showButton && (
        <button className={styles.toolButton}>
          Use Tool <i className="fas fa-arrow-right"></i>
        </button>
      )}
    </div>
  );
};

export default ToolCard;
