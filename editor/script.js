const source = document.getElementById('source');
const theme = document.getElementById('theme');
const btnImport = document.getElementById('btn-import');
const btnExport = document.getElementById('btn-export');
const blocks = document.getElementById('blocks');
const preview = document.getElementById('preview');

let blockData = []; // { id, html }

function uid(){ return Math.random().toString(36).slice(2,9); }

function parseSections(html){
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // เอาเฉพาะ <section> ทั้งหมด ถ้าไม่เจอ ให้ยกทั้ง <body>
  let secs = Array.from(doc.querySelectorAll('section'));
  if(secs.length === 0){
    secs = [doc.body];
  }
  return secs.map(s => s.outerHTML);
}

function renderBlocks(){
  blocks.innerHTML = '';
  blockData.forEach((b, idx) => {
    const el = document.createElement('div');
    el.className = 'block'; el.draggable = true;
    el.dataset.id = b.id;
    el.innerHTML = `
      <header>
        <strong>บล็อก #${idx+1}</strong>
        <div class="btns">
          <button data-act="up">↑</button>
          <button data-act="down">↓</button>
          <button data-act="del">ลบ</button>
        </div>
      </header>
      <textarea>${b.html}</textarea>
    `;
    // drag
    el.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', b.id);
    });
    el.addEventListener('dragover', e=> e.preventDefault());
    el.addEventListener('drop', e=>{
      e.preventDefault();
      const from = e.dataTransfer.getData('text/plain');
      const to = b.id;
      const a = blockData.findIndex(x=>x.id===from);
      const c = blockData.findIndex(x=>x.id===to);
      const [m] = blockData.splice(a,1);
      blockData.splice(c,0,m);
      renderBlocks(); renderPreview();
    });

    // buttons
    el.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.act;
        const i = blockData.findIndex(x=>x.id===b.id);
        if(act==='up' && i>0){ const [m]=blockData.splice(i,1); blockData.splice(i-1,0,m); }
        if(act==='down' && i<blockData.length-1){ const [m]=blockData.splice(i,1); blockData.splice(i+1,0,m); }
        if(act==='del'){ blockData.splice(i,1); }
        renderBlocks(); renderPreview();
      });
    });

    // edit textarea
    el.querySelector('textarea').addEventListener('input', (e)=>{
      b.html = e.target.value;
      renderPreview();
    });

    blocks.appendChild(el);
  });
}

function assembleHTML(){
  const inner = blockData.map(b=>b.html).join('\n\n');
  let shell = theme.value.trim();
  if(!shell){
    shell = `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Export</title><link rel="stylesheet" href="https://unpkg.com/sakura.css/css/sakura.css"></head><body><header><h1 style="margin:0">ตัวอย่างเว็บไซต์</h1></header><main></main><footer style="margin-top:1rem;color:#64748b">© 2025 Circlecamp</footer></body></html>`;
  }
  // inject after </header>
  const m = shell.match(/<\/header>/i);
  if(m){
    const idx = m.index + m[0].length;
    return shell.slice(0, idx) + '\n' + inner + '\n' + shell.slice(idx);
  }
  // else before </body>
  const n = shell.match(/<\/body>/i);
  if(n){
    const idy = n.index;
    return shell.slice(0, idy) + '\n' + inner + '\n' + shell.slice(idy);
  }
  return shell + inner;
}

function renderPreview(){
  const html = assembleHTML();
  preview.srcdoc = html;
}

btnImport.addEventListener('click', ()=>{
  const html = source.value.trim();
  if(!html){ alert('ยังไม่มี HTML ในกล่องซ้าย'); return; }
  const secs = parseSections(html);
  blockData = secs.map(s => ({ id: uid(), html: s }));
  renderBlocks();
  renderPreview();
});

btnExport.addEventListener('click', ()=>{
  const out = assembleHTML();
  const blob = new Blob([out], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'exported.html';
  a.click();
  URL.revokeObjectURL(url);
});
