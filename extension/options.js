const els = {
  apiBaseUrl: document.getElementById("apiBaseUrl"),
  awsRegion: document.getElementById("awsRegion"),
  clientId: document.getElementById("clientId"),
  code: document.getElementById("code"),
  status: document.getElementById("status"),
};

chrome.storage.local.get(["apiBaseUrl", "awsRegion", "clientId", "idToken"], (cfg) => {
  els.apiBaseUrl.value = cfg.apiBaseUrl || "";
  els.awsRegion.value = cfg.awsRegion || "";
  els.clientId.value = cfg.clientId || "";
  if (cfg.idToken) setStatus("Connected.");
});

document.getElementById("saveConfig").addEventListener("click", () => {
  chrome.storage.local.set(
    {
      apiBaseUrl: els.apiBaseUrl.value.trim(),
      awsRegion: els.awsRegion.value.trim(),
      clientId: els.clientId.value.trim(),
    },
    () => setStatus("Config saved.")
  );
});

document.getElementById("connect").addEventListener("click", async () => {
  const { awsRegion, clientId } = await chrome.storage.local.get(["awsRegion", "clientId"]);
  const code = els.code.value.trim();

  if (!awsRegion || !clientId) {
    setStatus("Save the region and client id first.", true);
    return;
  }
  if (!code) {
    setStatus("Paste the code from the dashboard first.", true);
    return;
  }

  try {
    const resp = await fetch(`https://cognito-idp.${awsRegion}.amazonaws.com/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: clientId,
        AuthParameters: { REFRESH_TOKEN: code },
      }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.AuthenticationResult) {
      setStatus(data.message || "That code didn't work — copy a fresh one from the dashboard.", true);
      return;
    }

    const { IdToken, ExpiresIn } = data.AuthenticationResult;
    await chrome.storage.local.set({
      idToken: IdToken,
      refreshToken: code,
      tokenExpiresAt: Date.now() + ExpiresIn * 1000,
    });
    setStatus("Connected.");
  } catch (err) {
    setStatus(String(err), true);
  }
});

function setStatus(text, isError) {
  els.status.textContent = text;
  els.status.style.color = isError ? "#dc2626" : "#16a34a";
}
