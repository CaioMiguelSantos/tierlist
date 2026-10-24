import { useState, useEffect } from "react";

/**
 * GenreSelect
 * ---------------------------------------------------------
 * Gêneros padrão + gêneros personalizados criados pelo usuário.
 *
 * Gênero personalizado: { id, nome }
 *  - O "id" é a chave usada para salvar a tier list (por isso renomear
 *    não perde nada).
 *  - Salvo no localStorage em "tierlist:generosCustom".
 *
 * aoSelecionar(chave, nome):
 *  - gênero padrão:       chave = nome
 *  - gênero personalizado: chave = id, nome = nome exibido
 * ---------------------------------------------------------
 */

const GENEROS_PADRAO = ["Todos", "Ação", "Aventura", "RPG", "Plataforma", "Simulação", "Quebra-cabeça"];

const CHAVE_GENEROS = "tierlist:generosCustom";
const CHAVE_IMAGENS = "tierlist:jogosCustom";
const TAMANHO_MAX = 24;
const MAX_GENEROS = 12;

const CSS = `
.gs-card .gs-acoes { opacity: 0; transition: opacity .15s; }
.gs-card:hover .gs-acoes,
.gs-acoes:focus-within { opacity: 1; }
@media (hover: none) { .gs-card .gs-acoes { opacity: 1; } }

.gs-botao { transition: background .12s, border-color .12s; }
.gs-botao:hover { background: #23242c; border-color: #4a4b56; }
.gs-mini:hover { background: rgba(255,255,255,0.1); }
`;

// ---------- Ícones (traço fino) ----------
function Icone({ nome, tamanho = 14 }) {
  const base = {
    width: tamanho,
    height: tamanho,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    style: { display: "block", flexShrink: 0 },
  };

  switch (nome) {
    case "editar":
      return (
        <svg {...base}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "lixeira":
      return (
        <svg {...base}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      );
    case "check":
      return (
        <svg {...base}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "fechar":
      return (
        <svg {...base}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case "mais":
      return (
        <svg {...base}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case "voltar":
      return (
        <svg {...base}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );
    default:
      return null;
  }
}

// ---------- localStorage: carregar os gêneros personalizados ----------
function carregarGeneros() {
  try {
    const salvo = localStorage.getItem(CHAVE_GENEROS);
    if (salvo) {
      const dados = JSON.parse(salvo);
      if (Array.isArray(dados)) {
        const vistos = new Set();
        const validos = [];
        for (const g of dados) {
          if (
            g &&
            typeof g.id === "string" &&
            typeof g.nome === "string" &&
            g.nome.trim() &&
            !vistos.has(g.id)
          ) {
            vistos.add(g.id);
            validos.push({ id: g.id, nome: g.nome.trim().slice(0, TAMANHO_MAX) });
          }
        }
        return validos;
      }
    }
  } catch (erro) {
    console.error("Erro ao carregar os gêneros salvos:", erro);
  }
  return [];
}

export default function GenreSelect({ aoSelecionar, aoVoltar }) {
  const [generos, setGeneros] = useState(carregarGeneros);
  const [editandoId, setEditandoId] = useState(null); // id | "novo" | null
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");

  // ---------- localStorage: salvar os gêneros ----------
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_GENEROS, JSON.stringify(generos));
    } catch (e) {
      console.error("Erro ao salvar os gêneros:", e);
    }
  }, [generos]);

  function nomeJaExiste(nome, idIgnorar) {
    const alvo = nome.toLowerCase();
    if (GENEROS_PADRAO.some((g) => g.toLowerCase() === alvo)) return true;
    return generos.some((g) => g.id !== idIgnorar && g.nome.toLowerCase() === alvo);
  }

  function iniciarCriacao() {
    setTexto("");
    setErro("");
    setEditandoId("novo");
  }

  function iniciarRenomear(genero) {
    setTexto(genero.nome);
    setErro("");
    setEditandoId(genero.id);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTexto("");
    setErro("");
  }

  function confirmarEdicao() {
    const nome = texto.trim();
    if (!nome) {
      setErro("Digite um nome.");
      return;
    }
    if (nomeJaExiste(nome, editandoId === "novo" ? null : editandoId)) {
      setErro("Já existe um gênero com esse nome.");
      return;
    }

    if (editandoId === "novo") {
      setGeneros((atual) => [...atual, { id: `g${Date.now()}`, nome }]);
    } else {
      setGeneros((atual) => atual.map((g) => (g.id === editandoId ? { ...g, nome } : g)));
    }
    cancelarEdicao();
  }

  function aoTeclar(e) {
    if (e.key === "Enter") confirmarEdicao();
    else if (e.key === "Escape") cancelarEdicao();
  }

  // Apaga o gênero e tudo o que foi salvo nele (classificação, categorias e imagens)
  function removerGenero(genero) {
    if (
      !window.confirm(
        `Apagar o gênero "${genero.nome}"? A classificação e as imagens adicionadas nele serão removidas.`
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem(`tierlist:${genero.id}`);
      localStorage.removeItem(`tierlist:tiers:${genero.id}`);
      localStorage.removeItem(`tierlist:nomes:${genero.id}`);

      const salvo = localStorage.getItem(CHAVE_IMAGENS);
      if (salvo) {
        const imagens = JSON.parse(salvo);
        if (Array.isArray(imagens)) {
          localStorage.setItem(
            CHAVE_IMAGENS,
            JSON.stringify(imagens.filter((img) => img.genero !== genero.id))
          );
        }
      }
    } catch (e) {
      console.error("Erro ao limpar os dados do gênero:", e);
    }

    setGeneros((atual) => atual.filter((g) => g.id !== genero.id));
    if (editandoId === genero.id) cancelarEdicao();
  }

  // ---------- Campo de nome (criar / renomear) ----------
  function renderEditor(chave) {
    return (
      <div key={chave} style={estilos.editor}>
        <div style={estilos.editorLinha}>
          <input
            autoFocus
            value={texto}
            maxLength={TAMANHO_MAX}
            placeholder="Nome do gênero"
            onChange={(e) => {
              setTexto(e.target.value);
              if (erro) setErro("");
            }}
            onKeyDown={aoTeclar}
            onFocus={(e) => e.target.select()}
            style={estilos.input}
          />
          <button
            className="gs-mini"
            onMouseDown={(e) => e.preventDefault()}
            onClick={confirmarEdicao}
            title="Salvar"
            aria-label="Salvar nome"
            style={{ ...estilos.botaoMini, color: "#8fd94f" }}
          >
            <Icone nome="check" tamanho={16} />
          </button>
          <button
            className="gs-mini"
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancelarEdicao}
            title="Cancelar"
            aria-label="Cancelar"
            style={estilos.botaoMini}
          >
            <Icone nome="fechar" tamanho={16} />
          </button>
        </div>
        {erro && <div style={estilos.erro}>{erro}</div>}
      </div>
    );
  }

  return (
    <div style={estilos.pagina}>
      <style>{CSS}</style>

      <div style={estilos.conteudo}>
        <button className="gs-mini" style={estilos.botaoVoltar} onClick={aoVoltar}>
          <Icone nome="voltar" tamanho={16} />
          Voltar
        </button>

        <h1 style={estilos.titulo}>Escolha um gênero</h1>
        <p style={estilos.subtitulo}>
          Selecione um gênero para classificar os jogos ou crie o seu, com o nome que quiser.
        </p>

        <div style={estilos.grade}>
          {/* Gêneros padrão */}
          {GENEROS_PADRAO.map((genero) => (
            <button
              key={genero}
              className="gs-botao"
              style={estilos.botaoGenero}
              onClick={() => aoSelecionar(genero, genero)}
            >
              {genero}
            </button>
          ))}

          {/* Gêneros personalizados */}
          {generos.map((genero) =>
            editandoId === genero.id ? (
              renderEditor(genero.id)
            ) : (
              <div key={genero.id} className="gs-card" style={estilos.cartao}>
                <button
                  className="gs-botao"
                  style={{ ...estilos.botaoGenero, width: "100%", paddingRight: "64px" }}
                  onClick={() => aoSelecionar(genero.id, genero.nome)}
                  title={genero.nome}
                >
                  <span style={estilos.nomeGenero}>{genero.nome}</span>
                </button>

                <div className="gs-acoes" style={estilos.acoes}>
                  <button
                    className="gs-mini"
                    style={estilos.botaoMini}
                    onClick={() => iniciarRenomear(genero)}
                    title="Renomear"
                    aria-label={`Renomear o gênero ${genero.nome}`}
                  >
                    <Icone nome="editar" />
                  </button>
                  <button
                    className="gs-mini"
                    style={{ ...estilos.botaoMini, color: "#ff8a8a" }}
                    onClick={() => removerGenero(genero)}
                    title="Apagar"
                    aria-label={`Apagar o gênero ${genero.nome}`}
                  >
                    <Icone nome="lixeira" />
                  </button>
                </div>
              </div>
            )
          )}

          {/* Criar novo gênero */}
          {editandoId === "novo" ? (
            renderEditor("novo")
          ) : generos.length < MAX_GENEROS ? (
            <button
              className="gs-botao"
              style={estilos.botaoCriar}
              onClick={iniciarCriacao}
            >
              <Icone nome="mais" tamanho={16} />
              Criar gênero
            </button>
          ) : null}
        </div>

        {generos.length >= MAX_GENEROS && (
          <p style={estilos.limite}>Limite de {MAX_GENEROS} gêneros personalizados atingido.</p>
        )}
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
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: "transparent",
    color: "#c7c8d1",
    border: "none",
    borderRadius: "6px",
    padding: "7px 10px 7px 6px",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  titulo: {
    fontSize: "28px",
    fontWeight: 800,
    margin: "0 0 8px",
  },
  subtitulo: {
    fontSize: "14px",
    color: "#b5b6c0",
    lineHeight: "1.5",
    margin: "0 0 28px",
  },
  grade: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    textAlign: "left",
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
    textAlign: "center",
    boxSizing: "border-box",
  },
  nomeGenero: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cartao: {
    position: "relative",
  },
  acoes: {
    position: "absolute",
    top: "50%",
    right: "8px",
    transform: "translateY(-50%)",
    display: "flex",
    gap: "2px",
  },
  botaoMini: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    background: "transparent",
    color: "#c7c8d1",
    border: "none",
    borderRadius: "6px",
    padding: 0,
    cursor: "pointer",
    flexShrink: 0,
  },
  botaoCriar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    background: "transparent",
    color: "#c7c8d1",
    border: "1px dashed #4a4b56",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
  editor: {
    background: "#1b1c22",
    border: "1px solid #5bc0ff",
    borderRadius: "8px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    justifyContent: "center",
  },
  editorLinha: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  input: {
    flex: 1,
    minWidth: 0,
    background: "#14151a",
    color: "#f2f2f2",
    border: "1px solid #3a3b44",
    borderRadius: "6px",
    padding: "9px 10px",
    fontSize: "14px",
    boxSizing: "border-box",
    marginRight: "4px",
  },
  erro: {
    fontSize: "12px",
    color: "#ffb86b",
    padding: "0 2px",
  },
  limite: {
    fontSize: "12px",
    color: "#8b8c98",
    marginTop: "14px",
  },
};