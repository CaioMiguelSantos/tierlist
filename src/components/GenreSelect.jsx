const GENEROS = ["Todos", "Ação", "Aventura", "RPG", "Plataforma", "Simulação", "Quebra-cabeça"];

export default function GenreSelect({ aoSelecionar, aoVoltar }) {
  return (
    <div style={estilos.pagina}>
      <div style={estilos.conteudo}>
        <button style={estilos.botaoVoltar} onClick={aoVoltar}>
          ← Voltar
        </button>

        <h1 style={estilos.titulo}>Escolha um gênero</h1>
        <p style={estilos.subtitulo}>
          Selecione o gênero dos jogos que você quer classificar na sua tier list.
        </p>

        <div style={estilos.grade}>
          {GENEROS.map((genero) => (
            <button
              key={genero}
              style={estilos.botaoGenero}
              onClick={() => aoSelecionar(genero)}
            >
              {genero}
            </button>
          ))}
        </div>
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
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
  },
  botaoVoltar: {
    background: "transparent",
    color: "#f2f2f2",
    border: "1px solid #3a3b44",
    borderRadius: "6px",
    padding: "8px 14px",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "24px",
  },
  titulo: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  subtitulo: {
    fontSize: "14px",
    color: "#b5b6c0",
    lineHeight: "1.5",
    marginBottom: "28px",
  },
  grade: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  botaoGenero: {
    background: "#1b1c22",
    color: "#f2f2f2",
    border: "1px solid #3a3b44",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
};