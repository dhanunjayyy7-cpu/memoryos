(() => {
  const DOUBLE_TAP_MS = 350;

  let lastClickTime = 0;
  let pendingMemories = [];

  const orb = document.createElement("div");
  orb.id = "memoryos-orb";
  orb.innerHTML = '<span class="memoryos-badge"></span>';
  document.documentElement.appendChild(orb);

  orb.addEventListener("click", onOrbClick);

  function onOrbClick() {
    const now = Date.now();
    const isDoubleTap = now - lastClickTime < DOUBLE_TAP_MS;
    lastClickTime = now;

    closeAnyOverlay();

    if (isDoubleTap) {
      openSaveMenu();
    } else if (pendingMemories.length > 0) {
      openMemoryPanel(pendingMemories);
    }
  }

  function openSaveMenu() {
    const selectionText = window.getSelection().toString().trim();

    const menu = document.createElement("div");
    menu.className = "memoryos-menu";
    menu.id = "memoryos-menu";
    positionNearOrb(menu);

    const savePageBtn = document.createElement("button");
    savePageBtn.textContent = "Save this page";
    savePageBtn.onclick = () => {
      saveMemory("manual_page", document.title, location.href, extractPageText());
      closeAnyOverlay();
    };
    menu.appendChild(savePageBtn);

    const saveSelectionBtn = document.createElement("button");
    saveSelectionBtn.textContent = selectionText ? "Save selection" : "Save selection (select text first)";
    saveSelectionBtn.disabled = !selectionText;
    saveSelectionBtn.style.opacity = selectionText ? "1" : "0.5";
    saveSelectionBtn.onclick = () => {
      if (!selectionText) return;
      saveMemory("manual_selection", document.title, location.href, selectionText);
      closeAnyOverlay();
    };
    menu.appendChild(saveSelectionBtn);

    document.documentElement.appendChild(menu);
    setTimeout(() => document.addEventListener("click", onOutsideClick, { once: true }), 0);
  }

  function onOutsideClick(e) {
    if (!e.target.closest("#memoryos-menu") && e.target.id !== "memoryos-orb") {
      closeAnyOverlay();
    }
  }

  function closeAnyOverlay() {
    document.getElementById("memoryos-menu")?.remove();
    document.getElementById("memoryos-panel")?.remove();
  }

  function positionNearOrb(el) {
    el.style.bottom = "84px";
    el.style.right = "24px";
  }

  function extractPageText() {
    return (document.body.innerText || "").slice(0, 20000);
  }

  function saveMemory(source, title, url, content) {
    chrome.runtime.sendMessage(
      { type: "MEMORYOS_SAVE", payload: { source, title, url, content } },
      (resp) => showToast(resp && resp.ok ? "Saved to MemoryOS" : "Save failed")
    );
  }

  function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "memoryos-toast";
    toast.textContent = text;
    document.documentElement.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  function openMemoryPanel(memories) {
    const panel = document.createElement("div");
    panel.className = "memoryos-panel";
    panel.id = "memoryos-panel";

    const heading = document.createElement("h3");
    heading.textContent = `${memories.length} related memories`;
    panel.appendChild(heading);

    memories.forEach((m) => {
      const card = document.createElement("div");
      card.className = "memoryos-memory-card";
      card.innerHTML = `
        <div class="memoryos-score">${Math.round(m.score * 100)}% · ${m.type}</div>
        <div><strong>${escapeHtml(m.title)}</strong></div>
        <div>${escapeHtml(m.explanation)}</div>
      `;
      panel.appendChild(card);
    });

    document.documentElement.appendChild(panel);
    setTimeout(() => document.addEventListener("click", onOutsideClick, { once: true }), 0);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "MEMORYOS_NOTIFICATION") {
      pendingMemories = message.memories || [];
      orb.classList.toggle("memoryos-has-notification", pendingMemories.length > 0);
      orb.classList.toggle("memoryos-pulse", pendingMemories.length > 0);
      orb.querySelector(".memoryos-badge").textContent = String(pendingMemories.length);
    }
  });

  chrome.runtime.sendMessage({
    type: "MEMORYOS_PAGE_CONTEXT",
    payload: { title: document.title, url: location.href },
  });
})();
