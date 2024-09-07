import { useState } from 'react';
import styles from '@/styles/FloatingJSONEditor.module.css';

const FloatingJSONEditor = ({ perguntasAtualizadas }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  return (
    <>
      {/* Botão flutuante para abrir/fechar o editor */}
      <button className={styles.floatingButton} onClick={toggleEditor}>
        {isEditorOpen ? "Fechar Editor" : "Abrir Editor"}
      </button>

      {/* Container do editor JSON colapsável */}
      {isEditorOpen && (
        <div className={styles.editorContainer}>
          <button className={styles.closeButton} onClick={toggleEditor}>
            ✕
          </button>
          <textarea
            className={styles.editorTextarea}
            value={JSON.stringify(perguntasAtualizadas, null, 2)}
            readOnly
          />
        </div>
      )}
    </>
  );
};

export default FloatingJSONEditor;
