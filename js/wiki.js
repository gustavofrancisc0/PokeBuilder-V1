// ===== WIKI - CONFIGURAÇÃO E ESTADO =====
const WIKI_API_BASE = "https://pokeapi.co/api/v2";
const WIKI_ITEMS_PER_PAGE = 36;

const wikiState = {
  // Pokédex
  allPokemon: [],
  filteredPokemon: [],
  displayedPokemonCount: 0,
  pokemonCache: {},
  pokemonDetailsCache: {}, // Cache para detalhes de Pokémon (para filtro de tipo)
  
  // Tipos
  typesData: {},
  typesLoaded: false,
  
  // Evoluções
  evolutionCache: {},
  speciesCache: {},
  
  // Naturezas
  natures: [],
  naturesLoaded: false,
  
  // Habilidades
  allAbilities: [],
  filteredAbilities: [],
  displayedAbilitiesCount: 0,
  abilitiesCache: {},
  abilitiesTranslations: null, // Traduções carregadas do abilities-pt.json
  
  // Itens
  allItems: [],
  filteredItems: [],
  displayedItemsCount: 0,
  
  // Berries
  allBerries: [],
  berriesLoaded: false,
  
  // Autocomplete
  autocompleteIndex: -1,
  
  // Geral
  currentWikiTab: 'pokedex',
  isLoading: false,
};

// Traduções de naturezas para português
const natureTranslations = {
  hardy: "Firme",
  lonely: "Solitário",
  brave: "Bravo",
  adamant: "Adamante",
  naughty: "Travesso",
  bold: "Ousado",
  docile: "Dócil",
  relaxed: "Relaxado",
  impish: "Sagaz",
  lax: "Relaxado",
  timid: "Tímido",
  hasty: "Apressado",
  serious: "Sério",
  jolly: "Alegre",
  naive: "Ingênuo",
  modest: "Modesto",
  mild: "Suave",
  quiet: "Quieto",
  bashful: "Acanhado",
  rash: "Impetuoso",
  calm: "Calmo",
  gentle: "Gentil",
  sassy: "Atrevido",
  careful: "Cuidadoso",
  quirky: "Peculiar"
};

// Traduções de sabores
const flavorTranslations = {
  spicy: "Picante",
  dry: "Seco",
  sweet: "Doce",
  bitter: "Amargo",
  sour: "Azedo"
};

// Traduções de stats
const statTranslations = {
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque Esp.",
  "special-defense": "Defesa Esp.",
  speed: "Velocidade",
  hp: "HP"
};

// Gerações e ranges
const generationRanges = {
  1: { start: 1, end: 151, name: "Kanto" },
  2: { start: 152, end: 251, name: "Johto" },
  3: { start: 252, end: 386, name: "Hoenn" },
  4: { start: 387, end: 493, name: "Sinnoh" },
  5: { start: 494, end: 649, name: "Unova" },
  6: { start: 650, end: 721, name: "Kalos" },
  7: { start: 722, end: 809, name: "Alola" },
  8: { start: 810, end: 905, name: "Galar" },
  9: { start: 906, end: 1025, name: "Paldea" }
};

// ===== ELEMENTOS DA WIKI =====
const wikiElements = {
  // Abas principais
  mainTabs: document.querySelectorAll('.main-tab'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Abas da Wiki
  wikiTabs: document.querySelectorAll('.wiki-tab'),
  wikiSections: document.querySelectorAll('.wiki-section'),
  
  // Pokédex
  wikiSearch: document.getElementById('wikiSearch'),
  wikiAutocomplete: document.getElementById('wikiAutocomplete'),
  clearWikiSearch: document.getElementById('clearWikiSearch'),
  wikiSearchBtn: document.getElementById('wikiSearchBtn'),
  wikiTypeFilter: document.getElementById('wikiTypeFilter'),
  wikiGenFilter: document.getElementById('wikiGenFilter'),
  wikiSortFilter: document.getElementById('wikiSortFilter'),
  totalPokemonCount: document.getElementById('totalPokemonCount'),
  filteredPokemonCount: document.getElementById('filteredPokemonCount'),
  wikiLoading: document.getElementById('wikiLoading'),
  pokedexGrid: document.getElementById('pokedexGrid'),
  wikiLoadMore: document.getElementById('wikiLoadMore'),
  wikiLoadMoreBtn: document.getElementById('wikiLoadMoreBtn'),
  
  // Tipos
  typesGrid: document.getElementById('typesGrid'),
  typeDetailPanel: document.getElementById('typeDetailPanel'),
  typeDetailContent: document.getElementById('typeDetailContent'),
  closeTypeDetail: document.getElementById('closeTypeDetail'),
  
  // Evoluções
  evolutionSearch: document.getElementById('evolutionSearch'),
  evolutionAutocomplete: document.getElementById('evolutionAutocomplete'),
  evolutionSearchBtn: document.getElementById('evolutionSearchBtn'),
  evolutionResult: document.getElementById('evolutionResult'),
  popularEvolutions: document.getElementById('popularEvolutions'),
  
  // Naturezas
  natureStatFilter: document.getElementById('natureStatFilter'),
  naturesLoading: document.getElementById('naturesLoading'),
  naturesTableContainer: document.getElementById('naturesTableContainer'),
  naturesTableBody: document.getElementById('naturesTableBody'),
  calcNature: document.getElementById('calcNature'),
  calcBaseStat: document.getElementById('calcBaseStat'),
  calcNatureBtn: document.getElementById('calcNatureBtn'),
  calcNatureResult: document.getElementById('calcNatureResult'),
  
  // Habilidades
  abilitySearch: document.getElementById('abilitySearch'),
  abilitySearchBtn: document.getElementById('abilitySearchBtn'),
  abilitiesCount: document.getElementById('abilitiesCount'),
  abilitiesLoading: document.getElementById('abilitiesLoading'),
  abilitiesGrid: document.getElementById('abilitiesGrid'),
  abilitiesLoadMore: document.getElementById('abilitiesLoadMore'),
  abilitiesLoadMoreBtn: document.getElementById('abilitiesLoadMoreBtn'),
  
  // Itens
  itemCategoryFilter: document.getElementById('itemCategoryFilter'),
  itemSearch: document.getElementById('itemSearch'),
  itemAutocomplete: document.getElementById('itemAutocomplete'),
  itemsLoading: document.getElementById('itemsLoading'),
  itemsGrid: document.getElementById('itemsGrid'),
  itemsLoadMore: document.getElementById('itemsLoadMore'),
  itemsLoadMoreBtn: document.getElementById('itemsLoadMoreBtn'),
  
  // Berries
  berriesLoading: document.getElementById('berriesLoading'),
  berriesGrid: document.getElementById('berriesGrid'),
  
  // Regiões
  regionsGrid: document.getElementById('regionsGrid'),
  regionDetails: document.getElementById('regionDetails'),
  backToRegions: document.getElementById('backToRegions'),
  regionDetailsContent: document.getElementById('regionDetailsContent'),
  
  // Modals
  wikiDetailModal: document.getElementById('wikiDetailModal'),
  wikiDetailClose: document.getElementById('wikiDetailClose'),
  wikiDetailBody: document.getElementById('wikiDetailBody'),
};

// ===== FUNÇÕES DE API WIKI =====

async function fetchPokemonList() {
  try {
    const response = await fetch(`${WIKI_API_BASE}/pokemon?limit=2000`);
    const data = await response.json();
    return data.results.map((p, index) => ({
      name: p.name,
      id: index + 1,
      url: p.url
    }));
  } catch (error) {
    console.error("Erro ao buscar lista de Pokémon:", error);
    return [];
  }
}

async function fetchPokemonData(nameOrId) {
  if (wikiState.pokemonCache[nameOrId]) {
    return wikiState.pokemonCache[nameOrId];
  }
  
  try {
    const response = await fetch(`${WIKI_API_BASE}/pokemon/${nameOrId}`);
    const data = await response.json();
    wikiState.pokemonCache[nameOrId] = data;
    wikiState.pokemonCache[data.id] = data;
    wikiState.pokemonCache[data.name] = data;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar Pokémon ${nameOrId}:`, error);
    return null;
  }
}

async function fetchPokemonSpecies(nameOrId) {
  if (wikiState.speciesCache[nameOrId]) {
    return wikiState.speciesCache[nameOrId];
  }
  
  try {
    const response = await fetch(`${WIKI_API_BASE}/pokemon-species/${nameOrId}`);
    const data = await response.json();
    wikiState.speciesCache[nameOrId] = data;
    wikiState.speciesCache[data.id] = data;
    wikiState.speciesCache[data.name] = data;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar species ${nameOrId}:`, error);
    return null;
  }
}

async function fetchEvolutionChain(url) {
  if (wikiState.evolutionCache[url]) {
    return wikiState.evolutionCache[url];
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    wikiState.evolutionCache[url] = data;
    return data;
  } catch (error) {
    console.error("Erro ao buscar cadeia de evolução:", error);
    return null;
  }
}

async function fetchAllNatures() {
  try {
    const response = await fetch(`${WIKI_API_BASE}/nature?limit=25`);
    const data = await response.json();
    
    const natures = await Promise.all(
      data.results.map(async (n) => {
        const res = await fetch(n.url);
        return res.json();
      })
    );
    
    return natures;
  } catch (error) {
    console.error("Erro ao buscar naturezas:", error);
    return [];
  }
}

async function fetchAbilitiesList() {
  try {
    const response = await fetch(`${WIKI_API_BASE}/ability?limit=400`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar habilidades:", error);
    return [];
  }
}

// Carregar traduções de habilidades do JSON
async function loadAbilitiesTranslations() {
  if (wikiState.abilitiesTranslations !== null) return;
  
  try {
    const response = await fetch("data/abilities-pt.json");
    wikiState.abilitiesTranslations = await response.json();
    console.log(`Traduções de habilidades carregadas: ${Object.keys(wikiState.abilitiesTranslations).length}`);
  } catch (error) {
    console.warn("⚠️ Arquivo abilities-pt.json não encontrado. Usando descrições em inglês.");
    wikiState.abilitiesTranslations = {};
  }
}

// Obter descrição traduzida da habilidade
function getTranslatedAbilityDescription(ability) {
  // Tentar tradução em português primeiro
  if (wikiState.abilitiesTranslations && wikiState.abilitiesTranslations[ability.name]) {
    return wikiState.abilitiesTranslations[ability.name];
  }
  
  // Fallback para descrição em inglês
  const enDescription = ability.effect_entries.find(e => e.language.name === 'en')?.effect
    || ability.effect_entries.find(e => e.language.name === 'en')?.short_effect
    || ability.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text
    || 'Descrição não disponível';
  
  return enDescription;
}

async function fetchAbilityData(nameOrId) {
  if (wikiState.abilitiesCache[nameOrId]) {
    return wikiState.abilitiesCache[nameOrId];
  }
  
  try {
    const response = await fetch(`${WIKI_API_BASE}/ability/${nameOrId}`);
    const data = await response.json();
    wikiState.abilitiesCache[nameOrId] = data;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar habilidade ${nameOrId}:`, error);
    return null;
  }
}

async function fetchItemsList() {
  try {
    const response = await fetch(`${WIKI_API_BASE}/item?limit=2000`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return [];
  }
}

async function fetchItemData(nameOrId) {
  try {
    const response = await fetch(`${WIKI_API_BASE}/item/${nameOrId}`);
    return response.json();
  } catch (error) {
    console.error(`Erro ao buscar item ${nameOrId}:`, error);
    return null;
  }
}

async function fetchAllBerries() {
  try {
    const response = await fetch(`${WIKI_API_BASE}/berry?limit=100`);
    const data = await response.json();
    
    const berries = await Promise.all(
      data.results.map(async (b) => {
        const res = await fetch(b.url);
        return res.json();
      })
    );
    
    return berries;
  } catch (error) {
    console.error("Erro ao buscar berries:", error);
    return [];
  }
}

// ===== SISTEMA DE ABAS =====

function initTabs() {
  // Abas principais (Builder / Wiki)
  wikiElements.mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      wikiElements.mainTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      wikiElements.tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-content`) {
          content.classList.add('active');
        }
      });
      
      // Inicializar wiki na primeira vez que acessar
      if (tabId === 'wiki' && wikiState.allPokemon.length === 0) {
        initPokedex();
      }
    });
  });
  
  // Abas da Wiki
  wikiElements.wikiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.wikiTab;
      
      wikiElements.wikiTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      wikiElements.wikiSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${tabId}-section`) {
          section.classList.add('active');
        }
      });
      
      wikiState.currentWikiTab = tabId;
      
      // Carregar dados da seção se necessário
      loadWikiSection(tabId);
    });
  });
}

function loadWikiSection(section) {
  switch (section) {
    case 'pokedex':
      if (wikiState.allPokemon.length === 0) initPokedex();
      break;
    case 'types':
      if (!wikiState.typesLoaded) loadTypesSection();
      break;
    case 'natures':
      if (!wikiState.naturesLoaded) loadNatures();
      break;
    case 'abilities':
      if (wikiState.allAbilities.length === 0) loadAbilities();
      break;
    case 'items':
      if (wikiState.allItems.length === 0) loadItems();
      break;
    case 'berries':
      if (!wikiState.berriesLoaded) loadBerries();
      break;
  }
}

// ===== POKÉDEX =====

async function initPokedex() {
  wikiElements.wikiLoading.style.display = 'block';
  wikiElements.pokedexGrid.innerHTML = '';
  
  // Carregar lista de Pokémon
  wikiState.allPokemon = await fetchPokemonList();
  wikiState.filteredPokemon = [...wikiState.allPokemon];
  
  // Atualizar contadores
  wikiElements.totalPokemonCount.textContent = wikiState.allPokemon.length;
  
  // Popular filtro de tipos
  populateTypeFilter();
  
  // Mostrar primeiros Pokémon
  wikiState.displayedPokemonCount = 0;
  await displayMorePokedex();
  
  wikiElements.wikiLoading.style.display = 'none';
}

function populateTypeFilter() {
  const types = Object.keys(typeNames);
  wikiElements.wikiTypeFilter.innerHTML = '<option value="">Todos os tipos</option>';
  
  types.forEach(type => {
    wikiElements.wikiTypeFilter.innerHTML += `
      <option value="${type}">${typeNames[type]}</option>
    `;
  });
}

async function displayMorePokedex() {
  const start = wikiState.displayedPokemonCount;
  const end = Math.min(start + WIKI_ITEMS_PER_PAGE, wikiState.filteredPokemon.length);
  
  const pokemonToShow = wikiState.filteredPokemon.slice(start, end);
  
  // Set para rastrear IDs já exibidos e evitar duplicatas
  const displayedIds = new Set();
  wikiElements.pokedexGrid.querySelectorAll('.pokedex-card').forEach(card => {
    const numberText = card.querySelector('.pokedex-card-number')?.textContent;
    if (numberText) {
      displayedIds.add(parseInt(numberText.replace('#', '')));
    }
  });
  
  // Buscar detalhes em paralelo (batches de 12)
  for (let i = 0; i < pokemonToShow.length; i += 12) {
    const batch = pokemonToShow.slice(i, i + 12);
    const details = await Promise.all(batch.map(p => fetchPokemonData(p.id)));
    
    details.forEach(pokemon => {
      if (pokemon && !displayedIds.has(pokemon.id)) {
        displayedIds.add(pokemon.id);
        const card = createPokedexCard(pokemon);
        wikiElements.pokedexGrid.appendChild(card);
      }
    });
  }
  
  wikiState.displayedPokemonCount = end;
  wikiElements.filteredPokemonCount.textContent = wikiElements.pokedexGrid.querySelectorAll('.pokedex-card').length;
  
  // Mostrar/ocultar botão de carregar mais
  if (wikiState.displayedPokemonCount < wikiState.filteredPokemon.length) {
    wikiElements.wikiLoadMore.style.display = 'block';
  } else {
    wikiElements.wikiLoadMore.style.display = 'none';
  }
}

function createPokedexCard(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  
  const card = document.createElement('div');
  card.className = 'pokedex-card';
  card.style.setProperty('--type-color', typeColors[primaryType]);
  
  card.innerHTML = `
    <span class="pokedex-card-number">#${String(pokemon.id).padStart(3, '0')}</span>
    <img 
      class="pokedex-card-sprite" 
      src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
      alt="${pokemon.name}"
      loading="lazy"
    />
    <p class="pokedex-card-name">${pokemon.name}</p>
    <div class="pokedex-card-types">
      ${pokemon.types.map(t => `
        <span class="pokedex-type-badge bg-${t.type.name}">${typeNames[t.type.name] || t.type.name}</span>
      `).join('')}
    </div>
  `;
  
  card.addEventListener('click', () => openPokemonModal(pokemon));
  
  return card;
}

async function filterPokedex() {
  const searchTerm = wikiElements.wikiSearch.value.toLowerCase().trim();
  const typeFilter = wikiElements.wikiTypeFilter.value;
  const genFilter = wikiElements.wikiGenFilter.value;
  const sortOption = wikiElements.wikiSortFilter.value;
  
  wikiElements.wikiLoading.style.display = 'block';
  wikiElements.pokedexGrid.innerHTML = '';
  
  // Fechar autocomplete
  if (wikiElements.wikiAutocomplete) {
    wikiElements.wikiAutocomplete.classList.remove('show');
  }
  
  // Filtrar por geração primeiro (não precisa de API)
  let filtered = wikiState.allPokemon.filter(pokemon => {
    // Filtro de busca
    if (searchTerm) {
      const matchesName = pokemon.name.toLowerCase().includes(searchTerm);
      const matchesId = pokemon.id.toString() === searchTerm;
      if (!matchesName && !matchesId) return false;
    }
    
    // Filtro de geração
    if (genFilter) {
      const range = generationRanges[genFilter];
      if (pokemon.id < range.start || pokemon.id > range.end) return false;
    }
    
    return true;
  });
  
  // Se há filtro de tipo, precisamos buscar detalhes
  if (typeFilter) {
    const typeData = await fetch(`${WIKI_API_BASE}/type/${typeFilter}`).then(r => r.json());
    const pokemonWithType = new Set(typeData.pokemon.map(p => p.pokemon.name));
    
    filtered = filtered.filter(pokemon => pokemonWithType.has(pokemon.name));
  }
  
  // Remover duplicatas baseado no ID
  const seenIds = new Set();
  filtered = filtered.filter(pokemon => {
    if (seenIds.has(pokemon.id)) {
      return false;
    }
    seenIds.add(pokemon.id);
    return true;
  });
  
  // Ordenar
  const [sortBy, sortDir] = sortOption.split('-');
  filtered.sort((a, b) => {
    if (sortBy === 'id') {
      return sortDir === 'asc' ? a.id - b.id : b.id - a.id;
    } else if (sortBy === 'name') {
      return sortDir === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    return 0;
  });
  
  wikiState.filteredPokemon = filtered;
  wikiState.displayedPokemonCount = 0;
  
  await displayMorePokedex();
  
  wikiElements.wikiLoading.style.display = 'none';
}

// ===== EVOLUÇÕES =====

async function searchEvolution() {
  const searchTerm = wikiElements.evolutionSearch.value.toLowerCase().trim();
  if (!searchTerm) return;
  
  wikiElements.evolutionResult.innerHTML = `
    <div class="wiki-loading">
      <div class="pokeball-spinner"></div>
      <p>Buscando evolução...</p>
    </div>
  `;
  
  try {
    // Buscar species para obter evolution chain
    const species = await fetchPokemonSpecies(searchTerm);
    if (!species) {
      throw new Error('Pokémon não encontrado');
    }
    
    // Buscar evolution chain
    const evolutionChain = await fetchEvolutionChain(species.evolution_chain.url);
    if (!evolutionChain) {
      throw new Error('Cadeia de evolução não encontrada');
    }
    
    // Renderizar cadeia de evolução
    await renderEvolutionChain(evolutionChain.chain);
    
  } catch (error) {
    wikiElements.evolutionResult.innerHTML = `
      <div class="evolution-placeholder">
        <span class="placeholder-icon">❌</span>
        <p>Pokémon não encontrado. Verifique o nome e tente novamente.</p>
      </div>
    `;
  }
}

async function renderEvolutionChain(chain) {
  const evolutions = [];
  
  // Função recursiva para extrair evoluções
  async function extractEvolutions(node, level = 0) {
    const pokemon = await fetchPokemonData(node.species.name);
    
    const evoData = {
      pokemon: pokemon,
      level: level,
      evolvesTo: [],
      conditions: []
    };
    
    // Extrair condições de evolução
    if (node.evolution_details && node.evolution_details.length > 0) {
      const details = node.evolution_details[0];
      
      if (details.min_level) {
        evoData.conditions.push(`Nível ${details.min_level}`);
      }
      if (details.item) {
        evoData.conditions.push(formatName(details.item.name));
      }
      if (details.trigger && details.trigger.name === 'trade') {
        evoData.conditions.push('Troca');
      }
      if (details.min_happiness) {
        evoData.conditions.push('Felicidade alta');
      }
      if (details.time_of_day) {
        evoData.conditions.push(details.time_of_day === 'day' ? 'De dia' : 'De noite');
      }
      if (details.known_move_type) {
        evoData.conditions.push(`Saber golpe ${typeNames[details.known_move_type.name] || details.known_move_type.name}`);
      }
      if (details.location) {
        evoData.conditions.push('Local especial');
      }
      if (details.held_item) {
        evoData.conditions.push(`Segurando ${formatName(details.held_item.name)}`);
      }
    }
    
    evolutions.push(evoData);
    
    // Processar evoluções seguintes
    for (const nextEvo of node.evolves_to) {
      await extractEvolutions(nextEvo, level + 1);
    }
  }
  
  await extractEvolutions(chain);
  
  // Organizar por níveis
  const levels = {};
  evolutions.forEach(evo => {
    if (!levels[evo.level]) levels[evo.level] = [];
    levels[evo.level].push(evo);
  });
  
  // Renderizar
  let html = '<div class="evolution-chain">';
  
  const levelKeys = Object.keys(levels).map(Number).sort((a, b) => a - b);
  
  levelKeys.forEach((level, index) => {
    const evosAtLevel = levels[level];
    
    if (evosAtLevel.length > 1) {
      // Múltiplas evoluções (como Eevee)
      html += '<div class="evolution-branches">';
      evosAtLevel.forEach(evo => {
        html += `
          <div class="evolution-branch">
            ${index > 0 ? `
              <div class="evolution-arrow">
                <span class="arrow-icon">→</span>
                ${evo.conditions.length > 0 ? `<span class="evo-condition">${evo.conditions.join(', ')}</span>` : ''}
              </div>
            ` : ''}
            <div class="evolution-pokemon" data-pokemon="${evo.pokemon.name}">
              <img src="${evo.pokemon.sprites.other['official-artwork'].front_default || evo.pokemon.sprites.front_default}" alt="${evo.pokemon.name}" />
              <p class="evo-name">${evo.pokemon.name}</p>
              <span class="evo-number">#${String(evo.pokemon.id).padStart(3, '0')}</span>
            </div>
          </div>
        `;
      });
      html += '</div>';
    } else {
      const evo = evosAtLevel[0];
      
      if (index > 0) {
        html += `
          <div class="evolution-arrow">
            <span class="arrow-icon">→</span>
            ${evo.conditions.length > 0 ? `<span class="evo-condition">${evo.conditions.join(', ')}</span>` : ''}
          </div>
        `;
      }
      
      html += `
        <div class="evolution-pokemon" data-pokemon="${evo.pokemon.name}">
          <img src="${evo.pokemon.sprites.other['official-artwork'].front_default || evo.pokemon.sprites.front_default}" alt="${evo.pokemon.name}" />
          <p class="evo-name">${evo.pokemon.name}</p>
          <span class="evo-number">#${String(evo.pokemon.id).padStart(3, '0')}</span>
        </div>
      `;
    }
  });
  
  html += '</div>';
  
  wikiElements.evolutionResult.innerHTML = html;
  
  // Adicionar eventos de clique
  wikiElements.evolutionResult.querySelectorAll('.evolution-pokemon').forEach(el => {
    el.addEventListener('click', async () => {
      const pokemon = await fetchPokemonData(el.dataset.pokemon);
      if (pokemon) openPokemonModal(pokemon);
    });
  });
}

// ===== NATUREZAS =====

async function loadNatures() {
  wikiElements.naturesLoading.style.display = 'block';
  
  wikiState.natures = await fetchAllNatures();
  wikiState.naturesLoaded = true;
  
  renderNaturesTable();
  populateNatureCalculator();
  
  wikiElements.naturesLoading.style.display = 'none';
  wikiElements.naturesTableContainer.style.display = 'block';
}

function renderNaturesTable(filter = '') {
  let natures = [...wikiState.natures];
  
  // Filtrar
  if (filter === 'neutral') {
    natures = natures.filter(n => !n.increased_stat || !n.decreased_stat);
  } else if (filter) {
    natures = natures.filter(n => n.increased_stat && n.increased_stat.name === filter);
  }
  
  // Ordenar por nome
  natures.sort((a, b) => a.name.localeCompare(b.name));
  
  let html = '';
  
  natures.forEach(nature => {
    const isNeutral = !nature.increased_stat || !nature.decreased_stat;
    const ptName = natureTranslations[nature.name] || formatName(nature.name);
    
    const increasedStat = nature.increased_stat 
      ? statTranslations[nature.increased_stat.name] || nature.increased_stat.name
      : '-';
    const decreasedStat = nature.decreased_stat
      ? statTranslations[nature.decreased_stat.name] || nature.decreased_stat.name
      : '-';
    
    const likesFlavor = nature.likes_flavor
      ? flavorTranslations[nature.likes_flavor.name] || nature.likes_flavor.name
      : '-';
    const hatesFlavor = nature.hates_flavor
      ? flavorTranslations[nature.hates_flavor.name] || nature.hates_flavor.name
      : '-';
    
    html += `
      <tr class="${isNeutral ? 'neutral' : ''}">
        <td><strong>${formatName(nature.name)}</strong></td>
        <td>${ptName}</td>
        <td class="${isNeutral ? 'neutral-text' : 'stat-increase'}">${isNeutral ? '-' : `+${increasedStat}`}</td>
        <td class="${isNeutral ? 'neutral-text' : 'stat-decrease'}">${isNeutral ? '-' : `-${decreasedStat}`}</td>
        <td>${likesFlavor}</td>
        <td>${hatesFlavor}</td>
      </tr>
    `;
  });
  
  wikiElements.naturesTableBody.innerHTML = html;
}

function populateNatureCalculator() {
  wikiElements.calcNature.innerHTML = '<option value="">Selecione...</option>';
  
  wikiState.natures
    .filter(n => n.increased_stat && n.decreased_stat)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(nature => {
      wikiElements.calcNature.innerHTML += `
        <option value="${nature.name}" 
                data-increase="${nature.increased_stat.name}" 
                data-decrease="${nature.decreased_stat.name}">
          ${formatName(nature.name)} (+${statTranslations[nature.increased_stat.name]}, -${statTranslations[nature.decreased_stat.name]})
        </option>
      `;
    });
}

function calculateNatureEffect() {
  const natureSelect = wikiElements.calcNature;
  const baseStat = parseInt(wikiElements.calcBaseStat.value);
  
  if (!natureSelect.value || isNaN(baseStat)) {
    alert('Por favor, selecione uma natureza e insira um valor de stat base.');
    return;
  }
  
  const selectedOption = natureSelect.options[natureSelect.selectedIndex];
  const increasedStat = selectedOption.dataset.increase;
  const decreasedStat = selectedOption.dataset.decrease;
  
  const increasedValue = Math.floor(baseStat * 1.1);
  const decreasedValue = Math.floor(baseStat * 0.9);
  
  wikiElements.calcNatureResult.innerHTML = `
    <p><strong>Natureza ${formatName(natureSelect.value)}:</strong></p>
    <p>Stat Base: <strong>${baseStat}</strong></p>
    <p>
      Se for <strong>${statTranslations[increasedStat]}</strong>: 
      <span class="result-stat increase">${increasedValue}</span> (+${increasedValue - baseStat})
    </p>
    <p>
      Se for <strong>${statTranslations[decreasedStat]}</strong>: 
      <span class="result-stat decrease">${decreasedValue}</span> (${decreasedValue - baseStat})
    </p>
  `;
  wikiElements.calcNatureResult.classList.add('show');
}

// ===== HABILIDADES =====

async function loadAbilities() {
  wikiElements.abilitiesLoading.style.display = 'block';
  
  // Carregar traduções primeiro
  await loadAbilitiesTranslations();
  
  wikiState.allAbilities = await fetchAbilitiesList();
  wikiState.filteredAbilities = [...wikiState.allAbilities];
  wikiState.displayedAbilitiesCount = 0;
  
  await displayMoreAbilities();
  
  wikiElements.abilitiesLoading.style.display = 'none';
  wikiElements.abilitiesCount.textContent = `${wikiState.allAbilities.length} habilidades encontradas`;
}

async function displayMoreAbilities() {
  const start = wikiState.displayedAbilitiesCount;
  const end = Math.min(start + WIKI_ITEMS_PER_PAGE, wikiState.filteredAbilities.length);
  
  const abilitiesToShow = wikiState.filteredAbilities.slice(start, end);
  
  // Buscar detalhes em paralelo
  const details = await Promise.all(abilitiesToShow.map(a => fetchAbilityData(a.name)));
  
  details.forEach(ability => {
    if (ability) {
      const card = createAbilityCard(ability);
      wikiElements.abilitiesGrid.appendChild(card);
    }
  });
  
  wikiState.displayedAbilitiesCount = end;
  
  // Mostrar/ocultar botão de carregar mais
  if (wikiState.displayedAbilitiesCount < wikiState.filteredAbilities.length) {
    wikiElements.abilitiesLoadMore.style.display = 'block';
  } else {
    wikiElements.abilitiesLoadMore.style.display = 'none';
  }
}

function createAbilityCard(ability) {
  const description = getTranslatedAbilityDescription(ability);
  
  const card = document.createElement('div');
  card.className = 'ability-card';
  
  card.innerHTML = `
    <div class="ability-card-header">
      <span class="ability-name">${formatName(ability.name)}</span>
      <span class="ability-badge ${ability.is_main_series ? 'normal' : 'hidden'}">
        ${ability.is_main_series ? 'Normal' : 'Oculta'}
      </span>
    </div>
    <p class="ability-description">${sanitizeHTML(description).substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
  `;
  
  card.addEventListener('click', () => openAbilityModal(ability));
  
  return card;
}

async function searchAbilities() {
  const searchTerm = wikiElements.abilitySearch.value.toLowerCase().trim();
  
  wikiElements.abilitiesGrid.innerHTML = '';
  wikiState.displayedAbilitiesCount = 0;
  
  if (searchTerm) {
    wikiState.filteredAbilities = wikiState.allAbilities.filter(a => 
      a.name.toLowerCase().includes(searchTerm)
    );
  } else {
    wikiState.filteredAbilities = [...wikiState.allAbilities];
  }
  
  wikiElements.abilitiesCount.textContent = `${wikiState.filteredAbilities.length} habilidades encontradas`;
  
  await displayMoreAbilities();
}

function openAbilityModal(ability) {
  const description = getTranslatedAbilityDescription(ability);
  
  const pokemonWithAbility = ability.pokemon.slice(0, 10);
  
  wikiElements.wikiDetailBody.innerHTML = `
    <div class="wiki-detail-content">
      <h2>${formatName(ability.name)}</h2>
      <span class="ability-badge ${ability.is_main_series ? 'normal' : 'hidden'}" style="margin-bottom: 20px; display: inline-block;">
        ${ability.is_main_series ? 'Habilidade Normal' : 'Habilidade Oculta'}
      </span>
      
      <div class="detail-section">
        <h4>Efeito</h4>
        <p>${sanitizeHTML(description)}</p>
      </div>
      
      ${pokemonWithAbility.length > 0 ? `
        <div class="detail-section">
          <h4>Pokémon com esta habilidade</h4>
          <div class="pokemon-ability-list">
            ${pokemonWithAbility.map(p => `
              <span class="pokemon-ability-tag">${formatName(p.pokemon.name)}</span>
            `).join('')}
            ${ability.pokemon.length > 10 ? `<span class="pokemon-ability-more">+${ability.pokemon.length - 10} mais</span>` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  wikiElements.wikiDetailModal.classList.add('active');
}

// ===== ITENS =====

async function loadItems() {
  wikiElements.itemsLoading.style.display = 'block';
  
  wikiState.allItems = await fetchItemsList();
  wikiState.filteredItems = [...wikiState.allItems];
  wikiState.displayedItemsCount = 0;
  
  await displayMoreItems();
  
  wikiElements.itemsLoading.style.display = 'none';
}

async function displayMoreItems() {
  const start = wikiState.displayedItemsCount;
  const end = Math.min(start + WIKI_ITEMS_PER_PAGE, wikiState.filteredItems.length);
  
  const itemsToShow = wikiState.filteredItems.slice(start, end);
  
  // Set para rastrear itens já exibidos e evitar duplicatas
  const displayedItems = new Set();
  wikiElements.itemsGrid.querySelectorAll('.item-card').forEach(card => {
    const itemName = card.querySelector('.item-name')?.textContent;
    if (itemName) {
      displayedItems.add(itemName.toLowerCase().replace(/ /g, '-'));
    }
  });
  
  // Buscar detalhes em paralelo (batches)
  for (let i = 0; i < itemsToShow.length; i += 12) {
    const batch = itemsToShow.slice(i, i + 12);
    const details = await Promise.all(batch.map(item => fetchItemData(item.name)));
    
    details.forEach(item => {
      if (item && item.sprites.default && !displayedItems.has(item.name)) {
        displayedItems.add(item.name);
        const card = createItemCard(item);
        wikiElements.itemsGrid.appendChild(card);
      }
    });
  }
  
  wikiState.displayedItemsCount = end;
  
  if (wikiState.displayedItemsCount < wikiState.filteredItems.length) {
    wikiElements.itemsLoadMore.style.display = 'block';
  } else {
    wikiElements.itemsLoadMore.style.display = 'none';
  }
}

function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';
  
  card.innerHTML = `
    <img class="item-sprite" src="${item.sprites.default}" alt="${item.name}" />
    <div class="item-info">
      <p class="item-name">${formatName(item.name)}</p>
      <span class="item-category">${item.category ? formatName(item.category.name) : ''}</span>
    </div>
  `;
  
  card.addEventListener('click', () => openItemModal(item));
  
  return card;
}

async function filterItems() {
  const category = wikiElements.itemCategoryFilter.value;
  // Converter termo de busca para o formato da API (espaços viram hífens)
  const searchTerm = wikiElements.itemSearch.value.toLowerCase().trim().replace(/ /g, '-');
  
  wikiElements.itemsGrid.innerHTML = '';
  wikiState.displayedItemsCount = 0;
  wikiElements.itemsLoading.style.display = 'block';
  
  // Fechar autocomplete
  if (wikiElements.itemAutocomplete) {
    wikiElements.itemAutocomplete.classList.remove('show');
  }
  
  let filtered = [...wikiState.allItems];
  
  // Filtrar por busca de texto
  if (searchTerm) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm));
  }
  
  // Filtrar por categoria - precisamos buscar detalhes dos itens
  if (category) {
    const categoryMap = {
      'healing': ['healing', 'revival', 'status-cures', 'hp-restore', 'pp-restore'],
      'pokeballs': ['standard-balls', 'special-balls', 'apricorn-balls', 'pokeballs'],
      'held-items': ['held-items', 'choice', 'type-enhancement', 'plates', 'jewels', 'type-protection'],
      'evolution': ['evolution', 'mega-stones', 'evo-items'],
      'medicine': ['medicine', 'pp-recovery', 'flutes', 'remedies'],
      'vitamins': ['vitamins', 'stat-boosts', 'effort-training'],
      'tm': ['all-machines', 'machines', 'tms', 'hms']
    };
    
    const categoryTerms = categoryMap[category] || [category];
    
    const filteredByCategory = [];
    
    // Processar em batches para performance
    for (let i = 0; i < Math.min(filtered.length, 300); i += 20) {
      const batch = filtered.slice(i, i + 20);
      const details = await Promise.all(batch.map(item => fetchItemData(item.name)));
      
      details.forEach((itemData, idx) => {
        if (itemData && itemData.category) {
          const itemCategoryName = itemData.category.name.toLowerCase();
          if (categoryTerms.some(term => itemCategoryName.includes(term))) {
            filteredByCategory.push(batch[idx]);
          }
        }
      });
    }
    
    filtered = filteredByCategory;
  }
  
  wikiState.filteredItems = filtered;
  
  await displayMoreItems();
  
  wikiElements.itemsLoading.style.display = 'none';
}

function openItemModal(item) {
  const description = item.effect_entries.find(e => e.language.name === 'en')?.short_effect 
    || item.flavor_text_entries.find(e => e.language.name === 'en')?.text
    || 'Descrição não disponível';
  
  wikiElements.wikiDetailBody.innerHTML = `
    <div class="wiki-detail-content" style="text-align: center;">
      <img src="${item.sprites.default}" alt="${item.name}" style="width: 80px; height: 80px;" />
      <h2>${formatName(item.name)}</h2>
      <span class="item-category" style="display: block; margin-bottom: 20px;">
        ${item.category ? formatName(item.category.name) : ''}
      </span>
      
      <div class="detail-section" style="text-align: left;">
        <h4>Efeito</h4>
        <p>${sanitizeHTML(description)}</p>
      </div>
      
      ${item.cost ? `
        <div class="detail-section" style="text-align: left;">
          <h4>Preço</h4>
          <p>₽ ${item.cost.toLocaleString()}</p>
        </div>
      ` : ''}
    </div>
  `;
  
  wikiElements.wikiDetailModal.classList.add('active');
}

// ===== BERRIES =====

async function loadBerries() {
  wikiElements.berriesLoading.style.display = 'block';
  
  wikiState.allBerries = await fetchAllBerries();
  wikiState.berriesLoaded = true;
  
  renderBerries();
  
  wikiElements.berriesLoading.style.display = 'none';
}

function renderBerries() {
  wikiElements.berriesGrid.innerHTML = '';
  
  wikiState.allBerries.forEach(berry => {
    const card = createBerryCard(berry);
    wikiElements.berriesGrid.appendChild(card);
  });
}

function createBerryCard(berry) {
  const card = document.createElement('div');
  card.className = 'berry-card';
  
  // Encontrar sabores dominantes
  const flavors = berry.flavors
    .filter(f => f.potency > 0)
    .sort((a, b) => b.potency - a.potency);
  
  const berryItemName = berry.item.name;
  
  card.innerHTML = `
    <img 
      class="berry-sprite" 
      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berryItemName}.png" 
      alt="${berry.name}"
      onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png'"
    />
    <p class="berry-name">${formatName(berry.name)} Berry</p>
    <div class="berry-flavors">
      ${flavors.slice(0, 2).map(f => `
        <span class="berry-flavor-tag" style="background: ${getFlavorColor(f.flavor.name)}; color: white;">
          ${flavorTranslations[f.flavor.name] || f.flavor.name}
        </span>
      `).join('')}
    </div>
  `;
  
  card.addEventListener('click', () => openBerryModal(berry));
  
  return card;
}

function getFlavorColor(flavor) {
  const colors = {
    spicy: '#dc2626',
    dry: '#d97706',
    sweet: '#db2777',
    bitter: '#059669',
    sour: '#ca8a04'
  };
  return colors[flavor] || '#6b7280';
}

function openBerryModal(berry) {
  const flavors = berry.flavors
    .filter(f => f.potency > 0)
    .sort((a, b) => b.potency - a.potency);
  
  wikiElements.wikiDetailBody.innerHTML = `
    <div class="wiki-detail-content" style="text-align: center;">
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.item.name}.png" 
        alt="${berry.name}"
        style="width: 80px; height: 80px;"
        onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png'"
      />
      <h2>${formatName(berry.name)} Berry</h2>
      
      <div class="detail-section" style="text-align: left;">
        <h4>Sabores</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${berry.flavors.map(f => `
            <span style="padding: 5px 12px; border-radius: 15px; background: ${f.potency > 0 ? getFlavorColor(f.flavor.name) : '#e5e7eb'}; color: ${f.potency > 0 ? 'white' : '#6b7280'};">
              ${flavorTranslations[f.flavor.name] || f.flavor.name}: ${f.potency}
            </span>
          `).join('')}
        </div>
      </div>
      
      <div class="detail-section" style="text-align: left;">
        <h4>Informações</h4>
        <p><strong>Tempo de crescimento:</strong> ${berry.growth_time} horas</p>
        <p><strong>Tamanho máximo:</strong> ${berry.max_harvest} por colheita</p>
        <p><strong>Suavidade:</strong> ${berry.smoothness}</p>
        <p><strong>Tamanho:</strong> ${berry.size}mm</p>
      </div>
      
      ${berry.natural_gift_type ? `
        <div class="detail-section" style="text-align: left;">
          <h4>Natural Gift</h4>
          <p>
            <span class="pokemon-type bg-${berry.natural_gift_type.name}">${typeNames[berry.natural_gift_type.name] || berry.natural_gift_type.name}</span>
            Poder: ${berry.natural_gift_power}
          </p>
        </div>
      ` : ''}
    </div>
  `;
  
  wikiElements.wikiDetailModal.classList.add('active');
}

// ===== TIPOS =====

// Ícones dos tipos
const typeIcons = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🏜️',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌑',
  steel: '⚙️',
  fairy: '🧚'
};

async function loadTypesSection() {
  if (!wikiElements.typesGrid) return;
  
  wikiElements.typesGrid.innerHTML = `
    <div class="wiki-loading">
      <div class="pokeball-spinner"></div>
      <p>Carregando tipos...</p>
    </div>
  `;
  
  try {
    // Carregar dados de todos os tipos
    const types = Object.keys(typeNames);
    
    await Promise.all(types.map(async (typeName) => {
      const response = await fetch(`${WIKI_API_BASE}/type/${typeName}`);
      const data = await response.json();
      wikiState.typesData[typeName] = data;
    }));
    
    wikiState.typesLoaded = true;
    renderTypesGrid();
    
  } catch (error) {
    console.error('Erro ao carregar tipos:', error);
    wikiElements.typesGrid.innerHTML = '<p>Erro ao carregar tipos. Tente novamente.</p>';
  }
}

function renderTypesGrid() {
  const types = Object.keys(typeNames);
  
  wikiElements.typesGrid.innerHTML = types.map(typeName => `
    <div class="type-card" data-type="${typeName}">
      <div class="type-card-icon" style="background: ${typeColors[typeName]}">
        ${typeIcons[typeName] || '❓'}
      </div>
      <p class="type-card-name">${typeNames[typeName]}</p>
    </div>
  `).join('');
  
  // Adicionar eventos de clique
  wikiElements.typesGrid.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      const typeName = card.dataset.type;
      showTypeDetail(typeName);
      
      // Marcar card como ativo
      wikiElements.typesGrid.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

function showTypeDetail(typeName) {
  const typeData = wikiState.typesData[typeName];
  if (!typeData) return;
  
  const dr = typeData.damage_relations;
  
  // Ofensivo (quando ATACA)
  const strongAgainst = dr.double_damage_to.map(t => t.name);
  const weakAgainst = dr.half_damage_to.map(t => t.name);
  const noEffectAgainst = dr.no_damage_to.map(t => t.name);
  
  // Defensivo (quando RECEBE)
  const weakTo = dr.double_damage_from.map(t => t.name);
  const resistsTo = dr.half_damage_from.map(t => t.name);
  const immuneTo = dr.no_damage_from.map(t => t.name);
  
  wikiElements.typeDetailContent.innerHTML = `
    <div class="type-detail-header">
      <div class="type-detail-icon" style="background: ${typeColors[typeName]}">
        ${typeIcons[typeName] || '❓'}
      </div>
      <div class="type-detail-title">
        <h3>Tipo ${typeNames[typeName]}</h3>
        <p>Relações de dano ofensivo e defensivo</p>
      </div>
    </div>
    
    <h4 style="margin-bottom: 15px; color: var(--dark);">⚔️ Ofensivo (Atacando)</h4>
    <div class="type-matchups-grid">
      <div class="type-matchup-card strong">
        <h4>💪 Super Efetivo (2x)</h4>
        <div class="type-matchup-badges">
          ${strongAgainst.length > 0 
            ? strongAgainst.map(t => `<span class="type-matchup-badge bg-${t}">${typeNames[t]}</span>`).join('')
            : '<span style="color: #999;">Nenhum</span>'
          }
        </div>
      </div>
      <div class="type-matchup-card weak">
        <h4>📉 Pouco Efetivo (0.5x)</h4>
        <div class="type-matchup-badges">
          ${weakAgainst.length > 0 
            ? weakAgainst.map(t => `<span class="type-matchup-badge bg-${t}">${typeNames[t]}</span>`).join('')
            : '<span style="color: #999;">Nenhum</span>'
          }
        </div>
      </div>
      <div class="type-matchup-card immune">
        <h4>🚫 Sem Efeito (0x)</h4>
        <div class="type-matchup-badges">
          ${noEffectAgainst.length > 0 
            ? noEffectAgainst.map(t => `<span class="type-matchup-badge bg-${t}">${typeNames[t]}</span>`).join('')
            : '<span style="color: #999;">Nenhum</span>'
          }
        </div>
      </div>
    </div>
    
    <h4 style="margin: 25px 0 15px; color: var(--dark);">🛡️ Defensivo (Recebendo)</h4>
    <div class="type-matchups-grid">
      <div class="type-matchup-card weak">
        <h4>⚠️ Fraco Contra (2x dano)</h4>
        <div class="type-matchup-badges">
          ${weakTo.length > 0 
            ? weakTo.map(t => `<span class="type-matchup-badge bg-${t}">${typeNames[t]}</span>`).join('')
            : '<span style="color: #999;">Nenhum</span>'
          }
        </div>
      </div>
      <div class="type-matchup-card resist">
        <h4>🛡️ Resiste (0.5x dano)</h4>
        <div class="type-matchup-badges">
          ${resistsTo.length > 0 
            ? resistsTo.map(t => `<span class="type-matchup-badge bg-${t}">${typeNames[t]}</span>`).join('')
            : '<span style="color: #999;">Nenhum</span>'
          }
        </div>
      </div>
      <div class="type-matchup-card immune">
        <h4>✨ Imune (0x dano)</h4>
        <div class="type-matchup-badges">
          ${immuneTo.length > 0 
            ? immuneTo.map(t => `<span class="type-matchup-badge bg-${t}">${typeNames[t]}</span>`).join('')
            : '<span style="color: #999;">Nenhum</span>'
          }
        </div>
      </div>
    </div>
  `;
  
  wikiElements.typeDetailPanel.style.display = 'block';
  wikiElements.typeDetailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== AUTOCOMPLETE =====

function initAutocomplete(inputElement, dropdownElement, onSelect) {
  if (!inputElement || !dropdownElement) return;
  
  let debounceTimer;
  
  inputElement.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      dropdownElement.classList.remove('show');
      dropdownElement.innerHTML = '';
      return;
    }
    
    debounceTimer = setTimeout(() => {
      showAutocompleteSuggestions(query, dropdownElement, onSelect);
    }, 200);
  });
  
  inputElement.addEventListener('keydown', (e) => {
    const items = dropdownElement.querySelectorAll('.autocomplete-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      wikiState.autocompleteIndex = Math.min(wikiState.autocompleteIndex + 1, items.length - 1);
      updateAutocompleteHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      wikiState.autocompleteIndex = Math.max(wikiState.autocompleteIndex - 1, 0);
      updateAutocompleteHighlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (wikiState.autocompleteIndex >= 0 && items[wikiState.autocompleteIndex]) {
        items[wikiState.autocompleteIndex].click();
      }
    } else if (e.key === 'Escape') {
      dropdownElement.classList.remove('show');
      wikiState.autocompleteIndex = -1;
    }
  });
  
  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!inputElement.contains(e.target) && !dropdownElement.contains(e.target)) {
      dropdownElement.classList.remove('show');
      wikiState.autocompleteIndex = -1;
    }
  });
}

async function showAutocompleteSuggestions(query, dropdownElement, onSelect) {
  // Filtrar Pokémon da lista
  const matches = wikiState.allPokemon.filter(p => {
    const matchesName = p.name.toLowerCase().includes(query);
    const matchesId = p.id.toString() === query;
    return matchesName || matchesId;
  }).slice(0, 8);
  
  if (matches.length === 0) {
    dropdownElement.innerHTML = '<div class="autocomplete-no-results">Nenhum Pokémon encontrado</div>';
    dropdownElement.classList.add('show');
    return;
  }
  
  // Buscar detalhes dos matches para mostrar sprites e tipos
  const details = await Promise.all(matches.map(m => fetchPokemonData(m.id)));
  
  dropdownElement.innerHTML = details.filter(d => d).map(pokemon => `
    <div class="autocomplete-item" data-pokemon-id="${pokemon.id}" data-pokemon-name="${pokemon.name}">
      <img src="${pokemon.sprites.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}" alt="${pokemon.name}" />
      <div class="autocomplete-item-info">
        <span class="autocomplete-item-name">${pokemon.name}</span>
        <span class="autocomplete-item-number">#${String(pokemon.id).padStart(3, '0')}</span>
      </div>
      <div class="autocomplete-item-types">
        ${pokemon.types.map(t => `<span class="bg-${t.type.name}">${typeNames[t.type.name] || t.type.name}</span>`).join('')}
      </div>
    </div>
  `).join('');
  
  dropdownElement.classList.add('show');
  wikiState.autocompleteIndex = -1;
  
  // Adicionar eventos de clique
  dropdownElement.querySelectorAll('.autocomplete-item').forEach(item => {
    item.addEventListener('click', async () => {
      const pokemonId = parseInt(item.dataset.pokemonId);
      const pokemon = await fetchPokemonData(pokemonId);
      if (onSelect && pokemon) {
        onSelect(pokemon);
      }
      dropdownElement.classList.remove('show');
      wikiState.autocompleteIndex = -1;
    });
  });
}

function updateAutocompleteHighlight(items) {
  items.forEach((item, index) => {
    item.classList.toggle('active', index === wikiState.autocompleteIndex);
  });
  
  if (wikiState.autocompleteIndex >= 0 && items[wikiState.autocompleteIndex]) {
    items[wikiState.autocompleteIndex].scrollIntoView({ block: 'nearest' });
  }
}

// ===== REGIÕES =====

function initRegions() {
  wikiElements.regionsGrid.querySelectorAll('.region-card').forEach(card => {
    card.addEventListener('click', () => {
      const region = card.dataset.region;
      showRegionPokemon(region);
    });
  });
  
  wikiElements.backToRegions.addEventListener('click', () => {
    wikiElements.regionDetails.style.display = 'none';
    wikiElements.regionsGrid.style.display = 'grid';
  });
}

async function showRegionPokemon(regionName) {
  const regionGenMap = {
    kanto: 1,
    johto: 2,
    hoenn: 3,
    sinnoh: 4,
    unova: 5,
    kalos: 6,
    alola: 7,
    galar: 8,
    paldea: 9
  };
  
  const gen = regionGenMap[regionName];
  const range = generationRanges[gen];
  
  wikiElements.regionsGrid.style.display = 'none';
  wikiElements.regionDetails.style.display = 'block';
  
  wikiElements.regionDetailsContent.innerHTML = `
    <h2 style="text-align: center; margin-bottom: 20px;">${formatName(regionName)} - Geração ${gen}</h2>
    <p style="text-align: center; margin-bottom: 30px;">Pokémon #${range.start} - #${range.end}</p>
    <div class="wiki-loading">
      <div class="pokeball-spinner"></div>
      <p>Carregando Pokémon da região...</p>
    </div>
  `;
  
  // Buscar Pokémon da região
  const pokemonIds = [];
  for (let i = range.start; i <= range.end; i++) {
    pokemonIds.push(i);
  }
  
  // Mostrar grid
  let html = `
    <h2 style="text-align: center; margin-bottom: 20px;">${formatName(regionName)} - Geração ${gen}</h2>
    <p style="text-align: center; margin-bottom: 30px;">Pokémon #${range.start} - #${range.end} (${range.end - range.start + 1} Pokémon)</p>
    <div class="pokedex-grid" id="regionPokemonGrid"></div>
  `;
  
  wikiElements.regionDetailsContent.innerHTML = html;
  
  const grid = document.getElementById('regionPokemonGrid');
  
  // Carregar em batches
  for (let i = 0; i < pokemonIds.length; i += 12) {
    const batch = pokemonIds.slice(i, i + 12);
    const details = await Promise.all(batch.map(id => fetchPokemonData(id)));
    
    details.forEach(pokemon => {
      if (pokemon) {
        const card = createPokedexCard(pokemon);
        grid.appendChild(card);
      }
    });
  }
}

// ===== AUTOCOMPLETE DE ITENS =====

function initItemAutocomplete() {
  let debounceTimer;
  let autocompleteIndex = -1;
  
  wikiElements.itemSearch.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      wikiElements.itemAutocomplete.classList.remove('show');
      wikiElements.itemAutocomplete.innerHTML = '';
      autocompleteIndex = -1;
      return;
    }
    
    debounceTimer = setTimeout(() => {
      showItemAutocompleteSuggestions(query);
    }, 150);
  });
  
  wikiElements.itemSearch.addEventListener('keydown', (e) => {
    const items = wikiElements.itemAutocomplete.querySelectorAll('.autocomplete-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      autocompleteIndex = Math.min(autocompleteIndex + 1, items.length - 1);
      updateItemAutocompleteHighlight(items, autocompleteIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      autocompleteIndex = Math.max(autocompleteIndex - 1, 0);
      updateItemAutocompleteHighlight(items, autocompleteIndex);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (autocompleteIndex >= 0 && items[autocompleteIndex]) {
        items[autocompleteIndex].click();
      } else {
        wikiElements.itemAutocomplete.classList.remove('show');
        filterItems();
      }
      autocompleteIndex = -1;
    } else if (e.key === 'Escape') {
      wikiElements.itemAutocomplete.classList.remove('show');
      autocompleteIndex = -1;
    }
  });
  
  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!wikiElements.itemSearch.contains(e.target) && !wikiElements.itemAutocomplete.contains(e.target)) {
      wikiElements.itemAutocomplete.classList.remove('show');
      autocompleteIndex = -1;
    }
  });
}

async function showItemAutocompleteSuggestions(query) {
  // Filtrar itens da lista (apenas pelo nome, sem fazer requisições)
  const matches = wikiState.allItems.filter(item => 
    item.name.toLowerCase().includes(query)
  ).slice(0, 8);
  
  if (matches.length === 0) {
    wikiElements.itemAutocomplete.innerHTML = '<div class="autocomplete-no-results">Nenhum item encontrado</div>';
    wikiElements.itemAutocomplete.classList.add('show');
    return;
  }
  
  // Mostrar sugestões imediatamente sem buscar detalhes (para ser mais rápido)
  wikiElements.itemAutocomplete.innerHTML = matches.map(item => `
    <div class="autocomplete-item" data-item-name="${item.name}">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png" 
           alt="${item.name}" 
           style="width: 32px; height: 32px;"
           onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'" />
      <div class="autocomplete-item-info">
        <span class="autocomplete-item-name">${formatName(item.name)}</span>
      </div>
    </div>
  `).join('');
  
  wikiElements.itemAutocomplete.classList.add('show');
  
  // Adicionar eventos de clique
  wikiElements.itemAutocomplete.querySelectorAll('.autocomplete-item').forEach(itemEl => {
    itemEl.addEventListener('click', () => {
      const itemName = itemEl.dataset.itemName;
      wikiElements.itemSearch.value = formatName(itemName);
      wikiElements.itemAutocomplete.classList.remove('show');
      filterItems();
    });
  });
}

function updateItemAutocompleteHighlight(items, index) {
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
  
  if (index >= 0 && items[index]) {
    items[index].scrollIntoView({ block: 'nearest' });
  }
}

// ===== UTILIDADES =====

function formatName(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sanitizeHTML(str) {
  if (typeof str !== "string") return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function closeWikiDetailModal() {
  wikiElements.wikiDetailModal.classList.remove('active');
}

// ===== INICIALIZAÇÃO =====

function initWiki() {
  // Inicializar sistema de abas
  initTabs();
  
  // Inicializar regiões
  initRegions();
  
  // Inicializar autocomplete da Pokédex
  if (wikiElements.wikiSearch && wikiElements.wikiAutocomplete) {
    initAutocomplete(wikiElements.wikiSearch, wikiElements.wikiAutocomplete, (pokemon) => {
      wikiElements.wikiSearch.value = pokemon.name;
      filterPokedex();
    });
  }
  
  // Event Listeners - Tipos
  if (wikiElements.closeTypeDetail) {
    wikiElements.closeTypeDetail.addEventListener('click', () => {
      wikiElements.typeDetailPanel.style.display = 'none';
      wikiElements.typesGrid.querySelectorAll('.type-card').forEach(c => c.classList.remove('active'));
    });
  }
  
  // Event Listeners - Pokédex
  if (wikiElements.wikiSearchBtn) {
    wikiElements.wikiSearchBtn.addEventListener('click', filterPokedex);
  }
  if (wikiElements.wikiSearch) {
    wikiElements.wikiSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') filterPokedex();
      wikiElements.clearWikiSearch.style.display = e.target.value ? 'flex' : 'none';
    });
    wikiElements.wikiSearch.addEventListener('input', () => {
      wikiElements.clearWikiSearch.style.display = wikiElements.wikiSearch.value ? 'flex' : 'none';
    });
  }
  if (wikiElements.clearWikiSearch) {
    wikiElements.clearWikiSearch.addEventListener('click', () => {
      wikiElements.wikiSearch.value = '';
      wikiElements.clearWikiSearch.style.display = 'none';
      if (wikiElements.wikiAutocomplete) {
        wikiElements.wikiAutocomplete.classList.remove('show');
      }
      filterPokedex();
    });
  }
  if (wikiElements.wikiTypeFilter) {
    wikiElements.wikiTypeFilter.addEventListener('change', filterPokedex);
  }
  if (wikiElements.wikiGenFilter) {
    wikiElements.wikiGenFilter.addEventListener('change', filterPokedex);
  }
  if (wikiElements.wikiSortFilter) {
    wikiElements.wikiSortFilter.addEventListener('change', filterPokedex);
  }
  if (wikiElements.wikiLoadMoreBtn) {
    wikiElements.wikiLoadMoreBtn.addEventListener('click', displayMorePokedex);
  }
  
  // Event Listeners - Evoluções
  if (wikiElements.evolutionSearchBtn) {
    wikiElements.evolutionSearchBtn.addEventListener('click', searchEvolution);
  }
  if (wikiElements.evolutionSearch) {
    wikiElements.evolutionSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchEvolution();
    });
  }
  
  // Inicializar autocomplete de evolução
  if (wikiElements.evolutionSearch && wikiElements.evolutionAutocomplete) {
    initAutocomplete(wikiElements.evolutionSearch, wikiElements.evolutionAutocomplete, (pokemon) => {
      wikiElements.evolutionSearch.value = pokemon.name;
      searchEvolution();
    });
  }
  
  if (wikiElements.popularEvolutions) {
    wikiElements.popularEvolutions.querySelectorAll('.popular-evo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        wikiElements.evolutionSearch.value = btn.dataset.pokemon;
        searchEvolution();
      });
    });
  }
  
  // Event Listeners - Naturezas
  if (wikiElements.natureStatFilter) {
    wikiElements.natureStatFilter.addEventListener('change', (e) => {
      renderNaturesTable(e.target.value);
    });
  }
  if (wikiElements.calcNatureBtn) {
    wikiElements.calcNatureBtn.addEventListener('click', calculateNatureEffect);
  }
  
  // Event Listeners - Habilidades
  if (wikiElements.abilitySearchBtn) {
    wikiElements.abilitySearchBtn.addEventListener('click', searchAbilities);
  }
  if (wikiElements.abilitySearch) {
    wikiElements.abilitySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchAbilities();
    });
  }
  if (wikiElements.abilitiesLoadMoreBtn) {
    wikiElements.abilitiesLoadMoreBtn.addEventListener('click', displayMoreAbilities);
  }
  
  // Event Listeners - Itens
  if (wikiElements.itemCategoryFilter) {
    wikiElements.itemCategoryFilter.addEventListener('change', filterItems);
  }
  if (wikiElements.itemSearch) {
    wikiElements.itemSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Fechar autocomplete e filtrar
        if (wikiElements.itemAutocomplete) {
          wikiElements.itemAutocomplete.classList.remove('show');
        }
        filterItems();
      }
    });
  }
  
  // Inicializar autocomplete de itens
  if (wikiElements.itemSearch && wikiElements.itemAutocomplete) {
    initItemAutocomplete();
  }
  
  if (wikiElements.itemsLoadMoreBtn) {
    wikiElements.itemsLoadMoreBtn.addEventListener('click', displayMoreItems);
  }
  
  // Event Listeners - Modals
  if (wikiElements.wikiDetailClose) {
    wikiElements.wikiDetailClose.addEventListener('click', closeWikiDetailModal);
  }
  if (wikiElements.wikiDetailModal) {
    wikiElements.wikiDetailModal.addEventListener('click', (e) => {
      if (e.target === wikiElements.wikiDetailModal) {
        closeWikiDetailModal();
      }
    });
  }
  
  console.log('✅ Wiki inicializada!');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initWiki);
