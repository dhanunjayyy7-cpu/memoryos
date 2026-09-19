const els = {
  apiBaseUrl: document.getElementById("apiBaseUrl"),
  awsRegion: document.getElementById("awsRegion"),
  clientId: document.getElementById("clientId"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  status: document.getElementById("status"),
};

chrome.storage.local.get(["apiBaseUrl", "awsRegion", "clientId", "idToken"], (cfg) => {
  els.apiBaseUrl.value = cfg.apiBaseUrl || "";
  els.awsRegion.value = cfg.awsRegion || "";
  els.clientId.value = cfg.clientId || "";
  if (cfg.idToken) setStatus("Logged in.");
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

document.getElementById("login").addEventListener("click", async () => {
  const { awsRegion, clientId } = await chrome.storage.local.get(["awsRegion", "clientId"]);
  if (!awsRegion || !clientId) {
    setStatus("Save the region and client id first.", true);
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
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: { USERNAME: els.email.value.trim(), PASSWORD: els.password.value },
      }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.AuthenticationResult) {
      setStatus(data.message || "Login failed.", true);
      return;
    }

    const { IdToken, RefreshToken, ExpiresIn } = data.AuthenticationResult;
    await chrome.storage.local.set({
      idToken: IdToken,
      refreshToken: RefreshToken,
      tokenExpiresAt: Date.now() + ExpiresIn * 1000,
    });
    setStatus("Logged in.");
  } catch (err) {
    setStatus(String(err), true);
  }
});

function setStatus(text, isError) {
  els.status.textContent = text;
  els.status.style.color = isError ? "#dc2626" : "#16a34a";
}
