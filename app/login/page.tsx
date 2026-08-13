// app/login/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Eye, EyeOff, X, Loader2, CheckCircle2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "You cancelled the sign-in process.",
  token_failed: "Could not authenticate with Google. Please try again.",
  profile_failed: "Could not retrieve account information. Please try again.",
  server_error: "Server error. Please try again later.",
};

// ── Sign Up Modal ─────────────────────────────────────────────────────────────
function SignUpModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/home"), 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create account</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Join WorkAI and boost your productivity
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success state */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 gap-3"
            >
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p className="font-bold text-slate-800">Account created!</p>
              <p className="text-sm text-slate-400">Redirecting to your workspace...</p>
            </motion.div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              {/* Full name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                    placeholder="At least 6 characters"
                    className="w-full h-11 px-4 pr-11 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSignUp}
                disabled={loading || !name || !email || !password}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 mb-5"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400">Or sign up with</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Google */}
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-2 w-full h-11 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl text-sm font-semibold text-slate-700 transition-all shadow-sm group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="group-hover:text-blue-700 transition-colors">
                  Continue with Google
                </span>
              </a>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Tách phần nội dung Đăng nhập vào trong ────────────────────────────────────
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = async () => {
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Login failed.");
      } else {
        router.push("/home");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full border-[40px] border-blue-200/50 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full border-[30px] border-blue-200/40 pointer-events-none" />
      <div className="absolute top-[30%] left-[5%] w-32 h-32 rounded-full border-[20px] border-indigo-200/30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex"
        style={{ minHeight: 480 }}
      >
        {/* ── Left: Form ── */}
        <div className="flex-1 px-12 py-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              WorkAI
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Log In</h2>
          <p className="text-slate-400 text-sm mb-7">
            Welcome back! Please enter your details
          </p>

          {/* OAuth error */}
          {error && ERROR_MESSAGES[error] && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
            >
              {ERROR_MESSAGES[error]}
            </motion.div>
          )}

          {/* Login error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
            >
              {loginError}
            </motion.div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                className="w-full h-11 px-4 pr-11 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="flex justify-end mb-6">
            <a href="#" className="text-xs text-blue-500 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 mb-5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">Or Continue With</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Google */}
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-2 h-11 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl text-sm font-semibold text-slate-700 transition-all shadow-sm group"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="group-hover:text-blue-700 transition-colors">Google</span>
          </a>

          {/* Sign up link */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => setShowSignUp(true)}
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="hidden md:block w-[340px] relative overflow-hidden rounded-r-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700" />
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full border-[30px] border-white/10" />
          <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 rounded-full border-[20px] border-white/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-center border border-white/20">
              <p className="text-white font-bold text-base mb-1">WorkAI</p>
              <p className="text-white/80 text-xs leading-relaxed">
                Manage your tasks smarter with AI-powered tools
              </p>
            </div>
          </div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-white/5 border border-white/10" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white/10 border border-white/20" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-[30%] left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">AI Assistant</p>
                <p className="text-white/70 text-[10px]">Ready to help</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sign Up Modal */}
      <AnimatePresence>
        {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ── Bọc Suspense ở ngoài cùng ──────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}