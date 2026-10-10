import { Component, useState } from "react";
import HomePage from "./components/HomePage";
import GenreSelect from "./components/GenreSelect";
import TierList from "./components/TierList";

// Mostra o erro na tela em vez de deixar a página branca
class CapturaErros extends Component {
  state = { erro: null };

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  render() {
    if (this.state.erro) {
      return (
        <div
          style={{
            background: "#14151a",
            color: "#ff8a8a",
            minHeight: "100vh",
            padding: "24px",
            fontFamily: "monospace",
          }}
        >
          <h2>Ocorreu um erro:</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.erro?.stack || this.state.erro)}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ padding: "8px 14px", cursor: "pointer" }}
          >
            Limpar dados salvos e recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [tela, setTela] = useState("inicio"); // "inicio" | "generos" | "tierlist"
  const [generoSelecionado, setGeneroSelecionado] = useState("Todos");

  let conteudo;

  if (tela === "tierlist") {
    conteudo = (
      <TierList
        key={generoSelecionado}
        generoSelecionado={generoSelecionado}
        aoVoltar={() => setTela("generos")}
      />
    );
  } else if (tela === "generos") {
    conteudo = (
      <GenreSelect
        aoSelecionar={(genero) => {
          setGeneroSelecionado(genero);
          setTela("tierlist");
        }}
        aoVoltar={() => setTela("inicio")}
      />
    );
  } else {
    conteudo = <HomePage aoIniciar={() => setTela("generos")} />;
  }

  return <CapturaErros>{conteudo}</CapturaErros>;
}

export default App;