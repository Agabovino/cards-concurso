// src/app/components/PlacarPerguntas.jsx
import React from 'react';
import styles from '@/styles/PlacarPerguntas.module.css'; // Importando os estilos específicos

const PlacarPerguntas = ({ acertos, erros, resetPlacar }) => {
  return (
    <div className={styles.scoreboard}>
      <h3 className={styles.scoreboardTitle}>Placar</h3>
      <p>Acertos: {acertos}</p>
      <p>Erros: {erros}</p>
      <button className={styles.resetButton} onClick={resetPlacar}>
        Resetar Placar
      </button>
    </div>
  );
};

export default PlacarPerguntas;
