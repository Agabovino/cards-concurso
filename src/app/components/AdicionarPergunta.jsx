import { useState } from 'react';
import styles from '@/styles/AdicionarPergunta.module.css';

const AdicionarPergunta = ({ isOpen, onClose, onAddPergunta }) => {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const novaPergunta = {
      pergunta,
      resposta,
    };

    onAddPergunta(novaPergunta);

    // Limpar os campos após adicionar a pergunta
    setPergunta('');
    setResposta('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2 className={styles.tittle}>Adicionar Nova Pergunta</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="pergunta">Pergunta:</label>
            <textarea 
              className={styles.perguntaTextarea}
              id="pergunta"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="resposta">Resposta:</label>
            <textarea
              className={styles.respostaTextarea}
              id="resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.addButton}>Adicionar Pergunta</button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarPergunta;
