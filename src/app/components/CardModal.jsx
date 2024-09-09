// src/components/CardModal.js
import React from 'react';
import styles from '@/styles/CardModal.module.css';

const CardModal = ({ card, closeModal }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={closeModal}>X</button>
        <h2>{card.pergunta}</h2>
        <p><strong>Resposta:</strong> {card.resposta}</p>
        <p><strong>Dificuldade:</strong> {card.dificuldade}</p>
      </div>
    </div>
  );
};

export default CardModal;
