import { refreshSession } from "@/lib/cognito"
import { getIdToken, getRefreshToken } from "@/lib/session"
import type { Memory } from "@/types/memory"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const isApiConfigured = Boolean(API_BASE_URL)

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!isApiConfigured) {
    throw new Error("The backend isn't deployed yet, so there's no API to call.")
  }

  let token = getIdToken()
  const expiresAt = Number(localStorage.getItem("memoryos.tokenExpiresAt") || 0)
  const refreshToken = getRefreshToken()

  if (refreshToken && Date.now() > expiresAt - 60_000) {
    token = (await refreshSession(refreshToken)) || token
  }
  if (!token) {
    throw new Error("You're not logged in.")
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
  })
}

export async function fetchMemories(): Promise<Memory[]> {
  const resp = await authedFetch("/memories")
  if (!resp.ok) throw new Error("Couldn't load your memories.")
  const data = await resp.json()
  return data.memories as Memory[]
}

export async function saveQuickMemory(content: string): Promise<void> {
  const resp = await authedFetch("/memories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "manual_page", title: content.slice(0, 60), content }),
  })
  if (!resp.ok) throw new Error("Couldn't save that memory.")
}
