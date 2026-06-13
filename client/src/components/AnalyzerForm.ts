import { API } from '../utils/config.js';

interface FormState {
  file: File | null;
  loading: boolean;
}

const state: FormState = { file: null, loading: false };

function esc(str: string): string {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function AnalyzerForm(): string {
  return `
    <div class="input-section glass">
      <div class="section-header">
        <h2>Analyze Your Resume</h2>
        <p>Upload your resume and paste the job description to get an instant ATS score with AI-powered insights.</p>
      </div>

      <form id="analyzeForm">
        <div class="upload-zone" id="uploadZone">
          <div class="upload-content" id="uploadContent">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p class="upload-text"><strong>Click to upload</strong> or drag and drop</p>
            <p class="upload-hint">PDF or DOCX (max 5MB)</p>
          </div>
          <div class="upload-preview" id="uploadPreview" style="display:${state.file ? 'flex' : 'none'}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span id="fileName">${state.file ? esc(state.file.name) : ''}</span>
            <button type="button" id="removeFile" class="remove-btn">&times;</button>
          </div>
          <input type="file" id="resumeInput" accept=".pdf,.docx" hidden />
        </div>

        <div class="field">
          <label for="jobDescription">Job Description</label>
          <textarea id="jobDescription" rows="5" placeholder="Paste the job description here..." required></textarea>
        </div>

        <button type="submit" id="analyzeBtn" class="btn-primary" ${state.loading ? 'disabled' : ''}>
          <span class="btn-text" style="display:${state.loading ? 'none' : ''}">Analyze Resume</span>
          <span class="btn-loader" style="display:${state.loading ? 'flex' : 'none'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Analyzing...
          </span>
        </button>
      </form>
    </div>
  `;
}

type ResultCallback = (data: unknown) => void;

export function mountAnalyzerForm(container: HTMLElement, onResult: ResultCallback): void {
  const fileInput = container.querySelector<HTMLInputElement>('#resumeInput')!;
  const uploadZone = container.querySelector<HTMLElement>('#uploadZone')!;
  const uploadContent = container.querySelector<HTMLElement>('#uploadContent')!;
  const uploadPreview = container.querySelector<HTMLElement>('#uploadPreview')!;
  const fileName = container.querySelector<HTMLElement>('#fileName')!;
  const removeBtn = container.querySelector<HTMLButtonElement>('#removeFile')!;
  const form = container.querySelector<HTMLFormElement>('#analyzeForm')!;
  const analyzeBtn = container.querySelector<HTMLButtonElement>('#analyzeBtn')!;
  const btnText = analyzeBtn.querySelector<HTMLElement>('.btn-text')!;
  const btnLoader = analyzeBtn.querySelector<HTMLElement>('.btn-loader')!;

  function setFile(file: File): void {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'docx'].includes(ext)) return showError('Please upload a PDF or DOCX file');
    if (file.size > 5 * 1024 * 1024) return showError('File must be under 5MB');
    state.file = file;
    fileName.textContent = file.name;
    uploadContent.style.display = 'none';
    uploadPreview.style.display = 'flex';
    uploadZone.classList.add('has-file');
  }

  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files?.[0]) setFile(fileInput.files[0]);
  });

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    state.file = null;
    uploadContent.style.display = '';
    uploadPreview.style.display = 'none';
    uploadZone.classList.remove('has-file');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = state.file;
    const jobDescription = (document.getElementById('jobDescription') as HTMLTextAreaElement).value.trim();

    if (!file) return showError('Please upload a resume');
    if (!jobDescription) return showError('Please provide a job description');

    state.loading = true;
    analyzeBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';

    const fd = new FormData();
    fd.append('resume', file);
    fd.append('jobDescription', jobDescription);

    try {
      const res = await fetch(API.analyze, { method: 'POST', body: fd });
      const data = await res.json();

      if (res.status === 429) { showError(data.error || 'Rate limit exceeded.'); return; }
      if (res.status === 502) { showError(data.error || 'AI service unavailable.'); return; }
      if (!res.ok) throw new Error(data.error);

      onResult(data);
    } catch (err) {
      showError((err as Error).message);
    } finally {
      state.loading = false;
      analyzeBtn.disabled = false;
      btnText.style.display = '';
      btnLoader.style.display = 'none';
    }
  });
}

function showError(msg: string): void {
  const existing = document.querySelector('.error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
