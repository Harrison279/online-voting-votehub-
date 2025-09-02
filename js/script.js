function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $all(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }
function toast(msg){ const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),250); },2000); }

// LocalStorage-based engine (default demo)
(function(){
  const page=document.querySelector('.award-page'); if(!page) return;
  const awardId=page.dataset.awardId; const form=page.querySelector('.vote-form'); const modal=document.getElementById('modal-'+awardId);
  const sel=modal.querySelector('.sel'); const confirmBtn=modal.querySelector('.confirm'); const cancelBtn=modal.querySelector('.cancel');
  const timerEl=page.querySelector('.timer'); const countEls=$all('.count', page);
  const keyVotes='votes_'+awardId; const keyEnd='end_'+awardId;
  const candidates = $all('input[name="candidate"]', form).map(i=>i.value);
  let votes={}; try{ votes = JSON.parse(localStorage.getItem(keyVotes))||{} }catch(e){ votes={}; }
  candidates.forEach(c=>{ if(!(c in votes)) votes[c]=0; });
  function render(){ countEls.forEach(sp=>{ sp.textContent = votes[sp.dataset.name]||0; }); }
  render();
  let end = parseInt(localStorage.getItem(keyEnd)||'0',10);
  if(!end){ end = Date.now() + 7*24*60*60*1000; localStorage.setItem(keyEnd, end); }
  function tick(){ const d = end - Date.now(); if(d<=0){ if(timerEl) timerEl.textContent='Voting ended'; return; } const days=Math.floor(d/86400000); const h=Math.floor((d%86400000)/3600000); const m=Math.floor((d%3600000)/60000); const s=Math.floor((d%60000)/1000); if(timerEl) timerEl.textContent = `${days}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
  tick(); setInterval(tick,1000);
  let chosen=''; form.addEventListener('submit', e=>{ e.preventDefault(); const pick = form.querySelector('input[name="candidate"]:checked'); if(!pick){ alert('Select a candidate'); return; } chosen = pick.value; sel.textContent = chosen; modal.style.display='grid'; });
  confirmBtn.addEventListener('click', ()=>{ votes[chosen] = (votes[chosen]||0) + 1; localStorage.setItem(keyVotes, JSON.stringify(votes)); render(); modal.style.display='none'; toast('Vote recorded (local)'); });
  cancelBtn.addEventListener('click', ()=> modal.style.display='none'); modal.addEventListener('click', e=>{ if(e.target===modal) modal.style.display='none'; });
})();

// OPTIONAL: server API helper (uncomment and set apiBase to use server instead)
// const apiBase = 'http://localhost:3000';
// async function voteServer(awardId, candidate){
//   const res = await fetch(apiBase + '/api/vote', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({awardId, candidate})});
//   return res.json();
//}
