import { useState } from 'react'
import { Bell, CheckCheck, BookOpen, Award, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'badge_earned', title: 'Badge Earned!', body: 'You earned the "Quiz Master" badge for scoring 90%+ on Algebra Quiz 1.', read_at: null, created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '2', type: 'grade_posted', title: 'Grade Posted', body: 'Your grade for "Algebra Quiz 1" has been posted: 92/100 (A)', read_at: null, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: '3', type: 'deadline_reminder', title: 'Deadline Reminder', body: 'Essay Draft in English Literature is due in 2 days. Don\'t forget to submit!', read_at: new Date().toISOString(), created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: '4', type: 'forum_reply', title: 'New Reply', body: 'Someone replied to your thread "Tips for solving quadratic equations?"', read_at: null, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', type: 'course_update', title: 'Course Updated', body: 'New content has been added to "Computer Science Fundamentals": Variables and Data Types.', read_at: new Date().toISOString(), created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
]

const notifIcon = (type: string) => {
  switch (type) {
    case 'badge_earned': return <Award className="w-4 h-4 text-amber-500" />
    case 'grade_posted': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    case 'deadline_reminder': return <AlertTriangle className="w-4 h-4 text-red-500" />
    case 'forum_reply': return <MessageSquare className="w-4 h-4 text-blue-500" />
    default: return <BookOpen className="w-4 h-4 text-slate-400" />
  }
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read_at).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-slate-500 text-sm mt-0.5">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-all ${!notif.read_at ? 'border-brand-200 bg-brand-50/30' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    !notif.read_at ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-50'
                  }`}>
                    {notifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${!notif.read_at ? 'text-slate-900' : 'text-slate-600'}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">{formatRelativeTime(notif.created_at)}</span>
                        {!notif.read_at && (
                          <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                        )}
                      </div>
                    </div>
                    <p className={`text-sm mt-0.5 ${!notif.read_at ? 'text-slate-700' : 'text-slate-400'}`}>
                      {notif.body}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
