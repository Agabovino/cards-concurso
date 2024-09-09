import { useState, useEffect } from 'react';
import axios from 'axios';
import CardPergunta from './CardPergunta';
import FloatingJSONEditor from './FloatingJSONEditor';
import PlacarPerguntas from './PlacarPerguntas'; // Novo componente de placar
import AdicionarPergunta from './AdicionarPergunta'; // Novo componente de adicionar pergunta
import styles from '@/styles/CarrosselPerguntas.module.css';

const CarrosselPerguntas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResposta, setShowResposta] = useState(false);
  const [perguntasAtualizadas, setPerguntasAtualizadas] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  useEffect(() => {
    fetchPerguntas();
  }, []);

  const fetchPerguntas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/perguntas');
      setPerguntasAtualizadas(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const updateNivel = (index, acertou) => {
    setPerguntasAtualizadas((prevPerguntas) => {
      const novasPerguntas = [...prevPerguntas];
      if (acertou) {
        novasPerguntas[index].nivel = "facil";
      } else {
        novasPerguntas[index].nivel = getNextNivel(novasPerguntas[index].nivel);
      }
      return novasPerguntas;
    });
  };

  const handleAcerto = () => {
    updateNivel(currentIndex, true);
    setAcertos(acertos + 1);
    moveToNextCard();
  };

  const handleErro = () => {
    updateNivel(currentIndex, false);
    setErros(erros + 1);
    moveToNextCard();
  };

  const moveToNextCard = () => {
    setShowResposta(false);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex < perguntasAtualizadas.length ? nextIndex : 0;
    });
  };

  const toggleResposta = () => {
    setShowResposta(!showResposta);
  };

  const resetPlacar = () => {
    setAcertos(0);
    setErros(0);
  };

  const getNextNivel = (nivelAtual) => {
    const niveis = ["facil", "medio", "dificil", "muito-dificil", "extremo"];
    const indexAtual = niveis.indexOf(nivelAtual);
    const proximoIndex = (indexAtual + 1) % niveis.length;
    return niveis[proximoIndex];
  };

  const currentCard = perguntasAtualizadas[currentIndex] || {};
  if (perguntasAtualizadas.length === 0 || !currentCard.pergunta) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.carrosselContainer}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Progresso</h2>
        <p>Total de Perguntas: {perguntasAtualizadas.length}</p>
        <p>Perguntas Respondidas: {currentIndex}</p>
        <p>Perguntas Restantes: {perguntasAtualizadas.length - currentIndex}</p>
      </div>

      <PlacarPerguntas acertos={acertos} erros={erros} onResetPlacar={resetPlacar} />

      <CardPergunta
        key={currentCard.id}
        pergunta={currentCard.pergunta}
        resposta={currentCard.resposta}
        showResposta={showResposta}
        onToggleResposta={toggleResposta}
        onAcerto={handleAcerto}
        onErro={handleErro}
      />

      <FloatingJSONEditor perguntasAtualizadas={perguntasAtualizadas} />

      {/* Adicionando o componente de adicionar pergunta */}
      <AdicionarPergunta onPerguntaAdicionada={fetchPerguntas} />
    </div>
  );
};

export default CarrosselPerguntas;
