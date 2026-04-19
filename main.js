const { Plugin } = require('obsidian');
const { ViewPlugin, Decoration, WidgetType } = require('@codemirror/view');

/* ═══════════════════════════════════════════════
   КАРТА ИКОНОК (Unicode escape для надёжности)
   ═══════════════════════════════════════════════ */

const ICON_MAP = {
  "▢": "empty",
  "☑": "done",
  "◧": "progress",
  "☒": "cancelled",
  "⚠": "important",
  "⍰": "question",
  "\u2460": "digit",   // ①
  "\u2461": "digit",   // ②
  "\u2462": "digit",   // ③
  "\u2463": "digit",   // ④
  "\u2464": "digit",   // ⑤
  "\u2465": "digit",   // ⑥
  "\u2466": "digit",   // ⑦
  "\u2467": "digit",   // ⑧
  "\u2468": "digit",   // ⑨
  "\u2789": "digit2",  // ➉
  "\u246A": "digit2",  // ⑪
  "\u246B": "digit2",  // ⑫
  "\u246C": "digit2",  // ⑬
  "\u246D": "digit2",  // ⑭
  "\u246E": "digit2",  // ⑮
  "\u246F": "digit2",  // ⑯
  "\u2470": "digit2",  // ⑰
  "\u2471": "digit2",  // ⑱
  "\u2472": "digit2",  // ⑲
  "\u2473": "digit2"   // ⑳
};

/* Два независимых цикла */
const CHECKBOX_CYCLE = ["▢", "☑", "◧", "☒", "⚠", "⍰"];
const DIGIT_CYCLE = [
  "\u2460", "\u2461", "\u2462", "\u2463", "\u2464",  // ①②③④⑤
  "\u2465", "\u2466", "\u2467", "\u2468", "\u2789",  // ⑥⑦⑧⑨➉
  "\u246A", "\u246B", "\u246C", "\u246D", "\u246E",  // ⑪⑫⑬⑭⑮
  "\u246F", "\u2470", "\u2471", "\u2472", "\u2473"   // ⑯⑰⑱⑲⑳
];

function getNextIcon(icon) {
  let idx = CHECKBOX_CYCLE.indexOf(icon);
  if (idx !== -1) return CHECKBOX_CYCLE[(idx + 1) % CHECKBOX_CYCLE.length];

  for (let i = 0; i < DIGIT_CYCLE.length; i++) {
    if (DIGIT_CYCLE[i] === icon) {
      return DIGIT_CYCLE[(i + 1) % DIGIT_CYCLE.length];
    }
  }

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
  const allIcons = Object.keys(ICON_MAP);

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const text = line.text;

    for (let ch = 0; ch < text.length; ch++) {
      for (const icon of allIcons) {
        if (text.substring(ch, ch + icon.length) === icon) {
          const cls = ICON_MAP[icon];
          const from = line.from + ch;
          let len = icon.length;
          while (ch + len < text.length &&
            (text.charCodeAt(ch + len) === 0xFE0E || text.charCodeAt(ch + len) === 0xFE0F)) {
            len++;
          }
          decs.push(
            Decoration.replace({
              widget: new IconWidget(icon, cls, from, len),
            }).range(from, from + len)
          );
          ch += len - 1;
          break;
        }
      }
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
    editor.replaceRange(next, { line: c.line, ch: pos }, { line: c.line, ch: end });
    editor.setCursor({ line: c.line, ch: pos + next.length });
  } else {
    let ws = c.ch;
    while (ws > 0 && !" \t,".includes(line[ws - 1])) ws--;
    editor.replaceRange(icons[0] + " ", { line: c.line, ch: ws });
    editor.setCursor({ line: c.line, ch: ws + icons[0].length + 1 });
  }
}

function findAllDigits(text) {
  const result = [];
  for (let ch = 0; ch < text.length; ch++) {
    for (const icon of DIGIT_CYCLE) {
      if (text.substring(ch, ch + icon.length) === icon) {
        result.push({ pos: ch, icon, idx: DIGIT_CYCLE.indexOf(icon), len: icon.length });
        ch += icon.length - 1;
        break;
      }
    }
  }
  return result;
}

function recalcRight(editor, lineNum, digits, startPos, startIdx) {
  let offset = 0;
  for (const digit of digits) {
    if (digit.pos < startPos) continue;
    const newPos = digit.pos + offset;
    const newIcon = DIGIT_CYCLE[startIdx % DIGIT_CYCLE.length];
    startIdx++;
    const current = editor.getLine(lineNum).substring(newPos, newPos + digit.len);
    if (current === digit.icon) {
      editor.replaceRange(
        newIcon,
        { line: lineNum, ch: newPos },
        { line: lineNum, ch: newPos + digit.len }
      );
      offset += newIcon.length - digit.len;
    }
  }
}

function smartInsertDigit(editor) {
  const c = editor.getCursor();
  const line = editor.getLine(c.line);
  const allDigits = findAllDigits(line);

  // Ищем цифру рядом с курсором
  let nearFound = null, nearPos = -1, nearFoundIdx = -1;
  for (let p = c.ch; p >= Math.max(0, c.ch - 5); p--) {
    for (let i = 0; i < DIGIT_CYCLE.length; i++) {
      if (line.substring(p, p + DIGIT_CYCLE[i].length) === DIGIT_CYCLE[i]) {
        nearFound = DIGIT_CYCLE[i]; nearPos = p; nearFoundIdx = i;
        break;
      }
    }
    if (nearFound) break;
  }

  if (nearFound) {
    // Переключаем и пересчитываем правее
    const next = DIGIT_CYCLE[(nearFoundIdx + 1) % DIGIT_CYCLE.length];
    let end = nearPos + nearFound.length;
    while (end < line.length && (line.charCodeAt(end) === 0xFE0E || line.charCodeAt(end) === 0xFE0F)) end++;
    editor.replaceRange(next, { line: c.line, ch: nearPos }, { line: c.line, ch: end });

    const rightDigits = allDigits.filter(f => f.pos > nearPos);
    recalcRight(editor, c.line, rightDigits, nearPos + next.length, nearFoundIdx + 2);
    editor.setCursor({ line: c.line, ch: nearPos + next.length });

  } else {
    // Вставляем новую
    const leftDigits = allDigits.filter(f => f.pos < c.ch);
    const rightDigits = allDigits.filter(f => f.pos >= c.ch);

    let insertIdx;
    if (leftDigits.length === 0) {
      insertIdx = 0;
    } else {
      const maxLeft = leftDigits.reduce((a, b) => a.idx > b.idx ? a : b);
      insertIdx = maxLeft.idx + 1;
    }

    const toInsert = DIGIT_CYCLE[insertIdx % DIGIT_CYCLE.length];

    let ws = c.ch;
    while (ws > 0 && !" \t,".includes(line[ws - 1])) ws--;

    editor.replaceRange(toInsert + " ", { line: c.line, ch: ws });

    const insertedLen = toInsert.length + 1;
    const shiftedRight = rightDigits.map(d => ({ ...d, pos: d.pos + insertedLen }));
    recalcRight(editor, c.line, shiftedRight, ws + insertedLen, insertIdx + 1);

    editor.setCursor({ line: c.line, ch: ws + toInsert.length + 1 });
  }
}

/* ═══════════════════════════════════════════════
   ПЛАГИН
   ═══════════════════════════════════════════════ */

class InlineCheckboxPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension([ext]);

    this.addCommand({
      id: 'toggle-checkbox',
      name: 'Insert or toggle checkbox',
      editorCallback: (editor) => {
        toggleOrInsert(editor, CHECKBOX_CYCLE);
      }
    });

    this.addCommand({
      id: 'toggle-digit',
      name: 'Insert or toggle circled digit',
      editorCallback: (editor) => {
        smartInsertDigit(editor);
      }
    });
  }
}

module.exports = InlineCheckboxPlugin;