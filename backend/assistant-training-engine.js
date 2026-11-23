const MODEL = process.env.AI_MODEL || 'Qwen/Qwen2.5-7B-Instruct';
const URL = process.env.AI_CHAT_COMPLETIONS_URL || 'https://router.huggingface.co/v1/chat/completions';
const rawInterval = Number(process.env.ANANTA_TRAINING_INTERVAL_SECONDS || 21600);
const INTERVAL = (Number.isFinite(rawInterval) ? Math.max(3600, rawInterval) : 21600) * 1000;
const LEVELS = ['Beginner','Learner','Intermediate','Advanced','Expert','Master'];
let active = false, timer = null;
const token = () => process.env.HF_TOKEN || process.env.AI_API_KEY || '';
const clean = (v,n=2000) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,' ').trim().slice(0,n);
async function ask(messages, max_tokens) {
  const key = token();
  if (!key) throw new Error('AI model token is not configured.');
  const r = await fetch(URL,{method:'POST',headers:{authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify({model:MODEL,temperature:0.2,max_tokens,messages}),signal:AbortSignal.timeout(30000)});
  if (!r.ok) throw new Error('AI provider HTTP '+r.status);
  const t = (await r.json())?.choices?.[0]?.message?.content || '';
  try { return JSON.parse(t); } catch {}
  const i=t.indexOf('{'), j=t.lastIndexOf('}');
  if(i>=0&&j>i) return JSON.parse(t.slice(i,j+1));
  throw new Error('AI returned invalid JSON.');
}
const lessonCode = x => (x.category||'general')+'-'+(String(x.title).match(/(?:មេរៀន|គោលការណ៍|នីតិវិធី)\s*(\d{1,4})/)?.[1]||String(x.id).slice(0,8));
const level = n => n>=95?6:n>=90?5:n>=80?4:n>=70?3:n>=60?2:1;
async function cycle({supabase,port}) {
  if(active) return;
  if(!token()){console.warn('[ANANTA Training] Paused: configure HF_TOKEN or AI_API_KEY.');return;}
  active=true;
  try {
    const {data:space,error:se}=await supabase.from('assistant_knowledge_spaces').select('id,is_enabled').eq('space_code','primary').maybeSingle();
    if(se) throw se; if(!space?.is_enabled) throw new Error('Primary knowledge space disabled.');
    const [p,l,a]=await Promise.all([
      supabase.from('assistant_training_progress').select('*').eq('space_id',space.id).maybeSingle(),
      supabase.from('assistant_knowledge_entries').select('id,title,content,category').eq('space_id',space.id).eq('status','approved').order('created_at').limit(40),
      supabase.from('assistant_training_attempts').select('lesson_code').eq('space_id',space.id).order('created_at',{ascending:false}).limit(100)
    ]);
    if(p.error||l.error||a.error) throw p.error||l.error||a.error;
    const entries=(l.data||[]).filter(x=>clean(x.content,5000).length>=30);
    if(!entries.length) throw new Error('No approved lessons.');
    const counts=new Map(); for(const x of a.data||[]) counts.set(x.lesson_code,(counts.get(x.lesson_code)||0)+1);
    const lesson=entries.sort((x,y)=>(counts.get(lessonCode(x))||0)-(counts.get(lessonCode(y))||0))[0];
    const current=Math.max(1,Math.min(6,Number(p.data?.current_level||1)));
    const q=await ask([
      {role:'system',content:'You are ANANTA AI teacher. Create one realistic Khmer customer message to test the lesson. Do not reveal answer. Return JSON only: {"question":"...","criteria":["...","..."]}. Provide 3-5 observable criteria; no invented product facts.'},
      {role:'user',content:JSON.stringify({level:current,title:lesson.title,lesson:lesson.content,weak_topics:p.data?.weak_topics||[]})}
    ],380);
    const question=clean(q.question,700), criteria=Array.isArray(q.criteria)?q.criteria.map(x=>clean(x,220)).filter(Boolean).slice(0,5):[];
    if(!question||criteria.length<2) throw new Error('Teacher question invalid.');
    const r=await fetch('http://127.0.0.1:'+port+'/api/assistant/chat',{method:'POST',headers:{'content-type':'application/json','x-ananta-training':'1'},body:JSON.stringify({message:question,language:'km'}),signal:AbortSignal.timeout(35000)});
    const student=await r.json().catch(()=>({}));
    if(!r.ok) throw new Error('ANANTA chat HTTP '+r.status);
    const answer=clean(student.message,1800);
    if(!answer||student.ai_enabled!==true) throw new Error('ANANTA live model answer unavailable; no grade saved.');
    const g=await ask([
      {role:'system',content:'Strictly grade ANANTA against lesson and criteria. Penalize invented price, stock, specs, warranty or shop verification. JSON only: {"score":0,"passed":false,"feedback":"...","weak_topics":["..."]}. Score 0-100, pass >=70. Feedback Khmer.'},
      {role:'user',content:JSON.stringify({lesson:lesson.content,question,criteria,answer})}
    ],360);
    const score=Math.max(0,Math.min(100,Math.round(Number(g.score)||0))), passed=score>=70&&g.passed!==false;
    const weak=Array.isArray(g.weak_topics)?g.weak_topics.map(x=>clean(x,120)).filter(Boolean).slice(0,8):[];
    const {error:ie}=await supabase.from('assistant_training_attempts').insert({space_id:space.id,lesson_code:lessonCode(lesson),level:current,question,expected_criteria:criteria,answer,score,passed,feedback:clean(g.feedback,1200),weak_topics:weak});
    if(ie) throw ie;
    const best=Math.max(Number(p.data?.best_score||0),score), next=Math.max(current,level(best));
    const {error:ue}=await supabase.from('assistant_training_progress').upsert({space_id:space.id,current_level:next,current_level_name:LEVELS[next-1],latest_score:score,best_score:best,lessons_completed:Number(p.data?.lessons_completed||0)+(passed?1:0),tests_passed:Number(p.data?.tests_passed||0)+(passed?1:0),tests_failed:Number(p.data?.tests_failed||0)+(passed?0:1),weak_topics:[...new Set([...weak,...(p.data?.weak_topics||[])])].slice(0,12),last_assessed_at:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:'space_id'});
    if(ue) throw ue;
    console.log('[ANANTA Training] graded:',JSON.stringify({lesson:lesson.title,score,passed}));
  } catch(e){console.error('[ANANTA Training] cycle failed:',clean(e.message,500));}
  finally{active=false;}
}
export function startAnantaTrainingEngine({supabase,port}) {
  if(!supabase||process.env.ANANTA_TRAINING_ENABLED==='false'){console.log('[ANANTA Training] scheduler disabled or Supabase missing.');return ()=>{};}
  if(timer)return ()=>clearInterval(timer);
  const run=()=>cycle({supabase,port});
  const startup=setTimeout(run,60000); timer=setInterval(run,INTERVAL); startup.unref?.();timer.unref?.();
  console.log('[ANANTA Training] scheduler registered; interval hours:',INTERVAL/3600000);
  return ()=>{clearTimeout(startup);clearInterval(timer);timer=null;};
}
