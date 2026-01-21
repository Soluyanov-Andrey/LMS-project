Установка на сервер Ubuntu.

---

### Шаг 1: Подготовка системы и глобальные установки

Заходим на сервер по SSH и выполняем базовую настройку.

```bash
# 1. Обновляем систему
sudo apt update && sudo apt upgrade -y

# 2. Устанавливаем базовые утилиты
sudo apt install -y curl git build-essential

# 3. Устанавливаем NVM (Node Version Manager) — лучший способ управления Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Перезагружаем окружение (или просто перезайди на сервер)
source ~/.bashrc

# 4. Устанавливаем Node.js (в 2025 году берем 22-ю или 24-ю версию)
nvm install 22
nvm use 22

# 5. Устанавливаем NestJS CLI глобально
npm install -g @nestjs/cli

# 6. Устанавливаем PostgreSQL (серверная часть)
sudo apt install -y postgresql postgresql-contrib

# Запускаем Postgres и настраиваем автозапуск
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

### Шаг 2: Создание структуры проекта

Мы создаем общую папку «монорепозитория».

```bash
mkdir lms-project && cd lms-project
```

---

### Шаг 3: Установка и запуск Фронтенда (Next.js)

Используем интерактивный установщик. **Важно:** на вопрос про Tailwind отвечаем **No**, так как мы выбрали **CSS Modules**.

```bash
npx create-next-app@latest frontend
```


### Финальные настройки установки Frontend (Next.js)

При запуске команды `npx create-next-app@latest frontend` выбираем следующие параметры:

1.  **Would you like to use the recommended Next.js defaults?** — **No / customize settings**
    *(Это самый важный пункт. Если нажать Yes, он поставит Tailwind по умолчанию и не даст выбора).*
2.  **Would you like to use TypeScript?** — **Yes**
    *(Обязательно для нашего бэкенда на NestJS, чтобы типы данных совпадали).*
3.  **Would you like to use ESLint?** — **Yes**
    *(Помогает находить ошибки в коде на лету).*
4.  **Would you like to use Tailwind CSS?** — **No**
    *(Наш выбор — **CSS Modules**. Отключаем Tailwind, чтобы не тянуть лишние библиотеки и писать чистый нативный CSS).*
5.  **Would you like to use React Compiler?** — **Yes**
    *(Новая технология React 19. Автоматически оптимизирует производительность, избавляя нас от ручного написания `useMemo` и `useCallback`).*
6.  **Would you like to use `src/` directory?** — **Yes**
    *(Разделяет конфигурационные файлы и исходный код. Так проект выглядит чище).*
7.  **Would you like to use App Router? (recommended)** — **Yes**
    *(Современный стандарт маршрутизации Next.js).*
8.  **Would you like to use Turbopack for `next dev`?** — **Yes**
    *(Новый сборщик, который работает значительно быстрее классического Webpack).*
9.  **Would you like to customize the default import alias (@/*)?** — **No**
    *(Стандартный алиас `@/` нам подходит).*

---


**Проверка:**
```bash
cd frontend
npm run dev
```
*Если сервер на Ubuntu, Next.js запустится на `http://localhost:3000`. Если ты заходишь снаружи, убедись, что порт 3000 открыт в Firewall (или используй `npm run dev -- -H 0.0.0.0`).*
Убедились, что работает? `Ctrl+C` и выходим обратно в корень: `cd ..`

---


 **Шаг 4: Создание Бэкенд-Монолита на NestJS**.

Поскольку Next.js по умолчанию занимает порт **3000**, мы настроим NestJS на порт **4000**, чтобы они могли работать одновременно.

### 4.1. Инициализация NestJS

Возращаемся в корень проекта `lms-project` и создай бэкенд:

```bash
cd ~/lms-project
nest new backend
```
*Выбираем **npm** как пакетный менеджер.*

### 4.2. Установка зависимостей (Prisma и утилиты)

Заходим в папку бэкенда и ставим всё необходимое для работы с БД и валидации:

```bash
cd backend

# Ставим Prisma (выберем стабильную 6-ю версию, как обсуждали)
npm install prisma@6 @prisma/client@6

**Настройка БД (сразу создадим базу):**
```bash
# Заходим под системным юзером postgres и создаем базу/пользователя
sudo -u postgres psql -c "CREATE DATABASE lms_db;"
sudo -u postgres psql -c "CREATE USER lms_admin WITH PASSWORD 'strong_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE lms_db TO lms_admin;"
sudo -u postgres psql -c "ALTER DATABASE lms_db OWNER TO lms_admin;"
```

---


# Утилиты для валидации данных (DTO)
npm install class-validator class-transformer
```

### 4.3. Настройка порта (с 3000 на 4000)

Это критически важно, чтобы не было конфликта с фронтендом.
Открой файл `src/main.ts`:
```bash
nano src/main.ts
```
Измени `await app.listen(process.env.PORT ?? 3000);` на:
```typescript
await app.listen(4000);
console.log(`Application is running on: http://localhost:4000`);
```

### 4.4. Настройка Prisma и Базы Данных

**1. Инициализируем Prisma:**
```bash
npx prisma init
```

**2. Настраиваем подключение к БД в `.env`:**
Открой файл `.env` в папке `backend`:
```bash
nano .env
```
Замени строку `DATABASE_URL` на ту, что мы создавали в Шаге 1 (подставь свой пароль):
```text
DATABASE_URL="postgresql://lms_admin:strong_password_here@localhost:5432/lms_db?schema=public"
```

**3. Описываем нашу схему с ролями:**
Открой `prisma/schema.prisma`:
```bash
nano prisma/schema.prisma
```
Сотри всё и вставь нашу базовую структуру:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  STUDENT
  TEACHER
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}
```

**4. Применяем схему к базе данных:**
```bash
npx prisma db push
```

### 4.5. Проверка запуска

Теперь запускаем бэкенд в режиме разработки:
```bash
npm run start:dev
```

Если ты видишь в консоли `Nest application successfully started`, значит:
1. NestJS работает на порту 4000.
2. Он успешно соединился с твоей PostgreSQL.
3. Таблицы в базе созданы.

### Настройка jwt для этого ставим пакеты
npm install @nestjs/jwt passport-jwt
npm install -D @types/passport-jwt

### По умолчанию NestJS не умеет парсить куки и работать с ними удобно.
npm install cookie-parser
npm install -D @types/cookie-parser

### Ошибка была 
**TypeScript просит импортировать Request и Response либо как типы, либо через namespace. Самый надежный способ для NestJS — это import type или использование имен из пространства express.
Почему это произошло?

Когда включен параметр emitDecoratorMetadata, TypeScript пытается сохранить информацию о типах аргументов функции, чтобы NestJS мог использовать их в рантайме. Если тип (например, Response) импортирован просто так, компилятор путается, является ли это реальным классом или просто описанием типа. import type или namespace импорты решают эту проблему.
Установил

npm install @nestjs/passport passport