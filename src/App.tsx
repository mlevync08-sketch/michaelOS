import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, BriefcaseBusiness, CheckCircle2, ChevronRight,
  CircleGauge, Clock3, HeartPulse, LogOut, Scale, Sparkles, Target,
  UsersRound, ListChecks, RefreshCw, AlertTriangle
} from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from './lib/supabase'
import type { Project, ActionItem, Decision, Relationship, WaitingOn } from './types'
import { Badge } from './components/Badge'

type View = 'today' | 'projects' | 'actions' | 'relationships' | 'waiting' | 'decisions' | 'health' | 'weekly'

const nav: { id: View; label: string; icon: typeof Target }[] = [
  { id: 'today', label: 'Today', icon: CircleGauge },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
  { id: 'actions', label: 'Actions', icon: ListChecks },
  { id: 'relationships', label: 'Relationships', icon: UsersRound },
  { id: 'waiting', label: 'Waiting On', icon: Clock3 },
  { id: 'decisions', label: 'Decisions', icon: Scale },
  { id: 'weekly', label: 'Weekly Review', icon: Target },
  { id: 'health', label: 'Health', icon: HeartPulse },
]

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [view, setView] = useState<View>('today')
  const [projects, setProjects] = useState<Project[]>([])
  const [actions, setActions] = useState<ActionItem[]>([])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [waiting, setWaiting] = useState<WaitingOn[]>([])
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined
    ;(async () => {
      try {
        const supabase = await getSupabase()
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
        unsub = () => listener.subscription.unsubscribe()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not initialize MichaelOS.')
      } finally {
        setReady(true)
      }
    })()
    return () => unsub?.()
  }, [])

  useEffect(() => {
    if (!session) return
    void loadData()
  }, [session])

  async function loadData() {
    setLoadingData(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const [p, a, d, r, w] = await Promise.all([
        supabase.from('projects').select('*').order('priority'),
        supabase.from('actions').select('*').limit(100),
        supabase.from('decisions').select('*').limit(100),
        supabase.from('relationships').select('*').limit(100),
        supabase.from('waiting_on').select('*').limit(100),
      ])
      const firstError = [p.error, a.error, d.error, r.error, w.error].find(Boolean)
      if (firstError) throw firstError
      setProjects((p.data || []) as Project[])
      setActions((a.data || []) as ActionItem[])
      setDecisions((d.data || []) as Decision[])
      setRelationships((r.data || []) as Relationship[])
      setWaiting((w.data || []) as WaitingOn[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load live data.')
    } finally {
      setLoadingData(false)
    }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setAuthBusy(true); setError('')
    try {
      const supabase = await getSupabase()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed.')
    } finally { setAuthBusy(false) }
  }

  async function logout() {
    const supabase = await getSupabase()
    await supabase.auth.signOut()
  }

  const critical = projects.filter(p => p.priority === 'critical').length
  const blocked = projects.filter(p => p.health === 'red' || (p.blocker && p.blocker.toLowerCase() !== 'none')).length
  const openDecisions = decisions.filter(d => !d.status || !['resolved', 'closed', 'done'].includes(d.status)).length
  const focus = Math.max(52, Math.min(96, 94 - critical * 2 - blocked * 5))

  const bigThree = useMemo(() => {
    const rank = (p: Project) => (p.priority === 'critical' ? 30 : p.priority === 'high' ? 20 : 10) + (p.health === 'red' ? 20 : p.health === 'amber' ? 10 : 0)
    return [...projects].sort((a, b) => rank(b) - rank(a)).slice(0, 3)
  }, [projects])

  if (!ready) return <div className="min-h-screen grid place-items-center text-slate-500">Loading MichaelOS…</div>

  if (!session) {
    return <div className="min-h-screen bg-[#f4f7f7] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#123b3a] text-white font-bold">M</div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">MichaelOS</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Your private executive operating system.</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500" />
          {error && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          <button disabled={authBusy} className="w-full rounded-xl bg-[#123b3a] px-4 py-3 font-semibold text-white disabled:opacity-60">{authBusy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  }

  return <div className="min-h-screen bg-[#f5f7f8] text-slate-800">
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white px-4 py-5">
      <div className="flex items-center gap-3 px-2 pb-7">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#123b3a] font-bold text-white">M</div>
        <div><div className="font-semibold text-slate-900">MichaelOS</div><div className="text-xs text-slate-400">Executive Operating System</div></div>
      </div>
      <nav className="space-y-1">
        {nav.map(item => {
          const Icon = item.icon
          const active = view === item.id
          return <button key={item.id} onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-[#eaf4f2] text-[#123b3a]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Icon size={18} />{item.label}
          </button>
        })}
      </nav>
      <div className="absolute inset-x-4 bottom-5 border-t border-slate-100 pt-4">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50"><LogOut size={17}/> Sign out</button>
      </div>
    </aside>

    <main className="ml-64 min-h-screen px-8 py-7">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">Levy Operating System</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{nav.find(n => n.id === view)?.label}</h1>
          </div>
          <button onClick={loadData} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-50"><RefreshCw size={15} className={loadingData ? 'animate-spin' : ''}/> Refresh</button>
        </header>

        {error && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertTriangle size={18}/>{error}</div>}

        {view === 'today' && <Today projects={projects} bigThree={bigThree} critical={critical} blocked={blocked} decisions={openDecisions} focus={focus} />}
        {view === 'projects' && <Projects projects={projects} />}
        {view === 'actions' && <SimpleList title="Open actions" count={actions.length} empty="No actions yet." rows={actions.map(a => ({ title: a.title, meta: [a.priority, a.owner, a.due_date].filter(Boolean).join(' · ') }))} />}
        {view === 'relationships' && <SimpleList title="Key relationships" count={relationships.length} empty="No relationships yet." rows={relationships.map(r => ({ title: r.name, meta: [r.company, r.health, r.next_move].filter(Boolean).join(' · ') }))} />}
        {view === 'waiting' && <SimpleList title="Waiting on" count={waiting.length} empty="Nothing waiting right now." rows={waiting.map(w => ({ title: w.item || 'Open loop', meta: [w.person, w.follow_up_at].filter(Boolean).join(' · ') }))} />}
        {view === 'decisions' && <SimpleList title="Decision center" count={decisions.length} empty="No decisions yet." rows={decisions.map(d => ({ title: d.title, meta: [d.recommendation, d.impact ? `Impact ${d.impact}` : null].filter(Boolean).join(' · ') }))} />}
        {view === 'weekly' && <Weekly projects={projects} actions={actions} />}
        {view === 'health' && <Health />}
      </div>
    </main>
  </div>
}

function Today({ projects, bigThree, critical, blocked, decisions, focus }: { projects: Project[]; bigThree: Project[]; critical: number; blocked: number; decisions: number; focus: number }) {
  const date = new Intl.DateTimeFormat('en-US', { weekday:'long', month:'long', day:'numeric' }).format(new Date())
  const top = bigThree[0]
  return <>
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
      <div className="flex items-start justify-between gap-6">
        <div><p className="text-sm text-slate-500">{date}</p><h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Good morning, Michael.</h2><p className="mt-3 max-w-2xl text-slate-500">Your operating picture is current. Protect attention for the work that unlocks the most downstream progress.</p></div>
        <div className="min-w-40 rounded-2xl bg-[#123b3a] p-5 text-white"><div className="text-xs uppercase tracking-widest text-teal-100">Focus score</div><div className="mt-2 text-4xl font-semibold">{focus}</div><div className="mt-1 text-xs text-teal-100">Executive readiness</div></div>
      </div>
      <div className="mt-7 grid grid-cols-4 gap-3">
        <Metric label="Active projects" value={projects.length}/><Metric label="Critical" value={critical}/><Metric label="Blocked" value={blocked}/><Metric label="Open decisions" value={decisions}/>
      </div>
    </section>

    <div className="mt-6 grid grid-cols-[1.25fr_.75fr] gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between"><div><div className="text-xs font-semibold uppercase tracking-widest text-teal-700">Today's Big 3</div><h3 className="mt-1 text-xl font-semibold text-slate-900">What deserves attention</h3></div><Target className="text-slate-300"/></div>
        <div className="mt-5 divide-y divide-slate-100">
          {bigThree.map((p, i) => <div key={p.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">{i+1}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><div className="font-semibold text-slate-900">{p.name}</div><Badge tone={p.health}>{p.health}</Badge></div><div className="mt-1 text-sm text-slate-500">{p.next_action || p.next_milestone || 'Define the next critical move.'}</div></div><ChevronRight size={17} className="mt-1 text-slate-300"/></div>)}
        </div>
      </section>
      <section className="rounded-3xl border border-[#cfe5e1] bg-[#eef8f6] p-6 shadow-soft">
        <div className="flex items-center gap-2 text-[#145c57]"><Sparkles size={18}/><span className="text-xs font-semibold uppercase tracking-widest">Chief of Staff</span></div>
        <h3 className="mt-4 text-xl font-semibold text-slate-900">Recommendation</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{top ? `Move ${top.name} first. ${top.next_action || top.next_milestone || 'Clarify its next milestone'} before adding new work. This is currently the strongest combination of urgency and leverage.` : 'Your portfolio is clear. Add or activate a project to generate recommendations.'}</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#145c57]">Protect the first 90 minutes <ArrowRight size={15}/></div>
      </section>
    </div>
  </>
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4"><div className="text-2xl font-semibold text-slate-900">{value}</div><div className="mt-1 text-xs font-medium text-slate-500">{label}</div></div> }

function Projects({ projects }: { projects: Project[] }) {
  return <div className="grid grid-cols-2 gap-5">{projects.map(p => <article key={p.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
    <div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h3 className="text-xl font-semibold text-slate-900">{p.name}</h3><Badge tone={p.health}>{p.health}</Badge></div><div className="mt-2 text-xs uppercase tracking-wider text-slate-400">{p.priority} priority · {p.owner || 'Unassigned'}</div></div><BriefcaseBusiness className="text-slate-300"/></div>
    <div className="mt-5"><div className="flex justify-between text-xs text-slate-500"><span>Progress</span><span>{p.progress || 0}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#1f7a73]" style={{width:`${Math.max(3,p.progress || 0)}%`}}/></div></div>
    <div className="mt-5 grid grid-cols-2 gap-4 text-sm"><Info label="Next milestone" value={p.next_milestone}/><Info label="Critical action" value={p.next_action}/></div>
    {p.blocker && p.blocker.toLowerCase() !== 'none' && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"><span className="font-semibold">Blocker:</span> {p.blocker}</div>}
  </article>)}</div>
}
function Info({label,value}:{label:string,value?:string|null}){return <div><div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1 leading-5 text-slate-700">{value || 'Not set'}</div></div>}
function SimpleList({title,count,rows,empty}:{title:string;count:number;rows:{title:string;meta:string}[];empty:string}){return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-end justify-between"><div><div className="text-xs font-semibold uppercase tracking-widest text-teal-700">Live data</div><h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2></div><div className="text-3xl font-semibold text-slate-300">{count}</div></div><div className="mt-5 divide-y divide-slate-100">{rows.length?rows.map((r,i)=><div key={i} className="py-4"><div className="font-semibold text-slate-800">{r.title}</div>{r.meta&&<div className="mt-1 text-sm text-slate-500">{r.meta}</div>}</div>):<div className="py-10 text-center text-sm text-slate-400">{empty}</div>}</div></section>}
function Weekly({projects,actions}:{projects:Project[];actions:ActionItem[]}){return <div className="grid grid-cols-3 gap-5"><MetricCard icon={<CheckCircle2/>} label="Projects active" value={projects.length.toString()} note="Portfolio in motion"/><MetricCard icon={<ListChecks/>} label="Actions tracked" value={actions.length.toString()} note="Execution inventory"/><MetricCard icon={<Activity/>} label="Portfolio health" value={`${projects.filter(p=>p.health==='green').length}/${projects.length}`} note="Projects currently green"/></div>}
function Health(){return <div className="grid grid-cols-3 gap-5"><MetricCard icon={<HeartPulse/>} label="Recovery" value="—" note="Connect health feed next"/><MetricCard icon={<Activity/>} label="Training" value="—" note="Performance history coming next"/><MetricCard icon={<Sparkles/>} label="Health brief" value="Ready" note="Architecture prepared for Health intelligence"/></div>}
function MetricCard({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}){return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"><div className="text-teal-700">{icon}</div><div className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div><div className="mt-1 text-3xl font-semibold text-slate-900">{value}</div><div className="mt-2 text-sm text-slate-500">{note}</div></div>}
