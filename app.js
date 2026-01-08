// ===== CONFIGURAÇÃO E ESTADO =====
const API_BASE = "https://pokeapi.co/api/v2";
const ITEMS_PER_PAGE = 24;

const state = {
  types: [],
  typeData: {},
  currentResults: [],
  displayedCount: 0,
  team: [],
  selectedPokemon: null,
  moveCache: {},
  teamMoves: {}, // { pokemonId: [move1, move2, move3, move4] }
  translationCache: {}, // Cache para traduções
  movesTranslations: null, // Traduções dos movimentos carregadas do JSON
};

// Nomes dos tipos em português
const typeNames = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
};

// Cores dos tipos
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

// ===== ELEMENTOS DO DOM =====
const elements = {
  type1: document.getElementById("type1"),
  type2: document.getElementById("type2"),
  searchBtn: document.getElementById("searchBtn"),
  teamGrid: document.getElementById("teamGrid"),
  teamCount: document.getElementById("teamCount"),
  clearTeamBtn: document.getElementById("clearTeamBtn"),
  teamAnalysis: document.getElementById("teamAnalysis"),
  teamWeaknesses: document.getElementById("teamWeaknesses"),
  teamResistances: document.getElementById("teamResistances"),
  teamImmunities: document.getElementById("teamImmunities"),
  pokemonGrid: document.getElementById("pokemonGrid"),
  loading: document.getElementById("loading"),
  noResults: document.getElementById("noResults"),
  resultsCount: document.getElementById("resultsCount"),
  sortBy: document.getElementById("sortBy"),
  loadMore: document.getElementById("loadMore"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  modal: document.getElementById("pokemonModal"),
  modalClose: document.getElementById("modalClose"),
  modalBody: document.getElementById("modalBody"),
};

// ===== FUNÇÕES DE API =====
async function fetchTypes() {
  try {
    const response = await fetch(`${API_BASE}/type`);
    const data = await response.json();

    // Filtrar tipos válidos (excluir unknown e shadow)
    const validTypes = data.results.filter(
      (t) => !["unknown", "shadow", "stellar"].includes(t.name)
    );

    state.types = validTypes;
    return validTypes;
  } catch (error) {
    console.error("Erro ao buscar tipos:", error);
    return [];
  }
}

async function fetchTypeData(typeName) {
  // Usar cache se disponível
  if (state.typeData[typeName]) {
    return state.typeData[typeName];
  }

  try {
    const response = await fetch(`${API_BASE}/type/${typeName}`);
    const data = await response.json();
    state.typeData[typeName] = data;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar tipo ${typeName}:`, error);
    return null;
  }
}

async function fetchPokemonDetails(nameOrId) {
  try {
    const response = await fetch(`${API_BASE}/pokemon/${nameOrId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar Pokémon ${nameOrId}:`, error);
    return null;
  }
}

async function fetchMoveDetails(moveNameOrId) {
  // Usar cache se disponível
  if (state.moveCache[moveNameOrId]) {
    return state.moveCache[moveNameOrId];
  }

  try {
    const response = await fetch(`${API_BASE}/move/${moveNameOrId}`);
    const data = await response.json();
    state.moveCache[moveNameOrId] = data;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar movimento ${moveNameOrId}:`, error);
    return null;
  }
}

// Carregar traduções dos movimentos do arquivo JSON
async function loadMovesTranslations() {
  if (state.movesTranslations) {
    return state.movesTranslations; // Já carregado
  }

  try {
    const response = await fetch("moves-pt.json");
    if (response.ok) {
      state.movesTranslations = await response.json();
      console.log(
        "✅ Traduções de movimentos carregadas:",
        Object.keys(state.movesTranslations).length,
        "movimentos"
      );
      return state.movesTranslations;
    }
  } catch (error) {
    console.warn(
      "⚠️ Arquivo moves-pt.json não encontrado. Usando descrições em inglês."
    );
  }

  return {};
}

// Função para traduzir descrição de movimento
function translateMoveDescription(moveName, descriptionEN) {
  // Limpar o texto
  const cleanText = descriptionEN
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Se temos o arquivo de traduções carregado, usar ele
  if (state.movesTranslations && state.movesTranslations[moveName]) {
    return state.movesTranslations[moveName];
  }

  // Se não, retornar o texto original em inglês
  return cleanText;
}

// ===== FUNÇÕES DE BUSCA =====
async function searchPokemon() {
  const type1 = elements.type1.value;
  const type2 = elements.type2.value;

  if (!type1) {
    alert("Por favor, selecione pelo menos um tipo.");
    return;
  }

  showLoading(true);
  elements.pokemonGrid.innerHTML = "";
  elements.noResults.style.display = "none";
  elements.loadMore.style.display = "none";

  try {
    // Buscar dados do tipo principal
    const type1Data = await fetchTypeData(type1);
    let pokemonList = type1Data.pokemon.map((p) => p.pokemon.name);

    // Se houver segundo tipo, fazer interseção
    if (type2) {
      const type2Data = await fetchTypeData(type2);
      const type2Pokemon = type2Data.pokemon.map((p) => p.pokemon.name);

      // Interseção: Pokémon que têm AMBOS os tipos
      pokemonList = pokemonList.filter((name) => type2Pokemon.includes(name));
    }

    // Buscar detalhes de cada Pokémon
    const pokemonDetails = await Promise.all(
      pokemonList.map((name) => fetchPokemonDetails(name))
    );

    // Filtrar nulos e ordenar por ID
    state.currentResults = pokemonDetails
      .filter((p) => p !== null)
      .sort((a, b) => a.id - b.id);

    state.displayedCount = 0;

    showLoading(false);

    if (state.currentResults.length === 0) {
      elements.noResults.style.display = "block";
      elements.resultsCount.textContent = "";
    } else {
      elements.resultsCount.textContent = `(${state.currentResults.length} encontrados)`;
      displayMorePokemon();
    }
  } catch (error) {
    console.error("Erro na busca:", error);
    showLoading(false);
    elements.noResults.style.display = "block";
  }
}

function displayMorePokemon() {
  const start = state.displayedCount;
  const end = Math.min(start + ITEMS_PER_PAGE, state.currentResults.length);

  for (let i = start; i < end; i++) {
    const pokemon = state.currentResults[i];
    const card = createPokemonCard(pokemon);
    elements.pokemonGrid.appendChild(card);
  }

  state.displayedCount = end;

  // Mostrar/ocultar botão "Carregar Mais"
  if (state.displayedCount < state.currentResults.length) {
    elements.loadMore.style.display = "block";
  } else {
    elements.loadMore.style.display = "none";
  }
}

// ===== FUNÇÕES DE UI =====
function populateTypeSelects() {
  const options = state.types
    .map((type) => {
      const name = typeNames[type.name] || type.name;
      return `<option value="${type.name}">${name}</option>`;
    })
    .join("");

  elements.type1.innerHTML =
    '<option value="">Selecione um tipo...</option>' + options;
  elements.type2.innerHTML = '<option value="">Qualquer</option>' + options;
}

function createPokemonCard(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  const isInTeam = state.team.some((p) => p.id === pokemon.id);

  const card = document.createElement("div");
  card.className = `pokemon-card type-${primaryType}`;
  card.style.setProperty("--type-color", typeColors[primaryType]);

  // Calcular forças e fraquezas
  const matchups = calculateMatchups(pokemon.types.map((t) => t.type.name));

  card.innerHTML = `
        <div class="pokemon-card-header">
            <img class="pokemon-sprite" 
                 src="${
                   pokemon.sprites.other["official-artwork"].front_default ||
                   pokemon.sprites.front_default
                 }" 
                 alt="${pokemon.name}"
                 loading="lazy">
        </div>
        <div class="pokemon-card-body">
            <span class="pokemon-number">#${String(pokemon.id).padStart(
              3,
              "0"
            )}</span>
            <h3 class="pokemon-name">${pokemon.name}</h3>
            <div class="pokemon-types">
                ${pokemon.types
                  .map(
                    (t) => `
                    <span class="pokemon-type bg-${t.type.name}">${
                      typeNames[t.type.name] || t.type.name
                    }</span>
                `
                  )
                  .join("")}
            </div>
            <div class="pokemon-matchups">
                <div class="matchup-row">
                    <span class="matchup-label">Forte vs:</span>
                    <div class="matchup-types">
                        ${
                          matchups.strengths
                            .slice(0, 4)
                            .map(
                              (t) => `
                            <span class="matchup-type bg-${t}">${
                                typeNames[t] || t
                              }</span>
                        `
                            )
                            .join("") ||
                          '<span style="color: #999; font-size: 0.8rem;">-</span>'
                        }
                    </div>
                </div>
                <div class="matchup-row">
                    <span class="matchup-label">Fraco vs:</span>
                    <div class="matchup-types">
                        ${
                          matchups.weaknesses
                            .slice(0, 4)
                            .map(
                              (t) => `
                            <span class="matchup-type bg-${t}">${
                                typeNames[t] || t
                              }</span>
                        `
                            )
                            .join("") ||
                          '<span style="color: #999; font-size: 0.8rem;">-</span>'
                        }
                    </div>
                </div>
            </div>
        </div>
        <div class="pokemon-card-footer">
            <button class="btn-add-team ${isInTeam ? "in-team" : ""}" 
                    data-pokemon-id="${pokemon.id}"
                    ${isInTeam || state.team.length >= 6 ? "disabled" : ""}>
                ${isInTeam ? "✓ No Time" : "+ Adicionar ao Time"}
            </button>
        </div>
    `;

  // Evento de clique no card para abrir modal
  card.querySelector(".pokemon-card-header").addEventListener("click", () => {
    openPokemonModal(pokemon);
  });

  card.querySelector(".pokemon-card-body").addEventListener("click", () => {
    openPokemonModal(pokemon);
  });

  // Evento de adicionar ao time
  const addBtn = card.querySelector(".btn-add-team");
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!addBtn.disabled) {
      addToTeam(pokemon);
    }
  });

  return card;
}

function calculateMatchups(types) {
  const multipliers = {};

  // Inicializar todos os tipos com multiplicador 1
  Object.keys(typeColors).forEach((type) => {
    multipliers[type] = 1;
  });

  // Calcular multiplicadores baseado nos tipos do Pokémon
  types.forEach((typeName) => {
    const typeData = state.typeData[typeName];
    if (!typeData) return;

    const dr = typeData.damage_relations;

    // Fraquezas (2x dano recebido)
    dr.double_damage_from.forEach((t) => {
      if (multipliers[t.name] !== undefined) {
        multipliers[t.name] *= 2;
      }
    });

    // Resistências (0.5x dano recebido)
    dr.half_damage_from.forEach((t) => {
      if (multipliers[t.name] !== undefined) {
        multipliers[t.name] *= 0.5;
      }
    });

    // Imunidades (0x dano recebido)
    dr.no_damage_from.forEach((t) => {
      if (multipliers[t.name] !== undefined) {
        multipliers[t.name] = 0;
      }
    });
  });

  // Separar por categoria
  const weaknesses = [];
  const resistances = [];
  const immunities = [];
  const strengths = [];

  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult >= 2) weaknesses.push(type);
    else if (mult > 0 && mult < 1) resistances.push(type);
    else if (mult === 0) immunities.push(type);
  });

  // Forças ofensivas
  types.forEach((typeName) => {
    const typeData = state.typeData[typeName];
    if (!typeData) return;

    typeData.damage_relations.double_damage_to.forEach((t) => {
      if (!strengths.includes(t.name)) {
        strengths.push(t.name);
      }
    });
  });

  return { weaknesses, resistances, immunities, strengths };
}

// ===== FUNÇÕES DO TIME =====
function addToTeam(pokemon) {
  if (state.team.length >= 6) return;
  if (state.team.some((p) => p.id === pokemon.id)) return;

  state.team.push(pokemon);
  updateTeamUI();
  updateSearchResultsButtons();
}

function removeFromTeam(pokemonId) {
  state.team = state.team.filter((p) => p.id !== pokemonId);
  updateTeamUI();
  updateSearchResultsButtons();
}

function clearTeam() {
  state.team = [];
  updateTeamUI();
  updateSearchResultsButtons();
}

function updateTeamUI() {
  const slots = elements.teamGrid.querySelectorAll(".team-slot");

  slots.forEach((slot, index) => {
    if (state.team[index]) {
      const pokemon = state.team[index];
      slot.className = "team-slot filled";
      slot.innerHTML = `
                <span class="slot-number">${index + 1}</span>
                <img class="pokemon-sprite" 
                     src="${
                       pokemon.sprites.other["official-artwork"]
                         .front_default || pokemon.sprites.front_default
                     }" 
                     alt="${pokemon.name}"
                     title="${pokemon.name}">
                <button class="remove-btn" data-pokemon-id="${
                  pokemon.id
                }">×</button>
            `;

      // Evento de remover
      slot.querySelector(".remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromTeam(pokemon.id);
      });

      // Evento de clique para ver detalhes
      slot.addEventListener("click", () => {
        openPokemonModal(pokemon);
      });
    } else {
      slot.className = "team-slot empty";
      slot.innerHTML = `
                <span class="slot-number">${index + 1}</span>
                <span class="slot-empty-text">Vazio</span>
            `;
    }
  });

  elements.teamCount.textContent = `(${state.team.length}/6)`;
  elements.clearTeamBtn.disabled = state.team.length === 0;

  // Atualizar análise do time
  updateTeamAnalysis();
}

function updateTeamAnalysis() {
  if (state.team.length === 0) {
    elements.teamAnalysis.style.display = "none";
    return;
  }

  elements.teamAnalysis.style.display = "block";

  // Coletar todos os tipos do time
  const teamTypes = [];
  state.team.forEach((pokemon) => {
    pokemon.types.forEach((t) => {
      if (!teamTypes.includes(t.type.name)) {
        teamTypes.push(t.type.name);
      }
    });
  });

  // Contar fraquezas, resistências e imunidades
  const weaknessCount = {};
  const resistanceCount = {};
  const immunitySet = new Set();

  state.team.forEach((pokemon) => {
    const types = pokemon.types.map((t) => t.type.name);
    const matchups = calculateMatchups(types);

    matchups.weaknesses.forEach((type) => {
      weaknessCount[type] = (weaknessCount[type] || 0) + 1;
    });

    matchups.resistances.forEach((type) => {
      resistanceCount[type] = (resistanceCount[type] || 0) + 1;
    });

    matchups.immunities.forEach((type) => {
      immunitySet.add(type);
    });
  });

  // Ordenar por quantidade
  const sortedWeaknesses = Object.entries(weaknessCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const sortedResistances = Object.entries(resistanceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Renderizar
  elements.teamWeaknesses.innerHTML =
    sortedWeaknesses.length > 0
      ? sortedWeaknesses
          .map(
            ([type, count]) => `
            <span class="type-badge bg-${type}" title="${count} Pokémon fracos">
                ${typeNames[type] || type} <span class="mult">(${count})</span>
            </span>
        `
          )
          .join("")
      : '<span style="color: #999;">Nenhuma fraqueza comum</span>';

  elements.teamResistances.innerHTML =
    sortedResistances.length > 0
      ? sortedResistances
          .map(
            ([type, count]) => `
            <span class="type-badge bg-${type}" title="${count} Pokémon resistentes">
                ${typeNames[type] || type} <span class="mult">(${count})</span>
            </span>
        `
          )
          .join("")
      : '<span style="color: #999;">Nenhuma resistência comum</span>';

  elements.teamImmunities.innerHTML =
    immunitySet.size > 0
      ? Array.from(immunitySet)
          .map(
            (type) => `
            <span class="type-badge bg-${type}">
                ${typeNames[type] || type}
            </span>
        `
          )
          .join("")
      : '<span style="color: #999;">Nenhuma imunidade</span>';
}

function updateSearchResultsButtons() {
  const buttons = elements.pokemonGrid.querySelectorAll(".btn-add-team");
  buttons.forEach((btn) => {
    const pokemonId = parseInt(btn.dataset.pokemonId);
    const isInTeam = state.team.some((p) => p.id === pokemonId);

    btn.className = `btn-add-team ${isInTeam ? "in-team" : ""}`;
    btn.textContent = isInTeam ? "✓ No Time" : "+ Adicionar ao Time";
    btn.disabled = isInTeam || state.team.length >= 6;
  });
}

// ===== MODAL =====
function openPokemonModal(pokemon) {
  state.selectedPokemon = pokemon;
  const primaryType = pokemon.types[0].type.name;
  const matchups = calculateMatchups(pokemon.types.map((t) => t.type.name));
  const isInTeam = state.team.some((p) => p.id === pokemon.id);

  elements.modalBody.innerHTML = `
        <div class="modal-pokemon-header" style="--type-color: ${
          typeColors[primaryType]
        }">
            <img class="modal-pokemon-sprite" 
                 src="${
                   pokemon.sprites.other["official-artwork"].front_default ||
                   pokemon.sprites.front_default
                 }" 
                 alt="${pokemon.name}">
        </div>
        <div class="modal-pokemon-body">
            <h2 class="modal-pokemon-name">${pokemon.name}</h2>
            <p class="modal-pokemon-number">#${String(pokemon.id).padStart(
              3,
              "0"
            )}</p>
            
            <div class="modal-section">
                <h4>Tipos</h4>
                <div class="modal-types">
                    ${pokemon.types
                      .map(
                        (t) => `
                        <span class="modal-type bg-${t.type.name}">${
                          typeNames[t.type.name] || t.type.name
                        }</span>
                    `
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="modal-section">
                <h4>Status Base</h4>
                <div class="stats-grid">
                    ${pokemon.stats
                      .map((stat) => {
                        const statName = getStatName(stat.stat.name);
                        const percentage = Math.min(
                          (stat.base_stat / 255) * 100,
                          100
                        );
                        const color = getStatColor(stat.base_stat);
                        return `
                            <div class="stat-row">
                                <span class="stat-name">${statName}</span>
                                <div class="stat-bar-container">
                                    <div class="stat-bar" style="width: ${percentage}%; background: ${color}"></div>
                                </div>
                                <span class="stat-value">${stat.base_stat}</span>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            </div>
            
            <div class="modal-section">
                <h4>Matchups Defensivos</h4>
                <div class="modal-matchups-grid">
                    <div class="modal-matchup-card">
                        <h5>⚠️ Fraco contra</h5>
                        <div class="type-badges">
                            ${
                              matchups.weaknesses
                                .map(
                                  (t) => `
                                <span class="type-badge bg-${t}">${
                                    typeNames[t] || t
                                  }</span>
                            `
                                )
                                .join("") ||
                              '<span style="color: #999;">Nenhum</span>'
                            }
                        </div>
                    </div>
                    <div class="modal-matchup-card">
                        <h5>🛡️ Resiste a</h5>
                        <div class="type-badges">
                            ${
                              matchups.resistances
                                .map(
                                  (t) => `
                                <span class="type-badge bg-${t}">${
                                    typeNames[t] || t
                                  }</span>
                            `
                                )
                                .join("") ||
                              '<span style="color: #999;">Nenhum</span>'
                            }
                        </div>
                    </div>
                    <div class="modal-matchup-card">
                        <h5>✨ Imune a</h5>
                        <div class="type-badges">
                            ${
                              matchups.immunities
                                .map(
                                  (t) => `
                                <span class="type-badge bg-${t}">${
                                    typeNames[t] || t
                                  }</span>
                            `
                                )
                                .join("") ||
                              '<span style="color: #999;">Nenhum</span>'
                            }
                        </div>
                    </div>
                    <div class="modal-matchup-card">
                        <h5>⚔️ Forte contra</h5>
                        <div class="type-badges">
                            ${
                              matchups.strengths
                                .map(
                                  (t) => `
                                <span class="type-badge bg-${t}">${
                                    typeNames[t] || t
                                  }</span>
                            `
                                )
                                .join("") ||
                              '<span style="color: #999;">Nenhum</span>'
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            ${isInTeam ? '<div id="movesSection"></div>' : ""}
            
            <button class="modal-btn-add" 
                    id="modalAddBtn"
                    ${isInTeam || state.team.length >= 6 ? "disabled" : ""}>
                ${
                  isInTeam
                    ? "✓ Já está no Time"
                    : state.team.length >= 6
                    ? "Time Completo"
                    : "+ Adicionar ao Time"
                }
            </button>
        </div>
    `;

  // Evento de adicionar ao time no modal
  document.getElementById("modalAddBtn").addEventListener("click", () => {
    addToTeam(pokemon);
    closePokemonModal();
  });

  elements.modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Se o Pokémon está no time, carregar movimentos
  if (isInTeam) {
    loadPokemonMoves(pokemon);
  }
}

function closePokemonModal() {
  elements.modal.classList.remove("active");
  document.body.style.overflow = "";
  state.selectedPokemon = null;
}

async function loadPokemonMoves(pokemon) {
  const movesSection = document.getElementById("movesSection");
  if (!movesSection) return;

  movesSection.innerHTML = `
        <div class="modal-section moves-section">
            <h4>⚔️ Movimentos (selecione até 4)</h4>
            <div class="selected-moves" id="selectedMoves"></div>
            <div class="moves-filters">
                <button class="move-filter-btn active" data-filter="all">Todos</button>
                <button class="move-filter-btn" data-filter="level-up">Level Up</button>
                <button class="move-filter-btn" data-filter="machine">TM/HM</button>
                <button class="move-filter-btn" data-filter="tutor">Tutor</button>
            </div>
            <div class="moves-loading">
                <div class="pokeball-spinner"></div>
                <p>Carregando movimentos...</p>
            </div>
            <div class="moves-list" id="movesList"></div>
        </div>
    `;

  // Renderizar movimentos já selecionados
  renderSelectedMoves(pokemon.id);

  // Filtros
  const filterBtns = movesSection.querySelectorAll(".move-filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterMoves(pokemon, btn.dataset.filter);
    });
  });

  // Carregar movimentos
  await loadAllMoves(pokemon);
}

async function loadAllMoves(pokemon, filter = "all") {
  const movesList = document.getElementById("movesList");
  const movesLoading = document.querySelector(".moves-loading");

  // Organizar movimentos por método
  const movesByMethod = {
    "level-up": [],
    machine: [],
    tutor: [],
    other: [],
  };

  pokemon.moves.forEach((moveData) => {
    const latestVersion =
      moveData.version_group_details[moveData.version_group_details.length - 1];
    const method = latestVersion.move_learn_method.name;
    const level = latestVersion.level_learned_at;

    const moveInfo = {
      name: moveData.move.name,
      url: moveData.move.url,
      method: method,
      level: level,
    };

    if (method === "level-up") {
      movesByMethod["level-up"].push(moveInfo);
    } else if (method === "machine") {
      movesByMethod["machine"].push(moveInfo);
    } else if (method === "tutor") {
      movesByMethod["tutor"].push(moveInfo);
    } else {
      movesByMethod["other"].push(moveInfo);
    }
  });

  // Ordenar level-up por nível
  movesByMethod["level-up"].sort((a, b) => a.level - b.level);

  // Aplicar filtro
  let filteredMoves = [];
  if (filter === "all") {
    filteredMoves = [
      ...movesByMethod["level-up"],
      ...movesByMethod["machine"],
      ...movesByMethod["tutor"],
      ...movesByMethod["other"],
    ];
  } else {
    filteredMoves = movesByMethod[filter] || [];
  }

  // Buscar detalhes dos movimentos (primeiros 50 para não sobrecarregar)
  const movesToLoad = filteredMoves.slice(0, 50);
  const moveDetails = await Promise.all(
    movesToLoad.map((m) => fetchMoveDetails(m.name))
  );

  movesLoading.style.display = "none";

  if (moveDetails.length === 0) {
    movesList.innerHTML =
      '<p style="text-align: center; color: #999; padding: 20px;">Nenhum movimento encontrado.</p>';
    return;
  }

  // Limpar lista e preparar para renderização progressiva
  movesList.innerHTML = "";

  // Traduzir e renderizar um movimento por vez
  for (let index = 0; index < moveDetails.length; index++) {
    const move = moveDetails[index];
    if (!move) continue;

    const moveInfo = movesToLoad[index];
    const descriptionEn =
      move.effect_entries.find((e) => e.language.name === "en")?.short_effect ||
      move.flavor_text_entries.find((e) => e.language.name === "en")
        ?.flavor_text ||
      "No description available";

    // Traduzir a descrição usando o arquivo JSON
    const descriptionRaw = translateMoveDescription(move.name, descriptionEn);
    const description = sanitizeHTML(descriptionRaw);

    const power = move.power || "-";
    const accuracy = move.accuracy || "-";
    const pp = move.pp || "-";
    const damageClass = move.damage_class.name;

    const selectedMoves = state.teamMoves[pokemon.id] || [];
    const isSelected = selectedMoves.some((m) => m.name === move.name);

    // Criar o card do movimento
    const moveCard = document.createElement("div");
    moveCard.className = `move-card ${isSelected ? "selected" : ""}`;
    moveCard.setAttribute("data-move-name", move.name);
    moveCard.innerHTML = `
            <div class="move-header">
                <div class="move-info">
                    <span class="move-name">${formatMoveName(move.name)}</span>
                    <span class="move-type bg-${move.type.name}">${
      typeNames[move.type.name] || move.type.name
    }</span>
                    <span class="move-class ${damageClass}">${formatDamageClass(
      damageClass
    )}</span>
                </div>
                <button class="move-select-btn" data-move='${JSON.stringify({
                  name: move.name,
                  displayName: formatMoveName(move.name),
                  type: move.type.name,
                  power: power,
                  accuracy: accuracy,
                  pp: pp,
                  damageClass: damageClass,
                  description: description,
                })}' ${
      isSelected || selectedMoves.length >= 4 ? "disabled" : ""
    }>
                    ${isSelected ? "✓" : "+"}
                </button>
            </div>
            <div class="move-stats">
                ${
                  moveInfo.method === "level-up"
                    ? `<span class="move-method">Nv. ${moveInfo.level}</span>`
                    : ""
                }
                ${
                  moveInfo.method === "machine"
                    ? `<span class="move-method">TM/HM</span>`
                    : ""
                }
                ${
                  moveInfo.method === "tutor"
                    ? `<span class="move-method">Tutor</span>`
                    : ""
                }
                <span>Poder: ${power}</span>
                <span>Precisão: ${accuracy}${accuracy !== "-" ? "%" : ""}</span>
                <span>PP: ${pp}</span>
            </div>
            <p class="move-description">${description}</p>
        `;

    // Adicionar o card à lista imediatamente
    movesList.appendChild(moveCard);

    // Adicionar evento de seleção
    const selectBtn = moveCard.querySelector(".move-select-btn");
    selectBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      try {
        const moveData = JSON.parse(selectBtn.dataset.move);
        toggleMoveSelection(pokemon.id, moveData);
      } catch (error) {
        console.error("Erro ao processar dados do movimento:", error);
      }
    });
  }
}

function filterMoves(pokemon, filter) {
  loadAllMoves(pokemon, filter);
}

function toggleMoveSelection(pokemonId, moveData) {
  if (!state.teamMoves[pokemonId]) {
    state.teamMoves[pokemonId] = [];
  }

  const selectedMoves = state.teamMoves[pokemonId];
  const index = selectedMoves.findIndex((m) => m.name === moveData.name);

  if (index >= 0) {
    // Remover movimento
    selectedMoves.splice(index, 1);
  } else {
    // Adicionar movimento (máximo 4)
    if (selectedMoves.length < 4) {
      selectedMoves.push(moveData);
    }
  }

  renderSelectedMoves(pokemonId);

  // Atualizar lista de movimentos
  const moveCard = document.querySelector(
    `.move-card[data-move-name="${moveData.name}"]`
  );
  if (moveCard) {
    const btn = moveCard.querySelector(".move-select-btn");
    const isSelected = selectedMoves.some((m) => m.name === moveData.name);

    moveCard.classList.toggle("selected", isSelected);
    btn.textContent = isSelected ? "✓" : "+";
    btn.disabled = isSelected || selectedMoves.length >= 4;
  }

  // Atualizar todos os botões se atingiu o limite
  if (selectedMoves.length >= 4) {
    document
      .querySelectorAll(".move-select-btn:not([disabled])")
      .forEach((btn) => {
        const moveData = JSON.parse(btn.dataset.move);
        const isSelected = selectedMoves.some((m) => m.name === moveData.name);
        if (!isSelected) {
          btn.disabled = true;
        }
      });
  } else {
    document.querySelectorAll(".move-select-btn").forEach((btn) => {
      const moveData = JSON.parse(btn.dataset.move);
      const isSelected = selectedMoves.some((m) => m.name === moveData.name);
      if (!isSelected) {
        btn.disabled = false;
      }
    });
  }
}

function renderSelectedMoves(pokemonId) {
  const selectedMovesDiv = document.getElementById("selectedMoves");
  if (!selectedMovesDiv) return;

  const selectedMoves = state.teamMoves[pokemonId] || [];

  if (selectedMoves.length === 0) {
    selectedMovesDiv.innerHTML =
      '<p class="no-moves-selected">Nenhum movimento selecionado (0/4)</p>';
    return;
  }

  selectedMovesDiv.innerHTML = `
        <div class="selected-moves-header">
            <span>Movimentos Selecionados (${selectedMoves.length}/4)</span>
        </div>
        <div class="selected-moves-grid">
            ${selectedMoves
              .map(
                (move) => `
                <div class="selected-move-card">
                    <div class="selected-move-header">
                        <span class="selected-move-name">${
                          move.displayName
                        }</span>
                        <button class="remove-move-btn" data-move-name="${
                          move.name
                        }">×</button>
                    </div>
                    <div class="selected-move-info">
                        <span class="move-type bg-${move.type}">${
                  typeNames[move.type] || move.type
                }</span>
                        <span class="move-class ${
                          move.damageClass
                        }">${formatDamageClass(move.damageClass)}</span>
                    </div>
                    <div class="selected-move-stats">
                        <span>⚔️ ${move.power}</span>
                        <span>🎯 ${move.accuracy}${
                  move.accuracy !== "-" ? "%" : ""
                }</span>
                        <span>📊 ${move.pp} PP</span>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  // Eventos de remoção
  selectedMovesDiv.querySelectorAll(".remove-move-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const moveName = btn.dataset.moveName;
      const moveData = selectedMoves.find((m) => m.name === moveName);
      if (moveData) {
        toggleMoveSelection(pokemonId, moveData);
      }
    });
  });
}

function formatMoveName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDamageClass(damageClass) {
  const classes = {
    physical: "Físico",
    special: "Especial",
    status: "Status",
  };
  return classes[damageClass] || damageClass;
}

function getStatName(statName) {
  const names = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SP.ATK",
    "special-defense": "SP.DEF",
    speed: "SPD",
  };
  return names[statName] || statName;
}

function getStatColor(value) {
  if (value < 50) return "#e63946";
  if (value < 80) return "#f4a261";
  if (value < 100) return "#e9c46a";
  if (value < 120) return "#2a9d8f";
  return "#1d3557";
}

// ===== UTILIDADES =====
function showLoading(show) {
  elements.loading.style.display = show ? "block" : "none";
}

function showError(message) {
  elements.noResults.innerHTML = `<p>❌ ${sanitizeHTML(message)}</p>`;
  elements.noResults.style.display = "block";
}

function sanitizeHTML(str) {
  if (typeof str !== "string") return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function sortResults() {
  const sortBy = elements.sortBy.value;

  if (sortBy === "name") {
    state.currentResults.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    state.currentResults.sort((a, b) => a.id - b.id);
  }

  // Re-renderizar
  elements.pokemonGrid.innerHTML = "";
  state.displayedCount = 0;
  displayMorePokemon();
}

// ===== INICIALIZAÇÃO =====
async function init() {
  showLoading(true);

  try {
    // Carregar tipos
    await fetchTypes();

    if (state.types.length === 0) {
      showError(
        "Não foi possível carregar os tipos Pokémon. Verifique sua conexão e recarregue a página."
      );
      showLoading(false);
      return;
    }

    populateTypeSelects();

    // Pré-carregar dados de todos os tipos (para cálculos de matchup)
    await Promise.all(state.types.map((t) => fetchTypeData(t.name)));

    // Carregar traduções dos movimentos
    await loadMovesTranslations();
  } catch (error) {
    console.error("Erro na inicialização:", error);
    showError(
      "Ocorreu um erro ao carregar o aplicativo. Por favor, recarregue a página."
    );
  }

  showLoading(false);

  // Event Listeners
  elements.searchBtn.addEventListener("click", searchPokemon);
  elements.clearTeamBtn.addEventListener("click", clearTeam);
  elements.loadMoreBtn.addEventListener("click", displayMorePokemon);
  elements.sortBy.addEventListener("change", sortResults);
  elements.modalClose.addEventListener("click", closePokemonModal);

  // Fechar modal ao clicar fora
  elements.modal.addEventListener("click", (e) => {
    if (e.target === elements.modal) {
      closePokemonModal();
    }
  });

  // Fechar modal com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.modal.classList.contains("active")) {
      closePokemonModal();
    }
  });

  // Buscar por Enter nos selects
  elements.type1.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchPokemon();
  });
  elements.type2.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchPokemon();
  });
}

// Iniciar aplicação
init();
