# 🚀 Как залить проект на GitHub

## Вариант 1: Через командную строку (у тебя локально)

1. **Скачай и распакуй проект** (архив pet-airlines.zip)

2. **Перейди в папку:**
   ```bash
   cd pet-airlines
   ```

3. **Проверь Git:**
   ```bash
   git status
   ```

4. **Если нет git, инициализируй:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Добавь remote:**
   ```bash
   git remote add origin https://github.com/JinojiLock/Animals_on_the_airplane.git
   ```

6. **Залей на GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Вариант 2: Через GitHub Desktop (проще)

1. Открой GitHub Desktop
2. File → Add Local Repository
3. Выбери папку `pet-airlines`
4. Нажми "Publish repository"
5. Выбери репозиторий `Animals_on_the_airplane`
6. Готово!

## Вариант 3: Через веб-интерфейс GitHub (самый простой)

1. Открой https://github.com/JinojiLock/Animals_on_the_airplane
2. Нажми "Add file" → "Upload files"
3. Перетащи все файлы из папки проекта
4. Напиши commit message: "Initial project setup"
5. Нажми "Commit changes"

⚠️ **Не загружай папки:**
- `node_modules/`
- `dist/`
- `.git/`

Они уже в `.gitignore`

## После заливки

Склонировать на другой машине:
```bash
git clone https://github.com/JinojiLock/Animals_on_the_airplane.git
cd Animals_on_the_airplane
npm install
npm run dev
```

Готово! 🎉
