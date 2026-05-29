import { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection, doc, onSnapshot, setDoc, updateDoc, getDoc
} from 'firebase/firestore';

// ── Firestore hooks ───────────────────────────────────────────────
function useGroups() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), snap => {
      const data = {};
      snap.forEach(d => { data[d.id] = d.data(); });
      setGroups(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  return { groups, loading };
}

function useGroup(id) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'groups', id), snap => {
      setGroup(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
    return unsub;
  }, [id]);
  return { group, loading };
}

async function saveGroup(g) {
  await setDoc(doc(db, 'groups', g.id), g);
}

async function updateGroup(id, data) {
  await updateDoc(doc(db, 'groups', id), data);
}

async function fetchGroup(id) {
  const snap = await getDoc(doc(db, 'groups', id));
  return snap.exists() ? snap.data() : null;
}

// ── Utilities ─────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }
function genPass() { return Math.random().toString(36).slice(2, 6).toUpperCase(); }
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DOWS   = ['일','월','화','수','목','금','토'];
function dateStr(y, m, d) { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function parseDate(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); }
function formatDate(s) {
  const dt = parseDate(s);
  return `${dt.getMonth()+1}월 ${dt.getDate()}일 (${DOWS[dt.getDay()]})`;
}

// ── Palette ───────────────────────────────────────────────────────
const C = {
  ivory: '#FAF8F2',
  blue: '#B8CDE0',
  accentBlue: '#7AA3C0',
  deepBlue: '#3D6B8E',
  sage: '#7A9E7E',
  darkSage: '#4A6B4E',
  ink: '#1C1C1C',
  muted: '#8A8A80',
  lightBlue: '#EBF2F8',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400&display=swap');
  @font-face{font-family:'IsYun';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff') format('woff');font-weight:normal;font-display:swap}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.ivory};font-family:'IsYun',sans-serif;color:${C.ink}}
  button{cursor:pointer;border:none;background:none;font-family:inherit}
  input,select{font-family:inherit}
  .hand{font-family:'IsYun',sans-serif}
  .app{min-height:100vh}

  .hdr{background:${C.ink};color:${C.ivory};padding:16px 28px;display:flex;align-items:center;justify-content:space-between}
  .hdr-title{font-family:'IsYun',sans-serif;font-size:22px;font-weight:600;letter-spacing:1px}
  .hdr-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;opacity:.45;margin-top:2px}

  .page{max-width:820px;margin:0 auto;padding:36px 22px}
  .page-sm{max-width:500px;margin:0 auto;padding:36px 22px}

  .rule{display:flex;align-items:center;gap:14px;margin:28px 0}
  .rule::before,.rule::after{content:'';flex:1;height:1px;background:${C.blue}}
  .rule span{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${C.muted};white-space:nowrap}

  .card{background:white;border:1px solid ${C.blue};border-radius:4px;padding:24px;margin-bottom:18px;position:relative;overflow:hidden}
  .card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:${C.accentBlue}}

  .gcard{background:white;border:1px solid ${C.blue};border-radius:4px;padding:20px 24px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:14px;cursor:pointer;transition:box-shadow .18s}
  .gcard:hover{box-shadow:0 4px 18px rgba(122,163,192,.18)}

  .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 22px;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-radius:2px;transition:all .18s;font-weight:500;cursor:pointer}
  .btn-primary{background:${C.ink};color:${C.ivory}}
  .btn-primary:hover{background:${C.deepBlue}}
  .btn-primary:disabled{opacity:.45;cursor:not-allowed}
  .btn-outline{border:1px solid ${C.ink};color:${C.ink}}
  .btn-outline:hover{background:${C.ink};color:${C.ivory}}
  .btn-rose{background:${C.accentBlue};color:white}
  .btn-rose:hover{background:${C.deepBlue}}
  .btn-confirm{background:${C.sage};color:white}
  .btn-confirm:hover{background:${C.darkSage}}
  .btn-ghost{color:${C.muted};font-size:11px;padding:7px 10px}
  .btn-ghost:hover{color:${C.ink}}
  .btn-sm{padding:6px 13px;font-size:10px}

  .fg{margin-bottom:18px}
  .lbl{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};margin-bottom:7px}
  .inp{width:100%;padding:10px 13px;border:1px solid ${C.blue};border-radius:2px;font-size:14px;background:${C.ivory};color:${C.ink};outline:none;transition:border-color .18s}
  .inp:focus{border-color:${C.accentBlue}}
  select.inp{cursor:pointer}

  .tabs{display:flex;border-bottom:1px solid ${C.blue};margin-bottom:26px;overflow-x:auto}
  .tab{padding:9px 18px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;border-bottom:2px solid transparent;margin-bottom:-1px;color:${C.muted};cursor:pointer;transition:all .18s;background:none;border-top:none;border-left:none;border-right:none;white-space:nowrap}
  .tab.on{color:${C.accentBlue};border-bottom-color:${C.accentBlue}}

  .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:9px;letter-spacing:1px;text-transform:uppercase}
  .badge-r{background:${C.lightBlue};color:${C.deepBlue}}
  .badge-g{background:#e0f0e0;color:${C.darkSage}}
  .badge-lg{font-family:'IsYun',sans-serif;font-size:15px;letter-spacing:0;padding:4px 14px;border-radius:20px;text-transform:none;background:${C.lightBlue};color:${C.deepBlue}}

  .alert{padding:11px 15px;border-radius:2px;font-size:13px;margin-bottom:14px}
  .alert-r{background:${C.lightBlue};color:${C.deepBlue};border-left:3px solid ${C.accentBlue}}
  .alert-g{background:#e8f4e8;color:${C.darkSage};border-left:3px solid ${C.sage}}

  .cal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .cal-month{font-family:'IsYun',sans-serif;font-size:22px;font-weight:600}
  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
  .cal-dow{text-align:center;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};padding:3px 0}
  .cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;border-radius:50%;cursor:pointer;border:1px solid transparent;transition:all .13s;position:relative}
  .cal-day:hover:not(.emp):not(.past){border-color:${C.accentBlue}}
  .cal-day.sel{background:${C.accentBlue};color:white;outline:2px solid ${C.deepBlue};outline-offset:1px}
  .cal-day.conf{background:${C.sage};color:white}
  .cal-day.emp,.cal-day.past{cursor:default}
  .cal-day.past{opacity:.28}

  .drow{display:flex;align-items:center;justify-content:space-between;padding:11px 15px;border:1px solid ${C.blue};border-radius:2px;margin-bottom:7px;background:white}
  .drow.top{border-left:3px solid ${C.accentBlue}}
  .drow.cfd{border-left:3px solid ${C.sage};background:#f0f7f0}

  .chips{display:flex;gap:4px;flex-wrap:wrap}
  .chip{background:${C.lightBlue};color:${C.deepBlue};font-size:9px;font-weight:500;letter-spacing:.5px;padding:2px 7px;border-radius:20px}

  .overlay{position:fixed;inset:0;background:rgba(28,28,28,.42);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
  .modal{background:white;border:1px solid ${C.blue};border-radius:4px;padding:30px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto}
  .modal-title{font-family:'IsYun',sans-serif;font-size:26px;margin-bottom:5px}

  .link-box{background:${C.ivory};border:1px dashed ${C.blue};padding:10px 14px;border-radius:2px;font-size:11px;color:${C.muted};word-break:break-all;display:flex;align-items:center;justify-content:space-between;gap:10px}

  .invite-card{border:2px solid ${C.blue};border-radius:4px;padding:40px 30px;margin:8px 0 24px;position:relative;text-align:center}
  .invite-corner{position:absolute;color:${C.blue};font-size:13px;line-height:1}

  .flex{display:flex}.flex-col{display:flex;flex-direction:column}
  .ic{align-items:center}.jb{justify-content:space-between}
  .g2{gap:8px}.g3{gap:12px}.g4{gap:16px}
  .mt2{margin-top:8px}.mt4{margin-top:16px}.mt6{margin-top:24px}
  .mb2{margin-bottom:8px}.mb4{margin-bottom:16px}
  .w100{width:100%}.tc{text-align:center}
  .muted{color:${C.muted};font-size:12px}
  h1.hand{font-size:38px;font-weight:700;line-height:1.1}
  h2.hand{font-size:28px;font-weight:600}
  .spin{display:inline-block;animation:spin 1s linear infinite}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

  @media(max-width:600px){
    .page,.page-sm{padding:18px 14px}
    h1.hand{font-size:30px}
    .hdr{padding:13px 14px}
    .gcard{flex-direction:column;align-items:flex-start}
  }
`;

// ── Couple Illustration ───────────────────────────────────────────
function CoupleIllustration() {
  return (
    <svg viewBox="0 0 160 195" width="130" height="158" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{display:'block',margin:'10px auto 0'}}>
      {/* Heart */}
      <path d="M80 18 C80 12 72 7 72 14 C72 19 80 26 80 26 C80 26 88 19 88 14 C88 7 80 12 80 18Z" fill={C.blue}/>

      {/* Groom */}
      <circle cx="57" cy="52" r="13" stroke={C.ink} strokeWidth="2"/>
      <path d="M44 68 Q57 61 70 68 L73 118 L41 118 Z" stroke={C.ink} strokeWidth="2"/>
      <path d="M55 65 L53 84 L57 92 L61 84 L59 65Z" fill={C.ink}/>
      <line x1="49" y1="118" x2="47" y2="170" stroke={C.ink} strokeWidth="2"/>
      <line x1="65" y1="118" x2="67" y2="170" stroke={C.ink} strokeWidth="2"/>
      <path d="M41 170 Q47 176 54 170" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M61 170 Q67 176 74 170" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M70 86 Q82 95 88 103" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>

      {/* Bride */}
      <circle cx="106" cy="52" r="13" stroke={C.ink} strokeWidth="2"/>
      <path d="M95 46 Q106 34 117 46" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M93 68 Q106 61 119 68 L116 96 L96 96 Z" stroke={C.ink} strokeWidth="2"/>
      <path d="M96 96 Q76 130 74 178 L138 178 Q136 130 116 96" stroke={C.ink} strokeWidth="2"/>
      <path d="M96 96 Q106 102 116 96" stroke={C.ink} strokeWidth="1.2"/>
      <path d="M94 86 Q84 95 88 103" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>
      <path d="M87 178 Q92 184 97 178 L97 185" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>
      <path d="M111 178 Q116 184 121 178 L121 185" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>

      {/* Holding hands */}
      <circle cx="88" cy="105" r="5" fill={C.blue} stroke={C.ink} strokeWidth="1.5"/>
    </svg>
  );
}

// ── Calendar ──────────────────────────────────────────────────────
function Calendar({ selected, onToggle, voteMap={}, confirmedDates=[], totalMembers=0, myName='', showOthers=false }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [popup, setPopup] = useState(null);

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => { setPopup(null); if (month===0){setYear(y=>y-1);setMonth(11);}else{setMonth(m=>m-1);} };
  const next = () => { setPopup(null); if (month===11){setYear(y=>y+1);setMonth(0);}else{setMonth(m=>m+1);} };

  const maxVotes = Math.max(1, ...cells.filter(Boolean).map(d => (voteMap[dateStr(year,month,d)]||[]).length));
  const heatBg = c => { if(!c) return 'transparent'; const r=c/maxVotes; if(r<0.4) return `rgba(184,205,224,${0.3+r})`; if(r<0.7) return `rgba(122,163,192,${0.3+r*0.5})`; return `rgba(61,107,142,${0.5+r*0.4})`; };
  const heatFg = c => (c/maxVotes)>=0.6 ? 'white' : C.ink;

  const handleDay = (e, ds, isPast) => {
    if (isPast) return;
    onToggle(ds);
    if (showOthers) {
      const rect = e.currentTarget.getBoundingClientRect();
      setPopup(p => p?.ds===ds ? null : { ds, top: rect.bottom+6, left: rect.left });
    }
  };

  return (
    <div style={{position:'relative'}}>
      <div className="cal-hdr">
        <button className="btn btn-ghost btn-sm" onClick={prev}>←</button>
        <span className="cal-month">{year}년 {MONTHS[month]}</span>
        <button className="btn btn-ghost btn-sm" onClick={next}>→</button>
      </div>

      {showOthers && (
        <div style={{display:'flex',gap:14,marginBottom:10,fontSize:10,color:C.muted,flexWrap:'wrap'}}>
          <span><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:C.accentBlue,marginRight:4,verticalAlign:'middle'}}/>내 선택</span>
          <span><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:'rgba(122,163,192,.35)',marginRight:4,verticalAlign:'middle'}}/>다른 멤버</span>
          <span><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:C.sage,marginRight:4,verticalAlign:'middle'}}/>확정</span>
        </div>
      )}

      <div className="cal-grid">
        {DOWS.map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} className="cal-day emp" />;
          const ds = dateStr(year, month, d);
          const isPast = new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
          const isSel  = selected.includes(ds);
          const votes  = voteMap[ds] || [];
          const others = myName ? votes.filter(n=>n!==myName) : votes;
          const isConf = confirmedDates.includes(ds);
          const isOpen = popup?.ds===ds;

          let cls = 'cal-day', style = {};
          if (isPast)        cls += ' past';
          else if (isConf)   cls += ' conf';
          else if (showOthers) {
            if (isSel)          style = { background:C.accentBlue, color:'white', outline:`2px solid ${C.deepBlue}`, outlineOffset:'1px' };
            else if (others.length) style = { background:heatBg(others.length), color:heatFg(others.length) };
          } else {
            if (isSel) cls += ' sel';
          }
          if (isOpen) style.outline = `2px solid ${C.accentBlue}`;

          return (
            <div key={ds} className={cls} style={style} onClick={e=>handleDay(e,ds,isPast)}>
              {d}
              {showOthers && votes.length>0 && !isConf && (
                <span style={{position:'absolute',top:1,right:1,fontSize:7,fontWeight:600,color:isSel?'rgba(255,255,255,.85)':C.deepBlue,lineHeight:1}}>{votes.length}</span>
              )}
            </div>
          );
        })}
      </div>

      {showOthers && popup && (
        <>
          <div style={{position:'fixed',inset:0,zIndex:49}} onClick={()=>setPopup(null)} />
          <div style={{position:'fixed',top:Math.min(popup.top,window.innerHeight-160),left:Math.max(8,Math.min(popup.left-16,window.innerWidth-200)),zIndex:50,background:'white',border:`1px solid ${C.blue}`,borderRadius:4,padding:'12px 15px',boxShadow:'0 4px 20px rgba(0,0,0,.10)',minWidth:160}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:1,marginBottom:7,textTransform:'uppercase'}}>{formatDate(popup.ds)}</div>
            {(voteMap[popup.ds]||[]).length===0
              ? <div style={{fontSize:12,color:C.muted}}>선택한 사람 없음</div>
              : (voteMap[popup.ds]||[]).map(n=>(
                  <div key={n} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,marginBottom:4}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:n===myName?C.accentBlue:C.sage,display:'inline-block',flexShrink:0}}/>
                    {n}{n===myName?' (나)':''}
                  </div>
                ))
            }
            <div style={{fontSize:10,color:C.muted,marginTop:7,borderTop:`1px solid ${C.blue}`,paddingTop:5}}>{(voteMap[popup.ds]||[]).length}/{totalMembers}명 가능</div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Overview Calendar ─────────────────────────────────────────────
function OverviewCalendar({ groups }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [popup, setPopup] = useState(null);

  const dateMap = {};
  Object.values(groups).forEach(g => {
    const voteMap = {};
    (g.members||[]).forEach(m=>(m.dates||[]).forEach(d=>{ if(!voteMap[d]) voteMap[d]=[]; voteMap[d].push(m.name); }));
    (g.confirmedDates||[]).forEach(d => {
      if (!dateMap[d]) dateMap[d] = [];
      dateMap[d].push({ groupName: g.name, members: voteMap[d]||[], total: g.members.length });
    });
  });

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  const prev = () => { setPopup(null); if(month===0){setYear(y=>y-1);setMonth(11);}else{setMonth(m=>m-1);} };
  const next = () => { setPopup(null); if(month===11){setYear(y=>y+1);setMonth(0);}else{setMonth(m=>m+1);} };

  const allConfirmed = Object.entries(dateMap).sort((a,b)=>a[0].localeCompare(b[0]));

  return (
    <div>
      <div className="cal-hdr">
        <button className="btn btn-ghost btn-sm" onClick={prev}>←</button>
        <span className="cal-month">{year}년 {MONTHS[month]}</span>
        <button className="btn btn-ghost btn-sm" onClick={next}>→</button>
      </div>

      <div className="cal-grid" style={{marginBottom:24}}>
        {DOWS.map(d=><div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d,i) => {
          if (!d) return <div key={`e${i}`} className="cal-day emp"/>;
          const ds = dateStr(year, month, d);
          const entries = dateMap[ds];
          const isPast  = new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
          const isOpen  = popup?.ds===ds;
          return (
            <div key={ds}
              className={`cal-day${isPast?' past':''}`}
              style={{
                background: entries ? C.sage : undefined,
                color: entries ? 'white' : undefined,
                outline: isOpen ? `2px solid ${C.accentBlue}` : undefined,
                cursor: entries ? 'pointer' : 'default',
                flexDirection:'column', gap:1, fontSize:11,
              }}
              onClick={e => {
                if (!entries) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setPopup(p=>p?.ds===ds ? null : { ds, top:rect.bottom+6, left:rect.left });
              }}
            >
              <span>{d}</span>
              {entries && <span style={{fontSize:6,lineHeight:1}}>{entries.length}그룹</span>}
            </div>
          );
        })}
      </div>

      {allConfirmed.length > 0 && (
        <div>
          <div className="rule"><span>확정 날짜 전체</span></div>
          {allConfirmed.map(([ds, entries]) => (
            <div key={ds} className="card mb2">
              <div style={{fontWeight:600,marginBottom:8}}>{formatDate(ds)}</div>
              {entries.map((e,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
                  <span><span className="chip" style={{marginRight:6}}>{e.groupName}</span>{e.members.join(', ')}</span>
                  <span className="muted">{e.members.length}/{e.total}명</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {allConfirmed.length===0 && (
        <div className="muted tc" style={{padding:'36px 0'}}>아직 확정된 날짜가 없어요.</div>
      )}

      {popup && (
        <>
          <div style={{position:'fixed',inset:0,zIndex:49}} onClick={()=>setPopup(null)}/>
          <div style={{position:'fixed',top:Math.min(popup.top,window.innerHeight-200),left:Math.max(8,Math.min(popup.left-16,window.innerWidth-240)),zIndex:50,background:'white',border:`1px solid ${C.blue}`,borderRadius:4,padding:'14px 16px',boxShadow:'0 4px 20px rgba(0,0,0,.10)',minWidth:200}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:1,marginBottom:10,textTransform:'uppercase'}}>{formatDate(popup.ds)}</div>
            {(dateMap[popup.ds]||[]).map((e,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{e.groupName}</div>
                <div style={{fontSize:11,color:C.muted}}>{e.members.join(', ')} ({e.members.length}/{e.total}명)</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Host: Group List ──────────────────────────────────────────────
function HostDashboard({ onSelectGroup }) {
  const { groups, loading } = useGroups();
  const list = Object.values(groups).sort((a,b)=>b.createdAt-a.createdAt);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]       = useState('');
  const [creating, setCreating]     = useState(false);
  const [hostTab, setHostTab]       = useState('groups');

  const create = async () => {
    setCreating(true);
    const id = genId();
    const g  = { id, name: newName.trim() || '청첩장모임', password: genPass(), members: [], confirmedDates: [], createdAt: Date.now() };
    await saveGroup(g);
    setNewName(''); setShowCreate(false); setCreating(false);
  };

  if (loading) return (
    <div className="page tc" style={{paddingTop:80}}>
      <span className="spin" style={{fontSize:24}}>♡</span>
      <p className="muted mt4">불러오는 중...</p>
    </div>
  );

  return (
    <div className="page">
      <div className="flex ic jb mb4">
        <div>
          <div style={{fontFamily:'IsYun',fontSize:13,letterSpacing:2,color:C.accentBlue,marginBottom:6}}>09 · 13 현석 ♡ 지현</div>
          <h1 className="hand">모임 날짜 조율</h1>
          <p className="muted mt2">그룹을 만들고 친구들과 날짜를 조율하세요.</p>
        </div>
        {hostTab==='groups' && <button className="btn btn-primary" onClick={()=>setShowCreate(true)}>+ 그룹 추가</button>}
      </div>

      <div className="tabs">
        <button className={`tab ${hostTab==='groups'?'on':''}`} onClick={()=>setHostTab('groups')}>그룹 목록</button>
        <button className={`tab ${hostTab==='calendar'?'on':''}`} onClick={()=>setHostTab('calendar')}>전체 캘린더</button>
      </div>

      {hostTab==='calendar' && <OverviewCalendar groups={groups} />}

      {hostTab==='groups' && <>
        {showCreate && (
          <div className="card" style={{borderLeft:`3px solid ${C.accentBlue}`}}>
            <div className="fg">
              <label className="lbl">그룹 이름</label>
              <input className="inp" placeholder="비우면 '청첩장모임'으로 설정" value={newName}
                onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()} autoFocus />
            </div>
            <div className="flex g3">
              <button className="btn btn-outline btn-sm" onClick={()=>setShowCreate(false)}>취소</button>
              <button className="btn btn-primary btn-sm" onClick={create} disabled={creating}>
                {creating ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        )}

        <div className="rule"><span>그룹 목록 ({list.length})</span></div>

        {list.length===0 && (
          <div className="tc" style={{padding:'56px 0'}}>
            <div style={{fontFamily:'IsYun',fontSize:48,marginBottom:10,color:C.blue}}>♡</div>
            <p className="muted">아직 그룹이 없어요. 첫 그룹을 만들어보세요!</p>
          </div>
        )}

        {list.map(g=>(
          <div key={g.id} className="gcard" onClick={()=>onSelectGroup(g.id)}>
            <div>
              <div style={{fontFamily:'IsYun',fontSize:22,fontWeight:600}}>{g.name}</div>
              <div className="muted" style={{marginTop:4}}>
                멤버 {g.members.length}명 · 비밀번호 <strong style={{letterSpacing:2}}>{g.password}</strong>
                {g.confirmedDates?.length>0 && <span className="badge badge-g" style={{marginLeft:8}}>확정 {g.confirmedDates.length}일</span>}
              </div>
            </div>
            <div className="flex g2 ic">
              <span className="badge badge-r">{g.members.length}명 응답</span>
              <span style={{color:C.muted,fontSize:17}}>›</span>
            </div>
          </div>
        ))}
      </>}
    </div>
  );
}

// ── KakaoTalk Message Modal ───────────────────────────────────────
function KakaoMsgModal({ group, voteMap, onClose }) {
  const [copied, setCopied] = useState(false);
  const confirmed = group.confirmedDates || [];
  const total = group.members.length;

  const dateLines = confirmed.map(d => {
    const names = voteMap[d] || [];
    return `📅 ${formatDate(d)}\n✅ 참석 가능 (${names.length}/${total}명): ${names.join(', ')}`;
  }).join('\n\n');

  const msg = `💌 [${group.name}] 모임 날짜 확정!\n\n${dateLines}\n\n현석 ♡ 지현의 결혼을 함께해줘서 고마워 💙`;

  const copy = () => {
    navigator.clipboard?.writeText(msg).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title mb2">카톡 메시지</div>
        <p className="muted mb4" style={{fontSize:12}}>복사 후 카카오톡에 붙여넣기 하세요.</p>
        <div style={{background:C.ivory,border:`1px solid ${C.blue}`,borderRadius:4,padding:16,fontSize:13,lineHeight:1.9,whiteSpace:'pre-wrap',marginBottom:16}}>
          {msg}
        </div>
        <div className="flex g3">
          <button className="btn btn-outline" onClick={onClose}>닫기</button>
          <button className="btn btn-primary" style={{flex:1}} onClick={copy}>{copied?'✓ 복사됨':'복사하기'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Host: Group Detail ────────────────────────────────────────────
function GroupDetail({ groupId, onBack }) {
  const { group, loading } = useGroup(groupId);
  const [tab, setTab]       = useState('dates');
  const [copied, setCopied] = useState(false);
  const [showKakao, setShowKakao] = useState(false);

  if (loading) return <div className="page muted tc" style={{paddingTop:60}}><span className="spin">♡</span></div>;
  if (!group)  return <div className="page muted tc" style={{paddingTop:60}}>그룹을 찾을 수 없어요.</div>;

  const voteMap = {};
  group.members.forEach(m=>(m.dates||[]).forEach(d=>{ if(!voteMap[d]) voteMap[d]=[]; voteMap[d].push(m.name); }));
  const sorted = Object.entries(voteMap).sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0]));
  const total  = group.members.length;

  const confirmDate = async ds => {
    if (group.confirmedDates.includes(ds)) return;
    await updateGroup(groupId, { confirmedDates: [...group.confirmedDates, ds] });
  };
  const unconfirm = async ds => {
    await updateGroup(groupId, { confirmedDates: group.confirmedDates.filter(d=>d!==ds) });
  };

  const appUrl  = window.location.origin + window.location.pathname;
  const shareUrl = `${appUrl}?group=${group.id}`;
  const handleCopy = () => {
    const text = `우리 모임날짜 잡아보자!\n[ ${group.name} ]\n\n링크: ${shareUrl}\n비밀번호: ${group.password}\n\n👉 링크 접속 → 비밀번호 입력 → 가능한 날짜 선택해줘!`;
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  const addresses = group.members.filter(m=>m.address).map(m=>({name:m.name,address:m.address}));

  return (
    <div className="page">
      <button className="btn btn-ghost" style={{paddingLeft:0,marginBottom:14}} onClick={onBack}>← 목록으로</button>
      <div className="flex ic jb mb2">
        <h2 className="hand">{group.name}</h2>
        <span className="badge badge-r">멤버 {total}명</span>
      </div>

      <div className="card mb4">
        <div className="lbl mb2">초대 링크 공유</div>
        <div className="link-box">
          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{shareUrl}</span>
          <button className="btn btn-sm btn-outline" onClick={handleCopy}>{copied?'✓ 복사됨':'복사'}</button>
        </div>
        <p className="muted mt2" style={{fontSize:11}}>비밀번호: <strong style={{color:C.deepBlue,letterSpacing:2}}>{group.password}</strong></p>
      </div>

      <div className="tabs">
        {['dates','calendar','members','place'].map(t=>(
          <button key={t} className={`tab ${tab===t?'on':''}`} onClick={()=>setTab(t)}>
            {t==='dates'?'날짜 조율':t==='calendar'?'캘린더':t==='members'?'멤버':'장소 추천'}
          </button>
        ))}
      </div>

      {tab==='dates' && (
        <div>
          {group.confirmedDates?.length>0 && <>
            <div className="rule"><span>확정된 날짜</span></div>
            {group.confirmedDates.map(d=>(
              <div key={d} className="drow cfd">
                <div>
                  <div style={{fontSize:14}}>🌿 {formatDate(d)}</div>
                  <div className="muted">{(voteMap[d]||[]).length}/{total}명 가능</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={()=>unconfirm(d)}>취소</button>
              </div>
            ))}
            <button className="btn btn-rose w100 mt2 mb4" onClick={()=>setShowKakao(true)}>
              💬 카톡 메시지 만들기
            </button>
            <div className="rule"/>
          </>}

          {group.confirmedDates?.length===0 && sorted.length>=2 && (
            <div className="card mb4" style={{borderLeft:`3px solid ${C.accentBlue}`}}>
              <div className="lbl mb2">날짜 후보 TOP {Math.min(sorted.length,3)}</div>
              <p className="muted mb4" style={{fontSize:12}}>완전 조율이 어려우면 후보 중 확정하세요.</p>
              {sorted.slice(0,3).map(([ds,names])=>(
                <div key={ds} className="flex jb ic" style={{marginBottom:12}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{formatDate(ds)}</div>
                    <div className="muted" style={{fontSize:11}}>{names.length}/{total}명 가능 · {names.join(', ')}</div>
                  </div>
                  <button className="btn btn-confirm btn-sm" onClick={()=>confirmDate(ds)}>확정</button>
                </div>
              ))}
            </div>
          )}

          {sorted.length===0
            ? <div className="muted tc" style={{padding:'36px 0'}}>아직 응답한 멤버가 없어요.</div>
            : sorted.map(([ds,names],i)=>{
                const isCfd = group.confirmedDates?.includes(ds);
                return (
                  <div key={ds} className={`drow ${i===0&&!isCfd?'top':''} ${isCfd?'cfd':''}`}>
                    <div>
                      <div style={{fontSize:14}}>{formatDate(ds)}</div>
                      <div className="chips mt2">{names.map(n=><span key={n} className="chip">{n}</span>)}</div>
                    </div>
                    <div className="flex-col ic g2" style={{alignItems:'flex-end'}}>
                      <span className="muted">{names.length}/{total}명</span>
                      {!isCfd && <button className="btn btn-confirm btn-sm" onClick={()=>confirmDate(ds)}>확정</button>}
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {tab==='calendar' && (
        <Calendar selected={group.confirmedDates||[]} onToggle={()=>{}} voteMap={voteMap} confirmedDates={group.confirmedDates||[]} />
      )}

      {tab==='members' && (
        <div>
          {group.members.length===0
            ? <div className="muted tc" style={{padding:'36px 0'}}>아직 응답한 멤버가 없어요.</div>
            : group.members.map((m,i)=>(
                <div key={i} className="card">
                  <div className="flex jb ic">
                    <strong>{m.name}</strong>
                    <span className="badge badge-r">{m.dates?.length||0}일 선택</span>
                  </div>
                  {m.address && <p className="muted mt2">📍 {m.address}</p>}
                  <div className="chips mt2">
                    {(m.dates||[]).sort().map(d=><span key={d} className="chip" style={{background:group.confirmedDates?.includes(d)?'#e0f0e0':undefined}}>{formatDate(d)}</span>)}
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {tab==='place' && <PlaceTab addresses={addresses} />}

      {showKakao && <KakaoMsgModal group={group} voteMap={voteMap} onClose={()=>setShowKakao(false)} />}
    </div>
  );
}

// ── Place Tab ─────────────────────────────────────────────────────
function PlaceTab({ addresses }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const recommend = async () => {
    if (!addresses.length) return;
    setLoading(true); setErr(''); setResult(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setResult(result);
    } catch { setErr('추천을 가져오지 못했어요. 다시 시도해주세요.'); }
    setLoading(false);
  };

  if (!addresses.length) return <div className="muted tc" style={{padding:'40px 0'}}>📍 주소를 입력한 멤버가 없어요.</div>;

  return (
    <div>
      <div className="card mb4">
        <div className="lbl mb2">멤버 주소 ({addresses.length}명)</div>
        {addresses.map((a,i)=>(
          <div key={i} className="flex g3 ic mb2">
            <span className="chip">{a.name}</span>
            <span className="muted">{a.address}</span>
          </div>
        ))}
      </div>
      {!result && <button className="btn btn-rose w100" onClick={recommend} disabled={loading}>{loading?'분석 중...':'🗺️ 중간 지점 추천받기'}</button>}
      {err && <div className="alert alert-r">{err}</div>}
      {result && (
        <div>
          <div className="alert alert-g"><strong>📍 {result.area}</strong><p style={{marginTop:5,fontSize:12}}>{result.reason}</p></div>
          <div className="card">
            <div className="lbl mb2">추천 장소</div>
            {result.suggestions.map((s,i)=><div key={i} className="drow" style={{marginBottom:7}}><span>♡ {s}</span></div>)}
          </div>
          <button className="btn btn-outline w100 mt2" onClick={recommend}>다시 추천</button>
        </div>
      )}
    </div>
  );
}

// ── Member View ───────────────────────────────────────────────────
function MemberView({ groupId }) {
  const { group: liveGroup } = useGroup(groupId);
  const [step, setStep]       = useState('auth');
  const [group, setGroup]     = useState(null);
  const groupName = liveGroup?.name || '';
  const [pw, setPw]           = useState('');
  const [name, setName]       = useState('');
  const [addr, setAddr]       = useState('');
  const [dates, setDates]     = useState([]);
  const [err, setErr]         = useState('');
  const [submitting, setSub]  = useState(false);

  const currentGroup = liveGroup || group;

  const voteMap = {};
  (currentGroup?.members||[]).forEach(m=>(m.dates||[]).forEach(d=>{ if(!voteMap[d]) voteMap[d]=[]; voteMap[d].push(m.name); }));
  const totalMembers = currentGroup?.members?.length || 0;

  const verify = async () => {
    setErr('');
    const g = await fetchGroup(groupId);
    if (!g)                                     { setErr('그룹을 찾을 수 없어요.'); return; }
    if (pw.trim().toUpperCase() !== g.password) { setErr('비밀번호가 틀렸어요.'); return; }
    setGroup(g); setStep('info');
  };

  const submit = async () => {
    if (!name.trim()) { setErr('이름을 입력해주세요.'); return; }
    setSub(true);
    const g = await fetchGroup(groupId);
    const members = (g.members||[]).filter(m=>m.name!==name.trim());
    members.push({ name: name.trim(), address: addr.trim(), dates, submittedAt: Date.now() });
    await updateGroup(groupId, { members });
    setSub(false);
    setStep('done');
  };

  const toggle = ds => setDates(p=>p.includes(ds)?p.filter(d=>d!==ds):[...p,ds]);
  const reset  = ()  => { setStep('auth'); setPw(''); setName(''); setAddr(''); setDates([]); setErr(''); };

  if (step==='auth') return (
    <div className="page-sm">
      <div className="invite-card">
        <span className="invite-corner" style={{top:8,left:10}}>♡</span>
        <span className="invite-corner" style={{top:8,right:10}}>♡</span>
        <span className="invite-corner" style={{bottom:8,left:10}}>♡</span>
        <span className="invite-corner" style={{bottom:8,right:10}}>♡</span>

        <div style={{fontSize:10,letterSpacing:4,textTransform:'uppercase',color:C.muted,marginBottom:10}}>Save the Date</div>
        <h1 className="hand" style={{fontSize:42,fontWeight:700,lineHeight:1}}>현석 ♡ 지현</h1>
        <div style={{fontFamily:'IsYun',fontSize:22,color:C.accentBlue,margin:'8px 0 0'}}>09 · 13</div>
        <CoupleIllustration />
        {groupName && <div className="badge-lg" style={{marginTop:10,display:'inline-block'}}>{groupName}</div>}
      </div>

      <div className="card">
        <p className="muted mb4" style={{textAlign:'center',fontSize:13}}>비밀번호를 입력해 참여하세요.</p>
        <div className="fg">
          <label className="lbl">비밀번호</label>
          <input className="inp" placeholder="예: AB12" value={pw}
            onChange={e=>setPw(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==='Enter'&&verify()} autoFocus
            style={{letterSpacing:4,fontSize:18,textAlign:'center'}} />
        </div>
        {err && <div className="alert alert-r">{err}</div>}
        <button className="btn btn-primary w100" onClick={verify}>입장하기</button>
      </div>
    </div>
  );

  if (step==='info') return (
    <div className="page-sm">
      <div className="tc mb4">
        <span className="badge-lg">{currentGroup?.name}</span>
        <h2 className="hand" style={{marginTop:8}}>내 정보 입력</h2>
        <p className="muted mt2">이름과 주소를 입력하고 날짜를 골라주세요.</p>
      </div>
      <div className="card">
        <div className="fg">
          <label className="lbl">이름 *</label>
          <input className="inp" placeholder="본인 이름" value={name} onChange={e=>setName(e.target.value)} autoFocus />
        </div>
        <div className="fg">
          <label className="lbl">집 주소 (선택)</label>
          <input className="inp" placeholder="예: 서울시 마포구 홍대입구" value={addr} onChange={e=>setAddr(e.target.value)} />
          <p className="muted mt2" style={{fontSize:10}}>중간 지점 추천에 사용돼요.</p>
        </div>
        {err && <div className="alert alert-r">{err}</div>}
        <button className="btn btn-primary w100" onClick={()=>{ if(!name.trim()){setErr('이름을 입력해주세요.');return;} setErr(''); setStep('calendar'); }}>
          다음 →
        </button>
      </div>
    </div>
  );

  if (step==='calendar') {
    const othersTop = Object.entries(voteMap)
      .filter(([,ns])=>ns.some(n=>n!==name))
      .sort((a,b)=>b[1].filter(n=>n!==name).length-a[1].filter(n=>n!==name).length)
      .slice(0,3);
    return (
      <div className="page-sm">
        <div className="tc mb4">
          <span className="badge-lg">{currentGroup?.name}</span>
          <h2 className="hand" style={{marginTop:8}}>{name}님, 가능한 날짜 선택</h2>
          <p className="muted mt2">날짜를 누르면 다른 멤버 현황을 볼 수 있어요.</p>
        </div>

        {othersTop.length>0 && (
          <div className="card mb4" style={{borderLeft:`3px solid ${C.sage}`,padding:'12px 16px'}}>
            <div className="lbl mb2">많이 선택된 날짜</div>
            {othersTop.map(([ds,ns])=>(
              <div key={ds} className="flex jb ic" style={{marginBottom:5,fontSize:12}}>
                <span>{formatDate(ds)}</span>
                <span style={{color:C.sage,fontWeight:500}}>{ns.filter(n=>n!==name).length}명</span>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <Calendar
            selected={dates} onToggle={toggle}
            voteMap={voteMap} confirmedDates={currentGroup?.confirmedDates||[]}
            totalMembers={totalMembers} myName={name} showOthers={true}
          />
          {dates.length>0 && (
            <div className="mt4">
              <div className="lbl mb2">선택한 날짜 ({dates.length})</div>
              <div className="chips">{[...dates].sort().map(d=><span key={d} className="chip">{formatDate(d)}</span>)}</div>
            </div>
          )}
        </div>

        <div className="flex g3 mt4">
          <button className="btn btn-ghost" onClick={()=>setStep('info')}>← 뒤로</button>
          <button className="btn btn-primary" style={{flex:1}} onClick={submit} disabled={submitting||dates.length===0}>
            {submitting ? '저장 중...' : `${dates.length}일 제출하기`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-sm tc" style={{paddingTop:70}}>
      <div style={{fontFamily:'IsYun',fontSize:64,marginBottom:14,color:C.blue}}>♡</div>
      <h2 className="hand">제출 완료!</h2>
      <p className="muted mt2">{name}님의 일정이 등록됐어요.<br/>모임 날짜가 확정되면 알려드릴게요.</p>
      <div className="alert alert-g mt4">선택 날짜: <strong>{dates.length}일</strong></div>
      <button className="btn btn-outline btn-sm mt4" onClick={reset}>다른 사람으로 입력</button>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const params  = new URLSearchParams(window.location.search);
  const groupId = params.get('group');

  const [view, setView]         = useState('host');
  const [detailId, setDetailId] = useState(null);

  if (groupId) return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="hdr">
          <div>
            <div className="hdr-title">현석 ♡ 지현</div>
            <div className="hdr-sub">09 · 13 저희 결혼합니다</div>
          </div>
        </div>
        <MemberView groupId={groupId} />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="hdr">
          <div>
            <div className="hdr-title">현석 ♡ 지현</div>
            <div className="hdr-sub">09 · 13 저희 결혼합니다</div>
          </div>
        </div>

        {view==='host'   && <HostDashboard onSelectGroup={id=>{ setDetailId(id); setView('detail'); }} />}
        {view==='detail' && <GroupDetail groupId={detailId} onBack={()=>setView('host')} />}
      </div>
    </>
  );
}
