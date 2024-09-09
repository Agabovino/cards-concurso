// pages/_app.js
import '../styles/globals.css'; // Importa estilos globais
import Layout from '@/app/layout'; // Importa o layout comum

function MyApp({ Component, pageProps }) {
  const handleAddPergunta = () => {
    // Função de exemplo para adicionar uma pergunta, pode ser personalizada
    console.log('Adicionando uma nova pergunta...');
  };

  return (
    <Layout onAddPergunta={handleAddPergunta}>
      {/* Renderiza o componente da página dentro do layout */}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
