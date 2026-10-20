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
и используются по имени. Существующие цвета синтаксиса Dark сохранены отдельно
под именами `syntax*`; их настройка запланирована на следующий этап.

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
