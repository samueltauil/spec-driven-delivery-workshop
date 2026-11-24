// Builds the workshop diagrams. Run `npm install` once, then `npm run build`.
// Each diagram is drawn as SVG and rendered to a 2x PNG in the target exercises' .github/images folders.
import octicons from '@primer/octicons';
import { Resvg } from '@resvg/resvg-js';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workshop = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const EX = {
  e1: 'spec-driven-trace-the-loop',
  e2: 'spec-driven-find-missing-rules',
  e3: 'spec-driven-deliver-a-behavior',
  e4: 'spec-driven-first-spec',
};

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Cascadia Mono', Consolas, 'Courier New', monospace";
const INK = '#1f2328';
const MUTED = '#59636e';
const LINE = '#d1d9e0';
const P = {
  blue: { fg: '#0969da', bg: '#ddf4ff' },
  purple: { fg: '#8250df', bg: '#fbefff' },
  green: { fg: '#1a7f37', bg: '#dafbe1' },
  orange: { fg: '#bc4c00', bg: '#fff1e5' },
  red: { fg: '#cf222e', bg: '#ffebe9' },
  gray: { fg: '#59636e', bg: '#f6f8fa' },
  yellow: { fg: '#9a6700', bg: '#fff8c5' },
};

// Load only the fonts the diagrams use: faster than scanning every system font, and identical output on any Windows machine.
const FONT_DIR = process.env.DIAGRAM_FONT_DIR || 'C:/Windows/Fonts';
const RESVG_FONTS = {
  loadSystemFonts: false,
  fontFiles: ['segoeui.ttf', 'seguisb.ttf', 'segoeuib.ttf', 'seguisym.ttf', 'consola.ttf', 'consolab.ttf'].map((f) => `${FONT_DIR}/${f}`),
  defaultFontFamily: 'Segoe UI',
};
const measured = new Map();

// Exact rendered width of a single line of text, measured with the same renderer that draws the PNGs.
function measure(value, size, weight = 400, family = FONT) {
  const key = `${value}|${size}|${weight}|${family}`;
  if (!measured.has(key)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="200"><text x="0" y="100" font-family="${family}" font-size="${size}" font-weight="${weight}">${esc(value)}</text></svg>`;
    const box = new Resvg(svg, { font: RESVG_FONTS }).getBBox();
    measured.set(key, box ? box.x + box.width : value.length * size * 0.55);
  }
  return measured.get(key);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function greedy(words, width, size, weight) {
  const lines = [];
  let cur = '';
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && measure(next, size, weight) > width) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// Wrap to the fewest lines that fit, then narrow the measure so lines are even and no word is left alone.
function wrap(text, width, size, bold = false) {
  const words = String(text).split(' ');
  const weight = bold ? 700 : 400;
  let best = greedy(words, width, size, weight);
  if (best.length < 2) return best;
  let lo = width * 0.4;
  let hi = width;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    const attempt = greedy(words, mid, size, weight);
    if (attempt.length === best.length) {
      best = attempt;
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return best;
}

function text(x, y, value, { size = 18, weight = 400, fill = INK, family = FONT, anchor = 'start' } = {}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`;
}

function lines(x, y, values, opts = {}) {
  const lh = (opts.size ?? 18) * (opts.lh ?? 1.35);
  return values.map((v, i) => text(x, y + i * lh, v, opts)).join('');
}

function frame(w, h, title, subtitle, body) {
  const markers = Object.entries({ ...P, ink: { fg: MUTED } })
    .map(([k, c]) => `<marker id="arrow-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c.fg}"/></marker>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>${markers}</defs>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="18" fill="#ffffff" stroke="${LINE}" stroke-width="2"/>
${text(40, 56, title, { size: 28, weight: 700 })}
${subtitle ? text(40, 88, subtitle, { size: 18, fill: MUTED }) : ''}
${body}
</svg>`;
}

function rect(x, y, w, h, { fill = '#ffffff', stroke = LINE, sw = 2, rx = 12, dash = '' } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

function arrow(x1, y1, x2, y2, color = 'ink', { sw = 2.5, dash = '' } = {}) {
  const c = color === 'ink' ? MUTED : P[color].fg;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#arrow-${color})"/>`;
}

function badge(cx, cy, label, color, r = 16) {
  const c = P[color];
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.fg}"/>${text(cx, cy + r * 0.38, label, { size: r * 1.05, weight: 700, fill: '#ffffff', anchor: 'middle' })}`;
}

function pill(x, y, label, color, { size = 15, pad = 12, h = 28, solid = false, family = FONT, weight = 600 } = {}) {
  const c = P[color];
  const w = Math.round(measure(label, size, weight, family) + pad * 2);
  return {
    w,
    svg: `${rect(x, y, w, h, { fill: solid ? c.fg : c.bg, stroke: c.fg, sw: 1.5, rx: h / 2 })}${text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight, fill: solid ? '#ffffff' : c.fg, anchor: 'middle', family })}`,
  };
}

// Draws a Primer Octicon (GitHub's official icon set) with its top-left corner at (x, y).
function icon(name, x, y, size = 24, fill = INK) {
  const o = octicons[name];
  if (!o) throw new Error(`Unknown Octicon: ${name}`);
  const base = size <= 16 ? 16 : 24;
  return `<g transform="translate(${x} ${y}) scale(${size / base})" fill="${fill}">${o.heights[base].path}</g>`;
}

function iconBadge(cx, cy, name, color, r = 18) {
  const s = Math.round(r * 1.1);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P[color].fg}"/>${icon(name, cx - s / 2, cy - s / 2, s, '#ffffff')}`;
}

function card({ x, y, w, h, color, num, iconName, title, body = '', titleSize = 20, bodySize = 17, dash = '', stack = false }) {
  const c = P[color];
  const pad = 18;
  let out = rect(x, y, w, h, { fill: c.bg, stroke: c.fg, dash });
  let ty = y + 36;
  let tx = x + pad;
  if (num !== undefined) {
    out += badge(x + pad + 14, y + 32, String(num), color);
    if (iconName) out += icon(iconName, x + w - pad - 26, y + 19, 26, c.fg);
    if (stack) ty = y + 80;
    else tx = x + pad + 38;
  } else if (iconName) {
    out += iconBadge(x + pad + 16, y + 32, iconName, color);
    if (stack) ty = y + 80;
    else tx = x + pad + 42;
  }
  const titleLines = wrap(title, x + w - pad - tx - (num !== undefined && iconName && !stack ? 34 : 0), titleSize, true);
  out += lines(tx, ty + 2, titleLines, { size: titleSize, weight: 700, fill: INK, lh: 1.2 });
  ty += titleLines.length * titleSize * 1.2 + 10;
  if (body) out += lines(x + pad, ty + 4, wrap(body, w - pad * 2, bodySize), { size: bodySize, fill: INK });
  return out;
}

// ---------- Shared ----------

function specLoop() {
  const w = 1000;
  const steps = [
    ['blue', 'Intent', 'Why the change matters', 'light-bulb'],
    ['purple', 'Requirement', 'The rule, written with MUST or SHALL', 'law'],
    ['purple', 'Scenario', 'An example someone can check', 'checklist'],
    ['orange', 'Feature and code', 'Examples that run, and the behavior', 'code'],
    ['green', 'Evidence', 'What ran, and what passed', 'check-circle'],
  ];
  const gap = 30;
  const cw = (w - 80 - gap * 4) / 5;
  let body = '';
  steps.forEach(([color, title, desc, iconName], i) => {
    const x = 40 + i * (cw + gap);
    body += card({ x, y: 120, w: cw, h: 210, color, num: i + 1, iconName, title, body: desc, titleSize: 19, bodySize: 17, stack: true });
    if (i < 4) body += arrow(x + cw + 4, 215, x + cw + gap - 4, 215);
  });
  body += rect(40, 354, w - 80, 56, { fill: P.gray.bg });
  body += text(60, 389, 'Shared IDs link the trail:', { size: 18, weight: 600 });
  let px = 300;
  for (const [id, label] of [['003-FR-004', 'a requirement'], ['003-US1-AS1', 'an acceptance scenario']]) {
    const p = pill(px, 368, id, 'purple', { family: MONO, size: 16 });
    body += p.svg + text(px + p.w + 10, 389, label, { size: 17, fill: MUTED });
    px += p.w + 10 + label.length * 9 + 34;
  }
  const a = measure('AI drafts.', 21, 700);
  const b = measure('Humans decide.', 21, 700);
  const mx = w / 2 - (32 + a + 28 + 32 + b) / 2;
  body += icon('copilot', mx, 434, 24, INK) + text(mx + 32, 455, 'AI drafts.', { size: 21, weight: 700 });
  body += icon('person', mx + 32 + a + 28, 434, 24, P.green.fg) + text(mx + 64 + a + 28, 455, 'Humans decide.', { size: 21, weight: 700, fill: P.green.fg });
  return frame(w, 480, 'The spec-driven loop', 'Every approved behavior leaves a trail you can follow, from why to proof.', body);
}

function workshopMap(current) {
  const w = 1000;
  const stops = [
    ['Trace the loop', 'Intent to evidence'],
    ['Find the missing rules', 'Before you build'],
    ['Deliver a behavior', 'Test-first, with Copilot'],
    ['Draft your first spec', 'Capstone'],
  ];
  const xs = [140, 380, 620, 860];
  let body = `<line x1="${xs[0]}" y1="170" x2="${xs[3]}" y2="170" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/>`;
  stops.forEach(([title, sub], i) => {
    const here = i + 1 === current;
    const x = xs[i];
    if (here) {
      body += `<circle cx="${x}" cy="170" r="34" fill="${P.blue.bg}" stroke="${P.blue.fg}" stroke-width="2"/>`;
      body += badge(x, 170, String(i + 1), 'blue', 24);
      const p = pill(0, 0, 'You are here', 'blue', { solid: true, size: 15 });
      body += pill(x - p.w / 2, 104, 'You are here', 'blue', { solid: true, size: 15 }).svg;
    } else {
      body += `<circle cx="${x}" cy="170" r="24" fill="#ffffff" stroke="${MUTED}" stroke-width="2.5"/>`;
      body += text(x, 178, String(i + 1), { size: 22, weight: 700, fill: MUTED, anchor: 'middle' });
    }
    body += lines(x, 236, wrap(title, 210, 19, true), { size: 19, weight: 700, anchor: 'middle', fill: here ? P.blue.fg : INK, lh: 1.2 });
    body += text(x, 266, sub, { size: 16, fill: MUTED, anchor: 'middle' });
  });
  return frame(w, 300, 'Spec-driven delivery workshop', 'Four exercises, one delivery loop.', body);
}

// ---------- Exercise 1 ----------

function traceChain() {
  const w = 740;
  const rows = [
    ['blue', 'Intent', 'Why does the team want this?', 'light-bulb'],
    ['purple', 'Requirement', 'Which rule must hold?', 'law'],
    ['purple', 'Scenario', 'Which example shows the rule?', 'checklist'],
    ['orange', 'Feature', 'Which executable example runs it?', 'beaker'],
    ['orange', 'Code', 'Where does the behavior live?', 'code'],
    ['green', 'Evidence', 'What ran, and did it pass?', 'check-circle'],
    ['red', 'Not proven by the evidence', 'What do the checks not assert?', 'alert'],
  ];
  let body = text(60, 132, 'Worksheet row', { size: 16, weight: 600, fill: MUTED }) + text(390, 132, 'The question it answers', { size: 16, weight: 600, fill: MUTED });
  rows.forEach(([color, label, q, iconName], i) => {
    const y = 150 + i * 58;
    const c = P[color];
    body += rect(40, y, 320, 42, { fill: c.bg, stroke: c.fg, rx: 21, dash: color === 'red' ? '6 5' : '' });
    body += icon(iconName, 58, y + 11, 20, c.fg);
    body += text(88, y + 28, label, { size: 18, weight: 700, fill: c.fg });
    body += text(390, y + 28, q, { size: 19 });
    if (i < rows.length - 1) body += `<line x1="68" y1="${y + 42}" x2="68" y2="${y + 58}" stroke="${MUTED}" stroke-width="2.5"/>`;
  });
  return frame(w, 580, 'One trace, seven questions', 'Fill each row of the worksheet by answering its question with what you found.', body);
}

function evidenceGap() {
  const w = 1000;
  let body = '';
  body += text(70, 132, 'What the spec promises', { size: 18, weight: 700, fill: P.purple.fg });
  body += text(610, 132, 'What the checks prove', { size: 18, weight: 700, fill: P.green.fg });
  const left = ['Scenario A', 'Scenario B', 'Scenario C', 'Scenario D', 'Scenario E'];
  const right = ['Feature scenario', 'Unit test', 'Feature scenario', null, 'Unit test'];
  left.forEach((label, i) => {
    const y = 148 + i * 54;
    body += rect(60, y, 300, 40, { fill: P.purple.bg, stroke: P.purple.fg, rx: 20 });
    body += text(84, y + 27, label, { size: 18, weight: 600 });
    if (right[i]) {
      body += rect(600, y, 330, 40, { fill: P.green.bg, stroke: P.green.fg, rx: 20 });
      body += icon('check-circle', 620, y + 10, 20, P.green.fg);
      body += text(648, y + 27, right[i], { size: 18, weight: 600, fill: P.green.fg });
      body += arrow(362, y + 20, 596, y + 20, 'green');
    } else {
      body += rect(600, y, 330, 40, { fill: P.red.bg, stroke: P.red.fg, rx: 20, dash: '6 5' });
      body += icon('question', 620, y + 10, 20, P.red.fg);
      body += text(648, y + 27, 'No automated evidence', { size: 18, weight: 700, fill: P.red.fg });
      body += arrow(362, y + 20, 596, y + 20, 'red', { dash: '7 6' });
      body += rect(440, y + 6, 80, 28, { fill: '#ffffff', stroke: P.red.fg, sw: 1.5, rx: 14 });
      body += text(480, y + 26, 'a gap', { size: 16, weight: 700, fill: P.red.fg, anchor: 'middle' });
    }
  });
  body += rect(40, 432, w - 80, 104, { fill: P.orange.bg, stroke: P.orange.fg });
  body += text(62, 466, 'Assumed capabilities', { size: 19, weight: 700, fill: P.orange.fg });
  body += lines(62, 496, ['Every spec relies on things it expects to exist: a field, a lookup, an interface or a queue.', 'A named owner confirms each one before Ready to build.'], { size: 17 });
  return frame(w, 568, 'Where gaps hide', 'Compare what the spec promises with what the automated checks prove.', body);
}

// ---------- Exercise 2 ----------

function questionLenses() {
  const w = 1000;
  const lenses = [
    ['blue', 'Who decides?', 'Who reviews, who approves, and who can grant an exception?', 'person'],
    ['purple', 'When?', 'Dates, lead times, waiting periods and deadlines.', 'calendar'],
    ['orange', 'Who else is affected?', 'Family members, partners, other teams and other systems.', 'people'],
    ['green', 'What proves it is ready?', 'Tests, sign-offs and acceptance by a partner.', 'verified'],
    ['red', 'What stops or undoes it?', 'Cancellations, terminations and reversals.', 'stop'],
  ];
  const cw = 292;
  const gap = 22;
  const pos = [
    [40, 120], [40 + cw + gap, 120], [40 + 2 * (cw + gap), 120],
    [(w - 2 * cw - gap) / 2, 300], [(w - 2 * cw - gap) / 2 + cw + gap, 300],
  ];
  let body = '';
  lenses.forEach(([color, title, desc, iconName], i) => {
    body += card({ x: pos[i][0], y: pos[i][1], w: cw, h: 158, color, iconName, title, body: desc, titleSize: 20, bodySize: 17 });
  });
  return frame(w, 500, 'Five lenses for missing rules', 'Read each story through every lens, and write down the questions it raises.', body);
}

function requirementAnatomy() {
  const w = 1000;
  const code = [
    ['## ADDED Requirements', 1],
    ['', 0],
    ['### Requirement: Setup lead time', 2],
    ['A vision rider MUST take effect on the first day', 0],
    ['of a month at least 30 calendar days after its', 0],
    ['configuration is approved, unless ...', 0],
    ['', 0],
    ['#### Scenario: Short-notice start needs approval', 3],
    ['', 0],
    ['- **GIVEN** a configuration approved on 2025-06-10', 4],
    ['- **WHEN** the group asks to start on 2025-07-01', 0],
    ['- **THEN** the setup is held until the product', 0],
    ['  owner and underwriting approve the exception', 0],
  ];
  const notes = {
    1: ['blue', 'ADDED, MODIFIED or REMOVED', 'Says how the change affects the current spec.'],
    2: ['purple', 'One rule per requirement', 'Written with MUST or SHALL.'],
    3: ['orange', 'At least one scenario', 'Exception scenarios catch the costly gaps.'],
    4: ['green', 'GIVEN, WHEN, THEN', 'Context, event, and a result someone can observe.'],
  };
  let body = rect(40, 116, 560, 410, { fill: P.gray.bg });
  code.forEach(([line, n], i) => {
    const y = 150 + i * 28;
    body += text(60, y, line.replace(/^ +/, (m) => '\u00a0'.repeat(m.length)), { size: 15.5, family: MONO, fill: line.startsWith('#') ? P.purple.fg : INK, weight: line.startsWith('#') ? 700 : 400 });
    if (n) {
      body += badge(570, y - 5, String(n), notes[n][0], 13);
    }
  });
  let ny = 120;
  for (const [n, [color, title, desc]] of Object.entries(notes)) {
    body += badge(648, ny + 22, n, color, 15);
    body += text(674, ny + 28, title, { size: 18, weight: 700, fill: P[color].fg });
    body += lines(674, ny + 56, wrap(desc, 290, 16.5), { size: 16.5 });
    ny += 100;
  }
  const cmd = 'openspec validate --strict';
  const rest = 'checks the format. People check that each rule is right.';
  const cmdW = measure(cmd, 16, 700, MONO);
  const fx = w / 2 - (cmdW + 8 + measure(rest, 17, 600)) / 2;
  body += text(fx, 562, cmd, { size: 16, weight: 700, family: MONO, fill: INK });
  body += text(fx + cmdW + 8, 562, rest, { size: 17, weight: 600, fill: MUTED });
  return frame(w, 590, 'Anatomy of a testable requirement', 'One rule, written so that someone can check it.', body);
}

function lateGaps() {
  const w = 1000;
  const x0 = 80;
  const x1 = 920;
  const wx = (week) => x0 + ((week - 1) * (x1 - x0)) / 14;
  const moves = {
    Clarify: 'blue',
    'Make it testable': 'purple',
    'Quality checklist': 'green',
    Plan: 'orange',
  };
  const gaps = [
    [1, 6, 'No named approver', 'Quality checklist'],
    [2, 7, "Partner's file layout", 'Plan'],
    [3, 9, 'Dependents', 'Quality checklist'],
    [4, 10, 'New-hire waiting period', 'Clarify'],
    [5, 12, 'Lead time', 'Clarify'],
    [6, 12, 'Administrator readiness', 'Make it testable'],
    [7, 14, 'Group ends before go-live', 'Make it testable'],
    [8, 15, 'Mid-year additions', 'Clarify'],
  ];
  let body = '';
  const bands = [[1, 8.5, 'Build', 'gray'], [8.5, 11.5, 'Acceptance testing', 'yellow'], [11.5, 15.5, 'Live', 'red']];
  for (const [a, b, label, color] of bands) {
    const xa = Math.max(x0 - 24, wx(a) - (a === 1 ? 24 : 0));
    const xb = Math.min(x1 + 24, wx(b));
    body += rect(xa, 116, xb - xa - 4, 36, { fill: P[color].bg, stroke: P[color].fg, sw: 1.5, rx: 8 });
    body += text((xa + xb) / 2, 140, label, { size: 16, weight: 700, fill: P[color].fg, anchor: 'middle' });
  }
  body += `<line x1="${x0 - 20}" y1="178" x2="${x1 + 20}" y2="178" stroke="${MUTED}" stroke-width="2"/>`;
  for (let week = 1; week <= 15; week++) {
    body += `<line x1="${wx(week)}" y1="172" x2="${wx(week)}" y2="184" stroke="${MUTED}" stroke-width="2"/>`;
    if ([1, 4, 8, 12, 15].includes(week)) body += text(wx(week), 204, `Week ${week}`, { size: 15, fill: MUTED, anchor: 'middle' });
  }
  const seen = {};
  for (const [n, week, , move] of gaps) {
    const stack = (seen[week] = (seen[week] ?? -1) + 1);
    body += badge(wx(week), 238 + stack * 40, String(n), moves[move], 17);
  }
  gaps.forEach(([n, , label, move], i) => {
    const col = i < 4 ? 0 : 1;
    const x = 50 + col * 455;
    const y = 330 + (i % 4) * 40;
    body += badge(x + 16, y, String(n), moves[move], 15);
    body += text(x + 42, y + 6, label, { size: 18, weight: 600 });
    body += text(x + 300, y + 6, move, { size: 16, fill: P[moves[move]].fg, weight: 600 });
  });
  body += text(w / 2, 512, '6 of 8 surfaced in testing or after go-live. Clarify 3 · Make it testable 2 · Quality checklist 2 · Plan 1', { size: 16.5, weight: 600, anchor: 'middle', fill: MUTED });
  return frame(w, 540, 'Where the 2025 gaps surfaced', 'Each number is a rule the epic never stated, colored by the move that would have caught it.', body);
}

// ---------- Exercise 3 ----------

function deliveryFlow(current) {
  const w = 1000;
  const stages = [
    ['Plan', 'Red tests, reviewed plan', true, 'beaker'],
    ['Implement', 'Make the tests pass', false, 'code'],
    ['Pull request', 'CI checks every change', false, 'git-pull-request'],
    ['Archive', 'Update the living spec', false, 'archive'],
    ['Merge', 'A person approves', true, 'git-merge'],
  ];
  const gap = 26;
  const cw = (w - 80 - gap * 4) / 5;
  let body = '';
  stages.forEach(([title, desc, gate, iconName], i) => {
    const x = 40 + i * (cw + gap);
    const here = i + 1 === current;
    const color = here ? 'blue' : 'gray';
    body += rect(x, 132, cw, 150, { fill: P[color].bg, stroke: here ? P.blue.fg : LINE, sw: here ? 3 : 2 });
    body += badge(x + 30, 166, String(i + 1), color, 15);
    body += icon(iconName, x + cw - 42, 153, 26, here ? P.blue.fg : MUTED);
    body += text(x + 16, 214, title, { size: 19, weight: 700, fill: here ? P.blue.fg : INK });
    body += lines(x + 16, 244, wrap(desc, cw - 32, 16.5), { size: 16.5 });
    if (here) {
      const pw = pill(0, 0, 'You are here', 'blue', { solid: true, size: 14, h: 26 }).w;
      body += pill(x + cw / 2 - pw / 2, 96, 'You are here', 'blue', { solid: true, size: 14, h: 26 }).svg;
    }
    if (gate) body += pill(x + 14, 294, 'Human check', 'green', { size: 14, h: 26 }).svg;
    if (i < 4) body += arrow(x + cw + 3, 207, x + cw + gap - 3, 207);
  });
  return frame(w, 344, 'Deliver an approved behavior', '', body);
}

function archiveFlow() {
  const w = 1000;
  const tree = (x, y, rows) =>
    rows.map(([depth, label, color, note, noteColor], i) => {
      const yy = y + i * 30;
      const tx = x + depth * 18;
      const weight = color ? 700 : 400;
      let out = text(tx, yy, label, { size: 15, family: MONO, fill: color ? P[color].fg : INK, weight });
      if (note) out += text(tx + measure(label, 15, weight, MONO) + 12, yy, note, { size: 15, fill: noteColor ? P[noteColor].fg : MUTED, weight: noteColor ? 600 : 400 });
      return out;
    }).join('');
  const cmd = pill(40, 72, 'npx openspec archive implement-dependent-privacy', 'gray', { family: MONO, size: 15, weight: 600, h: 30, pad: 14 });
  let body = cmd.svg;
  body += rect(40, 124, 425, 314, { fill: P.gray.bg });
  body += text(60, 158, 'Before: the change is in progress', { size: 18, weight: 700 });
  body += tree(60, 198, [
    [0, 'openspec/'],
    [1, 'specs/', null, 'current rules'],
    [1, 'changes/'],
    [2, 'implement-dependent-privacy/', 'orange'],
    [3, 'proposal.md'],
    [3, 'design.md'],
    [3, 'tasks.md'],
    [3, 'specs/', 'orange', 'new rules', 'orange'],
  ]);
  body += arrow(476, 284, 522, 284, 'ink', { sw: 3 });
  body += text(500, 266, 'archive', { size: 14, weight: 700, fill: MUTED, anchor: 'middle' });
  body += rect(535, 124, 425, 314, { fill: P.green.bg, stroke: P.green.fg });
  body += text(555, 158, 'After: the spec is current', { size: 18, weight: 700, fill: P.green.fg });
  body += tree(555, 198, [
    [0, 'openspec/'],
    [1, 'specs/'],
    [2, 'member-claim-privacy/', 'green'],
    [3, 'spec.md', 'green', 'new rules merged in', 'green'],
    [1, 'changes/'],
    [2, 'archive/'],
    [3, 'YYYY-MM-DD-implement-dependent-privacy/', 'gray'],
  ]);
  body += text(w / 2, 476, 'Archiving merges the new rules into the living spec and keeps a dated record of the change.', { size: 17, weight: 600, anchor: 'middle', fill: MUTED });
  return frame(w, 508, 'Archiving a delivered change', '', body);
}

// ---------- Exercise 4 ----------

function readinessGate() {
  const w = 1000;
  const checks = [
    ['blue', 'Scope is bounded', 'The proposal and its non-goals are agreed.', 'file'],
    ['purple', 'Questions are answered', 'Named people answered the material questions.', 'comment-discussion'],
    ['orange', 'Capabilities are confirmed', 'A named role confirmed each one, with evidence.', 'verified'],
    ['green', 'Test data is ready', 'Every scenario has synthetic data, a source and an owner.', 'database'],
  ];
  let body = text(40, 132, 'The gate asks', { size: 16, weight: 600, fill: MUTED });
  checks.forEach(([color, title, desc, iconName], i) => {
    const y = 148 + i * 92;
    body += rect(40, y, 540, 72, { fill: P[color].bg, stroke: P[color].fg });
    body += icon(iconName, 60, y + 24, 24, P[color].fg);
    body += text(100, y + 31, title, { size: 18, weight: 700, fill: P[color].fg });
    body += text(100, y + 56, desc, { size: 16.5 });
  });
  body += arrow(590, 322, 634, 322, 'ink', { sw: 3 });
  body += rect(644, 148, 316, 348, { fill: P.gray.bg });
  body += icon('person', 664, 166, 22, INK);
  body += text(696, 184, 'A person decides', { size: 18, weight: 700 });
  const outcome = (y, color, iconName, title, desc) => {
    let out = rect(664, y, 276, 130, { fill: P[color].bg, stroke: P[color].fg });
    out += icon(iconName, 684, y + 22, 24, P[color].fg);
    out += text(720, y + 42, title, { size: 20, weight: 700, fill: P[color].fg });
    out += lines(684, y + 80, wrap(desc, 236, 16.5), { size: 16.5 });
    return out;
  };
  body += outcome(204, 'green', 'check-circle', 'Ready', 'Build it, and track the measures you chose.');
  body += outcome(352, 'orange', 'alert', 'Not ready', 'Name each blocker, its owner and the next action.');
  body += rect(40, 520, w - 80, 92, { fill: P.blue.bg, stroke: P.blue.fg });
  body += icon('graph', 60, 536, 22, P.blue.fg);
  body += text(92, 554, 'Measures', { size: 18, weight: 700, fill: P.blue.fg });
  body += text(60, 590, 'Record what is counted, the baseline period, the source and the owner. No baseline yet? Write who collects it.', { size: 16 });
  const a = 'An AI answer is not confirmation.';
  const aw = measure(a, 18, 700);
  const ax = w / 2 - (30 + aw) / 2;
  body += icon('copilot', ax, 634, 22, MUTED) + text(ax + 30, 652, a, { size: 18, weight: 700, fill: MUTED });
  return frame(w, 684, 'The Ready to build gate', 'Valid is not the same as ready. "Not ready" with named next actions is a useful result.', body);
}

// ---------- Banners ----------

const DARK = {
  bg: '#0d1117',
  bg2: '#161b22',
  border: '#30363d',
  text: '#f0f6fc',
  soft: '#c9d1d9',
  muted: '#8b949e',
  dim: '#6e7681',
  blue: '#4493f8',
  purple: '#ab7df8',
  orange: '#db6d28',
  green: '#3fb950',
};

const BANNERS = {
  1: { title: ['Trace the Loop', 'from Intent to Evidence'], promise: 'Follow one rule from intent to passing evidence, and find what green tests do not prove.', focus: [0, 1, 2, 3, 4], gherkin: true },
  2: { title: ['Find the Missing Rules', 'Before You Build'], promise: 'Question a thin epic, then write the missing rules as a valid OpenSpec change.', focus: [0, 1, 2] },
  3: { title: ['Deliver an Approved', 'Behavior with Copilot'], promise: 'Go from failing tests to a merged, archived change, with a person at every gate.', focus: [2, 3, 4], gherkin: true },
  4: { title: ['Draft Your First Spec'], promise: 'Frame an unfamiliar problem as a validated change, and decide whether it is ready to build.', focus: [0, 1, 2] },
};

function banner(n) {
  const w = 1000;
  const h = 300;
  const b = BANNERS[n];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${DARK.bg}"/><stop offset="1" stop-color="${DARK.bg2}"/></linearGradient>
<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${DARK.blue}"/><stop offset="0.5" stop-color="${DARK.purple}"/><stop offset="1" stop-color="${DARK.green}"/></linearGradient>
<clipPath id="card"><rect x="0" y="0" width="${w}" height="${h}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#card)">
<rect x="0" y="0" width="${w}" height="${h}" fill="url(#bg)"/>
<rect x="0" y="0" width="${w}" height="5" fill="url(#accent)"/>
</g>
<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="18" fill="none" stroke="${DARK.border}" stroke-width="1.5"/>`;
  s += text(48, 58, `SPEC-DRIVEN DELIVERY WORKSHOP  ·  EXERCISE ${n} OF 4`, { size: 13, weight: 700, fill: DARK.muted }).replace('<text ', '<text letter-spacing="1.4" ');
  const twoLines = b.title.length === 2;
  s += lines(48, twoLines ? 104 : 124, b.title, { size: 36, weight: 700, fill: DARK.text, lh: 1.14 });
  s += lines(48, twoLines ? 182 : 162, wrap(b.promise, 500, 17.5), { size: 17.5, fill: DARK.soft, lh: 1.4 });

  // Tool chips along the bottom.
  let cx = 48;
  const tools = [['codespaces', 'Codespaces'], ['copilot', 'GitHub Copilot'], ['file', 'OpenSpec']];
  if (b.gherkin) tools.push(['checklist', 'Gherkin']);
  for (const [name, label] of tools) {
    const cw = Math.round(12 + 16 + 8 + measure(label, 14, 600) + 14);
    s += rect(cx, 234, cw, 32, { fill: DARK.bg2, stroke: DARK.border, sw: 1.2, rx: 16 });
    s += icon(name, cx + 12, 242, 16, DARK.soft);
    s += text(cx + 36, 255, label, { size: 14, weight: 600, fill: DARK.soft });
    cx += cw + 10;
  }

  // The loop, with this exercise's focus lit up.
  const nodes = [
    ['light-bulb', 'Intent', DARK.blue],
    ['law', 'Requirement', DARK.purple],
    ['checklist', 'Scenario', DARK.purple],
    ['code', 'Code', DARK.orange],
    ['check-circle', 'Evidence', DARK.green],
  ];
  const xs = [606, 688, 770, 852, 934];
  const cy = 160;
  s += text(770, 102, 'FOCUS OF THIS EXERCISE', { size: 12, weight: 700, fill: DARK.muted, anchor: 'middle' }).replace('<text ', '<text letter-spacing="1.4" ');
  for (let i = 0; i < nodes.length - 1; i++) {
    const lit = b.focus.includes(i) && b.focus.includes(i + 1);
    s += `<line x1="${xs[i] + 30}" y1="${cy}" x2="${xs[i + 1] - 30}" y2="${cy}" stroke="${lit ? DARK.muted : DARK.border}" stroke-width="2.5" stroke-linecap="round"/>`;
  }
  nodes.forEach(([name, label, color], i) => {
    const lit = b.focus.includes(i);
    s += `<circle cx="${xs[i]}" cy="${cy}" r="28" fill="${lit ? color : DARK.bg2}" fill-opacity="${lit ? 0.16 : 1}" stroke="${lit ? color : DARK.border}" stroke-width="2"/>`;
    s += icon(name, xs[i] - 13, cy - 13, 26, lit ? color : DARK.dim);
    s += text(xs[i], cy + 54, label, { size: 13.5, weight: 600, fill: lit ? DARK.soft : DARK.dim, anchor: 'middle' });
  });
  return `${s}</svg>`;
}

// ---------- Build ----------

const diagrams = [
  ...[1, 2, 3, 4].map((n) => ['banner.png', banner(n), [`e${n}`]]),
  ['spec-loop.png', specLoop(), ['e1']],
  ['workshop-map.png', workshopMap(1), ['e1']],
  ['workshop-map.png', workshopMap(2), ['e2']],
  ['workshop-map.png', workshopMap(3), ['e3']],
  ['workshop-map.png', workshopMap(4), ['e4']],
  ['trace-chain.png', traceChain(), ['e1']],
  ['evidence-gap.png', evidenceGap(), ['e1']],
  ['question-lenses.png', questionLenses(), ['e2']],
  ['requirement-anatomy.png', requirementAnatomy(), ['e2', 'e4']],
  ['late-gaps.png', lateGaps(), ['e2']],
  ...[1, 2, 3, 4, 5].map((n) => [`delivery-flow-${n}.png`, deliveryFlow(n), ['e3']]),
  ['archive-flow.png', archiveFlow(), ['e3']],
  ['readiness-gate.png', readinessGate(), ['e4']],
];

// Antivirus or an open image viewer can briefly lock a PNG on Windows, so retry a few times.
function save(file, data) {
  for (let attempt = 1; ; attempt++) {
    try {
      writeFileSync(file, data);
      return;
    } catch (err) {
      if (attempt >= 5) throw err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200 * attempt);
    }
  }
}

const preview = join(dirname(fileURLToPath(import.meta.url)), 'preview');
mkdirSync(preview, { recursive: true });
for (const [name, svg, targets] of diagrams) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'zoom', value: 2 },
    font: RESVG_FONTS,
  }).render().asPng();
  for (const key of targets) {
    const root = join(workshop, EX[key]);
    if (!existsSync(root)) continue;
    const dir = join(root, '.github', 'images');
    mkdirSync(dir, { recursive: true });
    save(join(dir, name), png);
  }
  save(join(preview, `${targets.join('-')}-${name}`), png);
  console.log(`${name.padEnd(28)} -> ${targets.map((k) => EX[k]).join(', ')}`);
}
