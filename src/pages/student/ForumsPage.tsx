import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { MessageSquare, Plus, Pin, CheckCircle2, Clock, ChevronRight, Search, ThumbsUp, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/utils'
import type { Forum, Thread } from '@/types'

const DEMO_TENANT_ID = 'a0000000-0000-0000-0000-000000000001'

const MOCK_THREADS: Thread[] = [
  {
    id: '1', forum_id: 'f0000000-0000-0000-0000-000000000001', tenant_id: DEMO_TENANT_ID,
    author_id: '1', title: 'Tips for solving quadratic equations?',
    body: 'I\'m struggling with the quadratic formula. Any tips?',
    is_pinned: true, is_locked: false, is_resolved: true,
    view_count: 245, reply_count: 12,
    last_reply_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    author: { id: '1', tenant_id: DEMO_TENANT_ID, full_name: 'Alice Johnson', display_name: null, avatar_url: null, date_of_birth: null, phone: null, locale: 'en', bio: null, gdpr_consent: true, last_active_at: null, is_active: true, created_at: '' },
  },
  {
    id: '2', forum_id: 'f0000000-0000-0000-0000-000000000001', tenant_id: DEMO_TENANT_ID,
    author_id: '2', title: 'Study group for midterm exams — who\'s in?',
    body: 'Anyone want to form a study group for the upcoming midterms?',
    is_pinned: false, is_locked: false, is_resolved: false,
    view_count: 89, reply_count: 8,
    last_reply_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    author: { id: '2', tenant_id: DEMO_TENANT_ID, full_name: 'Bob Smith', display_name: null, avatar_url: null, date_of_birth: null, phone: null, locale: 'en', bio: null, gdpr_consent: true, last_active_at: null, is_active: true, created_at: '' },
  },
  {
    id: '3', forum_id: 'f0000000-0000-0000-0000-000000000004', tenant_id: DEMO_TENANT_ID,
    author_id: '3', title: 'Python vs JavaScript for beginners?',
    body: 'Which language should I learn first as a total beginner?',
    is_pinned: false, is_locked: false, is_resolved: false,
    view_count: 312, reply_count: 24,
    last_reply_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    author: { id: '3', tenant_id: DEMO_TENANT_ID, full_name: 'Carol Davis', display_name: null, avatar_url: null, date_of_birth: null, phone: null, locale: 'en', bio: null, gdpr_consent: true, last_active_at: null, is_active: true, created_at: '' },
  },
]

export function ForumsPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [threads] = useState<Thread[]>(MOCK_THREADS)
  const [search, setSearch] = useState('')
  const [activeForumId, setActiveForumId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('forums')
        .select('*')
        .eq('tenant_id', DEMO_TENANT_ID)
        .order('sort_order')
      setForums(data ?? [])
      if (data && data.length > 0) setActiveForumId(data[0].id)
    }
    load()
  }, [])

  const filteredThreads = threads.filter((t) => {
    const matchForum = !activeForumId || t.forum_id === activeForumId
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
    return matchForum && matchSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Discussion Forums</h1>
          <p className="text-slate-500 text-sm mt-0.5">Ask questions, share ideas, and learn together</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Thread
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Forum sidebar */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2">Forums</p>
          {forums.map((forum) => (
            <button
              key={forum.id}
              onClick={() => setActiveForumId(forum.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeForumId === forum.id
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{forum.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Threads list */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search threads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredThreads.map((thread) => (
            <Card key={thread.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                    <AvatarFallback className="text-xs">
                      {thread.author?.full_name.charAt(0) ?? '?'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <Link
                        to={`/app/learn/forums/thread/${thread.id}` as any}
                        className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 group-hover:text-brand-600 flex-1"
                      >
                        {thread.is_pinned && <Pin className="w-3 h-3 text-brand-500 inline mr-1" />}
                        {thread.title}
                      </Link>
                      {thread.is_resolved && (
                        <Badge variant="success" className="shrink-0 text-[10px]">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                          Solved
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mb-3">{thread.body}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{thread.author?.full_name}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {thread.last_reply_at ? formatRelativeTime(thread.last_reply_at) : formatRelativeTime(thread.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {thread.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {thread.reply_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {Math.floor(Math.random() * 20)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-brand-400 transition-colors mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredThreads.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No threads found. Be the first to start a discussion!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
