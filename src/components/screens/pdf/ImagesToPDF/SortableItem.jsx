import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./ImagesToPDF.module.scss";

const SortableItem = ({ id, imageUrl, fileName, fileType }) => {
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
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt="Preview" className={styles.imagePreview} />
        <div className={styles.imageInfo}>
          <span className={styles.fileName}>{fileName}</span>
          <span className={styles.fileTypeBadge}>{fileType}</span>
        </div>
      </div>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <i className="fas fa-grip-vertical"></i>
      </div>
    </div>
  );
};

export default SortableItem;