# Инструкция по деплою на GitHub Pages

## Автоматический деплой (рекомендуется)

Проект настроен на автоматический деплой через GitHub Actions. При каждом пуше в ветку `main` сайт автоматически собирается и деплоится на GitHub Pages.

### Настройка GitHub Pages

1. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в `Settings` → `Pages`
   - В разделе `Source` выберите `GitHub Actions`
   - Сохраните изменения

2. **Настройте environment (если требуется):**
   - Перейдите в `Settings` → `Environments`
   - Если environment `github-pages` не создан автоматически, создайте его
   - Или просто используйте ручной деплой через `npm run deploy` (см. ниже)

2. **Настройте переменные окружения (опционально, для EmailJS):**
   - Перейдите в `Settings` → `Secrets and variables` → `Actions`
   - Добавьте секреты (если используете EmailJS):
     - `REACT_APP_EMAILJS_SERVICE_ID`
     - `REACT_APP_EMAILJS_TEMPLATE_ID`
     - `REACT_APP_EMAILJS_PUBLIC_KEY`

3. **Первый деплой:**
   - Сделайте push в ветку `main`
   - GitHub Actions автоматически запустит workflow
   - Проверьте статус в `Actions` → `Deploy to GitHub Pages`
   - После успешного деплоя сайт будет доступен по адресу:
     `https://illiaGoncharov.github.io/before-life-after-life/`

### Проверка деплоя

После первого деплоя проверьте:
- ✅ Сайт открывается по указанному URL
- ✅ Все изображения загружаются
- ✅ Форма работает корректно
- ✅ Мобильная версия отображается правильно

## Ручной деплой

Если нужно задеплоить вручную:

```bash
# Сборка проекта
npm run build

# Деплой на GitHub Pages
npm run deploy
```

Или через GitHub Actions:
- Перейдите в `Actions` → `Deploy to GitHub Pages` → `Run workflow`

## Устранение проблем

### Сайт не обновляется после деплоя
- Проверьте, что в `package.json` правильно указан `homepage`
- Очистите кеш браузера (Ctrl+Shift+R или Cmd+Shift+R)
- Проверьте логи в GitHub Actions

### Ошибки сборки
- Проверьте, что все зависимости установлены (`npm ci`)
- Убедитесь, что нет ошибок в коде (`npm run build` локально)
- Проверьте логи в GitHub Actions

### Переменные окружения не работают
- Убедитесь, что секреты добавлены в `Settings` → `Secrets and variables` → `Actions`
- Проверьте, что названия секретов совпадают с теми, что в `.github/workflows/deploy.yml`
- Пересоберите проект после добавления секретов

## Структура деплоя

```
.github/workflows/deploy.yml  # GitHub Actions workflow
package.json                   # Скрипты деплоя (predeploy, deploy)
build/                         # Собранные файлы (не коммитится)
```

## Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React App Deployment](https://create-react-app.dev/docs/deployment/#github-pages)

---
Последнее обновление: 2025-01-XX

