# Tema 1 - mini-frontend pentru un API REST

Link: https://HaitasDaniel.github.io/tema-web/

API folosit: https://jsonplaceholder.typicode.com/posts
- GET pentru lista de postari (primele 10)
- POST pentru adaugare
- DELETE pentru stergere

API-ul e de test, raspunde corect dar nu salveaza nimic.

CORS: pagina e pe github.io, API-ul pe alt domeniu. Merge fara proxy pentru ca serverul trimite headerul Access-Control-Allow-Origin: *.

Status codes:
- 200 / 201 - afisez lista, iar postarea noua o adaug in lista fara sa mai fac GET
- 4xx / 5xx - verific response.ok si afisez mesajul de la server (sau "Eroare + cod") langa formular sau deasupra listei
- 404 la DELETE - postarea nu exista pe server, o scot si din pagina
- eroare de retea - fetch arunca exceptie, o prind in catch si afisez un mesaj
