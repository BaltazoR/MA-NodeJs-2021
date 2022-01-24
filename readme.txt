1. Устанавливаем проект - npm install 
2. Запускаем сервер базы данных - docker-compose up -d
3. Создаем таблицы, выполнив миграции - npm run sequelize:migrate:latest
4. Запускаем проект - npm start

5. Переходим в Postman и регистрируем нового пользователя.
    Endpoint: POST /registration

    BODY:
      {
        "email": "user@localhost.com",
        "password": "12345"
      }

6. Логинимся для дальнейшей работы
    Endpoint: POST /login

    BODY:
      {
        "email": "user@localhost.com",
        "password": "12345"
      }

  В Response получаем юзера(email) и хэшированный пароль, который будем 
  использовать при всех последующих действиях (Basic Auth).

  Response:
    {
      "id": "fae25948-6826-4ed7-99dd-934139636e8a",
      "username": "user@localhost.com",
      "password": "$2b$05$hhiUNG2CD/yP7F3BVNdag.GVJJ5CLgWe7ii9xDVowG25mYPkyiqli"
    }

7. Загружаем список продуктов с файла data_100.csv
    Endpoint: PUT /data

  или же создаем самостоятельно каждый продукт:
    Endpoint: POST /createproduct

    BODY:
      {
        "item":"apple",
        "measure":"quantity",
        "measurevalue":46,
        "pricetype": "pricePerItem",
        "pricevalue":"$8",
        "type":"red"
      }

8. Далее создаем заказ
    Endpoint: POST /createproduct

    BODY:
      {
        "productId": "9b1ae67c-0a0a-4320-8a29-6ffc4c917329",
        "measurevalue": 5
      }

  productId берем рандомно из таблицы Products DBeaver-ом или аналогом.

  Повторяем несколько раз с разными productId.

9. Просматриваем наш заказ
    Endpoint: GET /basket/getorder

