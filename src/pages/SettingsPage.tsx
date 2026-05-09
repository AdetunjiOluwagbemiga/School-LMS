import { useState } from 'react'
import { Sun, Moon, Monitor, Globe, Shield, Bell, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'

export function SettingsPage() {
  const { theme, setTheme } = useUIStore()
  const [notifs, setNotifs] = useState({ grades: true, deadlines: true, forums: false, badges: true })

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your preferences and account settings</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === t.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-500" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'grades' as const, label: 'Grade Updates', desc: 'When grades are posted or updated' },
            { key: 'deadlines' as const, label: 'Deadline Reminders', desc: '24h before assignment due dates' },
            { key: 'forums' as const, label: 'Forum Replies', desc: 'When someone replies to your threads' },
            { key: 'badges' as const, label: 'Badge Achievements', desc: 'When you earn a new badge' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifs((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifs[item.key] ? 'bg-brand-500' : 'bg-slate-200'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                  notifs[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Your data is processed in accordance with GDPR and NDPA regulations.
            EduFlow never sells your personal data to third parties.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="w-3.5 h-3.5" />
              Download My Data
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-500" />
            Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">
            Download the EduFlow mobile app for offline learning and push notifications.
            Available on iOS and Android.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">iOS App Store</Button>
            <Button variant="outline" size="sm">Google Play</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
