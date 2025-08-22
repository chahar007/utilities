import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./MergePDF.module.scss";

const SortableItem = ({ id, name, size, index, onRemove }) => {
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
      <div className={styles.itemIndex}>
        {index}
      </div>
      <div className={styles.pdfContainer}>
        <div className={styles.pdfIcon}>
          <i className="fas fa-file-pdf"></i>
        </div>
        <div className={styles.pdfInfo}>
          <span className={styles.fileName}>{name}</span>
          <div className={styles.fileMeta}>
            <span className={styles.fileTypeBadge}>PDF</span>
            <span className={styles.fileSize}>{size} KB</span>
          </div>
        </div>
      </div>
      <div className={styles.itemActions}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={styles.removeButton}
          title="Remove PDF"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          <i className="fas fa-grip-vertical"></i>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
