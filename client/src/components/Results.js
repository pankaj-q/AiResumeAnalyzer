function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function Results() {
  return `
    <div id="results" style="display:none">
      <div class="score-section glass">
        <div class="score-header">
          <h2>ATS Analysis Results</h2>
          <div class="score-ring">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
              <circle cx="80" cy="80" r="68" fill="none" stroke="url(#scoreGrad)" stroke-width="10" stroke-linecap="round" id="scoreCircle" stroke-dasharray="427.26" stroke-dashoffset="427.26" transform="rotate(-90 80 80)"/>
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#a855f7"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="score-value">
              <span id="atsScore">0</span>
              <small>/100</small>
            </div>
          </div>
        </div>

        <div class="score-summary">
          <p id="summaryText"></p>
        </div>

        <div class="metrics-grid">
          <div class="metric"><div class="metric-label">Keyword Match</div><div class="metric-bar"><div class="metric-fill" id="keywordFill"></div></div><span class="metric-value" id="keywordScore">0</span></div>
          <div class="metric"><div class="metric-label">Skills Relevance</div><div class="metric-bar"><div class="metric-fill" id="skillsFill"></div></div><span class="metric-value" id="skillsScore">0</span></div>
          <div class="metric"><div class="metric-label">Experience</div><div class="metric-bar"><div class="metric-fill" id="experienceFill"></div></div><span class="metric-value" id="experienceScore">0</span></div>
          <div class="metric"><div class="metric-label">Education</div><div class="metric-bar"><div class="metric-fill" id="educationFill"></div></div><span class="metric-value" id="educationScore">0</span></div>
          <div class="metric"><div class="metric-label">Format & Structure</div><div class="metric-bar"><div class="metric-fill" id="formatFill"></div></div><span class="metric-value" id="formatScore">0</span></div>
        </div>

        <div class="results-grid">
          <div class="result-card">
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Keywords Matched</h3>
            <div class="tag-list" id="matchedKeywords"></div>
          </div>
          <div class="result-card">
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Missing Keywords</h3>
            <div class="tag-list" id="missingKeywords"></div>
          </div>
          <div class="result-card">
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Strengths</h3>
            <ul id="strengthsList"></ul>
          </div>
          <div class="result-card">
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Improvements</h3>
            <ul id="improvementsList"></ul>
          </div>
        </div>

        <div class="suggestions glass-dark">
          <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Actionable Suggestions</h3>
          <ul id="suggestionsList"></ul>
        </div>
      </div>

      <div class="sections-check glass">
        <h3>Resume Sections</h3>
        <div class="sections-grid" id="sectionsGrid"></div>
      </div>
    </div>
  `;
}

export function displayResults(data) {
  const results = document.getElementById('results');
  results.style.display = 'block';
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });

  animateScore('atsScore', data.atsScore);
  animateMetric('keywordScore', 'keywordFill', data.keywordMatch.score);
  animateMetric('skillsScore', 'skillsFill', data.skillsScore);
  animateMetric('experienceScore', 'experienceFill', data.experienceScore);
  animateMetric('educationScore', 'educationFill', data.educationScore);
  animateMetric('formatScore', 'formatFill', data.formatScore);

  document.getElementById('summaryText').textContent = data.summary;

  renderTags('matchedKeywords', data.keywordMatch.matched, 'match');
  renderTags('missingKeywords', data.keywordMatch.missing, 'miss');

  renderList('strengthsList', data.strengths);
  renderList('improvementsList', data.improvements);
  renderList('suggestionsList', data.suggestions);

  renderSections(data.sections);

  const circle = document.getElementById('scoreCircle');
  const offset = 427.26 * (1 - data.atsScore / 100);
  setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
}

function animateScore(id, final) {
  const el = document.getElementById(id);
  el.textContent = 0;
  let cur = 0;
  const step = Math.max(1, Math.floor(final / 30));
  const iv = setInterval(() => {
    cur += step;
    if (cur >= final) { cur = final; clearInterval(iv); }
    el.textContent = cur;
  }, 20);
}

function animateMetric(valueId, fillId, final) {
  document.getElementById(valueId).textContent = final + '%';
  setTimeout(() => { document.getElementById(fillId).style.width = final + '%'; }, 200);
}

function renderTags(id, items, cls) {
  const c = document.getElementById(id);
  c.innerHTML = items.length
    ? items.map(k => `<span class="${cls}">${esc(k)}</span>`).join('')
    : '<span style="color:var(--text-muted);font-size:13px">None found</span>';
}

function renderList(id, items) {
  const c = document.getElementById(id);
  c.innerHTML = items.length
    ? items.map(i => `<li>${esc(i)}</li>`).join('')
    : '<li style="color:var(--text-muted)">No data</li>';
}

function renderSections(sections) {
  const grid = document.getElementById('sectionsGrid');
  const labels = {
    contact: 'Contact Info', summary: 'Professional Summary',
    experience: 'Work Experience', education: 'Education',
    skills: 'Skills', certifications: 'Certifications',
  };
  grid.innerHTML = Object.entries(sections)
    .map(([k, v]) =>
      `<span class="section-tag ${v ? 'present' : 'missing'}">${v ? '✓' : '✗'} ${labels[k] || k}</span>`
    ).join('');
}
