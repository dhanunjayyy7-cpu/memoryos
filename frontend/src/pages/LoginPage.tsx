import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn, storeSession } from "@/lib/cognito"
import authSideImage from "@/assets/auth_side_layout.png"

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "success" }

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const [notice, setNotice] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setNotice(null)
    setStatus({ kind: "loading" })
    try {
      const result = await signIn(email, password)
      storeSession(result)
      setStatus({ kind: "success" })
      setTimeout(() => navigate("/dashboard"), 500)
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e9e9e9] p-4 sm:p-6">
      <div className="grid w-full max-w-[1160px] grid-cols-1 overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] md:h-[780px] md:grid-cols-[56%_44%]">
        <div className="p-3 sm:p-4">
          <img
            src={authSideImage}
            alt="MemoryOS mascot surrounded by floating contextual-memory elements"
            className="h-56 w-full rounded-[24px] object-cover sm:h-72 md:h-full"
          />
        </div>

        <div className="flex flex-col justify-center px-8 py-10 sm:px-12 md:px-14 md:py-14">
          <div className="mx-auto w-full max-w-[380px]">
            <div className="mb-9 flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-[10px] bg-ink">
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#38bdf8" strokeWidth={2}>
                  <path d="M8 6c-2.5 2-2.5 6 0 8M16 6c2.5 2 2.5 6 0 8" strokeLinecap="round" />
                  <circle cx="12" cy="10" r="1.4" fill="#38bdf8" stroke="none" />
                </svg>
              </div>
              <span className="text-[15px] font-bold text-ink">MemoryOS</span>
            </div>

            <h1 className="text-[38px] font-bold leading-tight tracking-tight text-ink">Welcome back!</h1>
            <p className="mt-2 text-[14px] text-neutral-500">Your context is waiting for you.</p>

            <form className="mt-9 flex flex-col gap-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-[13px] font-medium text-ink">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 h-12 w-full border-0 border-b border-neutral-300 bg-transparent text-[15px] text-ink outline-none placeholder:text-neutral-400 focus:border-ink transition-colors"
                />
              </label>

              <label className="block">
                <span className="text-[13px] font-medium text-ink">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 h-12 w-full border-0 border-b border-neutral-300 bg-transparent pr-8 text-[15px] text-ink outline-none placeholder:text-neutral-400 focus:border-ink transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 text-neutral-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-3.5 accent-black"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setNotice("Password reset isn't set up yet.")}
                  className="text-neutral-500 hover:text-ink"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" size="lg" disabled={status.kind === "loading"} className="h-[54px] w-full text-[15px]">
                {status.kind === "loading" ? "Logging in…" : <>Log in <span aria-hidden="true">&rarr;</span></>}
              </Button>

              <button
                type="button"
                onClick={() => setNotice("Google sign-in isn't set up yet.")}
                className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-full bg-neutral-100 text-[15px] font-medium text-ink transition-colors hover:bg-neutral-200"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {status.kind === "error" && (
                <p className="-mt-2 text-center text-[13px] text-red-600">{status.message}</p>
              )}
              {status.kind === "success" && (
                <p className="-mt-2 text-center text-[13px] text-emerald-600">Logged in — welcome back!</p>
              )}
              {notice && <p className="-mt-2 text-center text-[13px] text-neutral-500">{notice}</p>}
            </form>

            <p className="mt-7 text-center text-[13px] text-neutral-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setNotice("Sign-up isn't open yet — ask an admin to create your account.")}
                className="font-semibold text-ink"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.6 27 35.5 24 35.5c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.9 36.3 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5Z"
      />
    </svg>
  )
}
