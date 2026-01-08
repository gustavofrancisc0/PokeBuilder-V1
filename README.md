# 🎮 PokéBuilder

> Monte seu time Pokémon equilibrado e explore a Pokédex completa!

![PokéBuilder](https://img.shields.io/badge/Pok%C3%A9Builder-v1.0-red)
![Status](https://img.shields.io/badge/status-active-success)

## 📋 Sobre o Projeto

O **PokéBuilder** é uma aplicação web completa para treinadores Pokémon. Inclui um construtor de times com análise de fraquezas/resistências e uma Wiki completa com informações sobre Pokémon, evoluções, naturezas, habilidades, itens, berries e regiões.

## ✨ Funcionalidades

### ⚔️ Team Builder

- Busca de Pokémon por tipo (principal e secundário)
- Montagem de time com até 6 Pokémon
- Seleção de 4 movimentos por Pokémon com descrições traduzidas
- Análise automática de fraquezas, resistências e imunidades do time
- Ordenação por número ou nome

### 📖 Pokémon Wiki

- **📱 Pokédex Nacional**: Todos os Pokémon com filtros por tipo, geração e ordenação
- **🔄 Evoluções**: Visualize cadeias de evolução completas com métodos de evolução
- **🎭 Naturezas**: Tabela completa com stats aumentados/diminuídos e calculadora
- **✨ Habilidades**: Explore todas as habilidades com descrições traduzidas
- **🎒 Itens**: Catálogo de itens por categoria
- **🍇 Berries**: Guia completo de berries e seus efeitos
- **🗺️ Regiões**: Explore as 9 regiões do mundo Pokémon

## 📁 Estrutura do Projeto

```
PokeBuilder/
├── index.html              # Página principal
├── README.md               # Documentação
├── .gitignore             # Arquivos ignorados pelo Git
│
├── css/
│   └── styles.css          # Estilos da aplicação
│
├── js/
│   ├── app.js              # Lógica do Team Builder
│   └── wiki.js             # Lógica da Wiki
│
├── data/
│   ├── moves-pt.json       # Traduções de movimentos
│   └── abilities-pt.json   # Traduções de habilidades
│
└── tools/
    ├── translate-moves.html      # Ferramenta de tradução de movimentos
    └── translate-abilities.html  # Ferramenta de tradução de habilidades
```

## 🚀 Como Usar

### Instalação

1. Clone o repositório ou baixe os arquivos
2. Abra o arquivo `index.html` em um navegador moderno
3. Pronto! Não requer instalação de dependências

### Team Builder

1. Selecione um tipo no filtro e clique em "Buscar Pokémon"
2. Clique em um Pokémon para ver detalhes e adicionar ao time
3. Selecione até 4 movimentos para cada Pokémon
4. Analise as fraquezas e resistências do seu time

### Wiki

1. Clique na aba "Pokémon Wiki"
2. Navegue pelas sub-seções (Pokédex, Evoluções, etc.)
3. Use os filtros e busca para encontrar informações

## 🛠️ Ferramentas de Tradução

Na pasta `tools/` existem ferramentas auxiliares para gerar/atualizar as traduções:

### translate-moves.html

Busca todos os movimentos da PokéAPI e traduz automaticamente para português.

### translate-abilities.html

Busca todas as habilidades da PokéAPI e traduz automaticamente para português.

**Como usar:**

1. Abra o arquivo HTML no navegador
2. Clique em "Buscar" para carregar os dados da API
3. Clique em "Traduzir" para traduzir automaticamente
4. Baixe o arquivo JSON gerado
5. Coloque o arquivo na pasta `data/`

## 🔗 APIs Utilizadas

- **[PokéAPI](https://pokeapi.co/)**: Dados de Pokémon, movimentos, habilidades, itens, etc.
- **[MyMemory Translation](https://mymemory.translated.net/)**: Tradução automática (usado nas ferramentas)

## 🎨 Tecnologias

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript (ES6+, Fetch API, Async/Await)
- Google Fonts (Poppins)

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:

- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

---

**⭐ Se este projeto te ajudou, deixe uma estrela!**
