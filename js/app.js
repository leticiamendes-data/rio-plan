// app.js
// Este arquivo controla o comportamento (a "vida") do site.

// ===================================================
// PARTE 1: desenhar o mapa com Leaflet
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
// DADOS DO CLIMA

// ===================================================

let climaPorDia = [];

let climaCarregado = false;

fetch("data/clima.json")

  .then((resposta) => {

    if (!resposta.ok) {

      throw new Error("Não foi possível carregar o clima.json");

    }

    return resposta.json();

  })

  .then((dados) => {

    climaPorDia = dados;

    climaCarregado = true;

    console.log("Clima carregado:", climaPorDia);

    const diaInicial = document.querySelector(".day-tab.is-active");

    if (diaInicial) {

      diaInicial.click();

    }

  })

  .catch((erro) => {

    console.error("Não consegui carregar o clima:", erro);

  });
// ===================================================
// PARTE 2: fazer os botões dos dias funcionarem de acordo com o clima
// ===================================================

// Traduz o código do Open-Meteo para um dos temas visuais do site

function classificarClima(codigo, precipitacao) {

  // Céu limpo
  if (codigo <= 1) {
    return "sol";
  }

  // Nublado
  if (codigo <= 3) {
    return "nublado";
  }

  // Chuva muito intensa
  if (precipitacao >= 25) {
    return "tempestade";
  }

  // Chuva normal
  return "chuva";
}

// Retorna o ícone e o nome do clima, para mostrar no painel

function obterInfoClima(codigo, precipitacao) {

  if (codigo <= 1) {
    return {
      icone: "☀️",
      nome: "Sol"
    };
  }

  if (codigo <= 3) {
    return {
      icone: "☁️",
      nome: "Nublado"
    };
  }

  if (precipitacao >= 25) {
    return {
      icone: "⛈️",
      nome: "Tempestade"
    };
  }

  return {
    icone: "🌧️",
    nome: "Chuva"
  };
}

// Pega todos os botões que tem a classe "day-tab"

const dayTabs = document.querySelectorAll(".day-tab");

// Pega todos os painéis de conteúdo que tem a classe "day-panel"

const dayPanels = document.querySelectorAll(".day-panel");

dayTabs.forEach((tab) => {

  // Para cada botão, escutamos o evento de clique

  tab.addEventListener("click", () => {

    const targetDay = tab.dataset.day;

    // Converte "dia1", "dia2"... para a data correspondente

    const numeroDia = Number(targetDay.replace("dia", ""));

    const dataClima = `2026-09-${String(8 + numeroDia).padStart(2, "0")}`;

    // Tira o destaque de todos os botões

    dayTabs.forEach((t) => {

      t.classList.remove("is-active");

      t.setAttribute("aria-selected", "false");

    });

    // Coloca destaque só no botão clicado

    tab.classList.add("is-active");

    tab.setAttribute("aria-selected", "true");

    // Esconde todos os painéis

    dayPanels.forEach((panel) => {

      panel.hidden = true;

      panel.classList.remove("is-active");

    });

    // Mostra só o painel do dia clicado

    const targetPanel = document.getElementById(targetDay);

    if (targetPanel) {

      targetPanel.hidden = false;

      targetPanel.classList.add("is-active");

    }

    // Remove qualquer tema anterior

    document.body.classList.remove(
      "tema-sol",
      "tema-nublado",
      "tema-chuva",
      "tema-tempestade",
      "tema-rir"
    );

    // Busca o clima do dia clicado

    let climaDoDia = null;

    if (climaCarregado) {

      climaDoDia = climaPorDia.find(
        (item) => item.date === dataClima
      );

    }

    // Dia 11/09 — Rock in Rio

    if (targetDay === "dia3") {

      document.body.classList.add("tema-rir");

    }

    // Dia 12/09 — exceção: sol observado

    else if (targetDay === "dia4") {

      document.body.classList.add("tema-sol");

    }

    // Demais dias: usa o clima do JSON

    else {

      if (!climaCarregado) {

        console.warn("O clima ainda está carregando.");

        return;

      }

      if (climaDoDia) {

        const temaClima = classificarClima(
          climaDoDia.weathercode,
          climaDoDia.precipitation_sum
        );

        document.body.classList.add(`tema-${temaClima}`);

      }

    }

    // ===================================================
    // INFORMAÇÕES DO CARD DE CLIMA
    // ===================================================

    const climaCard = targetPanel?.querySelector(".clima-card");

    if (climaCard) {

      const infoClima = climaCard.querySelector(".clima-card__info");

      // Dia 11/09 — Rock in Rio

      if (targetDay === "dia3") {

        infoClima.textContent =
          "☀️ Sol · 26°C · Rock in Rio 🎸";

      }

      // Dia 12/09 — sol observado

      else if (targetDay === "dia4") {

        infoClima.textContent =
          "☀️ Sol · 26°C";

      }

      // Demais dias — dados do clima.json

      else if (climaDoDia) {

        const info = obterInfoClima(
          climaDoDia.weathercode,
          climaDoDia.precipitation_sum
        );

        infoClima.textContent =
          `${info.icone} ${info.nome} · ${climaDoDia.temperature_2m_max}°C · ${climaDoDia.precipitation_sum} mm`;

      }

    }

  });

});

// ===================================================// ===================================================
// PARTE 3: checklist da mala, por categoria, com progresso
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
// PARTE 4: contador regressivo até a viagem
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
// PARTE 5: fundo interativo — o brilho segue o mouse
// ===================================================
// Toda vez que o mouse se move, atualizamos duas variáveis CSS
// (--mx e --my) com a posição do cursor em porcentagem da tela.
// O CSS (body::before) usa essas variáveis pra mover o brilho.
document.addEventListener("mousemove", (evento) => {
  const porcentagemX = (evento.clientX / window.innerWidth) * 100;
  const porcentagemY = (evento.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mx", porcentagemX + "%");
  document.documentElement.style.setProperty("--my", porcentagemY + "%");
});

// ===================================================
// PARTE 6: gerar as estrelas do tema do Dia 11
// ===================================================

const QUANTIDADE_ESTRELAS = 80;
const containerEstrelas = document.getElementById("stars");

console.log("Container das estrelas:", containerEstrelas);
console.log("Quantidade de estrelas:", QUANTIDADE_ESTRELAS);

if (containerEstrelas) {

  for (let i = 0; i < QUANTIDADE_ESTRELAS; i++) {

    const estrela = document.createElement("div");

    estrela.className = "star";

    estrela.style.top = Math.random() * 100 + "%";
    estrela.style.left = Math.random() * 100 + "%";

    // Estrelas com tamanhos diferentes
    const tamanho = Math.random() * 2 + 1;

    estrela.style.width = tamanho + "px";
    estrela.style.height = tamanho + "px";

    // Cada estrela pisca em uma velocidade diferente
    const duracaoTwinkle = Math.random() * 2 + 2;

    // Movimento extremamente suave pelo fundo
    const duracaoDrift = Math.random() * 6 + 8;

    estrela.style.animationDuration =
      `${duracaoTwinkle}s, ${duracaoDrift}s`;

    // Faz cada uma começar em um momento diferente
    estrela.style.animationDelay =
      `${Math.random() * 3}s, ${Math.random() * 5}s`;

    // Algumas estrelas ficam mais brilhantes
    if (Math.random() > 0.85) {
      estrela.style.boxShadow =
        "0 0 8px rgba(255,255,255,0.95)";
    }

    containerEstrelas.appendChild(estrela);
  }

}
// ===================================================
// PARTE 7: crachás interativos — clicar troca a carinha
// ===================================================
const crachas = document.querySelectorAll(".crew-card__badge-wrap");

crachas.forEach((cracha) => {
  // A lista de carinhas foi guardada no HTML, separada por vírgula
  const carinhas = cracha.dataset.faces.split(",");
  let indiceAtual = 0;

  cracha.addEventListener("click", () => {
    indiceAtual = (indiceAtual + 1) % carinhas.length; // volta pro início ao chegar no fim
    const elementoTexto = cracha.querySelector(".badge-face");
    elementoTexto.textContent = carinhas[indiceAtual];
  });
});
// ===================================================
// PARTE 8: entrada cinematográfica do título "Rio 2026"
// ===================================================

const titulo = document.getElementById("titulo-animado");

if (titulo) {
  const texto = titulo.textContent;

  titulo.textContent = "";

  [...texto].forEach((letra, i) => {
    const span = document.createElement("span");

    span.textContent = letra === " " ? "\u00A0" : letra;
    span.style.setProperty("--delay", `${i * 0.5}s`);

    titulo.appendChild(span);
  });
}
// ===================================================
// PARTE 9: ÁLBUM DE FOTOS
// ===================================================

let fotosAlbum = [];
let indiceAtual = 0;
let legendasPorFoto = [];

const paginaAtual = document.getElementById("pagina-atual");
const botaoAnterior = document.getElementById("pag-anterior");
const botaoProxima = document.getElementById("pag-proxima");
const campoLegenda = document.getElementById("album-legenda");
const contadorAlbum = document.getElementById("album-contador");


// CARREGAR FOTOS DO JSON

fetch("data/fotos.json")
  .then((resposta) => {

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o fotos.json");
    }

    return resposta.json();

  })

  .then((dados) => {

    fotosAlbum = dados;

    legendasPorFoto = new Array(fotosAlbum.length).fill("");

    console.log("Fotos do álbum carregadas:", fotosAlbum);

    mostrarFoto();

  })

  .catch((erro) => {

    console.error("Não consegui carregar as fotos:", erro);

  });


// MOSTRAR FOTO ATUAL

function mostrarFoto() {

  if (!paginaAtual || !fotosAlbum.length) {
    return;
  }

  const foto = fotosAlbum[indiceAtual];

  paginaAtual.innerHTML = `
    <img
      src="assets/fotos/${foto.arquivo}"
      alt="Foto ${indiceAtual + 1} do álbum"
    >
  `;

  campoLegenda.value = legendasPorFoto[indiceAtual] || "";

  contadorAlbum.textContent =
    `${String(indiceAtual + 1).padStart(2, "0")} / ${String(fotosAlbum.length).padStart(2, "0")}`;
}


// SALVAR LEGENDA DA FOTO ATUAL

function salvarLegendaAtual() {

  if (!campoLegenda) {
    return;
  }

  legendasPorFoto[indiceAtual] = campoLegenda.value;

}


// TROCAR DE FOTO

function trocarFoto(novoIndice) {

  salvarLegendaAtual();

  paginaAtual.classList.add("trocando");

  setTimeout(() => {

    indiceAtual = novoIndice;

    mostrarFoto();

    paginaAtual.classList.remove("trocando");

  }, 250);

}


// BOTÃO FOTO ANTERIOR

if (botaoAnterior) {

  botaoAnterior.addEventListener("click", () => {

    const novoIndice =
      (indiceAtual - 1 + fotosAlbum.length) % fotosAlbum.length;

    trocarFoto(novoIndice);

  });

}


// BOTÃO PRÓXIMA FOTO

if (botaoProxima) {

  botaoProxima.addEventListener("click", () => {

    const novoIndice =
      (indiceAtual + 1) % fotosAlbum.length;

    trocarFoto(novoIndice);

  });

}


// TECLADO: ← →

document.addEventListener("keydown", (evento) => {

  if (!fotosAlbum.length) {
    return;
  }

  // Não interfere nas setas enquanto a pessoa estiver digitando
  if (
    evento.target.tagName === "INPUT" ||
    evento.target.tagName === "TEXTAREA"
  ) {
    return;
  }

  if (evento.key === "ArrowLeft") {

    const novoIndice =
      (indiceAtual - 1 + fotosAlbum.length) % fotosAlbum.length;

    trocarFoto(novoIndice);

  }

  if (evento.key === "ArrowRight") {

    const novoIndice =
      (indiceAtual + 1) % fotosAlbum.length;

    trocarFoto(novoIndice);

  }

});

console.log("rio-plan: site carregado ✅");
