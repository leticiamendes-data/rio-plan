# rio-plan

Site com o roteiro da viagem ao Rio de Janeiro (9 a 15 de setembro de 2026), construído como projeto de portfólio de ciência de dados / engenharia — integrando front-end, APIs e, agora na Fase 2, análise de dados reais da viagem em Python.

🔗 **Site no ar:** https://leticiamendes-data.github.io/rio-plan/

## Fase 1 — o site do roteiro

- Contador regressivo, mapa interativo (Leaflet), roteiro dia a dia em estilo "boarding pass"
- Cena 3D no hero e partículas fixas (Three.js), tema visual especial no dia do Rock in Rio
- Checklist da mala por categoria, com progresso salvo (localStorage)
- Curiosidades sobre o Rock in Rio, orçamento visual, playlist do Spotify

## Fase 2 — análise dos dados da viagem (em andamento)

- `analise/gastos-viagem.csv`: gastos reais da viagem (extrato bancário), categorizados por tipo e forma de pagamento
- `analise/analise-viagem-rio.ipynb`: notebook Jupyter com a análise em Python (pandas + matplotlib/seaborn)
- Clima retroativo dos dias da viagem, via API pública (Open-Meteo)
- Próximas etapas: passos diários (comparando as 5 amigas), fotos da viagem, e uma página nova no site (`analise.html`) resumindo os insights visualmente

## Por que essas escolhas técnicas

- **HTML, CSS e JavaScript puro** no site: decisão consciente para aprender os fundamentos antes de adicionar complexidade (React, build tools).
- **Leaflet + OpenStreetMap em vez de Google Maps**: gratuito, sem precisar de chave de API paga.
- **Three.js via CDN, sem React**: só o essencial pra ter elementos 3D decorativos.
- **Open-Meteo pro clima**: API histórica gratuita, sem cadastro nem chave.
- **pandas + Jupyter pra análise**: mesma stack do projeto Rock in Rio, mantendo consistência entre os projetos do portfólio.
- **Sem banco de dados/backend**: os dados ficam em arquivos CSV/JSON simples — suficiente para o escopo atual.

## Estrutura do projeto

```
rio-plan/
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── three-scene.js
│   └── three-particles.js
├── data/
│   ├── lugares.json
│   └── mala.json
├── analise/
│   ├── gastos-viagem.csv
│   └── analise-viagem-rio.ipynb
└── assets/
```

## Rodando localmente

```
git clone https://github.com/leticiamendes-data/rio-plan.git
cd rio-plan
```

Site: abra com a extensão **Live Server** do VS Code (clique direito no `index.html` > "Open with Live Server").

Análise: abra o Anaconda Navigator > Jupyter Notebook > navegue até `analise/analise-viagem-rio.ipynb`.

## Próximos passos

- Coletar passos diários das 5 amigas
- Selecionar fotos de paisagem (sem identificar rostos) para o site
- Gerar os 5 gráficos: gastos por dia, gastos por categoria, passos por pessoa, clima x passos, mapa de calor dos lugares (por contagem de fotos)
- Criar a página `analise.html` no site com os insights
- Álbum de fotos estilo revista, seção de depoimentos (a confirmar), aba de clima nos tickets, título com movimento
