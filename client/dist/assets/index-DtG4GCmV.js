(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=s(o);fetch(o.href,r)}})();function C(){return`
    <header>
      <div class="logo">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <span>Resume<span class="accent">AI</span></span>
      </div>
      <p class="subtitle">Intelligent ATS Resume Analysis</p>
    </header>
  `}const E={brand:{tagline:"AI-powered ATS resume analysis to help you land your dream job."},contact:{email:"contact@resumeai.com",phone:"+91 8449309324",address:"Bulandshahr, India"},services:[{label:"ATS Resume Analysis",href:"#"},{label:"Keyword Optimization",href:"#"}],company:[],copyright:`© ${new Date().getFullYear()} ResumeAI. All rights reserved.`,credit:"Designed & Developed by",creditName:"PANKAJ"},I={analyze:"/api/analyze",health:"/api/health"};let l={file:null,loading:!1};function A(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function M(){return`
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
          <div class="upload-preview" id="uploadPreview" style="display:${l.file?"flex":"none"}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span id="fileName">${l.file?A(l.file.name):""}</span>
            <button type="button" id="removeFile" class="remove-btn">&times;</button>
          </div>
          <input type="file" id="resumeInput" accept=".pdf,.docx" hidden />
        </div>

        <div class="field">
          <label for="jobDescription">Job Description</label>
          <textarea id="jobDescription" rows="5" placeholder="Paste the job description here..." required></textarea>
        </div>

        <button type="submit" id="analyzeBtn" class="btn-primary" ${l.loading?"disabled":""}>
          <span class="btn-text" style="display:${l.loading?"none":""}">Analyze Resume</span>
          <span class="btn-loader" style="display:${l.loading?"flex":"none"}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Analyzing...
          </span>
        </button>
      </form>
    </div>
  `}function F(e,t){const s=e.querySelector("#resumeInput"),i=e.querySelector("#uploadZone"),o=e.querySelector("#uploadContent"),r=e.querySelector("#uploadPreview"),a=e.querySelector("#fileName"),$=e.querySelector("#removeFile"),B=e.querySelector("#analyzeForm"),v=e.querySelector("#analyzeBtn"),g=v.querySelector(".btn-text"),x=v.querySelector(".btn-loader");function w(n){const p=n.name.split(".").pop().toLowerCase();if(!["pdf","docx"].includes(p))return c("Please upload a PDF or DOCX file");if(n.size>5*1024*1024)return c("File must be under 5MB");l.file=n,a.textContent=n.name,o.style.display="none",r.style.display="flex",i.classList.add("has-file")}i.addEventListener("click",()=>s.click()),i.addEventListener("dragover",n=>{n.preventDefault(),i.classList.add("dragover")}),i.addEventListener("dragleave",()=>i.classList.remove("dragover")),i.addEventListener("drop",n=>{n.preventDefault(),i.classList.remove("dragover"),n.dataTransfer.files[0]&&w(n.dataTransfer.files[0])}),s.addEventListener("change",()=>{s.files[0]&&w(s.files[0])}),$.addEventListener("click",n=>{n.stopPropagation(),s.value="",l.file=null,o.style.display="",r.style.display="none",i.classList.remove("has-file")}),B.addEventListener("submit",async n=>{n.preventDefault();const p=l.file,b=document.getElementById("jobDescription").value.trim();if(!p)return c("Please upload a resume");if(!b)return c("Please provide a job description");l.loading=!0,v.disabled=!0,g.style.display="none",x.style.display="flex";const f=new FormData;f.append("resume",p),f.append("jobDescription",b);try{const d=await fetch(I.analyze,{method:"POST",body:f}),m=await d.json();if(d.status===429){c(m.error||"Rate limit exceeded.");return}if(d.status===502){c(m.error||"AI service unavailable.");return}if(!d.ok)throw new Error(m.error);t(m)}catch(d){c(d.message)}finally{l.loading=!1,v.disabled=!1,g.style.display="",x.style.display="none"}})}function c(e){const t=document.querySelector(".error-toast");t&&t.remove();const s=document.createElement("div");s.className="error-toast",s.textContent=e,document.body.appendChild(s),setTimeout(()=>s.remove(),5e3)}function L(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function z(){return`
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
  `}function T(e){const t=document.getElementById("results");t.style.display="block",t.scrollIntoView({behavior:"smooth",block:"start"}),D("atsScore",e.atsScore),u("keywordScore","keywordFill",e.keywordMatch.score),u("skillsScore","skillsFill",e.skillsScore),u("experienceScore","experienceFill",e.experienceScore),u("educationScore","educationFill",e.educationScore),u("formatScore","formatFill",e.formatScore),document.getElementById("summaryText").textContent=e.summary,k("matchedKeywords",e.keywordMatch.matched,"match"),k("missingKeywords",e.keywordMatch.missing,"miss"),h("strengthsList",e.strengths),h("improvementsList",e.improvements),h("suggestionsList",e.suggestions),P(e.sections);const s=document.getElementById("scoreCircle"),i=427.26*(1-e.atsScore/100);setTimeout(()=>{s.style.strokeDashoffset=i},100)}function D(e,t){const s=document.getElementById(e);s.textContent=0;let i=0;const o=Math.max(1,Math.floor(t/30)),r=setInterval(()=>{i+=o,i>=t&&(i=t,clearInterval(r)),s.textContent=i},20)}function u(e,t,s){document.getElementById(e).textContent=s+"%",setTimeout(()=>{document.getElementById(t).style.width=s+"%"},200)}function k(e,t,s){const i=document.getElementById(e);i.innerHTML=t.length?t.map(o=>`<span class="${s}">${L(o)}</span>`).join(""):'<span style="color:var(--text-muted);font-size:13px">None found</span>'}function h(e,t){const s=document.getElementById(e);s.innerHTML=t.length?t.map(i=>`<li>${L(i)}</li>`).join(""):'<li style="color:var(--text-muted)">No data</li>'}function P(e){const t=document.getElementById("sectionsGrid"),s={contact:"Contact Info",summary:"Professional Summary",experience:"Work Experience",education:"Education",skills:"Skills",certifications:"Certifications"};t.innerHTML=Object.entries(e).map(([i,o])=>`<span class="section-tag ${o?"present":"missing"}">${o?"✓":"✗"} ${s[i]||i}</span>`).join("")}const y={email:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',address:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',phone:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'};function S(e,t){return!t||!t.length?"":`
    <div class="footer-col">
      <h4>${e}</h4>
      <ul class="footer-links">
        ${t.map(s=>`<li><a href="${s.href}">${s.label}</a></li>`).join("")}
      </ul>
    </div>
  `}function j(){const{brand:e,contact:t,services:s,company:i,copyright:o,credit:r,creditName:a}=E;return`
    <footer>
      <div class="footer-line"></div>
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <span class="footer-logo">Resume<span class="accent">AI</span></span>
            <p class="footer-desc">${e.tagline}</p>
          </div>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul class="footer-contact">
            <li>${y.email}<a href="mailto:${t.email}">${t.email}</a></li>
            <li>${y.address}<span>${t.address}</span></li>
            <li>${y.phone}<span>${t.phone}</span></li>
          </ul>
        </div>
        ${S("Services",s)}
        ${S("Company",i)}
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <span class="footer-copy">${o}</span>
        <span class="footer-credit">${r} <span class="footer-name">${a}</span></span>
      </div>
    </footer>
  `}const q=document.getElementById("app");function R(){q.innerHTML=`
    ${C()}
    <main>
      ${M()}
      ${z()}
    </main>
    ${j()}
  `,F(document.querySelector("main"),e=>{T(e)})}R();
