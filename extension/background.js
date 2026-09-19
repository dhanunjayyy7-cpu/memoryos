const DEBOUNCE_MS = 3000;
const debounceTimers = new Map();

async function getAuthedConfig() {
  const cfg = await chrome.storage.local.get([
    "apiBaseUrl",
    "awsRegion",
    "clientId",
    "idToken",
    "refreshToken",
    "tokenExpiresAt",
  ]);

  if (cfg.idToken && cfg.tokenExpiresAt && Date.now() > cfg.tokenExpiresAt - 60000) {
    await refreshToken(cfg);
    return chrome.storage.local.get(["apiBaseUrl", "idToken"]);
  }
  return cfg;
}

async function refreshToken(cfg) {
  if (!cfg.refreshToken || !cfg.awsRegion || !cfg.clientId) return;
  try {
    const resp = await fetch(`https://cognito-idp.${cfg.awsRegion}.amazonaws.com/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: cfg.clientId,
        AuthParameters: { REFRESH_TOKEN: cfg.refreshToken },
      }),
    });
    const data = await resp.json();
    if (data.AuthenticationResult) {
      await chrome.storage.local.set({
        idToken: data.AuthenticationResult.IdToken,
        tokenExpiresAt: Date.now() + data.AuthenticationResult.ExpiresIn * 1000,
      });
    }
  } catch (err) {
    console.warn("MemoryOS token refresh failed", err);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "MEMORYOS_SAVE") {
    handleSave(message.payload).then(sendResponse);
    return true;
  }
  if (message.type === "MEMORYOS_PAGE_CONTEXT") {
    handlePageContext(message.payload, sender.tab?.id);
  }
});

async function handleSave(payload) {
  const { apiBaseUrl, idToken } = await getAuthedConfig();
  if (!apiBaseUrl) return { ok: false, error: "no api base url configured" };
  if (!idToken) return { ok: false, error: "not logged in — open MemoryOS settings" };

  try {
    const resp = await fetch(`${apiBaseUrl}/memories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(payload),
    });
    return { ok: resp.ok };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function handlePageContext(payload, tabId) {
  if (tabId === undefined) return;

  if (debounceTimers.has(tabId)) clearTimeout(debounceTimers.get(tabId));
  debounceTimers.set(
    tabId,
    setTimeout(() => {
      debounceTimers.delete(tabId);
      fetchContext(payload, tabId);
    }, DEBOUNCE_MS)
  );
}

async function fetchContext(payload, tabId) {
  const { apiBaseUrl, idToken } = await getAuthedConfig();
  if (!apiBaseUrl || !idToken) return;

  try {
    const resp = await fetch(`${apiBaseUrl}/context`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) return;
    const data = await resp.json();
    if (data.memories && data.memories.length > 0) {
      chrome.tabs.sendMessage(tabId, { type: "MEMORYOS_NOTIFICATION", memories: data.memories });
    }
  } catch (err) {
    console.warn("MemoryOS context fetch failed", err);
  }
}
