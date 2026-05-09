import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Dumbbell, Music, Code, FlaskConical, Globe, Calculator, Palette } from 'lucide-react'

const levels = [
  {
    name: 'Primary School',
    range: 'KG – Year 6',
    age: 'Ages 4–11',
    framework: 'Cambridge Primary & UK National Curriculum',
    color: 'border-sky-300 bg-sky-50',
    badge: 'bg-sky-100 text-sky-700',
    subjects: ['English Language', 'Mathematics', 'Basic Science', 'Social Studies', 'Creative Arts', 'Physical Education', 'French (from Year 3)', 'ICT'],
    desc: 'Our primary programme builds a love of learning through inquiry-based teaching, project weeks, and a focus on literacy and numeracy. Small class sizes ensure every child receives individual attention.',
  },
  {
    name: 'Junior Secondary',
    range: 'JSS1 – JSS3',
    age: 'Ages 11–14',
    framework: 'Nigerian National Curriculum (NERDC)',
    color: 'border-emerald-300 bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    subjects: ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Business Studies', 'Computer Science', 'French', 'Physical & Health Education', 'Civic Education'],
    desc: 'The JSS curriculum broadens every student\'s academic base before subject specialisation. Students sit the Junior WAEC (BECE) at the end of JSS3.',
  },
  {
    name: 'Senior Secondary / IGCSE',
    range: 'SS1 – SS3 (Year 10–11)',
    age: 'Ages 14–16',
    framework: 'Cambridge IGCSE & WAEC/NECO',
    color: 'border-amber-300 bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    subjects: ['English Language', 'Mathematics', 'Additional Mathematics', 'Biology', 'Chemistry', 'Physics', 'Computer Science', 'Economics', 'History', 'Geography', 'French', 'Literature in English', 'Art & Design'],
    desc: 'Students choose 8–12 subjects from our broad IGCSE suite. All students sit both Cambridge IGCSE and WAEC/NECO examinations, maximising their university options.',
  },
  {
    name: 'Sixth Form (A-Level)',
    range: 'Lower & Upper Sixth',
    age: 'Ages 16–18',
    framework: 'Cambridge International A-Level',
    color: 'border-rose-300 bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    subjects: ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Business Studies', 'History', 'Literature in English', 'Geography', 'Art & Design'],
    desc: 'Students select 3–4 A-Level subjects with dedicated university counselling. Our UCAS and Common App support has placed students at UCL, Imperial, Toronto, and beyond.',
  },
]

const extracurriculars = [
  { icon: Code, name: 'Coding & Robotics Club', desc: 'National champions 2024 & 2025. Python, web dev, and competitive programming.' },
  { icon: Dumbbell, name: 'Sports (18 disciplines)', desc: 'Football, athletics, swimming, basketball, tennis, volleyball, and more.' },
  { icon: Music, name: 'Music & Performing Arts', desc: 'School orchestra, choir, drama productions, and annual Arts Festival.' },
  { icon: Globe, name: 'Debate & MUN', desc: 'Regional and national Model United Nations and debate competitions.' },
  { icon: FlaskConical, name: 'Science Olympiad', desc: 'Annual national science competition — Oakridge has won three times.' },
  { icon: Palette, name: 'Visual Arts', desc: 'Painting, sculpture, photography, and digital design studio.' },
  { icon: BookOpen, name: 'Book Club & Creative Writing', desc: 'Led by award-winning author Mrs. Grace Nwosu.' },
  { icon: Calculator, name: 'Mathematics Society', desc: 'AMC, Kangaroo Maths, and inter-school maths challenges.' },
]

export function CurriculumPage() {
  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Curriculum</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Programmes &amp; Curriculum</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            A rigorous, internationally-recognised curriculum from Early Years through Sixth Form, designed to open every door.
          </p>
        </div>
      </section>

      {/* Level cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Academic Programmes</h2>
          </div>
          {levels.map((level, i) => (
            <div key={level.name} className={`rounded-2xl border-2 p-8 ${level.color}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${level.badge}`}>{level.range} · {level.age}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{level.name}</h3>
                  <div className="text-sm text-slate-500 mb-4">{level.framework}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{level.desc}</p>
                </div>
                <div className="lg:col-span-2">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Subjects Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {level.subjects.map(s => (
                      <span key={s} className="text-xs bg-white text-slate-700 border border-slate-200 rounded-full px-3 py-1 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extra-curricular */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Extra-Curricular Activities</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We believe education happens beyond the classroom. Over 20 clubs and activities run each week.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {extracurriculars.map(ec => (
              <div key={ec.name} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <ec.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{ec.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{ec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-600 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to explore our programmes in person?</h2>
        <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors mt-2 mr-4">
          Book a Tour
        </Link>
        <Link to="/admissions" className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-4 rounded-xl border border-brand-500 transition-colors mt-2">
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </WebsiteLayout>
  )
}
