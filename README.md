# JSONServer + JWT Auth

A Fake REST API using json-server with JWT authentication. 

Implemented End-points: login,register

## Install

```bash
$ npm install
$ npm run start-auth
```

Might need to run
```
npm audit fix
```

## How to login/register?

You can login/register by sending a POST request to

```
POST http://localhost:8000/auth/login
POST http://localhost:8000/auth/register
```
with the following data 

```
{
  "email": "nilson@email.com",
  "password":"nilson"
}
```

You should receive an access token with the following format 

```
{
   "access_token": "<ACCESS_TOKEN>"
}
```


You should send this authorization with any request to the protected endpoints

```
Authorization: Bearer <ACCESS_TOKEN>
```

You can perform GET, POST requests to

```
http://localhost:8000/products
http://localhost:8000/location
http://localhost:8000/families
http://localhost:8000/transactions
```
You can perform GET, UPDATE, DELETE requests to

```
http://localhost:8000/products/productId
http://localhost:8000/location/locationId
http://localhost:8000/families/familyId
http://localhost:8000/transactions/transactionId
```

