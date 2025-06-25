#Setup

Для тестування через постман

1. Запустіть Docker контейнер:

```bash
docker run --name movies -p 8000:8050 -e APP_PORT=8050 onelaack/movies

```

2. Відкрийте Postman та створіть нову колекцію
3. Базова URL: http://localhost:8000

Крок 1: Реєстрація користувача
Налаштування запиту:

Метод: POST
URL: http://localhost:8000/api/v1/users
Headers:

Content-Type: application/json

Body (raw JSON):
json{
"email": "test@example.com",
"name": "Test User",
"password": "123456",
"confirmPassword": "123456"
}

Очікуваний результат:
json{
"token": "якийсьтокен...",
"status": 1
}

НЕ ЗАБУВАЄМ КОПІЮВАТИ ТОКЕН

Крок 2: Авторизація (опціонально)
Налаштування запиту:

Метод: POST
URL: http://localhost:8000/api/v1/sessions
Headers:

Content-Type: application/json

Body (raw JSON):
json{
"email": "test@example.com",
"password": "123456"
}

Крок 3: Створення фільму
Налаштування запиту:

Метод: POST
URL: http://localhost:8000/api/v1/movies
Headers:

Content-Type: application/json
Authorization: ВАШ_ТОКЕН

Body (raw JSON):
json{
"title": "Test Movie",
"year": 2023,
"format": "DVD",
"actors": ["Test Actor 1", "Test Actor 2"]
}

Крок 4: Отримання списку фільмів
Налаштування запиту:

Метод: GET
URL: http://localhost:8000/api/v1/movies
Headers:

Authorization: ВАШ_ТОКЕН

Очікуваний результат:
json{
"data": [
{
"id": 1,
"title": "Test Movie",
"year": 2023,
"format": "DVD",
"actors": [
{
"id": 1,
"name": "Test Actor 1"
}
]
}
],
"meta": {
"total": 1
},
"status": 1
}
Крок 5: Пагінація та сортування
Налаштування запиту:

Метод: GET
URL: http://localhost:8000/api/v1/movies?limit=5&offset=0&sort=year&order=DESC
Headers:

Authorization: ВАШ_ТОКЕН

Крок 6: Пошук за назвою
Налаштування запиту:

Метод: GET
URL: http://localhost:8000/api/v1/movies?title=Test
Headers:

Authorization: ВАШ_ТОКЕН

Крок 7: Пошук за актором
Налаштування запиту:

Метод: GET
URL: http://localhost:8000/api/v1/movies?actor=Actor
Headers:

Authorization: ВАШ_ТОКЕН

Крок 8: Комбінований пошук
Налаштування запиту:

Метод: GET
URL: http://localhost:8000/api/v1/movies?search=Test
Headers:

Authorization: ВАШ_ТОКЕН

Крок 9: Оновлення фільму (PATCH)
Налаштування запиту:

Метод: PATCH
URL: http://localhost:8000/api/v1/movies/1
Headers:

Content-Type: application/json
Authorization: ВАШ_ТОКЕН

Body (raw JSON):
json{
"title": "Updated Movie Title",
"year": 2024,
"format": "Blu-Ray",
"actors": ["Updated Actor"]
}

Крок 10: Імпорт фільмів з файлу
Налаштування запиту:

Метод: POST
URL: http://localhost:8000/api/v1/movies/import
Headers:

Authorization: ВАШ_ТОКЕН

Body:

Виберіть form-data
Key: movies (тип: File)
Value: Завантажте файл sample_movies.txt

Файл sample_movies.txt можна завантажити з: https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad
Крок 11: Отримання фільму за ID
Налаштування запиту:

Метод: GET
URL: http://localhost:8000/api/v1/movies/1
Headers:

Authorization: ВАШ_ТОКЕН

Крок 12: Видалення фільму
Налаштування запиту:

Метод: DELETE
URL: http://localhost:8000/api/v1/movies/1
Headers:

Authorization: ВАШ_ТОКЕН

Очікуваний результат:
json{
"status": 1,
"message": "Movie deleted successfully"
}

Структура відповіді

Успішна відповідь (список)

json{
"data": [
{
"id": 1,
"title": "Casablanca",
"year": 1942,
"format": "DVD",
"actors": [
{
"id": 1,
"name": "Humphrey Bogart",
"createdAt": "2021-06-29T10:51:46.000Z",
"updatedAt": "2021-06-29T10:51:46.000Z"
}
],
"createdAt": "2021-06-29T10:56:31.000Z",
"updatedAt": "2021-06-29T10:56:31.000Z"
}
],
"meta": {
"total": 25
},
"status": 1
}

Помилка

json{
"status": 0,
"error": "Movie not found"
}

Формат файлу для імпорту

Title: Blazing Saddles
Release Year: 1974
Format: VHS
Stars: Mel Brooks, Clevon Little, Harvey Korman

Title: Casablanca
Release Year: 1942
Format: DVD
Stars: Humphrey Bogart, Ingrid Bergman, Claude Rains

Docker

Швидкий запуск
docker run --name movies -p 8000:8050 -e APP_PORT=8050 onelaack/movies

Зупинка та очистка
docker stop movies && docker rm movies

Збірка з репо
git clone YOUR_REPO_URL
cd sampleMovies
docker build -t movies .
docker run --name movies -p 8000:8050 -e APP_PORT=8050 movies

Локальна розробка

Встановлення
git clone YOUR_REPO_URL
cd sampleMovies
npm install

Налаштування
bashcp .env.example .env

# Відредагуйте .env файл при необхідності

Запуск
npm run dev # Розробка з автоперезапуском
