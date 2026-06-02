# 🚀 Деплой Hamov Patar на Vercel — инструкция

## Вариант 1 — Drag & Drop (самый простой, без кода)

1. Идите на https://vercel.com/new
2. Войдите в аккаунт **shantgrigoryans-projects**
3. Нажмите **"Browse"** / перетащите папку проекта
4. Выберите папку `hamov-patar` (с этими файлами)
5. Настройки оставьте по умолчанию — нажмите **Deploy**
6. Через 30 секунд сайт готов!

---

## Вариант 2 — Через Vercel CLI (терминал)

```bash
# Установите Vercel CLI (один раз)
npm install -g vercel

# Перейдите в папку проекта
cd путь/к/hamov-patar

# Деплой (первый раз спросит логин)
vercel --prod

# Имя проекта: hamov-patar
# Framework: Other (нет фреймворка)
# Build command: оставьте пустым
# Output directory: оставьте пустым (или точку .)
```

---

## Структура файлов

```
hamov-patar/
├── index.html          ← главная страница
├── vercel.json         ← конфиг Vercel
├── css/
│   └── style.css       ← стили
└── js/
    ├── translations.js ← переводы (RU + HY)
    └── main.js         ← логика сайта
```

---

## После деплоя

Сайт будет доступен по адресу:
`https://hamov-patar.vercel.app`

Для добавления армянских переводов откройте файл:
`js/translations.js`
и заполните строки помеченные `// ✏️ ЗАПОЛНИТЕ`

