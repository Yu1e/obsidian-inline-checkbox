# Inline Checkbox Plugin for Obsidian

A plugin that transforms Unicode symbols into styled interactive checkboxes and numbered markers directly in your text. Attention! These inline checkboxes are not tasks and are not recognized by Obsidian or task plugins; they are for visual styling only.

## Features

- **Inline checkboxes** — not in lists, but anywhere in the text
- **Click to toggle** — cycles through states
- **Two independent cycles:**
  - Checkboxes: `▢ → ☑ → ◧ → ☒ → ⚠ → ⍰ → ▢`
  - Digits: `① → ② → ③ → ④ → ⑤ → ⑥ → ⑦ → ⑧ → ⑨ → ①`
- **Fully customizable** — colors, sizes, glow effects via CSS variables

## Checkbox States

| Symbol | State | Description |
|:------:|-------|-------------|
| ▢ | Empty | Not started |
| ☑ | Done | Completed |
| ◧ | In Progress | Work in progress |
| ☒ | Cancelled | Cancelled/rejected |
| ⚠ | Important | Requires attention |
| ⍰ | Question | Needs clarification |

## Circled Digits

`①` `②` `③` `④` `⑤` `⑥` `⑦` `⑧` `⑨`

Use for priorities, numbered steps, ratings, etc.

## Installation

Manual (BRAT plugin).

1. Download the latest release
2. Extract to `.obsidian/plugins/inline-checkboxes/`
3. Enable in Settings → Community Plugins


Usage with Note Toolbar
Add a button to insert/toggle checkboxes:

JavaScript

const icons = ["▢", "☑", "◧", "☒", "⚠", "⍰"];
const editor = app.workspace.activeLeaf?.view?.editor;
if (!editor) return;
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
  editor.replaceRange("▢ ", {line: c.line, ch: ws});
  editor.setCursor({line: c.line, ch: ws});
}

For digits, make another button and replace icons array with:

JavaScript

const icons = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨"];

# License

MIT

# Support

This plugin was entirely created by Claude.

## Contributing

This plugin will not be submitted to the official Obsidian community plugins directory. If you find it useful and would like to see it there, feel free to fork and submit your own version.

I'm not actively maintaining this plugin or accepting feature requests.

Feel free to:
- Fork this repository and adapt it to your needs
- Create your own version with additional features
- Share your improvements with the community


# Inline Checkboxes — плагин для Obsidian

Плагин превращает Unicode-символы в стилизованные интерактивные псевдо-флажки и нумерованные маркеры внутри абзаца. Внимание! Флажки не являются задачами и не учитываются Обсидианом и плагинами задач, это чисто визуальное оформление.

## Возможности

- **Инлайн-чекбоксы** — не в списках, а в любом месте текста
- **Клик для переключения** — циклическая смена состояний
- **Два независимых цикла:**
  - Флажки: `▢ → ☑ → ◧ → ☒ → ⚠ → ⍰ → ▢`
  - Цифры: `① → ② → ③ → ④ → ⑤ → ⑥ → ⑦ → ⑧ → ⑨ → ①`
- **Полная кастомизация** — цвета, размеры, эффекты свечения через CSS-переменные

## Состояния флажков

| Символ | Состояние | Описание |
|:------:|-----------|----------|
| ▢ | Пусто | Не начато |
| ☑ | Готово | Завершено |
| ◧ | В процессе | В работе |
| ☒ | Отменено | Отменено/отклонено |
| ⚠ | Важно | Требует внимания |
| ⍰ | Вопрос | Нужно уточнение |

## Цифры в кружках

`①` `②` `③` `④` `⑤` `⑥` `⑦` `⑧` `⑨`

Используйте для приоритетов, нумерованных шагов, рейтингов и т.д.

## Установка

### Вручную

1. Скачайте последний релиз
2. Распакуйте в `.obsidian/plugins/inline-checkboxes/`
3. Включите в Настройки → Сторонние плагины

## Использование


### Команды (палитра команд)
- `Toggle inline checkbox` — вставить/переключить флажок
- `Toggle circled digit` — вставить/переключить цифру

### Клик мышью
Кликните по флажку или цифре в тексте — состояние переключится.

Назначить горячие клавиши: Настройки → Горячие клавиши → "Inline Checkboxes"

## Для изменения оформления редактируйте CSS-переменные в styles.css:

CSS

:root {
  /* Цвета флажков */
  --cb-empty:      #FF8C00;
  --cb-done:       #739834;
  --cb-progress:   #FFA500;
  --cb-cancelled:  #808080;
  --cb-important:  #a33333;
  --cb-question:   #DFA000;

  /* Эффекты свечения */
  --cb-glow-empty: #FF8C00;
  --cb-glow-prog:  #FFA500;

  /* Цифры в кружках */
  --cb-digit-size:  0.55em;
  --cb-digit-color: #e040fb;
  --cb-digit-glow:  #e040fb;
}

### Использование с Note Toolbar
Добавьте кнопку для вставки/переключения флажков:

#### JavaScript

const icons = ["▢", "☑", "◧", "☒", "⚠", "⍰"];
const editor = app.workspace.activeLeaf?.view?.editor;
if (!editor) return;
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
  editor.replaceRange("▢ ", {line: c.line, ch: ws});
  editor.setCursor({line: c.line, ch: ws});
}

##### Для цифр замените массив icons:

JavaScript

const icons = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨"];
Лицензия
MIT

# Поддержка
Плагин полностью создан Claude. 

## Участие в разработке

Этот плагин не будет отправлен в официальный каталог плагинов Obsidian. Если он кажется вам полезным и вы хотели бы видеть его там — форкайте и подавайте свою версию.

Я не планирую активно развивать этот плагин и не смогу выполнять запросы на доработку.

Вы можете свободно:
- Форкнуть репозиторий и адаптировать под свои нужды
- Создать собственную версию с дополнительными функциями
- Делиться улучшениями с сообществом

