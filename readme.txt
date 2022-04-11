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

  Response:
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJ0eXBlIjoicmVmcmVzaCIsImlkIjoiNDRhZjFjNWYtNDBhMy00YzM4LWEyMDQtNzg0Y2UzNjkzOTYwIiwiZW1haWwiOiJ1c2VyQGxvY2FsaG9zdC5jb20iLCJpYXQiOjE2NDM3NDAxNzYsImV4cCI6MTY0MzgyNjU3Nn0.
    uYj8vydsFW6XD2jYND0vSvnDmMPCMOv2_XJm1qk2oGo",

    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJ0eXBlIjoiYWNjZXNzIiwiaWQiOiI0NGFmMWM1Zi00MGEzLTRjMzgtYTIwNC03ODRjZTM2OTM5NjAiLCJlbWFpbCI6InVzZXJAbG9jYWxob3N0LmNvbSIsImlhdCI6MTY0Mzc0MDE3NiwiZXhwIjoxNjQzNzQwMzU2fQ.
    MjJqqmm1tLZzK1cOJTRUgAsfZE4prg8m2CNNecs1Fhk"
}

  В Response получаем 2ва токена - AccessToken и RefreshToken.
  AccessToken будем использовать при всех последующих действиях (Bearer token). 
  Он имеет короткий срок жизни. По его истечению необходимо его обновить. 
  
  * Для обновления AccessToken воспользуемся RefreshToken-ом, перейдя на эндпоинт:

      Endpoint: GET /refresh

      В хэдэре (Bearer token) передаем RefreshToken. После этого в ответе получаем 
        новую пару токенов.

      Response:

      {
        "refreshToken": "...",
        "accessToken": "..."
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
    Endpoint: POST /basket/addorder

    BODY:
      {
        "productId": "9b1ae67c-0a0a-4320-8a29-6ffc4c917329",
        "measurevalue": 5
      }

  productId берем рандомно из таблицы Products DBeaver-ом или аналогом.

  Повторяем несколько раз с разными productId.

9. Просматриваем наш заказ
    Endpoint: GET /basket/getorder

10. Расчет стоимости доставки делаем в два шага:
      1. узнаем айди (Ref) городов
        Endpoint: POST /getCities

        BODY:
          {
            "CitySender": "Черкаси", // отправитель
            "CityRecipient": "Шостка" // получатель
          }
        
        Response:

          {
            "citySender": [
                {
                    "Description": "Черкаси",
                   ...
                    "Ref": "db5c8902-391c-11dd-90d9-001a92567626",
                    ...
                }
            ],
            "cityRecipient": [
                {
                    "Description": "Шостка",
                   ...
                    "Ref": "e221d64c-391c-11dd-90d9-001a92567626",
                   ...
                }
            ]
          }

      2. Рассчитываем стоимость. Берем айди (Ref) с предыдущего запроса и 
         формируем новый

         Endpoint: POST /getdocumentprice

          BODY:
            {
              "CitySender": "db5c8902-391c-11dd-90d9-001a92567626",
              "CityRecipient": "db5c88f5-391c-11dd-90d9-001a92567626",
              "Weight": "10", // вес
              "Cost": "1500" // оценочная стоимость
            }

          Response:
            {
                ...
                "data": [
                    {
                        "Cost": 88, // стоимость доставки
                        "AssessedCost": 1500
                    }
                ],
              ...
            }
