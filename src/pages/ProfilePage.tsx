import { useState } from 'react'
import { Camera, Save, User, Mail, Phone, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/utils'

export function ProfilePage() {
  const { profile, activeRole, tenant } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account information and preferences</p>
      </div>

      {/* Avatar section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xl font-bold bg-brand-500 text-white">
                  {getInitials(profile?.full_name ?? 'U')}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-full border-2 border-white flex items-center justify-center hover:bg-brand-600 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{profile?.full_name ?? 'User'}</h2>
              <p className="text-slate-500 text-sm">{tenant?.name ?? 'EduFlow'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="text-xs capitalize">
                  {activeRole?.replace('_', ' ') ?? 'User'}
                </Badge>
                <Badge variant="success" className="text-xs">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
              <Input defaultValue={profile?.full_name?.split(' ')[0] ?? ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
              <Input defaultValue={profile?.full_name?.split(' ').slice(1).join(' ') ?? ''} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
            </label>
            <Input type="email" defaultValue="user@oakridge.edu" disabled className="bg-slate-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
            </label>
            <Input type="tel" defaultValue={profile?.phone ?? ''} placeholder="+234 000 000 0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> Language
            </label>
            <select className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic (RTL)</option>
              <option value="yo">Yoruba</option>
              <option value="ha">Hausa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea
              rows={3}
              defaultValue={profile?.bio ?? ''}
              placeholder="Tell us a bit about yourself..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 min-w-[100px]">
              {isSaving ? (
                <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving</span>
              ) : saved ? (
                '✓ Saved!'
              ) : (
                <><Save className="w-4 h-4" />Save Changes</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
