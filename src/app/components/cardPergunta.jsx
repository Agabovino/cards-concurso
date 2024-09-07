// components/CardPergunta.jsx
import React from 'react';
import styles from '@/styles/CardPergunta.module.css'; // Verifique o caminho e nome do arquivo CSS

const CardPergunta = ({ pergunta, resposta, showResposta, onToggleResposta, onAcerto, onErro }) => {
  return (
    <div className={styles.cardPergunta}>
      <p>{pergunta}</p>
      {showResposta && <p>{resposta}</p>}
      <button onClick={onToggleResposta}>{showResposta ? 'Ocultar Resposta' : 'Mostrar Resposta'}</button>
      <button onClick={onAcerto}>Acertou</button>
      <button onClick={onErro}>Errou</button>
    </div>
  );
};

export default CardPergunta;
