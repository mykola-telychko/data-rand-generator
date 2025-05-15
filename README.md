# 🎲 data-rand-generator

## DRG — Random Data Generator API

🔗 Live: [data-rand-generator.vercel.app](https://data-rand-generator.vercel.app/)

Генерує великі обсяги випадкових даних для розробників, тестувальників або генерації мок-даних.

---

## 📦 Серверні модулі

### 1. **server**
Обробляє API-запити та повертає випадкові дані з різними типами полів.

#### 🔗 Приклад запиту:
http://localhost:3001/api/generate?name=string&age=number&date=unix&qty=5000

---

### 2. **server-stream**
Генерує числові коди у потоковому форматі.

#### 🔗 Приклади запитів:
http://localhost:3001/api/generate?number=integer&codelen=10&qty=20
http://localhost:3001/api/generate?number=float&codelen=5&qty=50000


---

### 3. **server-idpass**
Генерація ID-подібних кодів або паролів.

#### 🔗 Приклад:
http://localhost:3001/api/generate?number=integer&codelen=7&qty=770&type=idpass


---

### 4. **Taxpayer ID генерація**
#### 🔗 Запит:
http://localhost:3001/api/generate?number=integer&codelen=10&qty=2000


---

## 📚 Додаткові типи даних

### Slavic Names, Streets, Addresses:
- Підтримуються: `alley`, `street`, `avenue`
- Сервер: `server-addresses`

#### 🔗 Список людей:
http://localhost:3001/api/list?people=ua
http://localhost:3001/api/list?people=ua&type=all


---

## 🧩 Підтримувані `type` параметри

| Тип          | Опис                              |
|---------------|-----------------------------------|
| `idpass`      | ID або коди доступу               |
| `passcodes`   | Паролі, коди                      |
| `postindexes` | Поштові індекси                   |
| `all`         | Повна комбінація даних            |

---

## ⚙️ Параметри генерації

| Параметр  | Значення               | Опис                              |
|-----------|------------------------|-----------------------------------|
| `number`  | `integer`, `float`     | Тип числових значень              |
| `codelen` | Ціле число             | Довжина коду                      |
| `qty`     | Ціле число             | Кількість записів                 |
| `type`    | `idpass`, `passcodes`, `postindexes`, `all` | Специфічний режим генерації |
| `name`    | `string`               | Генерація випадкового імені       |
| `age`     | `number`               | Генерація випадкового числа       |
| `date`    | `unix`                 | Дата у форматі UNIX timestamp     |

---

## 🧪 Приклади використання

### ➤ Створити 5000 випадкових людей з іменами, віком і unix-датою:
http://localhost:3001/api/generate?name=string&age=number&date=unix&qty=5000


### ➤ Генерація числових кодів довжиною 10:
http://localhost:3001/api/generate?number=integer&codelen=10&qty=20


### ➤ Генерація 50000 випадкових чисел з десятковою частиною:
http://localhost:3001/api/generate?number=float&codelen=5&qty=50000


### ➤ Отримати список українських імен:
http://localhost:3001/api/list?people=ua&type=all


---

> 🛠️ **Цей проєкт підтримує кастомні параметри генерації та масштабовану генерацію JSON-даних.** Можна легко розширити під будь-які типи мок-даних.
