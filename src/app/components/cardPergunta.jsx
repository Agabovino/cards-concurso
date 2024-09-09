import React from 'react';
import styles from '@/styles/CardPergunta.module.css'; // Verifique o caminho e nome do arquivo CSS

const CardPergunta = ({ pergunta, resposta, showResposta, onToggleResposta, onAcerto, onErro }) => {
  return (
    <div className={styles.cardPergunta}>
      <p className={styles.pergunta}>{pergunta}</p> {/* Garantir que a pergunta esteja aqui */}
      {showResposta && <p className={styles.resposta}>{resposta}</p>}
      <button className={styles.botaoMostrarResposta} onClick={onToggleResposta}>
        {showResposta ? 'Ocultar Resposta' : 'Mostrar Resposta'}
      </button>
      <button className={styles.botaoAcertou} onClick={onAcerto}>Acertou</button>
      <button className={styles.botaoErro} onClick={onErro}>Errou</button>
    </div>
  );
};

export default CardPergunta;
