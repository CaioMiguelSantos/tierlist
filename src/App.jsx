import { useState } from "react";
import HomePage from "./components/HomePage";
import GenreSelect from "./components/GenreSelect";
import TierList from "./components/TierList";

function App() {
  const [tela, setTela] = useState("inicio"); // "inicio" | "generos" | "tierlist"
  const [generoSelecionado, setGeneroSelecionado] = useState("Todos");

  if (tela === "tierlist") {
    return (
      <TierList
        generoSelecionado={generoSelecionado}
        aoVoltar={() => setTela("generos")}
      />
    );
  }

  if (tela === "generos") {
    return (
      <GenreSelect
        aoSelecionar={(genero) => {
          setGeneroSelecionado(genero);
          setTela("tierlist");
        }}
        aoVoltar={() => setTela("inicio")}
      />
    );
  }

  return <HomePage aoIniciar={() => setTela("generos")} />;
}

export default App;