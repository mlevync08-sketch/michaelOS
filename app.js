const seed = {
 projects:[
  {id:'p1',name:'GTM Command Center',health:'green',priority:'critical',progress:86,next_milestone:'Stabilize next release',blocker:'None',next_action:'Finish Pipeline UX and deployment QA',owner:'Michael',due_date:'2026-08-21',mission:'Give early-stage teams an AI-native system for running go-to-market without a heavyweight CRM stack.',success:'Ship a stable, useful release and convert usage into repeatable adoption.',risk:'Feature creep before core workflow stability.',strategy:'Keep the product focused on intelligence + execution: Network → Segments → Pipeline → Roadmap.'},
  {id:'p2',name:'SAVi',health:'amber',priority:'critical',progress:78,next_milestone:'Investor-ready deck and outreach',blocker:'Final market/investor updates',next_action:'Complete market slide and final deck pass',owner:'Michael',due_date:'2026-08-24',mission:'Position SAVi as an investable healthcare growth opportunity with visible commercial proof and investor payback.',success:'Investor meetings driven by a credible ROI story and validated pipeline.',risk:'Story weakens if market proof or pipeline assumptions are not fully aligned.',strategy:'Lead with economics and commercial proof before product detail.'},
  {id:'p3',name:'Velocity / VHL',health:'red',priority:'critical',progress:62,next_milestone:'Engagement terms aligned',blocker:'Compensation and scope alignment',next_action:'Resolve open terms and progress engagement',owner:'Michael',due_date:'2026-08-21',mission:'Define a high-leverage operating role with clear economics, authority, scope and accountability.',success:'A mutually compelling engagement structure with explicit ownership and compensation.',risk:'Ambiguous expectations create work without aligned authority or economics.',strategy:'Resolve role architecture before expanding execution commitments.'},
  {id:'p4',name:'Babson Diagnostics',health:'green',priority:'high',progress:73,next_milestone:'Advance active client deliverables',blocker:'None',next_action:'Confirm next milestones across pricing and Epic work',owner:'Michael',due_date:'2026-08-25',mission:'Help BetterWay scale adoption with enterprise-grade pricing, integration and commercialization strategy.',success:'Executive-ready recommendations that move health-system adoption and commercial decisions.',risk:'Multiple parallel workstreams can diffuse focus.',strategy:'Tie every deliverable to adoption, procurement and enterprise value.'},
  {id:'p5',name:'PlasticBegone',health:'amber',priority:'high',progress:66,next_milestone:'Scientific validation and advisor outreach',blocker:'External validation pathway',next_action:'Advance expert outreach and validation',owner:'Michael',due_date:'2026-08-28',mission:'Build a credible consumer decision-support platform for plastic-associated chemical exposure.',success:'Validated scoring framework, trusted experts and scalable consumer relevance.',risk:'GTM activity can outrun scientific validation.',strategy:'Strengthen external validation while building high-value awareness and partnerships.'},
  {id:'p6',name:'Bluedoor',health:'green',priority:'high',progress:70,next_milestone:'GTM and growth execution',blocker:'Competing priorities',next_action:'Prioritize highest-value revenue work',owner:'Michael',due_date:'2026-08-26',mission:'Evolve Bluedoor into an AI-native growth company that delivers leverage beyond traditional agency work.',success:'Higher-margin repeatable offerings and stronger commercial pipeline.',risk:'Internal product building competes with near-term revenue work.',strategy:'Use AI products to create leverage while protecting client and revenue execution.'}
 ],
 actions:[
  {id:'a1',project_id:'p1',title:'Finish Pipeline UX polish and deployment QA',bucket:'do',priority:'critical',status:'open',owner:'Michael',due_date:'2026-08-21'},
  {id:'a2',project_id:'p2',title:'Complete SAVi market slide and investor deck pass',bucket:'do',priority:'critical',status:'open',owner:'Michael',due_date:'2026-08-21'},
  {id:'a3',project_id:'p3',title:'Progress VHL engagement terms',bucket:'decide',priority:'critical',status:'open',owner:'Michael',due_date:'2026-08-21'},
  {id:'a4',project_id:'p5',title:'Advance scientific advisor outreach',bucket:'delegate',priority:'high',status:'open',owner:'Michael',due_date:'2026-08-24'},
  {id:'a5',project_id:'p4',title:'Confirm next Babson client milestones',bucket:'do',priority:'high',status:'open',owner:'Michael',due_date:'2026-08-24'}
 ],
 waiting:[
  {id:'w1',project_id:'p3',person:'Deep',person_id:'r1',item:'Feedback on VHL engagement terms',requested_on:'2026-08-19',follow_up_on:'2026-08-21',priority:'critical',status:'waiting'},
  {id:'w2',project_id:'p2',person:'SAVi team',item:'Remaining investor / pipeline inputs',requested_on:'2026-08-20',follow_up_on:'2026-08-22',priority:'high',status:'waiting'}
 ],
 decisions:[
  {id:'d1',project_id:'p3',title:'Finalize acceptable VHL compensation and ownership structure',context:'The engagement needs clear economics, scope, and authority before proceeding.',recommendation:'Define the minimum acceptable package and resolve it directly.',consequence_of_delay:'The role remains ambiguous and momentum stalls.',priority:'critical',status:'open',due_date:'2026-08-21',impact:97,confidence:90},
  {id:'d2',project_id:'p1',title:'Ship current GTM release or add more features',context:'The core experience is working and additional scope can delay launch.',recommendation:'Ship the stable release and move remaining ideas into the next sprint.',consequence_of_delay:'Feature creep slows adoption and learning.',priority:'high',status:'open',due_date:'2026-08-21',impact:91,confidence:94}
 ],
 relationships:[
  {id:'r1',name:'Deep',role:'Velocity / VHL',company:'Velocity Health Labs',health:72,last_interaction:'2026-08-19',project_ids:['p3'],next_move:'Resolve role economics and scope in a direct conversation.',open_loops:1,notes:'Key relationship for progressing the VHL operating engagement.'},
  {id:'r2',name:'Jacqueline',role:'VHL collaborator',company:'Velocity Health Labs',health:68,last_interaction:'2026-08-03',project_ids:['p3'],next_move:'Close remaining unanswered questions and align next-step ownership.',open_loops:3,notes:'Important execution partner across VHL follow-up items.'},
  {id:'r3',name:'Steve',role:'SAVi stakeholder',company:'SAVi',health:82,last_interaction:'2026-08-12',project_ids:['p2'],next_move:'Use the revised market slide to close the investor narrative gap.',open_loops:1,notes:'Key voice in shaping the missing market story.'},
  {id:'r4',name:'Webb Golinkin',role:'Babson stakeholder',company:'Babson Diagnostics',health:88,last_interaction:'2026-08-10',project_ids:['p4'],next_move:'Confirm the next executive deliverable and decision milestone.',open_loops:1,notes:'Primary strategic relationship across BetterWay commercialization work.'},
  {id:'r5',name:'Jessie Buckley',role:'Scientific advisor prospect',company:'UNC',health:58,last_interaction:'2026-08-11',project_ids:['p5'],next_move:'Send a concise, personal follow-up and propose coffee in Chapel Hill.',open_loops:1,notes:'High-value validation relationship for PlasticBegone.'}
 ],
 health:{readiness:88,sleep:'7h 12m',hrv:55,rhr:45,weight:160,bodyfat:12.3,vo2:52,nutrition:{calories:'2,600',protein:'180 g',carbs:'—',fat:'—',water:'—'},strength:[{label:'Bench',value:'215 × 3',note:'New 3RM · Aug 19'},{label:'Deadlift',value:'340 × 3',note:'3RM'},{label:'Squat',value:'225 × 1',note:'Recent top set'}],labs:[{label:'ApoB',value:'109',unit:'mg/dL',note:'Apr 2026'},{label:'Lp(a)',value:'63.5',unit:'nmol/L',note:'Apr 2026'},{label:'Body Fat',value:'12.3',unit:'%',note:'DEXA · Dec 2025'}]}
};
let appMode='demo', supabaseClient=null, currentUser=null;
let data = JSON.parse(localStorage.getItem('chiefOfStaffData')||'null') || structuredClone(seed);
['health','relationships'].forEach(k=>{if(!data[k]) data[k]=structuredClone(seed[k])});
data.projects=data.projects.map(p=>({...seed.projects.find(x=>x.id===p.id),...p}));
data.decisions=data.decisions.map(d=>({...d,impact:d.impact||85,confidence:d.confidence||80}));
let currentAddType='action';
const $=s=>document.querySelector(s); const projectName=id=>data.projects.find(p=>p.id===id)?.name||'General';
function persist(){if(appMode==='demo') localStorage.setItem('chiefOfStaffData',JSON.stringify(data));renderAll()}
function setModeLabel(text){const el=$('#modeLabel');if(el)el.textContent=text}
function showApp(){ $('#login').classList.remove('open'); $('#app').style.display='grid'; $('#signOutBtn').style.display=appMode==='live'?'inline-block':'none'; renderAll(); }
function showLogin(){ $('#app').style.display='none'; $('#login').classList.add('open'); }
async function getConfig(){try{const r=await fetch('/.netlify/functions/config',{cache:'no-store'});if(!r.ok)return null;return await r.json()}catch(e){return null}}
async function initSupabase(){
 const cfg=await getConfig();
 if(!cfg?.supabaseUrl||!cfg?.supabaseAnonKey||!window.supabase){setModeLabel('Demo available');return false}
 supabaseClient=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
 const {data:{session}}=await supabaseClient.auth.getSession();
 if(session?.user){currentUser=session.user;appMode='live';await loadLiveData();setModeLabel('Live · Supabase');showApp();}
 supabaseClient.auth.onAuthStateChange(async(event,session)=>{if(event==='SIGNED_OUT'){currentUser=null;appMode='demo';showLogin()} });
 return true;
}
async function loadLiveData(){
 if(!supabaseClient||!currentUser)return;
 const [pr,ac,wa,de,re,he]=await Promise.all([
  supabaseClient.from('projects').select('*').order('created_at'),
  supabaseClient.from('actions').select('*').order('created_at'),
  supabaseClient.from('waiting_on').select('*').order('created_at'),
  supabaseClient.from('decisions').select('*').order('created_at'),
  supabaseClient.from('relationships').select('*').order('created_at'),
  supabaseClient.from('health_profiles').select('health_data').maybeSingle()
 ]);
 const err=[pr,ac,wa,de,re,he].find(x=>x.error)?.error;if(err)throw err;
 if(!pr.data.length){await seedLivePortfolio();return}
 data={projects:pr.data,actions:ac.data,waiting:wa.data,decisions:de.data,relationships:re.data,health:he.data?.health_data||structuredClone(seed.health)};
 data.decisions=data.decisions.map(d=>({...d,impact:d.impact||80,confidence:d.confidence||80}));
 renderAll();
}
async function seedLivePortfolio(){
 const uid=currentUser.id;
 const projectRows=seed.projects.map(({id,...p})=>({...p,user_id:uid}));
 const {data:projects,error}=await supabaseClient.from('projects').insert(projectRows).select();if(error)throw error;
 const map={};seed.projects.forEach(sp=>{map[sp.id]=projects.find(p=>p.name===sp.name)?.id});
 const mapProject=o=>({...o,project_id:o.project_id?map[o.project_id]:null,user_id:uid});
 const actions=seed.actions.map(({id,...o})=>mapProject(o));
 const waiting=seed.waiting.map(({id,person_id,...o})=>mapProject(o));
 const decisions=seed.decisions.map(({id,...o})=>mapProject(o));
 const relationships=seed.relationships.map(({id,project_ids,...o})=>({...o,user_id:uid,project_ids:(project_ids||[]).map(x=>map[x]).filter(Boolean)}));
 await Promise.all([
  supabaseClient.from('actions').insert(actions),supabaseClient.from('waiting_on').insert(waiting),supabaseClient.from('decisions').insert(decisions),supabaseClient.from('relationships').insert(relationships),supabaseClient.from('health_profiles').upsert({user_id:uid,health_data:seed.health,updated_at:new Date().toISOString()})
 ]);
 await loadLiveData();
}
function dateFmt(v){if(!v)return '—';return new Date(v+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'})}
function ageDays(v){if(!v)return 0;return Math.max(0,Math.floor((new Date('2026-08-21T12:00:00')-new Date(v+'T12:00:00'))/86400000))}
function head(title,sub,addType){return `<div class="topbar"><div><div class="eyebrow">Friday · August 21, 2026</div><h1 class="title">${title}</h1><div class="sub">${sub}</div></div><div class="top-actions">${addType?`<button class="btn primary" onclick="openAdd('${addType}')">+ Add ${addType==='waiting'?'item':addType}</button>`:''}</div></div>`}
function priorityPill(p){return `<span class="pill ${p}">${p}</span>`}
function metricCard(label,val,note,accent=''){return `<div class="card metric-card ${accent}"><div class="metric-label">${label}</div><div class="metric">${val}</div><div class="metric-note">${note}</div></div>`}
function renderToday(){
 const critical=data.actions.filter(a=>a.status==='open'&&a.priority==='critical').length, risks=data.projects.filter(p=>p.health!=='green').length, waits=data.waiting.filter(w=>w.status==='waiting').length, dec=data.decisions.filter(d=>d.status==='open').length;
 const top=[...data.actions].filter(a=>a.status==='open').sort((a,b)=>(a.priority==='critical'?-2:-1)-(b.priority==='critical'?-2:-1)).slice(0,5);
 $('#today').innerHTML=head('Good morning, Michael','Your operating brief for today.')+`<div class="hero"><div><div class="eyebrow hero-eye">TODAY'S OPERATING PRIORITY</div><h2>Move the three items that unlock momentum.</h2><p>Ship the GTM work, close the SAVi investor gap, and force clarity on VHL. New work can wait until one of those moves.</p></div><div class="focus-score"><span>Focus score</span><strong>91</strong><small>High leverage day</small></div></div><div class="grid5">${metricCard('Critical actions',critical,'Need movement today','redtop')}${metricCard('Projects at risk',risks,'Amber or red','ambertop')}${metricCard('Waiting on others',waits,'Open dependencies')}${metricCard('Decisions',dec,'Need your call')}${metricCard('Health',data.health.readiness,'Readiness score','greentop')}</div><div class="section two"><div class="card brief"><div class="eyebrow">AI CHIEF OF STAFF</div><h2>Protect the first 90 minutes.</h2><p>Your highest-leverage move is completing one commitment-unlocking item before reacting to email, messages, or new ideas.</p><div class="recommend"><strong>Recommended order:</strong> GTM → SAVi → VHL.</div></div><div class="card"><div class="section-head"><h2>What winning looks like</h2></div><div class="win-list"><div>01 <span>GTM release ready to ship</span></div><div>02 <span>SAVi investor story closed</span></div><div>03 <span>VHL economics clarified</span></div></div></div></div><div class="section"><div class="section-head"><h2>Today's Big 5</h2><button class="btn" onclick="showView('actions')">View all</button></div><div class="list">${top.map(a=>`<div class="item"><span class="dot ${a.priority==='critical'?'red':'amber'}"></span><div class="item-main"><div class="item-title">${a.title}</div><div class="item-meta">${projectName(a.project_id)} · ${a.bucket.toUpperCase()} · Due ${dateFmt(a.due_date)}</div></div>${priorityPill(a.priority)}</div>`).join('')}</div></div>`;
}
function table(columns,rows){return `<div class="table-wrap"><table class="table"><thead><tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`}
function renderProjects(){
 $('#projects').innerHTML=head('Projects','Portfolio health, strategy, critical path and the next move.','project')+`<div class="project-grid">${data.projects.map(p=>`<button class="project-card project-button" onclick="openProject('${p.id}')"><div class="project-card-top"><div><div class="project-name-lg">${p.name}</div><div class="item-meta">Owner · ${p.owner}</div></div><span class="health-chip ${p.health}">${p.health}</span></div><div class="progress"><span style="width:${p.progress||50}%"></span></div><div class="progress-label"><span>${p.progress||50}% progress</span><span>${priorityPill(p.priority)}</span></div><div class="project-kv"><small>Next milestone</small><strong>${p.next_milestone||'—'}</strong><small>Critical next action</small><strong>${p.next_action||'—'}</strong><small>Blocker</small><strong>${p.blocker||'None'}</strong></div><div class="card-link">Open workspace →</div></button>`).join('')}</div>`;
}
function openProject(id){const p=data.projects.find(x=>x.id===id);const acts=data.actions.filter(a=>a.project_id===id&&a.status==='open');const waits=data.waiting.filter(w=>w.project_id===id&&w.status==='waiting');const decs=data.decisions.filter(d=>d.project_id===id&&d.status==='open');$('#modal').classList.add('open');$('#modalTitle').textContent=p.name;$('#modalSub').textContent='Executive project workspace';$('#itemForm').innerHTML=`<div class="workspace"><div class="workspace-hero"><div><span class="health-chip ${p.health}">${p.health}</span><h2>${p.mission||p.next_milestone}</h2><p>${p.strategy||''}</p></div><div class="workspace-score"><strong>${p.progress}%</strong><span>Progress</span></div></div><div class="workspace-grid"><div><small>Success looks like</small><strong>${p.success||'—'}</strong></div><div><small>Primary risk</small><strong>${p.risk||p.blocker||'—'}</strong></div><div><small>Next milestone</small><strong>${p.next_milestone||'—'}</strong></div><div><small>Critical next action</small><strong>${p.next_action||'—'}</strong></div></div><div class="workspace-cols"><div><h3>Open actions</h3>${acts.length?acts.map(a=>`<div class="mini-item">${priorityPill(a.priority)}<span>${a.title}</span></div>`).join(''):'<p class="muted">No open actions.</p>'}</div><div><h3>Dependencies</h3>${waits.length?waits.map(w=>`<div class="mini-item"><span>${w.person}: ${w.item}</span></div>`).join(''):'<p class="muted">No open dependencies.</p>'}<h3>Decisions</h3>${decs.length?decs.map(d=>`<div class="mini-item"><span>${d.title}</span></div>`).join(''):'<p class="muted">No open decisions.</p>'}</div></div><button type="button" class="btn" style="margin-top:18px" onclick="openEditProject('${p.id}')">Edit project</button></div>`;$('#saveModal').style.display='none'}
window.openProject=openProject;

function openEditProject(id){
 const p=data.projects.find(x=>x.id===id);if(!p)return;
 currentAddType='edit-project';
 $('#modalTitle').textContent='Edit '+p.name;$('#modalSub').textContent='Update the executive project record.';$('#saveModal').style.display='inline-flex';
 $('#itemForm').innerHTML=`<input type="hidden" name="id" value="${p.id}"><div><label>Project name<input name="name" value="${p.name||''}" required></label></div><div><label>Health<select name="health">${['green','amber','red'].map(v=>`<option ${p.health===v?'selected':''}>${v}</option>`).join('')}</select></label></div><div><label>Priority<select name="priority">${['critical','high','medium'].map(v=>`<option ${p.priority===v?'selected':''}>${v}</option>`).join('')}</select></label></div><div><label>Progress<input type="number" min="0" max="100" name="progress" value="${p.progress||0}"></label></div><div><label>Mission<textarea name="mission">${p.mission||''}</textarea></label></div><div><label>Strategy<textarea name="strategy">${p.strategy||''}</textarea></label></div><div><label>Success definition<textarea name="success">${p.success||''}</textarea></label></div><div><label>Primary risk<textarea name="risk">${p.risk||''}</textarea></label></div><div><label>Next milestone<input name="next_milestone" value="${p.next_milestone||''}"></label></div><div><label>Critical next action<input name="next_action" value="${p.next_action||''}"></label></div><div><label>Blocker<input name="blocker" value="${p.blocker||''}"></label></div><div><label>Due date<input type="date" name="due_date" value="${p.due_date||''}"></label></div>`;
}
window.openEditProject=openEditProject;

function renderActions(){ $('#actions').innerHTML=head('Actions','Everything that needs to get done, delegated, or decided.','action')+table(['Action','Project','Bucket','Priority','Due',''],data.actions.filter(a=>a.status==='open').map(a=>`<tr><td class="project-name">${a.title}</td><td>${projectName(a.project_id)}</td><td>${a.bucket}</td><td>${priorityPill(a.priority)}</td><td>${dateFmt(a.due_date)}</td><td><button class="table-action" onclick="completeAction('${a.id}')">Done</button></td></tr>`)) }

async function completeAction(id){
 const a=data.actions.find(x=>x.id===id);if(!a)return;
 if(appMode==='live'){const {error}=await supabaseClient.from('actions').update({status:'done',updated_at:new Date().toISOString()}).eq('id',id);if(error)return alert(error.message);await loadLiveData()}
 else{a.status='done';persist()}
}
window.completeAction=completeAction;

function renderRelationships(){const rels=[...data.relationships].sort((a,b)=>b.open_loops-a.open_loops);$('#relationships').innerHTML=head('Relationships','The people most important to moving your work forward.','relationship')+`<div class="relationship-grid">${rels.map(r=>{const ps=r.project_ids.map(projectName).join(' · ');return `<div class="relationship-card"><div class="relationship-top"><div class="avatar">${r.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div class="relationship-main"><h2>${r.name}</h2><p>${r.role} · ${r.company}</p></div><div class="rel-score"><strong>${r.health}</strong><span>health</span></div></div><div class="relationship-projects">${ps}</div><div class="relationship-kv"><div><small>Last interaction</small><strong>${dateFmt(r.last_interaction)}</strong></div><div><small>Open loops</small><strong>${r.open_loops}</strong></div></div><div class="next-move"><small>Recommended next move</small><strong>${r.next_move}</strong></div></div>`}).join('')}</div>`}
function renderWaiting(){ $('#waiting').innerHTML=head('Waiting On','Track dependencies before they quietly become blockers.','waiting')+table(['Person','Item','Project','Age','Follow up','Priority'],data.waiting.filter(w=>w.status==='waiting').map(w=>`<tr><td class="project-name">${w.person}</td><td>${w.item}</td><td>${projectName(w.project_id)}</td><td>${ageDays(w.requested_on)}d</td><td>${dateFmt(w.follow_up_on)}</td><td>${priorityPill(w.priority)}</td></tr>`)) }
function renderDecisions(){const ds=data.decisions.filter(d=>d.status==='open').sort((a,b)=>b.impact-a.impact);$('#decisions').innerHTML=head('Decisions','Executive calls ranked by impact and urgency.','decision')+`<div class="decision-grid">${ds.map(d=>`<div class="card decision-card"><div class="decision-top">${priorityPill(d.priority)}<span class="muted">${projectName(d.project_id)}</span></div><div class="decision-score-row"><div><small>Impact</small><strong>${d.impact}</strong></div><div><small>Confidence</small><strong>${d.confidence}%</strong></div><div><small>Due</small><strong>${dateFmt(d.due_date)}</strong></div></div><h2>${d.title}</h2><p>${d.context}</p><div class="decision-rec"><small>Recommendation</small><strong>${d.recommendation}</strong></div><div class="cost"><small>Cost of delay</small><span>${d.consequence_of_delay}</span></div><button class="btn resolve-btn" onclick="resolveDecision('${d.id}')">Mark decided</button></div>`).join('')}</div>` }
async function resolveDecision(id){const d=data.decisions.find(x=>x.id===id);if(!d)return;if(appMode==='live'){const {error}=await supabaseClient.from('decisions').update({status:'decided',updated_at:new Date().toISOString()}).eq('id',id);if(error)return alert(error.message);await loadLiveData()}else{d.status='decided';persist()}} window.resolveDecision=resolveDecision;
function renderWeekly(){const done=data.actions.filter(a=>a.status==='done').length; const open=data.actions.filter(a=>a.status==='open').length;$('#weekly').innerHTML=head('Weekly Review','Step out of the work and assess the system.')+`<div class="grid4">${metricCard('Open actions',open,'Across all active projects')}${metricCard('Completed',done,'This demo period')}${metricCard('At-risk projects',data.projects.filter(p=>p.health!=='green').length,'Need intervention')}${metricCard('Health readiness',data.health.readiness,'Current performance signal')}</div><div class="section two"><div class="card"><div class="section-head"><h2>What moved</h2></div><div class="win-list"><div>01 <span>GTM Command Center UI materially improved</span></div><div>02 <span>SAVi investor narrative tightened</span></div><div>03 <span>MichaelOS operating system advanced to V1.2</span></div></div></div><div class="card"><div class="section-head"><h2>Next week</h2></div><p class="body-copy">Reduce context switching. Finish critical commitments before adding new project scope. Use Relationships and Waiting On to actively close dependencies.</p></div></div>`}
function renderHealth(){const h=data.health;$('#health').innerHTML=head('Health','Executive performance, recovery, training and biomarkers.')+`<div class="health-hero"><div><div class="eyebrow">EXECUTIVE PERFORMANCE</div><h2>Ready to perform.</h2><p>Current indicators support a normal training and work day. Keep fueling aligned to workload and protect recovery tonight.</p></div><div class="readiness-ring"><strong>${h.readiness}</strong><span>Readiness</span></div></div><div class="grid4">${metricCard('Sleep',h.sleep,'Last night')}${metricCard('HRV',h.hrv+' ms','Nightly average')}${metricCard('Resting HR',h.rhr+' bpm','Baseline')}${metricCard('Weight',h.weight+' lb','Current')}</div><div class="section three"><div class="card"><div class="section-head"><h2>Performance</h2></div>${h.strength.map(s=>`<div class="health-row"><div><strong>${s.label}</strong><span>${s.note}</span></div><b>${s.value}</b></div>`).join('')}</div><div class="card"><div class="section-head"><h2>Capacity</h2></div><div class="health-stat"><small>VO₂ max</small><strong>${h.vo2}</strong><span>Excellent aerobic capacity</span></div><div class="health-stat"><small>Body fat</small><strong>${h.bodyfat}%</strong><span>Last DEXA</span></div></div><div class="card"><div class="section-head"><h2>Nutrition</h2></div>${Object.entries(h.nutrition).map(([k,v])=>`<div class="health-row"><div><strong>${k[0].toUpperCase()+k.slice(1)}</strong></div><b>${v}</b></div>`).join('')}</div></div><div class="section two"><div class="card"><div class="section-head"><h2>Biomarkers</h2></div>${h.labs.map(l=>`<div class="health-row"><div><strong>${l.label}</strong><span>${l.note}</span></div><b>${l.value} <small>${l.unit}</small></b></div>`).join('')}</div><div class="card brief"><div class="eyebrow">HEALTH CHIEF OF STAFF</div><h2>Stay the course.</h2><p>Performance remains strong: aerobic capacity is high, strength is progressing, and the current body composition is lean. The highest-value health action is consistency—not adding complexity.</p><div class="recommend"><strong>Today:</strong> Train as planned, hit protein, fuel hard work with carbohydrates, and prioritize sleep.</div></div></div>`}

const executiveRadar = [
 {area:'Companies',score:88,note:'GTM Command Center and Bluedoor are creating the most operating leverage.'},
 {area:'Client Work',score:82,note:'Babson remains healthy; protect delivery quality while limiting context switching.'},
 {area:'Fundraising',score:76,note:'SAVi needs the final market narrative before broader investor activation.'},
 {area:'Career',score:68,note:'VHL has high upside but needs role and economics clarity before more investment.'},
 {area:'Health',score:91,note:'Performance and recovery remain strong. Consistency is the highest-value move.'},
 {area:'Relationships',score:79,note:'Several important relationships have open loops that should be closed this week.'}
];
let activeWarProject = localStorage.getItem('activeWarProject') || 'p3';
function renderStrategy(){
 const cards=[...data.projects].sort((a,b)=>({critical:3,high:2,medium:1}[b.priority]||0)-({critical:3,high:2,medium:1}[a.priority]||0));
 $('#strategy').innerHTML=head('Strategy','The why behind the work — mission, strategic logic, risks and success definition.')+`<div class="strategy-grid">${cards.map(p=>`<div class="card strategy-card"><div class="project-card-top"><div><div class="eyebrow">${p.priority} priority</div><h2>${p.name}</h2></div><span class="health-chip ${p.health}">${p.health}</span></div><p>${p.mission||'Mission to be defined.'}</p><div class="strategy-strip"><div><small>Strategy</small><strong>${p.strategy||'To define'}</strong></div><div><small>Success</small><strong>${p.success||'To define'}</strong></div><div><small>Primary risk</small><strong>${p.risk||'None identified'}</strong></div></div><div class="next-move"><small>Current strategic move</small><strong>${p.next_action||'Define next move'}</strong></div></div>`).join('')}</div>`;
}
function renderRadar(){
 const sorted=[...executiveRadar].sort((a,b)=>a.score-b.score);
 const attention=sorted.slice(0,3);
 $('#radar').innerHTML=head('Executive Radar','One glance at where attention is needed across the system.')+`<div class="radar-layout"><div class="card"><div class="section-head"><h2>Attention map</h2><span class="muted">0–100</span></div><div class="radar-list">${executiveRadar.map(r=>`<div class="radar-item"><strong>${r.area}</strong><div class="radar-bar"><span style="width:${r.score}%"></span></div><div class="radar-score">${r.score}</div></div>`).join('')}</div></div><div class="card brief"><div class="eyebrow">CHIEF OF STAFF READOUT</div><h2>Protect focus before adding scope.</h2><p>The portfolio is strong, but the lowest-scoring areas are where ambiguity or open loops are consuming attention.</p><div style="margin-top:16px">${attention.map(r=>`<div class="radar-note"><small>${r.area} · ${r.score}</small><strong>${r.note}</strong></div>`).join('')}</div></div></div>`;
}
function setWarProject(id){activeWarProject=id;localStorage.setItem('activeWarProject',id);renderWarRoom()} window.setWarProject=setWarProject;
function renderWarRoom(){
 const p=data.projects.find(x=>x.id===activeWarProject)||data.projects[0];
 const actions=data.actions.filter(a=>a.project_id===p.id&&a.status==='open');
 const waits=data.waiting.filter(w=>w.project_id===p.id&&w.status==='waiting');
 const decisions=data.decisions.filter(d=>d.project_id===p.id&&d.status==='open');
 const rels=data.relationships.filter(r=>r.project_ids.includes(p.id));
 $('#warroom').innerHTML=`<div class="topbar"><div><div class="eyebrow">MISSION MODE</div><h1 class="title">War Room</h1><div class="sub">Collapse the system around one mission and remove everything else.</div></div><div class="war-selector"><select onchange="setWarProject(this.value)">${data.projects.map(x=>`<option value="${x.id}" ${x.id===p.id?'selected':''}>${x.name}</option>`).join('')}</select></div></div><div class="war-hero"><div><div class="eyebrow" style="color:#d8b7c0">ACTIVE MISSION</div><h2>${p.name}</h2><p>${p.mission||''}</p></div><div class="focus-score"><span>Progress</span><strong>${p.progress||0}</strong><small>percent</small></div></div><div class="war-grid"><div class="card"><div class="section-head"><h2>Critical path</h2></div><div class="war-list"><div class="war-item"><small>Next milestone</small><strong>${p.next_milestone||'—'}</strong></div><div class="war-item"><small>Next action</small><strong>${p.next_action||'—'}</strong></div><div class="war-item"><small>Risk</small><strong>${p.risk||p.blocker||'None identified'}</strong></div><div class="war-item"><small>Success definition</small><strong>${p.success||'—'}</strong></div></div></div><div class="card"><div class="section-head"><h2>Open loops</h2></div><div class="war-list">${actions.map(a=>`<div class="war-item"><small>Action · ${a.priority}</small><strong>${a.title}</strong></div>`).join('')||'<div class="muted">No open actions.</div>'}${waits.map(w=>`<div class="war-item"><small>Waiting on ${w.person}</small><strong>${w.item}</strong></div>`).join('')}</div></div><div class="card"><div class="section-head"><h2>Decisions & people</h2></div><div class="war-list">${decisions.map(d=>`<div class="war-item"><small>Decision · impact ${d.impact}</small><strong>${d.title}</strong></div>`).join('')||'<div class="muted">No open decisions.</div>'}${rels.map(r=>`<div class="war-item"><small>${r.role}</small><strong>${r.name} — ${r.next_move}</strong></div>`).join('')}</div></div></div>`;
}
function knowledgeItems(){
 const out=[];
 data.projects.forEach(p=>out.push({type:'Project',title:p.name,text:[p.mission,p.strategy,p.success,p.risk,p.next_action].filter(Boolean).join(' ')}));
 data.relationships.forEach(r=>out.push({type:'Relationship',title:r.name,text:[r.role,r.company,r.notes,r.next_move].filter(Boolean).join(' ')}));
 data.decisions.forEach(d=>out.push({type:'Decision',title:d.title,text:[projectName(d.project_id),d.context,d.recommendation,d.consequence_of_delay].filter(Boolean).join(' ')}));
 data.actions.forEach(a=>out.push({type:'Action',title:a.title,text:[projectName(a.project_id),a.bucket,a.priority].join(' ')}));
 return out;
}
function searchKnowledge(q=''){
 const term=q.trim().toLowerCase();
 const items=knowledgeItems().filter(x=>!term||(x.title+' '+x.text+' '+x.type).toLowerCase().includes(term)).slice(0,30);
 const el=$('#knowledgeResults'); if(!el)return;
 el.innerHTML=items.length?items.map(x=>`<div class="knowledge-result"><div class="type">${x.type}</div><h3>${x.title}</h3><p>${x.text}</p></div>`).join(''):`<div class="knowledge-empty">Nothing matched “${q}”. Try a project, person, decision or keyword.</div>`;
}
window.searchKnowledge=searchKnowledge;
function renderKnowledge(){
 $('#knowledge').innerHTML=head('Knowledge','Search across the operating system — projects, people, decisions and actions.')+`<div class="knowledge-search"><input id="knowledgeQuery" placeholder="Try SAVi, Babson, Deep, investor, validation..." oninput="searchKnowledge(this.value)"><button class="btn" onclick="document.getElementById('knowledgeQuery').value='';searchKnowledge('')">Clear</button></div><div id="knowledgeResults" class="knowledge-results"></div>`;
 searchKnowledge('');
}

function renderAll(){renderToday();renderProjects();renderActions();renderRelationships();renderWaiting();renderDecisions();renderWeekly();renderHealth();renderStrategy();renderRadar();renderWarRoom();renderKnowledge()}
function showView(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));$('#'+v).classList.add('active');document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===v))}
window.showView=showView; document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>showView(b.dataset.view));
function openAdd(type){currentAddType=type;$('#saveModal').style.display='inline-flex';$('#modal').classList.add('open');$('#modalTitle').textContent='Add '+(type==='waiting'?'waiting item':type);$('#modalSub').textContent='Capture it once so it can be managed every day.'; const proj=`<div><label>Project<select name="project_id"><option value="">General</option>${data.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label></div>`; let html='';if(type==='project')html=`<div><label>Project name<input name="name" required></label></div><div><label>Health<select name="health"><option>green</option><option>amber</option><option>red</option></select></label></div><div><label>Priority<select name="priority"><option>critical</option><option>high</option><option selected>medium</option></select></label></div><div><label>Critical next action<input name="next_action"></label></div><div><label>Blocker<input name="blocker"></label></div><div><label>Due date<input type="date" name="due_date"></label></div>`;if(type==='action')html=`${proj}<div><label>Action<input name="title" required></label></div><div><label>Bucket<select name="bucket"><option>do</option><option>delegate</option><option>waiting</option><option>decide</option></select></label></div><div><label>Priority<select name="priority"><option>critical</option><option>high</option><option selected>medium</option></select></label></div><div><label>Due date<input type="date" name="due_date"></label></div>`;if(type==='waiting')html=`${proj}<div><label>Person<input name="person" required></label></div><div><label>What are we waiting for?<input name="item" required></label></div><div><label>Requested on<input type="date" name="requested_on" value="2026-08-21"></label></div><div><label>Follow-up date<input type="date" name="follow_up_on"></label></div><div><label>Priority<select name="priority"><option>critical</option><option>high</option><option selected>medium</option></select></label></div>`;if(type==='decision')html=`${proj}<div><label>Decision<input name="title" required></label></div><div><label>Context<textarea name="context"></textarea></label></div><div><label>Recommendation<textarea name="recommendation"></textarea></label></div><div><label>Cost of delay<textarea name="consequence_of_delay"></textarea></label></div><div><label>Impact score<input type="number" min="1" max="100" name="impact" value="80"></label></div><div><label>Confidence %<input type="number" min="1" max="100" name="confidence" value="80"></label></div><div><label>Priority<select name="priority"><option>critical</option><option>high</option><option selected>medium</option></select></label></div><div><label>Due date<input type="date" name="due_date"></label></div>`;if(type==='relationship')html=`<div><label>Name<input name="name" required></label></div><div><label>Role<input name="role"></label></div><div><label>Company<input name="company"></label></div><div><label>Relationship health (1-100)<input type="number" min="1" max="100" name="health" value="70"></label></div><div><label>Last interaction<input type="date" name="last_interaction" value="2026-08-21"></label></div><div><label>Recommended next move<textarea name="next_move"></textarea></label></div><div><label>Notes<textarea name="notes"></textarea></label></div>`;$('#itemForm').innerHTML=html;}
window.openAdd=openAdd;
$('#cancelModal').onclick=()=>{$('#modal').classList.remove('open');$('#saveModal').style.display='inline-flex'};
$('#saveModal').onclick=async()=>{
 const f=new FormData($('#itemForm')); const o=Object.fromEntries(f.entries());
 if(currentAddType==='edit-project'){
   const id=o.id;delete o.id;o.progress=Number(o.progress)||0;Object.keys(o).forEach(k=>{if(o[k]==='')o[k]=null});
   if(appMode==='live'){const {error}=await supabaseClient.from('projects').update({...o,updated_at:new Date().toISOString()}).eq('id',id);if(error)return alert(error.message);await loadLiveData()}
   else{const p=data.projects.find(x=>x.id===id);if(p)Object.assign(p,o);persist()}
   $('#modal').classList.remove('open');return;
 }
 o.status=currentAddType==='waiting'?'waiting':currentAddType==='project'||currentAddType==='relationship'?undefined:'open';
 if(currentAddType==='action')o.owner='Michael';
 if(currentAddType==='project'){o.owner='Michael';o.progress=10}
 if(currentAddType==='decision'){o.impact=Number(o.impact)||80;o.confidence=Number(o.confidence)||80}
 if(currentAddType==='relationship'){o.health=Number(o.health)||70;o.open_loops=0;o.project_ids=[]}
 if(appMode==='live'){
   const tableName={project:'projects',action:'actions',waiting:'waiting_on',decision:'decisions',relationship:'relationships'}[currentAddType];
   const row={...o,user_id:currentUser.id};
   Object.keys(row).forEach(k=>{if(row[k]==='')row[k]=null});
   const {error}=await supabaseClient.from(tableName).insert(row); if(error)return alert(error.message);
   await loadLiveData();
 } else {
   o.id=crypto.randomUUID();
   if(currentAddType==='project')data.projects.push(o);
   if(currentAddType==='action')data.actions.push(o);
   if(currentAddType==='waiting')data.waiting.push(o);
   if(currentAddType==='decision')data.decisions.push(o);
   if(currentAddType==='relationship')data.relationships.push(o);
   persist();
 }
 $('#modal').classList.remove('open');
};
$('#demoBtn').onclick=()=>{appMode='demo';setModeLabel('Demo · local');showApp()};
$('#loginForm').onsubmit=async e=>{
 e.preventDefault();
 if(!supabaseClient){const ok=await initSupabase();if(!ok)return alert('Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file and run with npm run dev.');}
 const email=$('#email').value.trim(),password=$('#password').value;
 const btn=e.submitter;btn.disabled=true;btn.textContent='Signing in…';
 const {data:authData,error}=await supabaseClient.auth.signInWithPassword({email,password});
 btn.disabled=false;btn.textContent='Sign in';
 if(error)return alert(error.message);
 currentUser=authData.user;appMode='live';
 try{await loadLiveData();setModeLabel('Live · Supabase');showApp()}catch(err){alert('Signed in, but database setup is incomplete: '+err.message)}
};
$('#signOutBtn').onclick=async()=>{if(supabaseClient)await supabaseClient.auth.signOut();currentUser=null;appMode='demo';showLogin()};
initSupabase();
