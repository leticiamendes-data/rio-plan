# rio-plan

Site com o roteiro da viagem ao Rio de Janeiro (9 a 15 de setembro de 2026), construído como projeto de portfólio de ciência de dados / engenharia — front-end, APIs, e uma análise de dados reais da viagem em Python.

🔗 **Site:** https://leticiamendes-data.github.io/rio-plan/
🔗 **Análise dos dados:** https://leticiamendes-data.github.io/rio-plan/analise.html
🔗 **Notebook completo:** [analise/analise-viagem-rio.ipynb](analise/analise-viagem-rio.ipynb)

## O site (Fase 1)

- Contador regressivo ao vivo, mapa interativo (Leaflet), roteiro dia a dia em estilo "boarding pass"
- Cena 3D no hero e partículas fixas (Three.js), tema visual especial no dia do Rock in Rio
- Checklist da mala por categoria, com progresso salvo (localStorage)
- Curiosidades sobre o Rock in Rio, orçamento visual, playlist do Spotify

## A análise (Fase 2)

Depois da viagem, usei os dados reais (gastos, passos diários das 5 amigas, clima retroativo) pra praticar um fluxo completo de análise em Python.

- **Limpeza e tratamento**: consolidação de dois extratos bancários diferentes, padronização de categorias, sinalização de transações ambíguas
- **Engenharia de variáveis**: gasto acumulado, % do total por categoria, dia relativo da viagem
- **Estatística descritiva**: média, mediana, desvio padrão dos gastos diários
- **Correlação e regressão linear**: relação entre chuva e passos (com nota honesta sobre o tamanho pequeno da amostra)
- **Normalização (min-max)**: gasto, passos e temperatura numa escala comum, pra visão geral comparável
- **Geolocalização**: mapa de calor dos lugares visitados (folium)

**Principal insight**: os passos das 4 amigas seguem quase o mesmo padrão ao longo da semana — sugere que o roteiro em grupo influenciou mais o nível de atividade do que o perfil individual de cada uma.

## Por que essas escolhas técnicas

- **HTML, CSS e JavaScript puro** no site: fundamentos antes de complexidade (React, build tools)
- **Leaflet + OpenStreetMap**: gratuito, sem chave de API paga
- **Three.js via CDN, sem React**: só o essencial pra elementos 3D decorativos
- **Open-Meteo pro clima**: API histórica gratuita, sem cadastro
- **pandas + Google Colab pra análise**: mesma stack do projeto Rock in Rio, mantendo consistência entre os projetos do portfólio
- **Sem banco de dados/backend**: dados em CSV/JSON simples — suficiente para o escopo atual

## Estrutura do projeto

```
rio-plan/
├── index.html
├── analise.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── three-scene.js
│   └── three-particles.js
├── data/
│   ├── lugares.json
│   └── mala.json
└── analise/
    ├── gastos-viagem.csv
    ├── passos-viagem.csv
    ├── resumo-final-viagem.csv
    ├── analise-viagem-rio.ipynb
    ├── mapa-calor-lugares.html
    └── imagens/
```

## Rodando localmente

```
git clone https://github.com/leticiamendes-data/rio-plan.git
cd rio-plan
```

Site: abra com a extensão **Live Server** do VS Code.
Análise: abra o notebook no [Google Colab](https://colab.research.google.com) ou localmente com Jupyter.

## Limitações conhecidas

- Gastos representam só uma pessoa do grupo, não o total da viagem
- Amostra pequena (7 dias) — resultados de correlação/regressão são exploratórios, não conclusivos
- Uma das 5 amigas não teve os passos coletados (dado incompleto, mantido como limitação documentada, não descartado)

## Próximos passos

- Álbum de fotos estilo revista, título com animação, aba de clima nos tickets, seção de depoimentos (em aberto)
- Fotos reais da viagem
