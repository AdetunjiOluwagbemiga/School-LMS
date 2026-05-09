import { WebsiteLayout } from '@/components/website/WebsiteLayout'
import { Link } from '@tanstack/react-router'
import { ArrowRight, GraduationCap, Building2, MapPin, Linkedin } from 'lucide-react'

const alumni = [
  {
    name: 'Dr. Emeka Anozie',
    classOf: 'Class of 2005',
    role: 'Consultant Cardiologist',
    company: 'Lagos University Teaching Hospital',
    location: 'Lagos, Nigeria',
    quote: 'The rigour of Oakridge\'s A-Level programme prepared me for medicine at UCL far better than I realised at the time.',
    avatar: 'EA',
    university: 'University College London (MBBS)',
  },
  {
    name: 'Sade Mensah',
    classOf: 'Class of 2010',
    role: 'Software Engineer',
    company: 'Google, London',
    location: 'London, UK',
    quote: 'Mr. Adebayo\'s coding club was where I wrote my first line of Python. That spark never left me.',
    avatar: 'SM',
    university: 'Imperial College London (MEng)',
  },
  {
    name: 'Babatunde Ojo',
    classOf: 'Class of 2015',
    role: 'Investment Analyst',
    company: 'Goldman Sachs',
    location: 'New York, USA',
    quote: 'Oakridge taught me how to think critically and communicate clearly — skills that matter more than any technical knowledge.',
    avatar: 'BO',
    university: 'University of Toronto (BComm)',
  },
  {
    name: 'Dr. Aisha Musa',
    classOf: 'Class of 2012',
    role: 'Research Scientist',
    company: 'WHO Geneva',
    location: 'Geneva, Switzerland',
    quote: 'Winning the national science olympiad in Year 12 gave me the confidence to pursue a PhD. Oakridge built that foundation.',
    avatar: 'AM',
    university: 'Oxford University (DPhil Biochemistry)',
  },
  {
    name: 'Chidi Okonkwo',
    classOf: 'Class of 2018',
    role: 'Founder & CEO',
    company: 'Fintech Startup (Series A)',
    location: 'Lagos, Nigeria',
    quote: 'I came back to Lagos and built something. Oakridge always pushed us to solve real problems.',
    avatar: 'CO',
    university: 'London School of Economics (BSc Econ)',
  },
  {
    name: 'Zainab Aliyu',
    classOf: 'Class of 2020',
    role: 'Human Rights Lawyer',
    company: 'Amnesty International',
    location: 'Abuja, Nigeria',
    quote: 'The debate club and civic education classes at Oakridge shaped my passion for justice and public service.',
    avatar: 'ZA',
    university: 'University of Lagos (LLB), Barrister-at-Law',
  },
]

const universityDests = [
  { name: 'United Kingdom', icon: '🇬🇧', count: '38%', examples: 'UCL, Imperial, Edinburgh, LSE' },
  { name: 'Nigeria', icon: '🇳🇬', count: '32%', examples: 'UNILAG, Covenant, LUTH, ABSU' },
  { name: 'North America', icon: '🌎', count: '18%', examples: 'Toronto, McGill, NYU, Georgia Tech' },
  { name: 'Europe & Rest', icon: '🌍', count: '12%', examples: 'TU Delft, EPFL, Monash, NUS' },
]

export function AlumniPage() {
  return (
    <WebsiteLayout>
      {/* Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">Alumni</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">Our Alumni Community</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Over 8,000 Oakridge graduates are making an impact across 40+ countries. Their success is our greatest achievement.
          </p>
        </div>
      </section>

      {/* University destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Where Our Graduates Go</h2>
            <p className="text-slate-500">Class of 2025 university placement destinations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {universityDests.map(d => (
              <div key={d.name} className="bg-slate-50 rounded-2xl border border-slate-100 p-6 text-center">
                <div className="text-4xl mb-3">{d.icon}</div>
                <div className="text-3xl font-extrabold text-brand-600 mb-1">{d.count}</div>
                <div className="font-semibold text-slate-900 mb-2">{d.name}</div>
                <div className="text-xs text-slate-500">{d.examples}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni stories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Alumni Stories</h2>
            <p className="text-slate-500">Hear from some of the remarkable people who walked our halls</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alumni.map(a => (
              <div key={a.name} className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 font-extrabold text-base flex items-center justify-center shrink-0">
                    {a.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{a.name}</h3>
                    <div className="text-xs text-brand-600 font-medium">{a.classOf}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.university}</div>
                  </div>
                </div>
                <blockquote className="text-sm text-slate-700 italic leading-relaxed mb-5">"{a.quote}"</blockquote>
                <div className="border-t border-slate-100 pt-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {a.role} · {a.company}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {a.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni network CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <GraduationCap className="w-16 h-16 text-brand-200 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Join the Alumni Network</h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
            Connect with over 8,000 fellow graduates, attend alumni events, mentor current students, and stay connected with your school.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Register as Alumni
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn Group
            </a>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}
