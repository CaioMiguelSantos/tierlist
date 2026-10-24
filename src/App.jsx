import { Component, useState } from "react";
import HomePage from "./components/HomePage";
import GenreSelect from "./components/GenreSelect";
import TierList from "./components/Tierlist";

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
            onClick={() => window.location.reload()}
            style={{ padding: "8px 14px", cursor: "pointer" }}
          >
            Recarregar a página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [tela, setTela] = useState("inicio"); // "inicio" | "generos" | "tierlist"

  // chave: identificador usado para salvar os dados (nome do gênero padrão ou id do personalizado)
  // nome:  texto exibido na tela
  const [generoSelecionado, setGeneroSelecionado] = useState("Todos");
  const [generoNome, setGeneroNome] = useState("Todos");

  let conteudo;

  if (tela === "tierlist") {
    conteudo = (
      <TierList
        key={generoSelecionado}
        generoSelecionado={generoSelecionado}
        generoNome={generoNome}
        aoVoltar={() => setTela("generos")}
      />
    );
  } else if (tela === "generos") {
    conteudo = (
      <GenreSelect
        aoSelecionar={(chave, nome) => {
          setGeneroSelecionado(chave);
          setGeneroNome(nome);
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