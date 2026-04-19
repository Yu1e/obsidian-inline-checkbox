# Inline Checkbox Plugin for Obsidian

A plugin that transforms Unicode symbols into styled interactive checkboxes and numbered markers directly in your text. Attention! These inline checkboxes are not tasks and are not recognized by Obsidian or task plugins; they are for visual styling only.

![Demo](demo.png)

![Demo](demoen.png)

Features
Inline checkboxes — not in lists, but anywhere in the text.
Click to toggle — cycles through states instantly.
Two independent cycles:
Checkboxes: ▢ → ☑ → ◧ → ☒ → ⚠ → ⍰ → ▢
Smart Digits: ① → ② ... → ⑳ → ①
Smart Sequence Management:
Context-aware insertion: Automatically detects the previous number in a paragraph and inserts the next one.
Auto-reindexing: If you insert a digit in the middle of a sequence, the plugin automatically increments all subsequent digits to maintain the correct order.
Fully customizable — colors, sizes, and glow effects via CSS variables.
Checkbox States
Symbol	State	Description
▢	Empty	Not started (Orange animated glow)
☑	Done	Completed (Green filled square)
◧	In Progress	Work in progress (Half-filled)
☒	Cancelled	Cancelled/rejected (Gray)
⚠	Important	Requires attention (Red square)
⍰	Question	Needs clarification (Mustard square)
Circled Digits
① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯ ⑰ ⑱ ⑲ ⑳

Use for priorities, numbered steps, or ratings. No more manual numbering — the plugin manages the sequence for you!

Installation
Download the latest release (main.js, manifest.json, styles.css).
Create a folder: .obsidian/plugins/Yule-inline-checkbox/.
Move the files into that folder.
Enable in Settings → Community Plugins.

---

# Inline Checkboxes — плагин для Obsidian

Плагин превращает Unicode-символы в стилизованные интерактивные псевдо-флажки и нумерованные маркеры внутри абзаца. Внимание! Флажки не являются задачами и не учитываются Обсидианом и плагинами задач, это чисто визуальное оформление.

## Возможности

- **Инлайн-чекбоксы** — не в списках, а в любом месте текста.
- **Клик для переключения** — циклическая смена состояний.
- **Два независимых цикла:**
  - Флажки: `▢ → ☑ → ◧ → ☒ → ⚠ → ⍰ → ▢`
  - Цифры: `① → ② → ... → ⑩ → ... → ⑳ → ①`
- **Умная нумерация (v2.0.0):**
  - **Контекстная вставка:** Плагин находит ближайшую предыдущую цифру в абзаце и автоматически подставляет следующую по порядку.
  - **Автоматический пересчет:** При вставке цифры в середину ряда все последующие цифры в этом абзаце автоматически увеличиваются, сохраняя правильную последовательность.
- **Полная кастомизация** — цвета, размеры, эффекты свечения через CSS-переменные.

## Состояния флажков

| Символ | Состояние | Описание |
|:------:|-----------|----------|
| `▢` | Пусто | Не начато (оранжевое пульсирующее свечение) |
| `☑` | Готово | Завершено (залитый зеленый квадрат) |
| `◧` | В процессе | В работе (залит наполовину) |
| `☒` | Отменено | Отменено/отклонено (серый) |
| `⚠` | Важно | Требует внимания (красный квадрат) |
| `⍰` | Вопрос | Нужно уточнение (горчичный квадрат) |

## Цифры в кружках
`① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ⑯ ⑰ ⑱ ⑲ ⑳`

Используйте для приоритетов, нумерованных шагов, рейтингов. Больше не нужно следить за нумерацией вручную — плагин сделает это за вас при вставке новой цифры.

## Установка

### Вручную
1. Скачайте последний релиз (`main.js`, `manifest.json`, `styles.css`).
2. Создайте папку `.obsidian/plugins/Yule-inline-checkbox/`.
3. Поместите скачанные файлы в эту папку.
4. Включите плагин в **Настройки → Сторонние плагины**.

Через плагин BRAT
1. Установите плагин BRAT.
2. В настройках BRAT нажмите Add Beta plugin.
3. Вставьте ссылку на этот репозиторий: https://github.com/Yu1e/obsidian-inline-checkbox.git
4. Нажмите Add Plugin, затем включите Inline Checkboxes в настройках сторонних плагинов.

## Использование

### Команды (палитра команд)
- `Insert or toggle checkbox` — вставить/переключить флажок.
- `Insert or toggle circled digit` — вставить следующую по порядку цифру или переключить существующую.

### Клик мышью
Кликните по флажку или цифре в тексте — состояние переключится. При переключении цифр последующие цифры в строке также будут пересчитаны.

## Настройка оформления
Для изменения цветов и размеров редактируйте переменные в начале файла `styles.css`:

### Использование с Note Toolbar
Коды для вставки и переключения флажков и умных цифр прилагается отдельно: 
- ([checkboxes-button-for-note-toolbar-plugin](https://github.com/Yu1e/obsidian-yule-inline-checkbox/blob/7da7281e1785e958c9cc8f1dc5a82f4074a5d581/checkboxes-button-for-note-toolbar-plugin).js)
- [digits-button-for-note-toolbar-plugin.js](digits-button-for-note-toolbar-plugin.js)

## Лицензия
MIT

## Поддержка
Плагин полностью создан Claude по запросу и под руководством пользователя.

### Участие в разработке
Этот плагин не будет отправлен в официальный каталог плагинов Obsidian. Если он кажется вам полезным — форкайте и публикуйте свою версию.

Автор не планирует активно развивать этот плагин. Вы можете свободно:
- Адаптировать код под свои нужды.
- Создавать собственные версии с дополнительными функциями.
- Делиться улучшениями с сообществом.
