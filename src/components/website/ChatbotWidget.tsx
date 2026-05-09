import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot } from 'lucide-react'

interface Message {
  role: 'bot' | 'user'
  text: string
}

const FAQ: Array<{ patterns: RegExp; answer: string }> = [
  {
    patterns: /term|holiday|vacation|school year|academic year|calendar/i,
    answer: 'Our 2025/2026 academic year has three terms:\n• Term 1: Sep 2025 – Dec 2025\n• Term 2: Jan 2026 – Apr 2026\n• Term 3: May 2026 – Jul 2026\n\nSee the full calendar at /calendar.',
  },
  {
    patterns: /fee|tuition|cost|price|pay|payment/i,
    answer: 'Tuition fees for 2026/2027:\n• JSS1–JSS3: ₦850,000/term\n• SS1–SS3 / IGCSE: ₦1,100,000/term\n• A-Level: ₦1,350,000/term\n\nScholarships are available. Visit /admissions for full details.',
  },
  {
    patterns: /uniform|dress code/i,
    answer: 'The complete uniform set costs ₦45,000 and is available at the school\'s uniform shop. It includes shirts, trousers/skirts, blazer, tie, and PE kit.',
  },
  {
    patterns: /apply|admission|enrol|enroll|register/i,
    answer: 'Applications for 2026/2027 are now open! Visit /admissions to complete the online application form. Deadline for Term 1 entry is 31 July 2026.',
  },
  {
    patterns: /contact|phone|email|address|location|office/i,
    answer: 'You can reach us at:\n📞 +234 801 234 5678\n✉️ info@oakridgeacademy.edu\n📍 12 Innovation Drive, Victoria Island, Lagos\n\nOffice hours: Mon–Fri, 7:30 AM – 5:00 PM.',
  },
  {
    patterns: /scholarship|bursary|financial aid/i,
    answer: 'We offer academic scholarships (top 5% of entry exam), sports scholarships, and need-based bursaries covering up to 50% of fees. Applications close 31 July 2026. See /admissions#scholarships.',
  },
  {
    patterns: /exam|igcse|waec|a.level|result|grade/i,
    answer: 'Our 2025 IGCSE results: 97% pass rate with 5+ A*–C grades. We prepare students for IGCSE, WAEC/NECO, and Cambridge A-Levels. View past results on the /about page.',
  },
  {
    patterns: /sport|football|athletics|swimming|club/i,
    answer: 'We offer 18 sports including football, athletics, swimming, basketball, and tennis. Extracurricular clubs include Coding, Debate, Music, Drama, and Science Olympiad.',
  },
  {
    patterns: /portal|login|lms|parent|student access/i,
    answer: 'The Student & Parent Portal is at /login. Students can access courses, grades, and the LMS. Parents can check attendance, grades, and upcoming events.',
  },
]

function getBotResponse(input: string): string {
  for (const faq of FAQ) {
    if (faq.patterns.test(input)) return faq.answer
  }
  return "I'm not sure about that — please contact us directly at info@oakridgeacademy.edu or call +234 801 234 5678, and our team will be happy to help!"
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I\'m the Oakridge Academy assistant. I can answer questions about fees, admissions, term dates, and more. How can I help you today?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getBotResponse(text) }])
      setTyping(false)
    }, 700)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-brand-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Oakridge Assistant</div>
                <div className="text-xs text-brand-200">Online · Instant answers</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] text-xs leading-relaxed px-3 py-2 rounded-2xl whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {['Tuition fees', 'How to apply', 'Term dates', 'Contact info'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-3 py-1 hover:bg-brand-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question..."
              className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  )
}
