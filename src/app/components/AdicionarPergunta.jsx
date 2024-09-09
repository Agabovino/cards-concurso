import { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/AdicionarPergunta.module.css'; // Importe o CSS para este componente

const AdicionarPergunta = ({ onPerguntaAdicionada }) => {
  // Estado para o formulário de adicionar nova pergunta
  const [novaPergunta, setNovaPergunta] = useState({ pergunta: '', resposta: '', nivel: 'facil' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaPergunta((prev) => ({ ...prev, [name]: value }));
  };

  // Função para adicionar nova pergunta
  const addPergunta = async () => {
    try {
      await axios.post('http://localhost:3001/api/perguntas', novaPergunta); // Atualizado para '/api/perguntas'
      onPerguntaAdicionada(); // Chama a função de callback para recarregar as perguntas no CarrosselPerguntas
      setNovaPergunta({ pergunta: '', resposta: '', nivel: 'facil' }); // Limpar o formulário
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };

  return (
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
  );
};

export default AdicionarPergunta;
