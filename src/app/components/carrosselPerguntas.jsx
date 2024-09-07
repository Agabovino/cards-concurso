// compoenente carrosselPerguntas.jsx
import { useState, useEffect } from 'react';
import CardPergunta from './CardPergunta';
import FloatingJSONEditor from './FloatingJSONEditor';

// Função para determinar o próximo nível de dificuldade
const getNextNivel = (currentNivel) => {
  const niveis = ["facil", "medio", "dificil", "muito-dificil", "extremo"];
  const index = niveis.indexOf(currentNivel);
  return index < niveis.length - 1 ? niveis[index + 1] : currentNivel;
};

const CarrosselPerguntas = ({ perguntas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResposta, setShowResposta] = useState(false);
  const [perguntasAtualizadas, setPerguntasAtualizadas] = useState(perguntas);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  useEffect(() => {
    // Atualizar o estado local com perguntas quando o componente for montado
    setPerguntasAtualizadas(perguntas);
  }, [perguntas]);

  // Função para atualizar o nível de dificuldade
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

  // Verifica se há perguntas e um card válido antes de renderizar
  const currentCard = perguntasAtualizadas[currentIndex] || {};
  if (perguntasAtualizadas.length === 0 || !currentCard.pergunta) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center m-20">
      {/* Header com contadores */}
      <div className="mb-6 p-4 bg-gray-100 w-full max-w-md rounded-lg text-center shadow-md">
        <h2 className="font-bold text-lg">Progresso</h2>
        <p>Total de Perguntas: {perguntasAtualizadas.length}</p>
        <p>Perguntas Respondidas: {currentIndex}</p>
        <p>Perguntas Restantes: {perguntasAtualizadas.length - currentIndex}</p>
        <div className="mt-4">
          <h3 className="font-bold text-lg">Placar</h3>
          <p>Acertos: {acertos}</p>
          <p>Erros: {erros}</p>
        </div>
      </div>

      {/* Card de Pergunta */}
      <CardPergunta
        key={currentCard.id} // Use o id como key
        pergunta={currentCard.pergunta}
        resposta={currentCard.resposta}
        showResposta={showResposta}
        onToggleResposta={toggleResposta}
        onAcerto={handleAcerto}
        onErro={handleErro}
      />

      {/* Adiciona o editor de JSON flutuante */}
      <FloatingJSONEditor perguntasAtualizadas={perguntasAtualizadas} />
    </div>
  );
};

export default CarrosselPerguntas;
