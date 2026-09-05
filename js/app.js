// app.js
// Este arquivo controla o comportamento (a "vida") do site.

// ===================================================
// PARTE 2: desenhar o mapa com Leaflet
// ===================================================
// Cria o mapa dentro da div id="map", centralizado no Rio de Janeiro,
// com zoom inicial 12 (quanto maior o número, mais "perto" começa)
const map = L.map("map").setView([-22.965, -43.21], 12);

// Adiciona as "telhas" visuais do mapa (vem do OpenStreetMap, de graça)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Busca o arquivo de dados dos lugares
fetch("data/lugares.json")
  .then((resposta) => resposta.json())
  .then((lugares) => {
    lugares.forEach((lugar) => {
      // Para cada lugar da lista, cria um marcador na posição lat/lng
      const marcador = L.marker([lugar.lat, lugar.lng]).addTo(map);

      // Texto que aparece ao clicar no marcador
      const textoPreco = lugar.preco ? `R$ ${lugar.preco}` : "";
      marcador.bindPopup(`<strong>${lugar.nome}</strong><br>${textoPreco}`);
    });
  })
  .catch((erro) => {
    console.error("Não consegui carregar os lugares:", erro);
  });

// ===================================================
// PARTE 3: fazer os botões dos dias funcionarem
// ===================================================
// Pega todos os botões que tem a classe "day-tab"
const dayTabs = document.querySelectorAll(".day-tab");
// Pega todos os painéis de conteúdo que tem a classe "day-panel"
const dayPanels = document.querySelectorAll(".day-panel");

dayTabs.forEach((tab) => {
  // Para cada botão, escutamos o evento de clique
  tab.addEventListener("click", () => {
    const targetDay = tab.dataset.day; // ex: "dia3"

    // Tira o destaque de todos os botões...
    dayTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    // ...e coloca só no botão que foi clicado
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    // Esconde todos os painéis...
    dayPanels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove("is-active");
    });
    // ...e mostra só o painel do dia clicado
    const targetPanel = document.getElementById(targetDay);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.classList.add("is-active");
    }
  });
});

// ===================================================
// PARTE 4: checklist da mala, por categoria, com progresso
// ===================================================

// Nome bonito e cor de cada categoria (a "legenda")
const CATEGORIAS = {
  roupas:      { nome: "Roupas",              cor: "#3B5BDB" },
  praia:       { nome: "Praia & Extras",      cor: "#1098AD" },
  cabelo:      { nome: "Cabelo",              cor: "#7048E8" },
  skincare:    { nome: "Skincare",            cor: "#099268" },
  maquiagem:   { nome: "Maquiagem",           cor: "#9C36B5" },
  remedios:    { nome: "Remédios",            cor: "#15AABF" },
  eletronicos: { nome: "Eletrônicos",         cor: "#495057" },
  rockinrio:   { nome: "Kit Rock in Rio",     cor: "#D8352A" },
};

// Chave usada pra guardar o progresso no localStorage
const CHAVE_LOCALSTORAGE = "rio-plan-mala-marcados";

// Pega a lista de itens já marcados (ou uma lista vazia, se for a primeira vez)
function pegarMarcados() {
  const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE);
  return salvo ? JSON.parse(salvo) : [];
}

// Salva a lista de itens marcados
function salvarMarcados(lista) {
  localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(lista));
}

fetch("data/mala.json")
  .then((resposta) => resposta.json())
  .then((itens) => {
    // Monta a legenda no topo, uma vez por categoria
    const legendaEl = document.getElementById("legend");
    Object.values(CATEGORIAS).forEach((cat) => {
      const span = document.createElement("div");
      span.className = "legend__item";
      span.innerHTML = `<span class="legend__dot" style="background:${cat.cor}"></span>${cat.nome}`;
      legendaEl.appendChild(span);
    });

    // Agrupa os itens por categoria
    const porCategoria = {};
    itens.forEach((item) => {
      if (!porCategoria[item.categoria]) porCategoria[item.categoria] = [];
      porCategoria[item.categoria].push(item);
    });

    const listaEl = document.getElementById("packing-list");
    const marcados = pegarMarcados();

    Object.keys(porCategoria).forEach((chaveCategoria) => {
      const cat = CATEGORIAS[chaveCategoria];

      const grupo = document.createElement("div");
      grupo.className = "packing-group";
      grupo.innerHTML = `<p class="packing-group__title"><span class="legend__dot" style="background:${cat.cor}"></span>${cat.nome}</p>`;

      porCategoria[chaveCategoria].forEach((item) => {
        const linha = document.createElement("div");
        linha.className = "packing-item";
        if (marcados.includes(item.nome)) linha.classList.add("is-checked");
        linha.innerHTML = `<span class="packing-item__box"></span><span class="packing-item__text">${item.nome}</span>`;

        // Ao clicar, alterna marcado/desmarcado e salva
        linha.addEventListener("click", () => {
          linha.classList.toggle("is-checked");
          const listaAtual = pegarMarcados();
          if (linha.classList.contains("is-checked")) {
            listaAtual.push(item.nome);
          } else {
            const posicao = listaAtual.indexOf(item.nome);
            if (posicao > -1) listaAtual.splice(posicao, 1);
          }
          salvarMarcados(listaAtual);
          atualizarProgresso(itens.length);
        });

        grupo.appendChild(linha);
      });

      listaEl.appendChild(grupo);
    });

    atualizarProgresso(itens.length);
  });

// Atualiza a barra e o texto "X de Y prontos"
function atualizarProgresso(total) {
  const marcados = pegarMarcados().length;
  const porcentagem = total > 0 ? (marcados / total) * 100 : 0;
  document.getElementById("progress-fill").style.width = porcentagem + "%";
  document.getElementById("progress-label").textContent = `${marcados} de ${total} prontos`;
}

// ===================================================
// PARTE 5: contador regressivo até a viagem
// ===================================================

// Data alvo: 9 de setembro de 2026, meia-noite
const DATA_VIAGEM = new Date("2026-09-09T00:00:00");

function atualizarContador() {
  const agora = new Date();
  const diferencaMs = DATA_VIAGEM - agora; // diferença em milissegundos

  // Se a viagem já passou, mostra tudo zerado e para o relógio
  if (diferencaMs <= 0) {
    document.getElementById("cd-dias").textContent = "00";
    document.getElementById("cd-horas").textContent = "00";
    document.getElementById("cd-min").textContent = "00";
    document.getElementById("cd-seg").textContent = "00";
    return;
  }

  // Convertendo milissegundos em dias, horas, minutos e segundos
  const umSegundo = 1000;
  const umMinuto = umSegundo * 60;
  const umaHora = umMinuto * 60;
  const umDia = umaHora * 24;

  const dias = Math.floor(diferencaMs / umDia);
  const horas = Math.floor((diferencaMs % umDia) / umaHora);
  const minutos = Math.floor((diferencaMs % umaHora) / umMinuto);
  const segundos = Math.floor((diferencaMs % umMinuto) / umSegundo);

  // padStart(2, "0") garante que "5" vire "05"
  document.getElementById("cd-dias").textContent = String(dias).padStart(2, "0");
  document.getElementById("cd-horas").textContent = String(horas).padStart(2, "0");
  document.getElementById("cd-min").textContent = String(minutos).padStart(2, "0");
  document.getElementById("cd-seg").textContent = String(segundos).padStart(2, "0");
}

atualizarContador(); // roda uma vez assim que a página carrega
setInterval(atualizarContador, 1000); // e depois roda de novo a cada 1 segundo

// ===================================================
// PRÓXIMOS PASSOS (ainda não implementados,
// na ordem do nosso plano):
// 6. Fundo gerado no Haikei
// 7. Seção "curiosidades do Rock in Rio 1985"
// 8. Orçamento visual (soma dos ingressos)
// 9. Seção de fotos pós-viagem (Fase 2)
// ===================================================

console.log("rio-plan: site carregado ✅");
