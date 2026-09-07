// app.js
// Este arquivo controla o comportamento (a "vida") do site.

// ===================================================
// PARTE 2: desenhar o mapa com Leaflet
// ===================================================
const map = L.map("map").setView([-22.965, -43.21], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

fetch("data/lugares.json")
  .then((resposta) => resposta.json())
  .then((lugares) => {
    lugares.forEach((lugar) => {
      const marcador = L.marker([lugar.lat, lugar.lng]).addTo(map);
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
const dayTabs = document.querySelectorAll(".day-tab");
const dayPanels = document.querySelectorAll(".day-panel");

dayTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetDay = tab.dataset.day;

    dayTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    dayPanels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove("is-active");
    });
    const targetPanel = document.getElementById(targetDay);
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.classList.add("is-active");
    }

    if (targetDay === "dia3") {
      document.body.classList.add("tema-rir");
    } else {
      document.body.classList.remove("tema-rir");
    }
  });
});

// ===================================================
// PARTE 4: checklist da mala, por categoria, com progresso
// ===================================================
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

const CHAVE_LOCALSTORAGE = "rio-plan-mala-marcados";

function pegarMarcados() {
  const salvo = localStorage.getItem(CHAVE_LOCALSTORAGE);
  return salvo ? JSON.parse(salvo) : [];
}

function salvarMarcados(lista) {
  localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(lista));
}

fetch("data/mala.json")
  .then((resposta) => resposta.json())
  .then((itens) => {
    const legendaEl = document.getElementById("legend");
    Object.values(CATEGORIAS).forEach((cat) => {
      const span = document.createElement("div");
      span.className = "legend__item";
      span.innerHTML = `<span class="legend__dot" style="background:${cat.cor}"></span>${cat.nome}`;
      legendaEl.appendChild(span);
    });

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

function atualizarProgresso(total) {
  const marcados = pegarMarcados().length;
  const porcentagem = total > 0 ? (marcados / total) * 100 : 0;
  document.getElementById("progress-fill").style.width = porcentagem + "%";
  document.getElementById("progress-label").textContent = `${marcados} de ${total} prontos`;
}

// ===================================================
// PARTE 5: contador regressivo até a viagem
// ===================================================
const DATA_VIAGEM = new Date("2026-09-09T00:00:00");

function atualizarContador() {
  const agora = new Date();
  const diferencaMs = DATA_VIAGEM - agora;

  if (diferencaMs <= 0) {
    document.getElementById("cd-dias").textContent = "00";
    document.getElementById("cd-horas").textContent = "00";
    document.getElementById("cd-min").textContent = "00";
    document.getElementById("cd-seg").textContent = "00";
    return;
  }

  const umSegundo = 1000;
  const umMinuto = umSegundo * 60;
  const umaHora = umMinuto * 60;
  const umDia = umaHora * 24;

  const dias = Math.floor(diferencaMs / umDia);
  const horas = Math.floor((diferencaMs % umDia) / umaHora);
  const minutos = Math.floor((diferencaMs % umaHora) / umMinuto);
  const segundos = Math.floor((diferencaMs % umMinuto) / umSegundo);

  document.getElementById("cd-dias").textContent = String(dias).padStart(2, "0");
  document.getElementById("cd-horas").textContent = String(horas).padStart(2, "0");
  document.getElementById("cd-min").textContent = String(minutos).padStart(2, "0");
  document.getElementById("cd-seg").textContent = String(segundos).padStart(2, "0");
}

atualizarContador();
setInterval(atualizarContador, 1000);

// ===================================================
// PARTE 6: fundo interativo — o brilho segue o mouse
// ===================================================
document.addEventListener("mousemove", (evento) => {
  const porcentagemX = (evento.clientX / window.innerWidth) * 100;
  const porcentagemY = (evento.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mx", porcentagemX + "%");
  document.documentElement.style.setProperty("--my", porcentagemY + "%");
});

// ===================================================
// PARTE 8: crachás interativos — clicar troca a carinha
// ===================================================
const crachas = document.querySelectorAll(".crew-card__badge-wrap");

crachas.forEach((cracha) => {
  const carinhas = cracha.dataset.faces.split(",");
  let indiceAtual = 0;

  cracha.addEventListener("click", () => {
    indiceAtual = (indiceAtual + 1) % carinhas.length;
    const elementoTexto = cracha.querySelector(".badge-face");
    elementoTexto.textContent = carinhas[indiceAtual];
  });
});

// ===================================================
// PRÓXIMOS PASSOS (ainda não implementados,
// na ordem do nosso plano):
// 10. Elemento 3D pontual com Three.js
// ===================================================

console.log("rio-plan: site carregado ✅");
