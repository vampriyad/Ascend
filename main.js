const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const CURRICULUM = [
  {
    phase: 'Stage 01',
    title: 'Diagnostic & Goal Setting',
    desc: 'Every student starts with a diagnostic assessment so lessons target what actually needs work.',
    tags: ['Initial assessment', 'Strengths & gaps', 'Target score plan']
  },
  {
    phase: 'Stage 02',
    title: 'Core Lessons',
    desc: 'Structured lessons prepared by the instructor: clear explanations, examples, and guided exercises.',
    tags: ['Lessons', 'Explanations', 'Guided exercises']
  },
  {
    phase: 'Stage 03',
    title: 'Strategy & Technique',
    desc: 'Learn how the test works: question formats, timing, elimination, and how to handle difficult questions.',
    tags: ['Time management', 'Question strategies', 'Elimination']
  },
  {
    phase: 'Stage 04',
    title: 'Practice Cycles',
    desc: 'Apply skills through targeted practice sets and timed exercises that mirror real test conditions.',
    tags: ['Practice sets', 'Timed exercises', 'Realistic questions']
  },
  {
    phase: 'Stage 05',
    title: 'Full Tests & Review',
    desc: 'Complete full practice tests, then break down every mistake to turn weaknesses into points.',
    tags: ['Full practice tests', 'Mistake analysis', 'Feedback']
  },
  {
    phase: 'Stage 06',
    title: 'Final Progression',
    desc: 'Track measurable progress, refine remaining weak areas, and walk into test day prepared.',
    tags: ['Progress tracking', 'Targeted review', 'Test day readiness']
  }
];

const timelineEl = document.getElementById('curriculum-timeline');
if (timelineEl) {
  timelineEl.innerHTML = CURRICULUM.map(m => `
    <div class="timeline-item reveal">
      <span class="phase">${m.phase}</span>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
      <div class="tags">${m.tags.map(t => `<span>${t}</span>`).join('')}</div>
    </div>
  `).join('');
  timelineEl.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

const SAT_RESULTS = [
  { student: 'Credit: Aya B., 3 months of SAT preparation with ASCEND', before: '1080', after: '1340', gain: '+260', fillPercent: 84 },
  { student: 'Credit: Omar E., 2 months of SAT preparation with ASCEND', before: '1210', after: '1430', gain: '+220', fillPercent: 89 }
];

const TOEFL_RESULTS = [
  { student: 'Credit: Salma R., 8 weeks of TOEFL preparation with ASCEND', before: '76', after: '97', gain: '+21', fillPercent: 81 },
  { student: 'Credit: Yassine M., 10 weeks of TOEFL preparation with ASCEND', before: '85', after: '103', gain: '+18', fillPercent: 86 }
];

function renderResults(elId, results, testName, scale, extraClass) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = results.map(r => `
    <div class="result-card ${extraClass} reveal">
      <span class="test-name">${testName}</span>
      <p class="test-scale">${scale}</p>
      <div class="score-row">
        <div class="score-box"><span class="label">Before</span><span class="value">${r.before}</span></div>
        <div class="score-box"><span class="label">After</span><span class="value">${r.after}</span></div>
        <div class="score-box gain"><span class="label">Improvement</span><span class="value">${r.gain}</span></div>
      </div>
      <div class="score-bar"><div class="fill" data-fill="${r.fillPercent}"></div></div>
      <p class="student">${r.student}</p>
    </div>
  `).join('');
  el.querySelectorAll('.reveal').forEach(card => revealObserver.observe(card));
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.fill + '%';
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  el.querySelectorAll('.fill').forEach(f => barObserver.observe(f));
}

renderResults('sat-results', SAT_RESULTS, 'SAT', 'Digital SAT, scored 400 to 1600', '');
renderResults('toefl-results', TOEFL_RESULTS, 'TOEFL iBT', 'TOEFL iBT, scored 0 to 120', 'toefl');

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`[ASCEND] ${data.get('program')}: ${data.get('name')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProgram: ${data.get('program')}\nLocation: ${data.get('location') || 'Not specified'}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:riyadkhairoun@gmail.com?subject=${subject}&body=${body}`;
  });
}

let audioCtx = null;
let audioUnlocked = false;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

window.addEventListener('pointerdown', () => {
  audioUnlocked = true;
  getCtx();
}, { once: true });

function tone(freq, dur, vol, type, delay) {
  const c = getCtx();
  const t = c.currentTime + (delay || 0);
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function playHover() {
  if (!audioUnlocked) return;
  tone(1320, 0.09, 0.022);
}

function playClick() {
  if (!audioUnlocked) return;
  tone(659, 0.11, 0.07);
  tone(988, 0.16, 0.045, 'sine', 0.045);
}

function playTransition() {
  if (!audioUnlocked) return;
  const c = getCtx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(330, t + 0.28);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.05, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.38);
}

document.querySelectorAll('a, button, summary, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', playHover);
  el.addEventListener('pointerdown', playClick);
});

document.querySelectorAll('.program-card, .detail-card, .value-card, .how-step, .method-step, .result-card, .intro-point, .pill, .score-box').forEach(el => {
  el.addEventListener('mouseenter', playHover);
});

document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || link.target === '_blank') return;
  e.preventDefault();
  playTransition();
  document.body.classList.add('leaving');
  setTimeout(() => { window.location.href = href; }, 320);
});

document.body.classList.add('ready');
window.addEventListener('pageshow', () => {
  document.body.classList.remove('leaving');
  document.body.classList.add('ready');
});
