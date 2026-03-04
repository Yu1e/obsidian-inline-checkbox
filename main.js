const { Plugin } = require('obsidian');
const { ViewPlugin, Decoration, WidgetType } = require('@codemirror/view');

/* ═══════════════════════════════════════════════
   КАРТА ИКОНОК
   ═══════════════════════════════════════════════ */

const ICON_MAP = {
  "▢": "empty",
  "☑": "done",
  "◧": "progress",
  "☒": "cancelled",
  "⚠": "important",
  "⍰": "question",
  "①": "digit",
  "②": "digit",
  "③": "digit",
  "④": "digit",
  "⑤": "digit",
  "⑥": "digit",
  "⑦": "digit",
  "⑧": "digit",
  "⑨": "digit"
};

/* Два независимых цикла */
const CHECKBOX_CYCLE = ["▢", "☑", "◧", "☒", "⚠", "⍰"];
const DIGIT_CYCLE    = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

function getNextIcon(icon) {
  let idx = CHECKBOX_CYCLE.indexOf(icon);
  if (idx !== -1) return CHECKBOX_CYCLE[(idx + 1) % CHECKBOX_CYCLE.length];

  idx = DIGIT_CYCLE.indexOf(icon);
  if (idx !== -1) return DIGIT_CYCLE[(idx + 1) % DIGIT_CYCLE.length];

  return icon;
}

/* ═══════════════════════════════════════════════
   SVG-ИКОНКИ
   ═══════════════════════════════════════════════ */

const SVG_IMPORTANT = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='26' height='26'>
  <rect x='1.5' y='1.5' width='21' height='21' rx='3' fill='currentColor' stroke='currentColor' stroke-width='1.5'/>
  <line x1='12' y1='6' x2='12' y2='13' stroke='white' stroke-width='2.5' stroke-linecap='round'/>
  <circle cx='12' cy='17' r='1.5' fill='white'/>
</svg>`;

const SVG_QUESTION = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='26' height='26'>
  <rect x='1.5' y='1.5' width='21' height='21' rx='3' fill='currentColor' stroke='currentColor' stroke-width='1.5'/>
  <path d='M10 9.5c0-1.4 1.1-2.5 2-2.5s2 1.1 2 2.5c0 1-0.7 1.5-1.5 2-.5.3-.5.5-.5 1' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round'/>
  <circle cx='12' cy='17' r='1.2' fill='white'/>
</svg>`;

/* ═══════════════════════════════════════════════
   ВИДЖЕТ
   ═══════════════════════════════════════════════ */

class IconWidget extends WidgetType {
  constructor(icon, cls, pos, len) {
    super();
    this.icon = icon;
    this.cls = cls;
    this.pos = pos;
    this.len = len;
  }

  toDOM(view) {
    const s = document.createElement('span');
    s.className = `inline-icon icon-${this.cls}`;

    if (this.icon === "☑") {
      s.textContent = '\u200B';
    } else if (this.icon === "⚠") {
      s.innerHTML = SVG_IMPORTANT;
    } else if (this.icon === "⍰") {
      s.innerHTML = SVG_QUESTION;
    } else {
      s.textContent = this.icon;
    }

    s.addEventListener('click', (e) => {
      e.preventDefault();
      const next = getNextIcon(this.icon);
      view.dispatch({
        changes: { from: this.pos, to: this.pos + this.len, insert: next }
      });
    });
    return s;
  }

  eq(o) { return this.icon === o.icon && this.pos === o.pos; }
  ignoreEvent() { return false; }
}

/* ═══════════════════════════════════════════════
   ДЕКОРАЦИИ
   ═══════════════════════════════════════════════ */

function buildDecorations(view) {
  const decs = [];
  const doc = view.state.doc;
  const regex = /[▢☑◧☒⚠⍰①-⑨][\uFE0E\uFE0F]?/g;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    let m;
    while ((m = regex.exec(line.text)) !== null) {
      const base = m[0][0];
      const cls = ICON_MAP[base];
      if (!cls) continue;
      const from = line.from + m.index;
      decs.push(
        Decoration.replace({
          widget: new IconWidget(base, cls, from, m[0].length),
        }).range(from, from + m[0].length)
      );
    }
  }
  return Decoration.set(decs);
}

const ext = ViewPlugin.fromClass(
  class {
    constructor(v) { this.decorations = buildDecorations(v); }
    update(u) {
      if (u.docChanged || u.viewportChanged)
        this.decorations = buildDecorations(u.view);
    }
  },
  { decorations: (v) => v.decorations }
);

/* ═══════════════════════════════════════════════
   ФУНКЦИИ ДЛЯ КОМАНД
   ═══════════════════════════════════════════════ */

function toggleOrInsert(editor, icons) {
  const c = editor.getCursor();
  const line = editor.getLine(c.line);

  let found = null, pos = -1, foundIdx = -1;

  for (let p = c.ch; p >= Math.max(0, c.ch - 5); p--) {
    for (let i = 0; i < icons.length; i++) {
      if (line.substring(p, p + icons[i].length) === icons[i]) {
        found = icons[i]; pos = p; foundIdx = i;
        break;
      }
    }
    if (found) break;
  }

  if (found) {
    const next = icons[(foundIdx + 1) % icons.length];
    let end = pos + found.length;
    while (end < line.length && (line.charCodeAt(end) === 0xFE0E || line.charCodeAt(end) === 0xFE0F)) end++;
    editor.replaceRange(next, {line: c.line, ch: pos}, {line: c.line, ch: end});
    editor.setCursor({line: c.line, ch: pos});
  } else {
    let ws = c.ch;
    while (ws > 0 && !" \t,".includes(line[ws - 1])) ws--;
    editor.replaceRange(icons[0] + " ", {line: c.line, ch: ws});
    editor.setCursor({line: c.line, ch: ws});
  }
}

/* ═══════════════════════════════════════════════
   ПЛАГИН
   ═══════════════════════════════════════════════ */

class InlineCheckboxPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension([ext]);

    // Команда: Вставить/переключить флажок
    this.addCommand({
      id: 'toggle-checkbox',
      name: 'Insert or toggle checkbox',
      editorCallback: (editor) => {
        toggleOrInsert(editor, CHECKBOX_CYCLE);
      }
    });

    // Команда: Вставить/переключить цифру
    this.addCommand({
      id: 'toggle-digit',
      name: 'Insert or toggle circled digit',
      editorCallback: (editor) => {
        toggleOrInsert(editor, DIGIT_CYCLE);
      }
    });
  }
}

module.exports = InlineCheckboxPlugin;