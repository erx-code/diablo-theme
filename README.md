# Diablo Theme

Две темы для VS Code: **Necromancer Dark** и **Necromancer Light**.

## Генерация тем

Для разработки нужен Node.js 22.6 или новее с поддержкой `--experimental-strip-types`.
Установка зависимостей не требуется.

```sh
npm run build
```

Исходники цветов и правил находятся в `src/palettes/necromancer-dark.ts`
и `src/palettes/necromancer-light.ts`. Все цвета объявляются в объекте `palette`
и используются по имени. Подсветка TS, TSX, JS, JSX, JSON, JSONC, CSS, SCSS и HTML использует
согласованные роли Blood & Bone. Tailwind `@apply` учитывает встроенную CSS
и установленную Tailwind injection grammar. Пять старых `syntax*` сохранены
только для diff, значков интерфейса и прозрачного Markdown overlay.

`src/build.ts` генерирует оба файла `themes/*-color-theme.json`.
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
npm test
npm run test:syntax
```

`npm test` проверяет генерацию, палитру, selectors и конфликтующие дубликаты.
`npm run test:syntax` проверяет реальные TextMate/Oniguruma и TypeScript semantic
tokens установленного VS Code на файлах `fixtures/syntax-audit.*`.
Зависимости не устанавливаются. При нестандартном расположении редактора задайте
`VSCODE_APP_ROOT` — путь к его каталогу `resources/app` (на macOS —
`Visual Studio Code.app/Contents/Resources/app`).

Это автоматические проверки токенизации, а не визуальные тесты окна VS Code.
Результаты аудита, принятые роли и ограничения грамматик описаны в
[отчёте](docs/syntax-audit.md).

Миграция CSS/SCSS/HTML/Tailwind, инвентаризация legacy-полей и ограничения:
[Legacy Palette Migration](docs/legacy-palette-migration.md).
