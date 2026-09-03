// app.js
// Este arquivo controla o comportamento (a "vida") do site.

// ===================================================
// PARTE 1: fazer os botões dos dias funcionarem
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
// PRÓXIMOS PASSOS (ainda não implementados,
// na ordem do nosso plano):
// 2. Mapa interativo com Leaflet.js
// 3. Checklist da mala clicável, com barra de progresso
// 4. Efeito liquid-glass nos cartões
// 5. Fundo gerado no Haikei
// 6. Contador regressivo até 9/09
// 7. Seção "curiosidades do Rock in Rio 1985"
// 8. Orçamento visual (soma dos ingressos)
// 9. Seção de fotos pós-viagem (Fase 2)
// ===================================================

console.log("rio-plan: site carregado ✅");
