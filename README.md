<img width="629" height="630" alt="Captura de Tela 2026-09-22 às 22 58 55" src="https://github.com/user-attachments/assets/8b0f281e-5892-4dc1-8c2b-6d72117fcdbe" />

# rio-plan

Site com o roteiro da viagem ao Rio de Janeiro (9 a 15 de setembro de 2026) e uma análise dos dados reais da viagem em Python — projeto de portfólio de ciência de dados / engenharia, cobrindo front-end, APIs e análise de dados.

🔗 **Site:** https://leticiamendes-data.github.io/rio-plan/
🔗 **Análise dos dados:** https://leticiamendes-data.github.io/rio-plan/analise.html
🔗 **Notebook completo:** [analise/analise-viagem-rio.ipynb](analise/analise-viagem-rio.ipynb)

## O site

- Contador regressivo ao vivo, mapa interativo (Leaflet + OpenStreetMap)
- Roteiro dia a dia em estilo "boarding pass", com conteúdo real da viagem
- Crachás interativos de cada pessoa (clique pra trocar a carinha)
- Álbum de fotos da viagem
- Checklist da mala por categoria, com progresso salvo (localStorage)
- Curiosidades sobre o Rock in Rio, orçamento visual, playlist do Spotify
- Tema visual especial (preto/vermelho/estrelas) no dia do Rock in Rio
- Fundo animado com partículas (Three.js) e brilho que segue o mouse

## A análise de dados (Python)

Depois da viagem, usei os dados reais (gastos, passos diários de 4 amigas, clima retroativo) pra um fluxo completo de análise:

- Limpeza e consolidação de dois extratos bancários diferentes
- Engenharia de variáveis (gasto acumulado, % por categoria, dia relativo da viagem)
- Estatística descritiva (média, mediana, desvio padrão)
- Correlação e regressão linear (clima x passos, com nota sobre o tamanho pequeno da amostra)
- Normalização min-max (gasto, passos e temperatura numa escala comparável)
- Mapa de calor geoespacial dos lugares visitados (folium)

**Principal insight**: os passos das 4 amigas seguem quase o mesmo padrão ao longo da semana — sugere que o roteiro em grupo influenciou mais o nível de atividade do que o perfil individual.

## Por que essas escolhas técnicas

- **HTML, CSS e JavaScript puro** no site: fundamentos antes de complexidade (React, build tools)
- **Leaflet + OpenStreetMap**: gratuito, sem chave de API paga
- **Three.js via CDN, sem React**: só o essencial pra elementos 3D decorativos
- **Open-Meteo pro clima**: API histórica gratuita, sem cadastro
- **pandas + Google Colab pra análise**: mesma stack do projeto Rock in Rio, consistência entre os projetos do portfólio
- **Sem banco de dados/backend**: dados em CSV/JSON simples — suficiente para o escopo atual

## Estrutura do projeto

```
rio-plan/
├── index.html
├── analise.html
├── css/style.css
├── js/
│   ├── app.js
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
Análise: abra o notebook no [Google Colab](https://colab.research.google.com).

## Limitações conhecidas

- Gastos representam só uma pessoa do grupo, não o total da viagem
- Amostra pequena (7 dias) — correlação/regressão são exploratórias, não conclusivas
- Uma das 5 amigas não teve os passos coletados

## Próximos passos

- Seção de depoimentos das amigas (planejado como "plus")
- Mais fotos no álbum
