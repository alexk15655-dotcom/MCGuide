# Interactive Agent Guide

Интерактивный мультиязычный гайд с поддержкой брендинга.

## Функции

- 25 брендов с разными цветовыми схемами
- 6 языков (RU/EN/AR/UZ/BN/FR), легко добавить новые
- Поддержка RTL (арабский)
- Интерактивная навигация по шагам
- Адаптивный дизайн
- Плавные анимации переходов между шагами
- Ленивая загрузка изображений для оптимизации производительности
- Встраиваемое видео (YouTube/Vimeo)
- Изображения к карточкам ошибок (страница "Частые ошибки")
- Градиентный заголовок "Mobcash" в шапке

## URL-структура

```
/mobcash?lang=ru     → бренд Mobcash, русский
/wowbet?lang=en      → бренд WowBet, английский
/fastpari            → бренд FastPari, язык по умолчанию
```

## Локальный запуск

```bash
npm install
npm run dev
```

Откроется на http://localhost:3000

## Деплой на Netlify

1. Push в GitHub
2. В Netlify: New site → Import from Git
3. Выбрать репозиторий
4. Деплой автоматический

## Структура файлов

```
/config/brands.json    ← конфиги 25 брендов (цвета, лого, название)
/content/steps.json    ← весь контент гайда на всех языках
/public/logos/         ← SVG логотипы брендов
/public/images/        ← изображения для шагов
```

## Добавление нового бренда

1. Добавь объект в `config/brands.json`:
```json
"newbrand": {
  "name": "New Brand",
  "logo": "/logos/newbrand.svg",
  "primary": "#HEX",
  "secondary": "#HEX",
  "background": "#HEX"
}
```

2. Добавь логотип в `/public/logos/newbrand.svg`

3. Готово. Доступен по `/newbrand`

## Добавление нового языка

1. В `content/steps.json` добавь код языка в массив `languages`
2. Добавь название в `languageNames`
3. Для каждого шага добавь перевод в соответствующие поля

## Редактирование контента

Файл `content/steps.json` содержит весь контент.

Используй `{{brand}}` в тексте — будет заменено на название бренда.

Типы контента в шагах:
- `title` — заголовок
- `content` — основной текст
- `image` — путь к изображению шага (напр. `"/images/step-01.png"`)
- `video` — embed-ссылка на YouTube/Vimeo (см. ниже)
- `listItems` — маркированный список
- `numberedSteps` — нумерованные шаги
- `columns` — две колонки (уменьшается/увеличивается)
- `errorCards` — карточки ошибок (поддерживают индивидуальные изображения)
- `notes` — информационный блок
- `warning` — предупреждение

## Замена placeholder-изображений

Положи реальные скриншоты в `/public/images/` с именами `step-01.png`, `step-02.png` и т.д.

Обнови расширения в `content/steps.json` если нужно (`.png` вместо `.svg`).

## Встраивание видео (YouTube / Vimeo)

Добавь поле `video` в нужный шаг в `content/steps.json` с embed-ссылкой:

```json
{
  "id": "some-step",
  "video": "https://www.youtube.com/embed/VIDEO_ID"
}
```

Для Vimeo: `"video": "https://player.vimeo.com/video/VIDEO_ID"`

## Изображения в карточках ошибок

Каждая карточка ошибки (в `errorCards`) поддерживает индивидуальное изображение. Добавь поле `image` в нужную карточку:

```json
{
  "title": "Название ошибки",
  "description": "Описание",
  "solution": "Решение",
  "image": "/images/error-example.png"
}
```

Изображение отображается справа от текста (слева для арабского RTL).
