import { useState, useEffect } from 'react';
import axios from 'axios';
import CardPergunta from './CardPergunta';
import Header from './Header';
import FloatingJSONEditor from './FloatingJSONEditor';
import PlacarPerguntas from './PlacarPerguntas';
import AdicionarPergunta from './AdicionarPergunta'; // Importe o componente AdicionarPergunta
import styles from '@/styles/CarrosselPerguntas.module.css';

const CarrosselPerguntas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResposta, setShowResposta] = useState(false);
  const [perguntasAtualizadas, setPerguntasAtualizadas] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

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

  // Função para abrir o modal
  const handleOpenModal = () => setIsModalOpen(true);
  // Função para fechar o modal
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddPergunta = async (novaPergunta) => {
    try {
      await axios.post('http://localhost:3001/api/perguntas', novaPergunta);
      // Recarregar as perguntas após adicionar uma nova
      const response = await axios.get('http://localhost:3001/api/perguntas');
      setPerguntasAtualizadas(response.data);
      handleCloseModal(); // Fecha o modal após adicionar a pergunta
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };

  const updateNivel = (index, acertou) => {
    setPerguntasAtualizadas((prevPerguntas) => {
      const novasPerguntas = [...prevPerguntas];
      if (acertou) {
        novasPerguntas[index].nivel = "facil"; // Volta para o nível mais fácil
      } else {
        novasPerguntas[index].nivel = getNextNivel(novasPerguntas[index].nivel);
      }
      return novasPerguntas;
    });
  };

  const handleAcerto = () => {
    updateNivel(currentIndex, true);
    setAcertos(acertos + 1); // Atualiza o placar de acertos
    moveToNextCard();
  };

  const handleErro = () => {
    updateNivel(currentIndex, false);
    setErros(erros + 1); // Atualiza o placar de erros
    moveToNextCard();
  };

  const moveToNextCard = () => {
    setShowResposta(false);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex < perguntasAtualizadas.length ? nextIndex : 0; // Reinicia o índice se chegar ao final
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
    const proximoIndex = (indexAtual + 1) % niveis.length; // Retorna ao primeiro nível se alcançar o final
    return niveis[proximoIndex];
  };

  const currentCard = perguntasAtualizadas[currentIndex] || {};
  if (perguntasAtualizadas.length === 0 || !currentCard.pergunta) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.carrosselContainer}>
      {/* Header com botão de adicionar pergunta */}
      <Header onAddPergunta={handleOpenModal} />

      {/* Placar Perguntas */}
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

      {/* Modal AdicionarPergunta */}
      <AdicionarPergunta isOpen={isModalOpen} onClose={handleCloseModal} onAddPergunta={handleAddPergunta} />
    </div>
  );
};

export default CarrosselPerguntas;
