import style from '@/styles/header.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Importando o componente Link do Next.js

const Header = ({ onAddPergunta }) => {
  return (
    <header className={style.header}>
      <div className={style.headerContent}>
        <div className={style.headerContentLeft}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <h1 className={style.logo}>Hbo+GPT 🤝</h1>
        </div>

        <div className={style.headerContentRight}>
          <span>Início</span>
          <button className={style.addCardButton} onClick={onAddPergunta}>Adicionar Card</button>
          <span>PDF para Texto</span>
          
          {/* Atualização: "Texto para cards" usando Link sem o elemento <a> */}
          <Link href="/TextoParaCards" className={style.linkItem}>
            Texto para cards
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
