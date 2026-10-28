# Diablo Theme

Четыре темы для VS Code: **Necromancer Dark**, **Necromancer Light**,
**Paladin Dark** и **Paladin Light**.

Paladin Dark использует палитру Ivory & Midnight: полуночные поверхности,
текст цвета слоновой кости, золотые, лавандовые и шалфейные акценты.
Paladin Light сочетает светлый ivory-фон с тёмным текстом и более глубокими
оттенками тех же акцентов для читаемой подсветки.

Во всех четырёх темах переменные и параметры выделяются акцентным цветом,
а свойства — основным цветом текста: в `palette.someValue` объект `palette`
отличается от свойства `someValue`. Правила работают в TS, TSX, JS и JSX
с семантической подсветкой и без неё.
Функции и методы используют третий цвет: в Paladin переменные золотые,
функции лавандовые, свойства цвета основного текста. В Necromancer переменные
медные, функции розовые в Dark и бордовые в Light.

Файлы `.env`, `.env.local`, `.env.example` и другие варианты Dotenv также
используют цвета выбранной темы: имена переменных, значения, `export`,
подстановки `${NAME}`, escape-последовательности и комментарии.
Поддерживаются встроенный язык Dotenv (`source.dotenv`) и расширение
`mikestead.dotenv` (`source.env`). Если файл открыт как Plain Text, выберите
для него язык **Dotenv / Environment Variables** в строке состояния VS Code.
Точность подсветки подстановок и числовых значений зависит от грамматики:
`mikestead.dotenv` не размечает подстановки вне кавычек, а встроенная грамматика
не выделяет числа и boolean отдельно от остальных значений.

## Генерация тем

Для разработки нужен Node.js 22.6 или новее с поддержкой `--experimental-strip-types`.
Установка зависимостей не требуется.

```sh
npm run build
```

Исходники тем находятся в `src/palettes/`. Палитры Paladin задаются в
`paladin-dark/primitives.ts` и `paladin-light/primitives.ts`, общие роли —
в `paladin.ts`. Привязки интерфейса и правила подсветки полных тем находятся
в `src/theme/create-theme.ts`. Подсветка TS, TSX, JS, JSX, JSON, JSONC, CSS, SCSS и HTML использует
согласованные роли Blood & Bone. Tailwind `@apply` учитывает встроенную CSS
и установленную Tailwind injection grammar. Пять старых `syntax*` сохранены
только для diff, значков интерфейса и прозрачного Markdown overlay.

`src/build.ts` генерирует все четыре файла `themes/*-color-theme.json`.
Изменяйте TypeScript-исходники, затем запускайте сборку и сохраняйте обновлённые
JSON вместе с исходниками. Повторная сборка перезаписывает JSON.

Для просмотра запустите конфигурацию **Extension** через F5 и выберите тему
командой **Preferences: Color Theme** в Extension Development Host.

Расширение использует готовые JSON-файлы; Node.js нужен только для генерации.
Оформление чата распространяется на встроенные компоненты VS Code и элементы,
которые используют его цвета темы. Собственный интерфейс сторонних расширений
может потребовать отдельной поддержки этих цветов.

Используемые ключи интерфейса описаны в
[VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color).

## Проверки подсветки

```sh
npm run build:check
npm test
npm run test:syntax
npm run test:identifiers
npm run test:dotenv
```

`npm run build:check` ничего не записывает: сравнивает результат из исходников
и JSON в `themes/` с независимыми [baseline-файлами](tests/baselines/README.md).
Сравнение включает все цвета, semantic tokens, порядок TextMate rules/selectors,
fontStyle и точные байты JSON тем Necromancer. Для Paladin проверяется
соответствие JSON исходникам. Baseline не обновляется сборкой.
При миграции архитектуры он должен оставаться неизменным.

`npm test` проверяет генерацию, палитру, selectors и конфликтующие дубликаты.
Также проверяет baseline и способность проверки обнаруживать изменения.
`npm run test:syntax` проверяет реальные TextMate/Oniguruma и TypeScript semantic
tokens установленного VS Code на файлах `fixtures/syntax-audit.*`.
Зависимости не устанавливаются. При нестандартном расположении редактора задайте
`VSCODE_APP_ROOT` — путь к его каталогу `resources/app` (на macOS —
`Visual Studio Code.app/Contents/Resources/app`).

Это автоматические проверки токенизации, а не визуальные тесты окна VS Code.
`npm run test:identifiers` отдельно проверяет различие переменных, свойств и функций
на настоящих TextMate-грамматиках и TypeScript semantic tokens для всех тем.
`npm run test:dotenv` проверяет цвета настоящих Dotenv-токенов во всех темах
на примерах из `fixtures/syntax-audit.env`. Для проверки `mikestead.dotenv`
используется уже установленное расширение; нестандартный путь можно задать
через `VSCODE_DOTENV_ROOT`.
Результаты аудита, принятые роли и ограничения грамматик описаны в
[отчёте](docs/syntax-audit.md).

Миграция CSS/SCSS/HTML/Tailwind, инвентаризация legacy-полей и ограничения:
[Legacy Palette Migration](docs/legacy-palette-migration.md).
