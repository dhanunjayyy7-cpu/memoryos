const REGION = import.meta.env.VITE_AWS_REGION
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID

export const isCognitoConfigured = Boolean(REGION && CLIENT_ID)

interface AuthResult {
  idToken: string
  refreshToken: string
  expiresIn: number
}

async function callCognito(target: string, body: Record<string, unknown>) {
  const resp = await fetch(`https://cognito-idp.${REGION}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.")
  }
  return data
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isCognitoConfigured) {
    throw new Error("Sign-in isn't configured yet — the backend hasn't been deployed.")
  }
  const data = await callCognito("InitiateAuth", {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: { USERNAME: email, PASSWORD: password },
  })
  if (!data.AuthenticationResult) {
    throw new Error("Incorrect email or password.")
  }
  const { IdToken, RefreshToken, ExpiresIn } = data.AuthenticationResult
  return { idToken: IdToken, refreshToken: RefreshToken, expiresIn: ExpiresIn }
}

export function storeSession({ idToken, refreshToken, expiresIn }: AuthResult) {
  localStorage.setItem("memoryos.idToken", idToken)
  localStorage.setItem("memoryos.refreshToken", refreshToken)
  localStorage.setItem("memoryos.tokenExpiresAt", String(Date.now() + expiresIn * 1000))
}
