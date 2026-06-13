import './styles.css';
import { Header } from './components/Header.js';
import { AnalyzerForm, mountAnalyzerForm } from './components/AnalyzerForm.js';
import { Results, displayResults } from './components/Results.js';
import { Footer } from './components/Footer.js';

const app = document.getElementById('app');

function render() {
  app.innerHTML = `
    ${Header()}
    <main>
      ${AnalyzerForm()}
      ${Results()}
    </main>
    ${Footer()}
  `;

  mountAnalyzerForm(document.querySelector('main'), (data) => {
    displayResults(data);
  });
}

render();
