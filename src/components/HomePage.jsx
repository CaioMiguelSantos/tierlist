export default function HomePage({ aoIniciar }) {
  return (
    <div style={estilos.pagina}>
      <div style={estilos.conteudo}>
        <h1 style={estilos.titulo}>Tier List de Jogos</h1>
        <p style={estilos.subtitulo}>
          Organize seus jogos favoritos em uma tier list arrastando as capas
          entre as categorias S, A, B, C e D.
        </p>
        <button style={estilos.botao} onClick={aoIniciar}>
          Criar minha Tier List
        </button>
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#14151a",
    color: "#f2f2f2",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  conteudo: {
    maxWidth: "480px",
    textAlign: "center",
  },
  titulo: {
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: "12px",
  },
  subtitulo: {
    fontSize: "15px",
    color: "#b5b6c0",
    lineHeight: "1.5",
    marginBottom: "28px",
  },
  botao: {
    background: "#ff5b5b",
    color: "#14151a",
    border: "none",
    borderRadius: "8px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
};