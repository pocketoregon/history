/* ============================================================
   AI Editor - Drop-in script for pocketoregon/history
   Trigger: click the bottom-right corner (50x50px invisible zone)
   Requires: OpenRouter API key (free at openrouter.ai)
             GitHub PAT token (repo scope)
============================================================ */

/* --- Injected styles --- */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
/* ================================================================
     AI EDITOR STYLES
  ================================================================ */
  #aie-trigger {
    position: fixed; bottom: 0; right: 0;
    width: 50px; height: 50px;
    z-index: 999990; cursor: default;
    background: transparent;
  }

  #aie-panel {
    position: fixed; bottom: 24px; right: 24px;
    width: 370px; z-index: 999999;
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 10px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.8);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px; color: #e6edf3;
    display: none; flex-direction: column;
    overflow: hidden;
  }
  #aie-panel.aie-open {
    display: flex;
    animation: aie-in 0.18s ease;
  }
  @keyframes aie-in {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  #aie-header {
    padding: 11px 14px 9px;
    background: #161b22;
    border-bottom: 1px solid #21262d;
    display: flex; align-items: center; justify-content: space-between;
    cursor: move;
    user-select: none;
  }
  #aie-header-title {
    font-size: 11px; font-weight: 700; color: #58a6ff;
    letter-spacing: 1.5px; text-transform: uppercase;
    display: flex; align-items: center; gap: 7px;
  }
  #aie-close {
    background: none; border: none; color: #555;
    cursor: pointer; font-size: 16px; padding: 0; line-height: 1;
    font-family: inherit;
  }
  #aie-close:hover { color: #e6edf3; }

  #aie-body { padding: 13px 14px; display: flex; flex-direction: column; gap: 10px; }

  .aie-label {
    font-size: 10px; font-weight: 700; color: #8b949e;
    text-transform: uppercase; letter-spacing: 0.8px;
    margin-bottom: 3px; display: block;
  }
  .aie-input {
    width: 100%; box-sizing: border-box;
    background: #010409; border: 1px solid #30363d;
    border-radius: 5px; padding: 6px 9px;
    color: #e6edf3; font-size: 11px; font-family: inherit;
    outline: none; transition: border 0.12s;
  }
  .aie-input:focus { border-color: #58a6ff; }
  .aie-input::placeholder { color: #3a3f47; }

  #aie-select-btn {
    width: 100%; padding: 7px 10px;
    background: #161b22; border: 1px solid #30363d;
    border-radius: 5px; color: #c9d1d9;
    font-size: 11px; font-family: inherit;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 6px;
    transition: background 0.12s, border-color 0.12s;
    letter-spacing: 0.3px;
  }
  #aie-select-btn:hover { background: #21262d; border-color: #58a6ff; }
  #aie-select-btn.aie-active { background: #1f3a5f; border-color: #58a6ff; color: #79c0ff; }

  #aie-area-status {
    font-size: 10px; color: #3fb950;
    text-align: center; display: none;
    padding: 3px 0;
  }
  #aie-area-status.aie-visible { display: block; }

  #aie-desc {
    width: 100%; box-sizing: border-box;
    min-height: 72px; resize: vertical;
    background: #010409; border: 1px solid #30363d;
    border-radius: 5px; padding: 7px 9px;
    color: #e6edf3; font-size: 11px; font-family: inherit;
    outline: none; line-height: 1.5;
    transition: border 0.12s;
  }
  #aie-desc:focus { border-color: #58a6ff; }
  #aie-desc::placeholder { color: #3a3f47; }

  #aie-hint { font-size: 10px; color: #484f58; text-align: right; margin-top: -6px; }

  #aie-submit {
    width: 100%; padding: 8px;
    background: #238636; border: 1px solid #2ea043;
    border-radius: 5px; color: #fff;
    font-size: 12px; font-weight: 700;
    font-family: inherit; cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.12s;
  }
  #aie-submit:hover:not(:disabled) { background: #2ea043; }
  #aie-submit:disabled { opacity: 0.45; cursor: not-allowed; }

  #aie-status {
    font-size: 11px; padding: 8px 10px;
    border-radius: 5px; display: none;
    line-height: 1.55; word-break: break-word;
  }
  #aie-status.aie-info    { display:block; background:#1c2d3f; color:#79c0ff; border:1px solid #1f6feb; }
  #aie-status.aie-success { display:block; background:#1a3128; color:#56d364; border:1px solid #238636; }
  #aie-status.aie-error   { display:block; background:#2d1b1b; color:#ff7b72; border:1px solid #da3633; }

  #aie-history-row {
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid #21262d; padding-top: 8px; margin-top: 2px;
  }
  #aie-hist-toggle {
    font-size: 10px; color: #58a6ff; cursor: pointer;
    text-decoration: underline; text-underline-offset: 2px;
    background: none; border: none; font-family: inherit;
    padding: 0; letter-spacing: 0.3px;
  }
  #aie-hist-clear {
    font-size: 10px; color: #484f58; cursor: pointer;
    background: none; border: none; font-family: inherit; padding: 0;
  }
  #aie-hist-clear:hover { color: #ff7b72; }
  #aie-history {
    background: #010409; border: 1px solid #21262d;
    border-radius: 5px; max-height: 110px;
    overflow-y: auto; font-size: 10px; color: #8b949e;
    padding: 7px 9px; display: none; line-height: 1.6;
  }
  #aie-history.aie-open { display: block; }
  #aie-history .aie-hentry { margin-bottom: 4px; }
  #aie-history .aie-hentry:last-child { margin-bottom: 0; }
  #aie-history .aie-hnum { color: #58a6ff; font-weight: 700; }
  #aie-history .aie-htime { color: #484f58; }

  /* Selection overlay */
  #aie-overlay {
    position: fixed; inset: 0;
    z-index: 999997; cursor: crosshair;
    display: none;
  }
  #aie-overlay.aie-active { display: block; }

  #aie-selbox {
    position: fixed;
    border: 2px solid #4d94ff;
    background: rgba(77,148,255,0.15);
    pointer-events: none; display: none;
    z-index: 999998;
    box-shadow: 0 0 0 1px rgba(77,148,255,0.3);
  }

  #aie-selhint {
    position: fixed; top: 16px; left: 50%;
    transform: translateX(-50%);
    background: #0d1117; border: 1px solid #30363d;
    border-radius: 6px; padding: 6px 14px;
    font-size: 11px; color: #79c0ff;
    font-family: ui-monospace, monospace;
    pointer-events: none; z-index: 999999;
    display: none; letter-spacing: 0.3px;
  }
  #aie-selhint.aie-active { display: block; }
  `;
  document.head.appendChild(style);
})();

/* --- Editor DOM --- */
(function injectDOM() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
<!-- -- AI EDITOR DOM --------------------------------------- -->
<div id="aie-trigger" title=""></div>

<div id="aie-panel">
  <div id="aie-header">
    <div id="aie-header-title">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      </svg>
      AI Editor
    </div>
    <button id="aie-close">x</button>
  </div>
  <div id="aie-body">

    <div>
      <span class="aie-label">GitHub PAT Token</span>
      <input class="aie-input" id="aie-pat" type="password"
             placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off" spellcheck="false" />
    </div>

    <div>
      <span class="aie-label">Repository</span>
      <input class="aie-input" id="aie-repo" type="text"
             value="pocketoregon/history" spellcheck="false" />
    </div>

    <div>
      <span class="aie-label">GitHub Models Token</span>
      <input class="aie-input" id="aie-orkey" type="password"
             placeholder="ghp_xxxx (same as PAT or separate Models token)" autocomplete="off" spellcheck="false" />
    </div>

    <div>
      <span class="aie-label">Select Area to Edit</span>
      <button id="aie-select-btn">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 1h4v1.5H2.5v1.5H1V1zm10 0h4v3h-1.5V2.5H11V1zM1 11h1.5v1.5H4V14H1v-3zm12.5 1.5V11H15v3h-3v-1.5h1.5zM5.5 1H7v1.5H5.5V1zm3 0H10v1.5H8.5V1zM1 5.5h1.5V7H1V5.5zm0 3H1.5V10H1V8.5zm13-3H15V7h-1.5V5.5zm0 3H15V10h-1.5V8.5zM5.5 13.5H7V15H5.5v-1.5zm3 0H10V15H8.5v-1.5z"/>
        </svg>
        Click &amp; Drag to Select Area
      </button>
      <div id="aie-area-status">+ Area selected</div>
    </div>

    <div>
      <span class="aie-label">Describe the Change</span>
      <textarea id="aie-desc" placeholder="e.g. Change the header title to 'My Timeline' and make it glow green"></textarea>
      <div id="aie-hint">Ctrl+Enter to submit</div>
    </div>

    <div id="aie-status"></div>

    <button id="aie-submit">>> Apply Change with AI</button>

    <div id="aie-history-row">
      <button id="aie-hist-toggle">Show change history</button>
      <button id="aie-hist-clear">Clear history</button>
    </div>
    <div id="aie-history"></div>

  </div>
</div>

<!-- Selection UI -->
<div id="aie-overlay"></div>
<div id="aie-selbox"></div>
<div id="aie-selhint">Drag to select area - release to confirm</div>
<!-- -- END AI EDITOR DOM ------------------------------------ -->

<!-- Selection UI -->
<div id="aie-overlay"></div>
<div id="aie-selbox"></div>
<div id="aie-selhint">Drag to select area - release to confirm</div>
  `;
  document.body.appendChild(wrapper);
})();

/* --- Editor Logic --- */
/* ============================================================
   AI EDITOR SCRIPT
============================================================ */
(function () {
  'use strict';

  const REPO_DEFAULT    = 'pocketoregon/history';
  const FILE_PATH       = 'index.html';
  const AI_URL  = 'https://corsproxy.io/?url=https://models.inference.ai.azure.com/chat/completions';
  const AI_MODEL = 'gpt-4o-mini';

  const STORAGE_CTX  = 'aie_ctx';
  const STORAGE_PAT  = 'aie_pat';
  const STORAGE_REPO = 'aie_repo';
  const STORAGE_OR   = 'aie_orkey';

  // -- Persistence ------------------------------------------
  const loadCtx  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_CTX) || '[]'); } catch { return []; } };
  const saveCtx  = v  => localStorage.setItem(STORAGE_CTX, JSON.stringify(v.slice(-10)));
  const loadPat  = () => localStorage.getItem(STORAGE_PAT)  || '';
  const savePat  = v  => localStorage.setItem(STORAGE_PAT,  v);
  const loadRepo = () => localStorage.getItem(STORAGE_REPO) || REPO_DEFAULT;
  const saveRepo = v  => localStorage.setItem(STORAGE_REPO, v);
  const loadOR   = () => localStorage.getItem(STORAGE_OR)   || '';
  const saveOR   = v  => localStorage.setItem(STORAGE_OR,   v);

  // -- DOM refs ---------------------------------------------
  const panel      = document.getElementById('aie-panel');
  const patInput   = document.getElementById('aie-pat');
  const repoInput  = document.getElementById('aie-repo');
  const orkeyInput = document.getElementById('aie-orkey');
  const selectBtn  = document.getElementById('aie-select-btn');
  const areaStatus = document.getElementById('aie-area-status');
  const descInput  = document.getElementById('aie-desc');
  const submitBtn  = document.getElementById('aie-submit');
  const statusEl   = document.getElementById('aie-status');
  const histToggle = document.getElementById('aie-hist-toggle');
  const histClear  = document.getElementById('aie-hist-clear');
  const histEl     = document.getElementById('aie-history');
  const overlay    = document.getElementById('aie-overlay');
  const selbox     = document.getElementById('aie-selbox');
  const selhint    = document.getElementById('aie-selhint');

  // -- State ------------------------------------------------
  let capturedArea  = null;
  let selStart      = null;
  let isDraggingPanel = false;
  let dragOffX = 0, dragOffY = 0;

  // -- Init values ------------------------------------------
  patInput.value  = loadPat();
  repoInput.value = loadRepo();
  orkeyInput.value = loadOR();

  // -- Panel open/close -------------------------------------
  document.getElementById('aie-trigger').addEventListener('click', openPanel);
  document.getElementById('aie-close').addEventListener('click', closePanel);

  function openPanel() {
    panel.classList.add('aie-open');
    renderHistory();
  }
  function closePanel() {
    panel.classList.remove('aie-open');
  }

  // -- Draggable panel --------------------------------------
  const header = document.getElementById('aie-header');
  header.addEventListener('mousedown', e => {
    isDraggingPanel = true;
    const rect = panel.getBoundingClientRect();
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;
    panel.style.bottom = 'auto';
    panel.style.right  = 'auto';
    panel.style.left   = rect.left + 'px';
    panel.style.top    = rect.top  + 'px';
  });
  window.addEventListener('mousemove', e => {
    if (!isDraggingPanel) return;
    panel.style.left = (e.clientX - dragOffX) + 'px';
    panel.style.top  = (e.clientY - dragOffY) + 'px';
  });
  window.addEventListener('mouseup', () => isDraggingPanel = false);

  // -- Save PAT / Repo on blur -------------------------------
  patInput.addEventListener('blur',  () => savePat(patInput.value.trim()));
  repoInput.addEventListener('blur', () => saveRepo(repoInput.value.trim()));
  orkeyInput.addEventListener('blur', () => saveOR(orkeyInput.value.trim()));

  // -- Area selection ---------------------------------------
  selectBtn.addEventListener('click', startSelect);

  function startSelect() {
    panel.style.visibility = 'hidden';
    selectBtn.classList.add('aie-active');
    overlay.classList.add('aie-active');
    selhint.classList.add('aie-active');
    selStart = null;

    overlay.addEventListener('mousedown',  onDown);
    overlay.addEventListener('mousemove',  onMove);
    overlay.addEventListener('mouseup',    onUp);
    overlay.addEventListener('touchstart', onTDown, { passive: false });
    overlay.addEventListener('touchmove',  onTMove, { passive: false });
    overlay.addEventListener('touchend',   onTUp);
  }

  function clientXY(e) {
    return e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX,           y: e.clientY };
  }

  function onDown(e) { selStart = clientXY(e); selbox.style.display = 'block'; }
  function onTDown(e) { e.preventDefault(); onDown(e); }

  function onMove(e) {
    if (!selStart) return;
    const cur = clientXY(e);
    const x = Math.min(selStart.x, cur.x), y = Math.min(selStart.y, cur.y);
    const w = Math.abs(cur.x - selStart.x), h = Math.abs(cur.y - selStart.y);
    Object.assign(selbox.style, { left: x+'px', top: y+'px', width: w+'px', height: h+'px' });
  }
  function onTMove(e) { e.preventDefault(); onMove(e); }

  function onUp(e) {
    if (!selStart) return;
    const cur = clientXY(e);
    const x = Math.min(selStart.x, cur.x), y = Math.min(selStart.y, cur.y);
    const w = Math.abs(cur.x - selStart.x), h = Math.abs(cur.y - selStart.y);

    capturedArea = {
      clientX: x, clientY: y, w, h,
      pageX: x + window.scrollX, pageY: y + window.scrollY
    };

    // cleanup
    overlay.classList.remove('aie-active');
    selhint.classList.remove('aie-active');
    selbox.style.display = 'none';
    selectBtn.classList.remove('aie-active');
    panel.style.visibility = '';
    selStart = null;
    overlay.removeEventListener('mousedown',  onDown);
    overlay.removeEventListener('mousemove',  onMove);
    overlay.removeEventListener('mouseup',    onUp);
    overlay.removeEventListener('touchstart', onTDown);
    overlay.removeEventListener('touchmove',  onTMove);
    overlay.removeEventListener('touchend',   onTUp);

    areaStatus.textContent = `+ Area selected - ${Math.round(w)}-${Math.round(h)}px`;
    areaStatus.classList.add('aie-visible');
  }
  function onTUp(e) { onUp(e); }

  // -- Submit -----------------------------------------------
  submitBtn.addEventListener('click', handleSubmit);
  descInput.addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); });

  async function handleSubmit() {
    const pat   = patInput.value.trim();
    const repo  = repoInput.value.trim();
    const orkey = orkeyInput.value.trim();
    const desc  = descInput.value.trim();

    if (!pat)   return setStatus('aie-error', '! Enter your GitHub PAT token.');
    if (!repo)  return setStatus('aie-error', '! Enter your repository (user/repo).');
    if (!orkey) return setStatus('aie-error', '! Enter your GitHub Models token.');
    if (!desc)  return setStatus('aie-error', '! Describe the change you want.');

    savePat(pat); saveRepo(repo); saveOR(orkey);
    submitBtn.disabled = true;

    try {
      setStatus('aie-info', '[1/5] Capturing screenshot-');
      await loadH2C();
      const b64 = await captureScreen();

      setStatus('aie-info', '[2/5] Fetching current index.html from GitHub-');
      const { content, sha } = await ghFetch(pat, repo);

      setStatus('aie-info', '[3/5] Asking AI to edit the page-');
      const newHtml = await callAI(orkey, content, desc, b64);

      setStatus('aie-info', '[4/5] Committing changes-');
      await ghCommit(pat, repo, newHtml, sha, desc);

      // Save context
      const ctx = loadCtx();
      ctx.push({ desc, ts: new Date().toLocaleString(), area: capturedArea ? `${Math.round(capturedArea.w)}-${Math.round(capturedArea.h)}` : 'full' });
      saveCtx(ctx);
      renderHistory();

      // Reset area
      capturedArea = null;
      areaStatus.classList.remove('aie-visible');
      descInput.value = '';
      submitBtn.disabled = false;

      setStatus('aie-info', '[5/5] Waiting 60s for GitHub Pages to deploy-');
      await new Promise(r => setTimeout(r, 60000));
      setStatus('aie-success', '>> Done! Reload the page to see your changes.');

    } catch (err) {
      setStatus('aie-error', 'ERR: ' + (err.message || 'Something went wrong.'));
      submitBtn.disabled = false;
    }
  }

  function setStatus(cls, msg) {
    statusEl.className = 'aie-status ' + cls;
    statusEl.textContent = msg;
    statusEl.style.display = 'block';
  }

  // -- History ----------------------------------------------
  histToggle.addEventListener('click', () => {
    histEl.classList.toggle('aie-open');
    histToggle.textContent = histEl.classList.contains('aie-open') ? 'Hide history' : 'Show change history';
  });
  histClear.addEventListener('click', () => {
    if (confirm('Clear all change history?')) { saveCtx([]); renderHistory(); }
  });

  function renderHistory() {
    const ctx = loadCtx();
    if (!ctx.length) {
      histEl.innerHTML = '<div style="color:#3a3f47">No changes recorded yet.</div>';
      return;
    }
    histEl.innerHTML = ctx.map((c, i) =>
      `<div class="aie-hentry"><span class="aie-hnum">#${i+1}</span> ${c.desc} <span class="aie-htime">(${c.ts})</span></div>`
    ).join('');
  }

  // -- html2canvas loader -----------------------------------
  function loadH2C() {
    return new Promise(resolve => {
      if (window.html2canvas) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  async function captureScreen() {
    const canvas = await html2canvas(document.body, {
      useCORS: true, allowTaint: true, scale: 0.7, logging: false
    });
    // Draw blue highlight over selected area
    if (capturedArea) {
      const ctx = canvas.getContext('2d');
      const sx = canvas.width  / window.innerWidth;
      const sy = canvas.height / window.innerHeight;
      ctx.fillStyle   = 'rgba(77,148,255,0.28)';
      ctx.strokeStyle = '#4d94ff';
      ctx.lineWidth   = 3;
      const rx = capturedArea.clientX * sx, ry = capturedArea.clientY * sy;
      const rw = capturedArea.w * sx,       rh = capturedArea.h * sy;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);
    }
    return canvas.toDataURL('image/jpeg', 0.4).split(',')[1];
  }

  // -- Strip AI editor block from HTML before sending to AI -
  function stripEditorBlock(html) {
    // Remove everything between the AI EDITOR DOM and END AI EDITOR DOM comments
    html = html.replace(/<!--\s*--\s*AI EDITOR DOM[\s\S]*?--\s*END AI EDITOR DOM\s*-->/gi, '<!-- AI_EDITOR_PLACEHOLDER -->');
    // Remove AI EDITOR STYLES block (between the two style comment markers)
    html = html.replace(/\/\*\s*={10,}\s*\n\s*AI EDITOR STYLES[\s\S]*?={10,}\s*\*\//gi, '/* AI_EDITOR_STYLES_PLACEHOLDER */');
    // Remove AI EDITOR SCRIPT block
    html = html.replace(/\/\*\s*={10,}\s*\n\s*AI EDITOR SCRIPT[\s\S]*?\}\)\(\);/gi, '/* AI_EDITOR_SCRIPT_PLACEHOLDER */');
    return html;
  }

  // -- Re-inject editor into AI-returned HTML ---------------
  function reInjectEditor(originalHtml, aiHtml) {
    // Extract the three editor blocks from the original file
    const domMatch   = originalHtml.match(/(<!--\s*--\s*AI EDITOR DOM[\s\S]*?--\s*END AI EDITOR DOM\s*-->)/i);
    const styleMatch = originalHtml.match(/(\/\*\s*={10,}\s*\n\s*AI EDITOR STYLES[\s\S]*?={10,}\s*\*\/)/i);
    const scriptMatch= originalHtml.match(/(\/\*\s*={10,}\s*\n\s*AI EDITOR SCRIPT[\s\S]*?\}\)\(\);)/i);

    let out = aiHtml;
    if (domMatch)    out = out.replace('<!-- AI_EDITOR_PLACEHOLDER -->', domMatch[1]);
    if (styleMatch)  out = out.replace('/* AI_EDITOR_STYLES_PLACEHOLDER */', styleMatch[1]);
    if (scriptMatch) out = out.replace('/* AI_EDITOR_SCRIPT_PLACEHOLDER */', scriptMatch[1]);

    // Fallback: if placeholders weren't preserved by AI, append editor before </body>
    if (!domMatch && originalHtml.includes('id="aie-panel"')) {
      const editorDom = originalHtml.match(/<!-- -- AI EDITOR DOM[\s\S]*?-- END AI EDITOR DOM --/i)?.[0] || '';
      if (editorDom) out = out.replace('</body>', editorDom + '\n</body>');
    }
    return out;
  }

  // -- GitHub API -------------------------------------------
  async function ghFetch(pat, repo) {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error(`GitHub fetch: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return { content: atob(data.content.replace(/\n/g, '')), sha: data.sha };
  }

  async function ghCommit(pat, repo, html, sha, desc) {
    const encoded = btoa(unescape(encodeURIComponent(html)));
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `AI Editor: ${desc.slice(0, 72)}`, content: encoded, sha })
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(`GitHub commit: ${res.status} - ${e.message || res.statusText}`);
    }
  }

  // -- AI call (GitHub Models) ------------------------------
  async function callAI(orkey, currentHtml, description, b64) {
    // index.html is clean - editor lives in ai-editor.js separately
    const strippedHtml = currentHtml;

    const prevChanges = loadCtx();
    const ctxNote = prevChanges.length
      ? 'Previous changes already applied to this file:\n' +
        prevChanges.map((c,i) => `${i+1}. [${c.ts}] ${c.desc}`).join('\n')
      : 'No previous changes.';

    const system = `You are an expert web developer. You receive the full HTML source of a page and a change request.
Return ONLY the complete updated HTML file - no markdown fences, no explanation, no preamble.
The file must start with <!DOCTYPE html> or <html.
Preserve all existing functionality unless explicitly asked to change it.
The blue-highlighted region in the screenshot shows the area to focus on.
The HTML will contain placeholder comments like <!-- AI_EDITOR_PLACEHOLDER --> - leave these exactly as-is, do not remove or change them.

Context of prior edits (do NOT undo these):
${ctxNote}`;

    const userContent = [
      { type: 'text', text: `Current HTML:\n\`\`\`html\n${strippedHtml}\n\`\`\`\n\nRequested change: ${description}\n\nReturn the complete updated HTML only.` },
      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } }
    ];

    const res = await fetch(AI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${orkey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'system', content: system }, { role: 'user', content: userContent }],
        max_tokens: 8000,
        temperature: 0.15
      })
    });

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(`AI API: ${res.status} - ${e.error?.message || res.statusText}`);
    }

    const data = await res.json();
    let html = (data.choices?.[0]?.message?.content || '').trim();
    html = html.replace(/^```html?\s*/i, '').replace(/```\s*$/i, '').trim();
    if (!html.toLowerCase().startsWith('<!doctype') && !html.toLowerCase().startsWith('<html'))
      throw new Error('AI returned invalid content - not a valid HTML document.');
    return html;
  }

})();
