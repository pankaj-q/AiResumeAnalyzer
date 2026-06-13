const form = document.getElementById('analyzeForm');
const fileInput = document.getElementById('resumeInput');
const uploadZone = document.getElementById('uploadZone');
const uploadContent = document.getElementById('uploadContent');
const uploadPreview = document.getElementById('uploadPreview');
const fileName = document.getElementById('fileName');
const removeBtn = document.getElementById('removeFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const btnText = analyzeBtn.querySelector('.btn-text');
const btnLoader = analyzeBtn.querySelector('.btn-loader');
const results = document.getElementById('results');

uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) setFile(fileInput.files[0]);
});

function setFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf', 'docx'].includes(ext)) {
    return showError('Please upload a PDF or DOCX file');
  }
  if (file.size > 5 * 1024 * 1024) {
    return showError('File must be under 5MB');
  }
  fileName.textContent = file.name;
  uploadContent.style.display = 'none';
  uploadPreview.style.display = 'flex';
  uploadZone.classList.add('has-file');
}

removeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  fileInput.value = '';
  uploadContent.style.display = '';
  uploadPreview.style.display = 'none';
  uploadZone.classList.remove('has-file');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  const jobDescription = document.getElementById('jobDescription').value.trim();

  if (!file) return showError('Please upload a resume');
  if (!jobDescription) return showError('Please provide a job description');

  analyzeBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'flex';

  const fd = new FormData();
  fd.append('resume', file);
  fd.append('jobDescription', jobDescription);

  try {
    const res = await fetch('/api/analyze', { method: 'POST', body: fd });
    const data = await res.json();

    if (res.status === 429) {
      showError(data.error || 'Rate limit exceeded. Please wait before the next analysis.');
      return;
    }

    if (!res.ok) throw new Error(data.error);
    displayResults(data);
  } catch (err) {
    showError(err.message);
  } finally {
    analyzeBtn.disabled = false;
    btnText.style.display = '';
    btnLoader.style.display = 'none';
  }
});

function displayResults(data) {
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
  let current = 0;
  const step = Math.max(1, Math.floor(final / 30));
  const interval = setInterval(() => {
    current += step;
    if (current >= final) { current = final; clearInterval(interval); }
    el.textContent = current;
  }, 20);
}

function animateMetric(valueId, fillId, final) {
  document.getElementById(valueId).textContent = final + '%';
  setTimeout(() => {
    document.getElementById(fillId).style.width = final + '%';
  }, 200);
}

function renderTags(id, items, cls) {
  const container = document.getElementById(id);
  container.innerHTML = items.length
    ? items.map(k => `<span class="${cls}">${esc(k)}</span>`).join('')
    : '<span style="color:var(--text-muted);font-size:13px">None found</span>';
}

function renderList(id, items) {
  const container = document.getElementById(id);
  container.innerHTML = items.length
    ? items.map(i => `<li>${esc(i)}</li>`).join('')
    : '<li style="color:var(--text-muted)">No data</li>';
}

function renderSections(sections) {
  const grid = document.getElementById('sectionsGrid');
  const labels = {
    contact: 'Contact Info',
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    certifications: 'Certifications',
  };
  grid.innerHTML = Object.entries(sections)
    .map(([key, val]) =>
      `<span class="section-tag ${val ? 'present' : 'missing'}">
        ${val ? '✓' : '✗'} ${labels[key] || key}
      </span>`
    )
    .join('');
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showError(msg) {
  const existing = document.querySelector('.error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
