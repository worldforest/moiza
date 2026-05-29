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
  ivory:'#FAF7F2', blush:'#E8C5B0', rose:'#C4785A', deepRose:'#8B4A35',
  sage:'#7A9E7E', darkSage:'#4A6B4E', ink:'#2C2016', muted:'#8A7A6E', lightBlush:'#F5E6DC',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.ivory};font-family:'Jost',sans-serif;color:${C.ink}}
  button{cursor:pointer;border:none;background:none;font-family:inherit}
  input,select{font-family:inherit}
  .serif{font-family:'Cormorant Garamond',serif}
  .app{min-height:100vh}

  .hdr{background:${C.ink};color:${C.ivory};padding:16px 28px;display:flex;align-items:center;justify-content:space-between}
  .hdr-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;letter-spacing:2px}
  .hdr-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;opacity:.45;margin-top:2px}

  .page{max-width:820px;margin:0 auto;padding:36px 22px}
  .page-sm{max-width:500px;margin:0 auto;padding:36px 22px}

  .rule{display:flex;align-items:center;gap:14px;margin:28px 0}
  .rule::before,.rule::after{content:'';flex:1;height:1px;background:${C.blush}}
  .rule span{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${C.muted};white-space:nowrap}

  .card{background:white;border:1px solid ${C.blush};border-radius:2px;padding:24px;margin-bottom:18px;position:relative;overflow:hidden}
  .card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:${C.rose}}

  .gcard{background:white;border:1px solid ${C.blush};border-radius:2px;padding:20px 24px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:14px;cursor:pointer;transition:box-shadow .18s}
  .gcard:hover{box-shadow:0 4px 18px rgba(196,120,90,.13)}

  .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 22px;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-radius:1px;transition:all .18s;font-weight:500;cursor:pointer}
  .btn-primary{background:${C.ink};color:${C.ivory}}
  .btn-primary:hover{background:${C.deepRose}}
  .btn-primary:disabled{opacity:.45;cursor:not-allowed}
  .btn-outline{border:1px solid ${C.ink};color:${C.ink}}
  .btn-outline:hover{background:${C.ink};color:${C.ivory}}
  .btn-rose{background:${C.rose};color:white}
  .btn-rose:hover{background:${C.deepRose}}
  .btn-confirm{background:${C.sage};color:white}
  .btn-confirm:hover{background:${C.darkSage}}
  .btn-ghost{color:${C.muted};font-size:11px;padding:7px 10px}
  .btn-ghost:hover{color:${C.ink}}
  .btn-sm{padding:6px 13px;font-size:10px}

  .fg{margin-bottom:18px}
  .lbl{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};margin-bottom:7px}
  .inp{width:100%;padding:10px 13px;border:1px solid ${C.blush};border-radius:1px;font-size:14px;background:${C.ivory};color:${C.ink};outline:none;transition:border-color .18s}
  .inp:focus{border-color:${C.rose}}
  select.inp{cursor:pointer}

  .tabs{display:flex;border-bottom:1px solid ${C.blush};margin-bottom:26px;overflow-x:auto}
  .tab{padding:9px 18px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;border-bottom:2px solid transparent;margin-bottom:-1px;color:${C.muted};cursor:pointer;transition:all .18s;background:none;border-top:none;border-left:none;border-right:none;white-space:nowrap}
  .tab.on{color:${C.rose};border-bottom-color:${C.rose}}

  .badge{display:inline-block;padding:2px 9px;border-radius:20px;font-size:9px;letter-spacing:1px;text-transform:uppercase}
  .badge-r{background:${C.lightBlush};color:${C.deepRose}}
  .badge-g{background:#e0f0e0;color:${C.darkSage}}

  .alert{padding:11px 15px;border-radius:1px;font-size:13px;margin-bottom:14px}
  .alert-r{background:${C.lightBlush};color:${C.deepRose};border-left:3px solid ${C.rose}}
  .alert-g{background:#e8f4e8;color:${C.darkSage};border-left:3px solid ${C.sage}}

  .cal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .cal-month{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:400}
  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
  .cal-dow{text-align:center;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};padding:3px 0}
  .cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:12px;border-radius:50%;cursor:pointer;border:1px solid transparent;transition:all .13s;position:relative}
  .cal-day:hover:not(.emp):not(.past){border-color:${C.rose}}
  .cal-day.sel{background:${C.rose};color:white;outline:2px solid ${C.deepRose};outline-offset:1px}
  .cal-day.conf{background:${C.sage};color:white}
  .cal-day.emp,.cal-day.past{cursor:default}
  .cal-day.past{opacity:.28}

  .drow{display:flex;align-items:center;justify-content:space-between;padding:11px 15px;border:1px solid ${C.blush};border-radius:1px;margin-bottom:7px;background:white}
  .drow.top{border-left:3px solid ${C.rose}}
  .drow.cfd{border-left:3px solid ${C.sage};background:#f0f7f0}

  .chips{display:flex;gap:4px;flex-wrap:wrap}
  .chip{background:${C.lightBlush};color:${C.deepRose};font-size:9px;font-weight:500;letter-spacing:.5px;padding:2px 7px;border-radius:20px}

  .overlay{position:fixed;inset:0;background:rgba(44,32,22,.42);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
  .modal{background:white;border:1px solid ${C.blush};border-radius:2px;padding:30px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto}
  .modal-title{font-family:'Cormorant Garamond',serif;font-size:22px;margin-bottom:5px}

  .link-box{background:${C.ivory};border:1px dashed ${C.blush};padding:10px 14px;border-radius:1px;font-size:11px;color:${C.muted};word-break:break-all;display:flex;align-items:center;justify-content:space-between;gap:10px}

  .floral{color:${C.blush};font-size:16px;opacity:.7}
  .flex{display:flex}.flex-col{display:flex;flex-direction:column}
  .ic{align-items:center}.jb{justify-content:space-between}
  .g2{gap:8px}.g3{gap:12px}.g4{gap:16px}
  .mt2{margin-top:8px}.mt4{margin-top:16px}.mt6{margin-top:24px}
  .mb2{margin-bottom:8px}.mb4{margin-bottom:16px}
  .w100{width:100%}.tc{text-align:center}
  .muted{color:${C.muted};font-size:12px}
  h1.serif{font-size:32px;font-weight:300;line-height:1.2}
  h2.serif{font-size:22px;font-weight:400}
  .spin{display:inline-block;animation:spin 1s linear infinite}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

  @media(max-width:600px){
    .page,.page-sm{padding:18px 14px}
    h1.serif{font-size:24px}
    .hdr{padding:13px 14px}
    .gcard{flex-direction:column;align-items:flex-start}
  }
`;

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
  const heatBg = c => { if(!c) return 'transparent'; const r=c/maxVotes; if(r<0.4) return `rgba(232,197,176,${0.3+r})`; if(r<0.7) return `rgba(196,120,90,${0.3+r*0.5})`; return `rgba(139,74,53,${0.5+r*0.4})`; };
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
        <span className="cal-month serif">{year}년 {MONTHS[month]}</span>
        <button className="btn btn-ghost btn-sm" onClick={next}>→</button>
      </div>

      {showOthers && (
        <div style={{display:'flex',gap:14,marginBottom:10,fontSize:10,color:C.muted,flexWrap:'wrap'}}>
          <span><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:C.rose,marginRight:4,verticalAlign:'middle'}}/>내 선택</span>
          <span><span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:'rgba(196,120,90,.35)',marginRight:4,verticalAlign:'middle'}}/>다른 멤버</span>
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
            if (isSel)          style = { background:C.rose, color:'white', outline:`2px solid ${C.deepRose}`, outlineOffset:'1px' };
            else if (others.length) style = { background:heatBg(others.length), color:heatFg(others.length) };
          } else {
            if (isSel) cls += ' sel';
          }
          if (isOpen) style.outline = `2px solid ${C.rose}`;

          return (
            <div key={ds} className={cls} style={style} onClick={e=>handleDay(e,ds,isPast)}>
              {d}
              {showOthers && votes.length>0 && !isConf && (
                <span style={{position:'absolute',top:1,right:1,fontSize:7,fontWeight:600,color:isSel?'rgba(255,255,255,.85)':C.deepRose,lineHeight:1}}>{votes.length}</span>
              )}
            </div>
          );
        })}
      </div>

      {showOthers && popup && (
        <>
          <div style={{position:'fixed',inset:0,zIndex:49}} onClick={()=>setPopup(null)} />
          <div style={{position:'fixed',top:Math.min(popup.top,window.innerHeight-160),left:Math.max(8,Math.min(popup.left-16,window.innerWidth-200)),zIndex:50,background:'white',border:`1px solid ${C.blush}`,borderRadius:3,padding:'12px 15px',boxShadow:'0 4px 20px rgba(0,0,0,.12)',minWidth:160}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:1,marginBottom:7,textTransform:'uppercase'}}>{formatDate(popup.ds)}</div>
            {(voteMap[popup.ds]||[]).length===0
              ? <div style={{fontSize:12,color:C.muted}}>선택한 사람 없음</div>
              : (voteMap[popup.ds]||[]).map(n=>(
                  <div key={n} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,marginBottom:4}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:n===myName?C.rose:C.sage,display:'inline-block',flexShrink:0}}/>
                    {n}{n===myName?' (나)':''}
                  </div>
                ))
            }
            <div style={{fontSize:10,color:C.muted,marginTop:7,borderTop:`1px solid ${C.blush}`,paddingTop:5}}>{(voteMap[popup.ds]||[]).length}/{totalMembers}명 가능</div>
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

  const create = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const id = genId();
    const g  = { id, name: newName.trim(), password: genPass(), members: [], confirmedDates: [], createdAt: Date.now() };
    await saveGroup(g);
    setNewName(''); setShowCreate(false); setCreating(false);
  };

  if (loading) return (
    <div className="page tc" style={{paddingTop:80}}>
      <span className="spin" style={{fontSize:24}}>✦</span>
      <p className="muted mt4">불러오는 중...</p>
    </div>
  );

  return (
    <div className="page">
      <div className="flex ic jb mb4">
        <div>
          <div className="floral mb2">✦ 청첩장 모임 ✦</div>
          <h1 className="serif">모임 관리</h1>
          <p className="muted mt2">그룹을 만들고 친구들과 날짜를 조율하세요.</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowCreate(true)}>+ 그룹 추가</button>
      </div>

      {showCreate && (
        <div className="card" style={{borderLeft:`3px solid ${C.rose}`}}>
          <div className="fg">
            <label className="lbl">그룹 이름</label>
            <input className="inp" placeholder="예: 대학 친구들, 직장 동료" value={newName}
              onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()} autoFocus />
          </div>
          <div className="flex g3">
            <button className="btn btn-outline btn-sm" onClick={()=>setShowCreate(false)}>취소</button>
            <button className="btn btn-primary btn-sm" onClick={create} disabled={creating||!newName.trim()}>
              {creating ? '생성 중...' : '생성'}
            </button>
          </div>
        </div>
      )}

      <div className="rule"><span>그룹 목록 ({list.length})</span></div>

      {list.length===0 && (
        <div className="tc" style={{padding:'56px 0'}}>
          <div style={{fontSize:38,marginBottom:10}}>🌸</div>
          <p className="muted">아직 그룹이 없어요. 첫 그룹을 만들어보세요!</p>
        </div>
      )}

      {list.map(g=>(
        <div key={g.id} className="gcard" onClick={()=>onSelectGroup(g.id)}>
          <div>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:19}}>{g.name}</div>
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
    </div>
  );
}

// ── Host: Group Detail ────────────────────────────────────────────
function GroupDetail({ groupId, onBack }) {
  const { group, loading } = useGroup(groupId);
  const [tab, setTab]       = useState('dates');
  const [copied, setCopied] = useState(false);

  if (loading) return <div className="page muted tc" style={{paddingTop:60}}><span className="spin">✦</span></div>;
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
        <h2 className="serif">{group.name}</h2>
        <span className="badge badge-r">멤버 {total}명</span>
      </div>

      <div className="card mb4">
        <div className="lbl mb2">초대 링크 공유</div>
        <div className="link-box">
          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{shareUrl}</span>
          <button className="btn btn-sm btn-outline" onClick={handleCopy}>{copied?'✓ 복사됨':'복사'}</button>
        </div>
        <p className="muted mt2" style={{fontSize:11}}>비밀번호: <strong style={{color:C.deepRose,letterSpacing:2}}>{group.password}</strong></p>
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
            <div className="rule"/>
          </>}
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
      const prompt = `다음 멤버들의 집 주소:\n${addresses.map(a=>`- ${a.name}: ${a.address}`).join('\n')}\n\n만나기 좋은 중간 지점을 추천해주세요. 반드시 JSON만 응답(다른 텍스트 없이): {"area":"지역명","reason":"이유(2문장 이내)","suggestions":["구체적장소1","구체적장소2","구체적장소3"]}`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      const text = (data.content||[]).map(c=>c.text||'').join('');
      setResult(JSON.parse(text.replace(/```json|```/g,'').trim()));
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
            {result.suggestions.map((s,i)=><div key={i} className="drow" style={{marginBottom:7}}><span>🌸 {s}</span></div>)}
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
      <div className="tc mb4">
        <div style={{fontSize:36,marginBottom:6}}>💌</div>
        {groupName && <div className="badge badge-r" style={{marginBottom:8}}>{groupName}</div>}
        <h1 className="serif">청첩장 모임 날짜</h1>
        <p className="muted mt2">비밀번호를 입력해 참여하세요.</p>
      </div>
      <div className="card">
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
        <span className="badge badge-r">{currentGroup?.name}</span>
        <h2 className="serif" style={{marginTop:8}}>내 정보 입력</h2>
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
          <span className="badge badge-r">{currentGroup?.name}</span>
          <h2 className="serif" style={{marginTop:8}}>{name}님, 가능한 날짜 선택</h2>
          <p className="muted mt2">날짜를 누르면 다른 멤버 현황을 볼 수 있어요.</p>
        </div>

        {othersTop.length>0 && (
          <div className="card mb4" style={{borderLeft:`3px solid ${C.sage}`,padding:'12px 16px'}}>
            <div className="lbl mb2">🌿 많이 선택된 날짜</div>
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
      <div style={{fontSize:48,marginBottom:14}}>🌸</div>
      <h2 className="serif">제출 완료!</h2>
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

  // 멤버 링크로 접속한 경우
  if (groupId) return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="hdr">
          <div>
            <div className="hdr-title">💍 모임 날짜 조율</div>
            <div className="hdr-sub">청첩장 모임 일정 관리</div>
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
            <div className="hdr-title">💍 모임 날짜 조율</div>
            <div className="hdr-sub">청첩장 모임 일정 관리</div>
          </div>
        </div>

        {view==='host'   && <HostDashboard onSelectGroup={id=>{ setDetailId(id); setView('detail'); }} />}
        {view==='detail' && <GroupDetail groupId={detailId} onBack={()=>setView('host')} />}
      </div>
    </>
  );
}
