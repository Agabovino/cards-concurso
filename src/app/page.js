'use client'

import { useState, useEffect } from 'react';
import CarrosselPerguntas from './components/CarrosselPerguntas';

export default function Home() {
  const [perguntas, setPerguntas] = useState([]);

  useEffect(() => {
    async function fetchPerguntas() {
      const response = await fetch('/api/perguntas'); // Ajuste a URL se necessário
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setPerguntas(data);
    }

    fetchPerguntas().catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <CarrosselPerguntas perguntas={perguntas} />
    </div>
  );
}
