import React from 'react';
import styles from './ProgressIndicator.module.scss';

const ProgressIndicator = ({ 
  currentStep, 
  onReset, 
  showResetButton = true,
  steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Process' },
    { number: 3, label: 'Download' }
  ]
}) => {
  return (
    <div className={styles.progressIndicator}>
      <div className={styles.progressSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`${styles.progressStep} ${currentStep >= step.number ? styles.active : ''} ${currentStep > step.number ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>
                {currentStep > step.number ? <i className="fas fa-check"></i> : step.number}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`${styles.progressLine} ${currentStep > step.number ? styles.active : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {showResetButton && currentStep > 1 && onReset && (
        <button onClick={onReset} className={styles.resetButton}>
          <i className="fas fa-redo"></i>
          Start Over
        </button>
      )}
    </div>
  );
};

export default ProgressIndicator;
