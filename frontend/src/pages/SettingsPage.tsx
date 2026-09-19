import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Copy, Check, ArrowLeft } from "lucide-react"
import { getRefreshToken, isLoggedIn } from "@/lib/session"

export default function SettingsPage() {
  const [copied, setCopied] = useState(false)
  const code = getRefreshToken()

  if (!isLoggedIn()) return <Navigate to="/login" replace />

  async function copyCode() {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dash-bg p-6">
      <div className="w-full max-w-[560px] rounded-[22px] bg-dash-surface p-8 shadow-[0_4px_16px_rgba(0,0,0,0.045),0_12px_30px_rgba(0,0,0,0.035)]">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-dash-text-secondary hover:text-dash-text">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>

        <h1 className="text-[22px] font-semibold text-dash-text">Connect the browser extension</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-dash-text-secondary">
          Copy this code and paste it into the MemoryOS extension's settings (right-click the orb icon → Options,
          or open it from <code className="text-[12px]">chrome://extensions</code>). It's unique to your account and
          keeps working until you log out here.
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-[12px] border border-dash-border bg-dash-surface-2 p-3">
          <code className="min-w-0 flex-1 truncate text-[12px] text-dash-text">{code}</code>
          <button
            onClick={copyCode}
            className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-dash-text px-3 py-1.5 text-[12px] font-medium text-white"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="mt-4 text-[12px] text-dash-text-muted">
          This code is a session credential, not a password — don't share it. If you think it's been exposed,
          logging out and back in here issues a new one.
        </p>
      </div>
    </div>
  )
}
