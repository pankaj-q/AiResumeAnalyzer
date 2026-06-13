import './styles.css';
import { Header } from './components/Header.js';
import { AnalyzerForm, mountAnalyzerForm } from './components/AnalyzerForm.js';
import { Results, displayResults } from './components/Results.js';
import { Footer } from './components/Footer.js';

const app = document.getElementById('app')!;

function render(): void {
  app.innerHTML = [
    Header(),
    '<main>',
    AnalyzerForm(),
    Results(),
    '</main>',
    Footer(),
  ].join('');

  mountAnalyzerForm(document.querySelector('main')!, (data) => {
    displayResults(data as Parameters<typeof displayResults>[0]);
  });
}

render();
