import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
      } else {
        navigate({ to: '/app/learn/dashboard' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true)
    setError('')
    const demoAccounts: Record<string, { email: string; password: string }> = {
      student: { email: 'demo.student@oakridge.edu', password: 'demo123456' },
      teacher: { email: 'demo.teacher@oakridge.edu', password: 'demo123456' },
      admin: { email: 'demo.admin@oakridge.edu', password: 'demo123456' },
    }
    const account = demoAccounts[role]
    if (account) {
      const { error: authError } = await supabase.auth.signInWithPassword(account)
      if (authError) {
        setError('Demo account not set up yet. Please register manually.')
      } else {
        const routes: Record<string, string> = {
          student: '/app/learn/dashboard',
          teacher: '/app/teach/dashboard',
          admin: '/app/admin/dashboard',
        }
        navigate({ to: routes[role] as '/app/learn/dashboard' })
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-900 relative overflow-hidden p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-brand-900/40" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduFlow LMS</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white leading-tight mb-6">
              The Global Standard for Modern Learning
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              SCORM/xAPI compliant. Adaptive learning paths. Real-time analytics.
              Built for schools and enterprises worldwide.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '50K+', label: 'Active Learners' },
                { stat: '200+', label: 'Institutions' },
                { stat: '98%', label: 'Completion Rate' },
                { stat: '40+', label: 'Countries' },
              ].map((item) => (
                <div key={item.stat} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{item.stat}</div>
                  <div className="text-sm text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="relative z-10 mt-auto flex flex-wrap gap-2">
          {['SCORM 1.2 / 2004', 'xAPI / Tin Can', 'LTI Ready', 'GDPR/NDPA Compliant', 'SSO Ready', 'Multi-Tenant'].map((f) => (
            <span key={f} className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">EduFlow LMS</span>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

          {/* Demo quick-access */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-medium text-brand-700 mb-2">Quick Demo Access</p>
            <div className="flex gap-2">
              {['student', 'teacher', 'admin'].map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(role)}
                  disabled={isLoading}
                  className="flex-1 text-xs capitalize border-brand-200 text-brand-700 hover:bg-brand-100"
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <Input
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-brand-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">OR CONTINUE WITH</div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0078D4">
                <path d="M11.4 24H0V12.6L11.4 24zM12.6 24H24V12.6L12.6 24zM0 11.4V0h11.4L0 11.4zM24 0H12.6L24 11.4V0z"/>
              </svg>
              Microsoft
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">Create one</Link>
          </p>

          {/* GDPR notice */}
          <p className="text-center text-xs text-slate-400 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We comply with GDPR & NDPA.
          </p>
        </div>
      </div>
    </div>
  )
}
