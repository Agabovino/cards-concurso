import { useState, useEffect } from 'react';
import axios from 'axios';
import CardPergunta from './CardPergunta';
import FloatingJSONEditor from './FloatingJSONEditor';
import styles from '@/styles/CarrosselPerguntas.module.css'; // Importe o módulo CSS

const CarrosselPerguntas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResposta, setShowResposta] = useState(false);
  const [perguntasAtualizadas, setPerguntasAtualizadas] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  // Estado para o formulário de adicionar nova pergunta
  const [novaPergunta, setNovaPergunta] = useState({ pergunta: '', resposta: '', nivel: 'facil' });

  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/perguntas'); // Atualizado para '/api/perguntas'
        setPerguntasAtualizadas(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchPerguntas();
  }, []);

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

  // Função para adicionar nova pergunta
  const addPergunta = async () => {
    try {
      await axios.post('http://localhost:3001/api/perguntas', novaPergunta); // Atualizado para '/api/perguntas'
      // Recarregar as perguntas após adicionar uma nova
      const response = await axios.get('http://localhost:3001/api/perguntas'); // Atualizado para '/api/perguntas'
      setPerguntasAtualizadas(response.data);
      setNovaPergunta({ pergunta: '', resposta: '', nivel: 'facil' }); // Limpar o formulário
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaPergunta((prev) => ({ ...prev, [name]: value }));
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
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Progresso</h2>
        <p>Total de Perguntas: {perguntasAtualizadas.length}</p>
        <p>Perguntas Respondidas: {currentIndex}</p>
        <p>Perguntas Restantes: {perguntasAtualizadas.length - currentIndex}</p>
        <div className={styles.scoreboard}>
          <h3 className={styles.scoreboardTitle}>Placar</h3>
          <p>Acertos: {acertos}</p>
          <p>Erros: {erros}</p>
          <button className={styles.resetButton} onClick={resetPlacar}>
            Resetar Placar
          </button>
        </div>
      </div>

      <CardPergunta
        key={currentCard.id} // Use o id como key
        pergunta={currentCard.pergunta}
        resposta={currentCard.resposta}
        showResposta={showResposta}
        onToggleResposta={toggleResposta}
        onAcerto={handleAcerto}
        onErro={handleErro}
      />

      <FloatingJSONEditor perguntasAtualizadas={perguntasAtualizadas} />

      {/* Formulário para adicionar nova pergunta */}
      <div className={styles.addPerguntaForm}>
        <h3>Adicionar Nova Pergunta</h3>
        <input
          type="text"
          name="pergunta"
          value={novaPergunta.pergunta}
          onChange={handleChange}
          placeholder="Pergunta"
        />
        <input
          type="text"
          name="resposta"
          value={novaPergunta.resposta}
          onChange={handleChange}
          placeholder="Resposta"
        />
        <select
          name="nivel"
          value={novaPergunta.nivel}
          onChange={handleChange}
        >
          <option value="facil">Fácil</option>
          <option value="medio">Médio</option>
          <option value="dificil">Difícil</option>
          <option value="muito-dificil">Muito Difícil</option>
          <option value="extremo">Extremo</option>
        </select>
        <button onClick={addPergunta}>Adicionar Pergunta</button>
      </div>
    </div>
  );
};

export default CarrosselPerguntas;
