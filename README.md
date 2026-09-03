# roteiro-rio

Site com o roteiro de uma viagem ao Rio de Janeiro (Setembro de 2026), construído como projeto de portfólio de ciência de dados / engenharia — a ideia é aprender a integrar diferentes APIs e ferramentas num projeto real, do design ao código.

🔗 **Site no ar:** _(link do GitHub Pages entra aqui depois do deploy)_

## O que o site tem

- Roteiro dos lugares que vamos visitar (Cristo Redentor, Pão de Açúcar, praias, Rock in Rio 1985, pop-up do Stray Kids)
- Checklist do essencial pra mala de 10kg
- Mapa interativo com os pontos da viagem *(em construção)*
- Depois da viagem: extração e análise dos dados da experiência *(fase 2, ainda não iniciada)*

## Stack técnica

- HTML, CSS e JavaScript puro (sem framework, de propósito — é um projeto de aprendizado)
- Dados do roteiro em JSON (`data/lugares.json`)
- Hospedado com GitHub Pages

## Estrutura do projeto

```
roteiro-rio/
├── index.html
├── css/style.css
├── js/app.js
├── data/lugares.json
└── assets/
```

## Rodando localmente

```
git clone https://github.com/SEU-USUARIO/roteiro-rio.git
cd roteiro-rio
open index.html
```

## Status

🚧 Em construção — próximo passo: integrar API de mapas.
