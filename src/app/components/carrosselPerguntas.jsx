import { useState, useEffect } from 'react';
import axios from 'axios';
import CardPergunta from './CardPergunta';
import Header from './Header';
import FloatingJSONEditor from './FloatingJSONEditor';
import PlacarPerguntas from './PlacarPerguntas';
import AdicionarPergunta from './AdicionarPergunta'; 
import styles from '@/styles/CarrosselPerguntas.module.css';

const CarrosselPerguntas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResposta, setShowResposta] = useState(false);
  const [perguntasAtualizadas, setPerguntasAtualizadas] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/perguntas');
        setPerguntasAtualizadas(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchPerguntas();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddPergunta = async (novaPergunta) => {
    try {
      await axios.post('http://localhost:3001/api/perguntas', novaPergunta);
      const response = await axios.get('http://localhost:3001/api/perguntas');
      setPerguntasAtualizadas(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };

  const atualizarDificuldade = async (pergunta) => {
    const niveis = ["facil", "medio", "dificil"];
    const indiceAtual = niveis.indexOf(pergunta.nivel);

    if (indiceAtual > 0) {
      pergunta.nivel = niveis[indiceAtual - 1];
    }

    try {
      await axios.put(`http://localhost:3001/api/perguntas/${pergunta.id}`, { nivel: pergunta.nivel });
      const response = await axios.get('http://localhost:3001/api/perguntas');
      setPerguntasAtualizadas(response.data);
    } catch (error) {
      console.error('Erro ao atualizar pergunta:', error);
    }
  };

  const handleAcerto = async () => {
    const perguntaAtual = perguntasAtualizadas[currentIndex];
    await atualizarDificuldade(perguntaAtual);
    setAcertos(acertos + 1);
    moveToNextCard();
  };

  const handleErro = async () => {
    const perguntaAtual = perguntasAtualizadas[currentIndex];
    await atualizarDificuldade(perguntaAtual);
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

  const currentCard = perguntasAtualizadas[currentIndex] || {};
  if (perguntasAtualizadas.length === 0 || !currentCard.pergunta) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.carrosselContainer}>
      <Header onAddPergunta={handleOpenModal} />
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
      <AdicionarPergunta isOpen={isModalOpen} onClose={handleCloseModal} onAddPergunta={handleAddPergunta} />
    </div>
  );
};

export default CarrosselPerguntas;
