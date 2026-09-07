# rio-plan

Site com o roteiro da viagem ao Rio de Janeiro (9 a 15 de setembro de 2026), construído como projeto de portfólio de ciência de dados / engenharia — a ideia é aprender a integrar diferentes APIs e ferramentas num projeto real, do design ao código.

🔗 **Site no ar:** _(link do GitHub Pages entra aqui depois do deploy)_

## O que o site tem

- Contador regressivo ao vivo até a viagem
- Crachás interativos de cada pessoa (clique pra trocar a carinha)
- Mapa interativo (Leaflet + OpenStreetMap) com os lugares do roteiro
- Roteiro dividido dia a dia, em estilo "boarding pass"
- Um tema visual especial (preto/vermelho/estrelas) que liga automaticamente no dia do Rock in Rio
- Checklist da mala de 10kg, por categoria, com progresso salvo no navegador (localStorage)
- Curiosidades sobre a história do Rock in Rio
- Orçamento visual dos ingressos
- Playlist do Spotify incorporada
- Seção reservada para fotos pós-viagem (Fase 2)

## Por que essas escolhas técnicas

- **HTML, CSS e JavaScript puro**, sem framework: decisão consciente para aprender os fundamentos antes de adicionar complexidade (React, build tools).
- **Leaflet + OpenStreetMap em vez de Google Maps**: gratuito, sem precisar de chave de API paga.
- **Sem banco de dados/backend**: os dados (lugares, itens da mala) ficam em arquivos JSON simples — suficiente para o escopo atual.
- **localStorage para o progresso da mala**: evita precisar de login ou servidor só para lembrar o que já foi separado.

## Estrutura do projeto

```
rio-plan/
├── index.html
├── css/style.css
├── js/app.js
├── data/
│   ├── lugares.json
│   └── mala.json
└── assets/
```

## Rodando localmente

```
git clone https://github.com/SEU-USUARIO/rio-plan.git
cd rio-plan
```

Abra com a extensão **Live Server** do VS Code (clique direito no `index.html` > "Open with Live Server") — abrir direto pelo duplo clique não funciona bem, porque o navegador bloqueia o carregamento dos arquivos JSON nesse modo.

## Próximos passos

- Elemento 3D pontual com Three.js (decorativo)
- Fotos reais da viagem (Fase 2)
- Extração e análise dos dados da experiência, pós-viagem (Fase 2)
