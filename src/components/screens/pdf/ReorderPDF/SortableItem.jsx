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
      <div className={styles.pageInfo}>
        <span className={styles.positionIndicator}>{currentPosition}</span>
        <span className={styles.pageNumber}>Page {number}</span>
      </div>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <i className="fas fa-grip-vertical"></i>
      </div>
    </div>
  );
};

export default SortableItem;