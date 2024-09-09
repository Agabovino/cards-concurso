// pages/TextoParaCards.js
import React, { useState } from 'react';
import style from '@/styles/TextoParaCards.module.css';

const TextoParaCards = () => {
  const [jsonText, setJsonText] = useState(''); // Estado para armazenar o texto JSON

  return (
    <div className={style.container}>
      {/* Metade esquerda: Campo de texto para o JSON */}
      <div className={style.leftPane}>
        <textarea
          className={style.jsonInput}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="Cole o JSON aqui..."
        />
      </div>

      {/* Metade direita: Grid de cards gerados com base no JSON */}
      <div className={style.rightPane}>
        {/* Aqui você vai gerar os cards com base no JSON */}
        {/* Exemplo de um card vazio para estruturação inicial */}
        <div className={style.cardGrid}>
          <div className={style.card}>
            <h3>Card Exemplo</h3>
            <p>Conteúdo do Card...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextoParaCards;
