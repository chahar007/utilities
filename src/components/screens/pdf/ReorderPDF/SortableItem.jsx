import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ReorderPDF.module.scss';

const SortableItem = ({ id, number, currentPosition }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sortableItem} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.currentPosition}>
        <span className={styles.positionNumber}>{currentPosition}</span>
      </div>
      <div className={styles.pageInfo}>
        <div className={styles.pageIcon}>
          <i className="fas fa-file-alt"></i>
        </div>
        <span className={styles.pageNumber}>Page {number}</span>
      </div>
      <div className={styles.itemActions}>
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          <i className="fas fa-grip-vertical"></i>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;