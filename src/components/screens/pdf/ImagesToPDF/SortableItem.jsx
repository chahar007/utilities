import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./ImagesToPDF.module.scss";

const SortableItem = ({ id, imageUrl, fileName, fileType, fileSize, index, onRemove }) => {
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
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt="Preview" className={styles.imagePreview} />
        <div className={styles.imageInfo}>
          <span className={styles.fileName}>{fileName}</span>
          <div className={styles.fileMeta}>
            <span className={styles.fileTypeBadge}>{fileType}</span>
            <span className={styles.fileSize}>{fileSize} KB</span>
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
          title="Remove image"
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