(function(){
  const $=id=>document.getElementById(id);
  const KEY='taskflow.tasks';
  let tasks=[],filter='all';
  try{tasks=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){tasks=[]}
  if(!Array.isArray(tasks))tasks=[];
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(tasks))}catch(e){}};

  $('today').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});

  const THEME='taskflow.theme';
  const root=document.documentElement;
  function setTheme(t){
    root.dataset.theme=t;
    $('themeBtn').textContent=t==='dark'?'☀':'☾';
    try{localStorage.setItem(THEME,t)}catch(e){}
  }
  let saved='dark';
  try{saved=localStorage.getItem(THEME)==='light'?'light':'dark'}catch(e){}
  setTheme(saved);
  $('themeBtn').onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark');

  $('taskForm').onsubmit=e=>{
    e.preventDefault();
    const text=$('taskInput').value.trim();
    if(!text)return;
    tasks.unshift({id:Date.now(),text,done:false});
    $('taskInput').value='';
    save();render();
  };

  document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{
    filter=b.dataset.filter;
    document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));
    render();
  });

  $('clearCompleted').onclick=()=>{tasks=tasks.filter(t=>!t.done);save();render()};

  function render(){
    const list=$('taskList');list.replaceChildren();
    const items=tasks.filter(t=>filter==='all'||(filter==='active'?!t.done:t.done));
    items.forEach(t=>{
      const li=document.createElement('li');li.className='task'+(t.done?' done':'');
      const cb=document.createElement('input');cb.type='checkbox';cb.checked=t.done;cb.setAttribute('aria-label','Mark complete');
      cb.onchange=()=>{t.done=cb.checked;save();render()};
      const tx=document.createElement('span');tx.className='task-text';tx.textContent=t.text;
      const del=document.createElement('button');del.type='button';del.className='del';del.textContent='✕';del.title='Delete task';del.setAttribute('aria-label','Delete task');
      del.onclick=()=>{tasks=tasks.filter(x=>x!==t);save();render()};
      li.append(cb,tx,del);list.append(li);
    });
    const total=tasks.length,comp=tasks.filter(t=>t.done).length,rem=total-comp;
    $('totalCount').textContent=total;
    $('completedCount').textContent=comp;
    $('remainingCount').textContent=rem;
    $('taskBadge').textContent=total+(total===1?' task':' tasks');
    $('footerCount').textContent=rem+(rem===1?' task remaining':' tasks remaining');
    $('emptyState').hidden=items.length>0;
  }
  render();
})();