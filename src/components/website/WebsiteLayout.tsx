import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { BookOpen, Menu, X, ChevronDown, Phone, Mail, MapPin } from 'lucide-react'
import { ChatbotWidget } from './ChatbotWidget'

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Curriculum', to: '/curriculum' },
  { label: 'Staff', to: '/staff' },
  {
    label: 'School Life',
    children: [
      { label: 'News & Stories', to: '/news' },
      { label: 'Calendar', to: '/calendar' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Alumni', to: '/alumni' },
    ],
  },
  { label: 'Contact', to: '/contact' },
]

interface WebsiteLayoutProps {
  children: React.ReactNode
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdown(null)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top utility bar */}
      <div className="hidden md:block bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> +234 801 234 5678</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> info@oakridgeacademy.edu</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> 12 Innovation Drive, Victoria Island, Lagos</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">|</span>
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Student/Parent Portal</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">Oakridge Academy</div>
              <div className="text-[10px] text-slate-500 leading-none font-medium">Excellence in Education</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onMouseEnter={() => setDropdown(link.label)}
                    onMouseLeave={() => setDropdown(null)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdown === link.label && (
                    <div
                      onMouseEnter={() => setDropdown(link.label)}
                      onMouseLeave={() => setDropdown(null)}
                      className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50"
                    >
                      {link.children.map(child => (
                        <Link
                          key={child.to}
                          to={child.to as any}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to as any}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Portal Login
            </Link>
            <Link
              to="/admissions"
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-1">
            {navLinks.map(link => (
              link.children ? (
                <div key={link.label}>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">{link.label}</div>
                  {link.children.map(child => (
                    <Link
                      key={child.to}
                      to={child.to as any}
                      className="block px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to as any}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-slate-100 mt-2">
              <Link to="/login" className="block text-center py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Portal Login
              </Link>
              <Link to="/admissions" className="block text-center py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors">
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Oakridge Academy</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Empowering the next generation of leaders through rigorous academics, character development, and innovation.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" /><span>+234 801 234 5678</span></div>
                <div className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" /><span>info@oakridgeacademy.edu</span></div>
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" /><span>12 Innovation Drive, Victoria Island, Lagos</span></div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">School</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Curriculum & Programs', to: '/curriculum' },
                  { label: 'Staff Directory', to: '/staff' },
                  { label: 'Gallery', to: '/gallery' },
                  { label: 'Alumni', to: '/alumni' },
                ].map(l => (
                  <li key={l.to}><Link to={l.to as any} className="text-slate-400 hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Admissions */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Admissions</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Apply Now', to: '/admissions' },
                  { label: 'Fee Schedule', to: '/admissions#fees' },
                  { label: 'Scholarships', to: '/admissions#scholarships' },
                  { label: 'Open Days', to: '/calendar' },
                  { label: 'Contact Us', to: '/contact' },
                ].map(l => (
                  <li key={l.to}><Link to={l.to as any} className="text-slate-400 hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Policies</h4>
              <ul className="space-y-2.5 text-sm">
                {['Safeguarding Policy', 'Anti-Bullying Policy', 'Data Privacy Policy', 'Accessibility Statement', 'Terms of Use'].map(l => (
                  <li key={l}><a href="#" className="text-slate-400 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© 2026 Oakridge Academy. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Accredited by the British Council</span>
              <span>·</span>
              <span>ISO 9001:2015 Certified</span>
              <span>·</span>
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Student & Parent Portal</Link>
            </div>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  )
}
