import { useState, useEffect } from 'react'
import { Award, Lock, Star, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { getRarityColor, getRarityGlow } from '@/lib/utils'
import type { Badge as BadgeType } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'
const EARNED_BADGE_IDS = [
  'e0000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000004',
]

const BADGE_EMOJIS: Record<string, string> = {
  'First Steps': '🚀',
  'Quiz Master': '🎯',
  'Course Completer': '🏆',
  'Streak Keeper': '🔥',
  'Top Scholar': '⭐',
  'Perfect Score': '💯',
  'Legend': '👑',
}

export function BadgesPage() {
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all')

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from('badges')
        .select('*')
        .eq('tenant_id', DEMO_TENANT_ID)
        .order('created_at')
      setBadges(data ?? [])
      setIsLoading(false)
    }
    load()
  }, [])

  const earned = badges.filter((b) => EARNED_BADGE_IDS.includes(b.id))
  const locked = badges.filter((b) => !EARNED_BADGE_IDS.includes(b.id))

  const filtered = filter === 'earned' ? earned : filter === 'locked' ? locked : badges

  const totalPoints = earned.reduce((sum, b) => sum + b.points_value, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Badges & Achievements</h1>
        <p className="text-slate-500 text-sm mt-0.5">Earn badges by completing courses, quizzes, and challenges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-slate-900">{earned.length}</p>
            <p className="text-xs text-slate-400 mt-1">Badges Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-amber-600">{totalPoints}</p>
            <p className="text-xs text-slate-400 mt-1">XP from Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-slate-400">{locked.length}</p>
            <p className="text-xs text-slate-400 mt-1">Yet to Earn</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Badge Collection Progress</span>
            <span className="text-sm font-bold text-brand-600">{earned.length}/{badges.length}</span>
          </div>
          <Progress
            value={badges.length > 0 ? (earned.length / badges.length) * 100 : 0}
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-amber-400 to-orange-500"
          />
          <p className="text-xs text-slate-400 mt-2">
            {badges.length - earned.length} more badge{badges.length - earned.length !== 1 ? 's' : ''} to collect
          </p>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2">
        {([
          { value: 'all', label: 'All Badges' },
          { value: 'earned', label: `Earned (${earned.length})` },
          { value: 'locked', label: `Locked (${locked.length})` },
        ] as const).map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Badges grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((badge) => {
            const isEarned = EARNED_BADGE_IDS.includes(badge.id)
            const rarityColor = getRarityColor(badge.rarity)
            const rarityGlow = isEarned ? getRarityGlow(badge.rarity) : ''

            return (
              <div
                key={badge.id}
                className={`relative rounded-2xl border p-5 text-center transition-all ${
                  isEarned
                    ? `bg-white border-slate-200 hover:shadow-md ${rarityGlow}`
                    : 'bg-slate-50 border-slate-100 opacity-60'
                }`}
              >
                {isEarned && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  isEarned ? 'bg-amber-50 border-2' : 'bg-slate-100 border border-slate-200'
                }`} style={{ borderColor: isEarned ? rarityColor : undefined }}>
                  {isEarned ? (
                    <span className="text-3xl">{BADGE_EMOJIS[badge.name] ?? '🏅'}</span>
                  ) : (
                    <Lock className="w-6 h-6 text-slate-300" />
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-900 mb-1">{badge.name}</h3>
                <p className="text-xs text-slate-400 mb-2 leading-tight">{badge.description}</p>

                <div className="flex items-center justify-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: rarityColor }}
                  />
                  <span className="text-[10px] font-medium capitalize" style={{ color: rarityColor }}>
                    {badge.rarity}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-amber-600 font-medium">
                  <Zap className="w-3 h-3" />
                  {badge.points_value} XP
                </div>

                {isEarned && (
                  <Badge variant="success" className="mt-2 text-[10px]">
                    Earned!
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
