export function getIdToken(): string | null {
  return localStorage.getItem("memoryos.idToken")
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("memoryos.refreshToken")
}

export function isLoggedIn(): boolean {
  return Boolean(getIdToken())
}

export function logOut() {
  localStorage.removeItem("memoryos.idToken")
  localStorage.removeItem("memoryos.refreshToken")
  localStorage.removeItem("memoryos.tokenExpiresAt")
}
