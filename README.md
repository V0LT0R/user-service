# User Service (Express + TS + Prisma)

Короткий проект для работы с пользователями. Есть регистрация, вход по JWT, роли `ADMIN/USER`, блокировка пользователя. Есть простые страницы: `/` (главная) и `/admin` (админка).

## Технологии

* **Express** + **TypeScript**
* **Prisma ORM**
* **SQLite** 

## Быстрый старт

```bash
npm i
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Открой: [http://localhost:3000](http://localhost:3000)

## .env (минимум)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=change_me
JWT_EXPIRES_IN=1h
DATABASE_URL="file:./dev.db"
```

## Эндпоинты

* **POST** `/api/auth/register` — регистрация → `{ user, token }`
* **POST** `/api/auth/login` — вход → `{ user, token }`
* **GET** `/api/users/:id` — получить пользователя (админ или сам)
* **GET** `/api/users` — список (только админ; `page`, `perPage`, `isActive`)
* **PATCH** `/api/users/:id/block` — заблокировать (админ или сам)


## Страницы

* `/` — формы регистрации и входа, блок «Мой профиль», кнопка «Заблокировать себя»
* `/admin` — таблица пользователей + кнопки «Блокировать» (нужен токен админа)


## Заметки

* Пароли хэшируются (bcrypt).
* JWT хранит `sub` (id) и `role`.
* В SQLite файл БД создастся сам после миграции (`dev.db`).
