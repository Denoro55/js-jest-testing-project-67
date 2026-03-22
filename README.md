### Hexlet tests and linter status:
[![Actions Status](https://github.com/Denoro55/js-jest-testing-project-67/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Denoro55/js-jest-testing-project-67/actions)

# page-loader

Утилита для скачивания веб-страниц вместе с локальными ресурсами (изображения, стили, скрипты).

## Установка

Глобально (рекомендуется):

```sh
npm install -g`
```

Локально (только в папке проекта):

```sh
npm install
```

## Использование

### CLI

Глобально (рекомендуется):

```sh
page-loader [options] <url>
```

Локально (только в папке проекта):

```sh
npx page-loader [options] <url>
```

## Удаление

Глобально:

```sh
npm run remove
```

**Опции:**

| Опция | Описание | По умолчанию |
|---|---|---|
| `-o, --output <path>` | Директория для сохранения | `./output` |
| `-d, --debug` | Включить debug-логи | выключено |
| `-V, --version` | Версия утилиты | |
| `-h, --help` | Справка | |

**Примеры:**

```sh
# Скачать страницу в текущую директорию
page-loader https://google.com

# Указать директорию для сохранения
page-loader -o /tmp/pages https://google.com

# С debug-логами
page-loader --debug https://google.com
```

### Программный API

```ts
import { PageLoader } from 'testing-project-67';

const loader = new PageLoader('./output');
await loader.load('https://google.com');
```
;lp
## Что скачивается

Утилита скачивает страницу и все локальные ресурсы с того же домена:
- Изображения (`<img src="...">`)
- Стили (`<link href="...">`, кроме `rel="canonical"`)
- Скрипты (`<script src="...">`)

Ресурсы сохраняются в папку `<hostname>-<path>_files/`, HTML-файл — рядом.

## Debug-логи

Для расширенного вывода можно использовать флаг `--debug` или переменную окружения:

```sh
DEBUG=page-loader:* page-loader https://example.com
DEBUG=axios,page-loader:* page-loader https://example.com
```

## Разработка

```sh
# Запустить тесты
npm test

# Запустить без сборки
npm run page-loader -- https://google.com --debug -o output

# Очистить папку output
npm run clean
```

