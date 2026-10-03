const ORDEM_TIERS = ["S", "A", "B", "C", "D", "F"];
 
// Cria uma grade vazia, uma linha por tier, sem jogos ainda
function criarGradeVazia() {
  return ORDEM_TIERS.map((tier) => ({ tier, jogos: [] }));
}
 
// Lê o estado atual do DOM e transforma em matriz.
// Espera que cada dropzone de tier tenha data-zone="S", "A", etc.
function lerGradeComoMatriz() {
  return ORDEM_TIERS.map((tier) => {
    const zona = document.querySelector(`.dropzone[data-zone="${tier}"]`);
    const jogos = zona
      ? [...zona.querySelectorAll(".card")].map((card) => ({
          id: card.dataset.id,
          nome: card.textContent,
          c1: card.style.getPropertyValue("--c1"),
          c2: card.style.getPropertyValue("--c2"),
        }))
      : [];
    return { tier, jogos };
  });
}
 
// Aplica uma matriz de volta no DOM, recriando os cards de cada tier.
// Precisa que a função criarCard(id, nome, c1, c2) já exista no seu app.
function aplicarMatrizNaGrade(matriz, criarCard) {
  matriz.forEach(({ tier, jogos }) => {
    const zona = document.querySelector(`.dropzone[data-zone="${tier}"]`);
    if (!zona) return;
    zona.innerHTML = "";
    jogos.forEach((jogo) => {
      zona.appendChild(criarCard(jogo.id, jogo.nome, jogo.c1, jogo.c2));
    });
  });
}
 
// Utilitário: acha em qual tier (linha da matriz) um jogo está
function encontrarTierDoJogo(matriz, idJogo) {
  const linha = matriz.find((linha) => linha.jogos.some((j) => j.id === idJogo));
  return linha ? linha.tier : null;
}
 
// ============================================================
// ESTRUTURA 2: LISTA DE TEMPLATES (COM TAGS)
// ============================================================
// Cada template é um conjunto de jogos pré-definido, marcado com
// tags (gênero, plataforma, etc.) para facilitar filtro e carga
// rápida na pool de "não classificados".
 
const TEMPLATES = [
  {
    id: "tpl-classicos",
    nome: "Clássicos",
    tags: ["retro", "consagrados"],
    jogos: ["Super Mario World", "Chrono Trigger", "Tetris", "Doom"],
  },
  {
    id: "tpl-fps",
    nome: "FPS Modernos",
    tags: ["fps", "multiplayer"],
    jogos: ["Valorant", "Call of Duty", "Apex Legends", "Overwatch 2"],
  },
  {
    id: "tpl-indies",
    nome: "Indies Aclamados",
    tags: ["indie", "narrativo"],
    jogos: ["Hollow Knight", "Celeste", "Hades", "Undertale"],
  },
  {
    id: "tpl-rpg",
    nome: "RPGs",
    tags: ["rpg", "narrativo"],
    jogos: ["The Witcher 3", "Persona 5", "Elden Ring", "Baldur's Gate 3"],
  },
];
 
// Retorna todas as tags únicas existentes nos templates (pra montar um filtro)
function listarTagsDisponiveis() {
  const todas = TEMPLATES.flatMap((t) => t.tags);
  return [...new Set(todas)];
}
 
// Filtra templates que tenham uma determinada tag
function filtrarTemplatesPorTag(tag) {
  if (!tag) return TEMPLATES;
  return TEMPLATES.filter((t) => t.tags.includes(tag));
}
 
// Carrega um template inteiro na pool de não classificados.
// Precisa de criarCard(id, nome, c1, c2), CORES e do elemento pool,
// que já existem no seu script principal.
function carregarTemplate(idTemplate, { pool, criarCard, CORES }) {
  const template = TEMPLATES.find((t) => t.id === idTemplate);
  if (!template) return;
 
  template.jogos.forEach((nome) => {
    const [c1, c2] = CORES[Math.floor(Math.random() * CORES.length)];
    const id = "jogo-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    pool.appendChild(criarCard(id, nome, c1, c2));
  });
}
 
// ============================================================
// EXPORTAÇÃO (caso use como módulo) — remova se for script solto
// ============================================================
export {
  ORDEM_TIERS,
  criarGradeVazia,
  lerGradeComoMatriz,
  aplicarMatrizNaGrade,
  encontrarTierDoJogo,
  TEMPLATES,
  listarTagsDisponiveis,
  filtrarTemplatesPorTag,
  carregarTemplate,
};