# JSONServer + JWT Auth + Pytest

A Fake REST API using json-server with JWT authentication. 

Implemented End-points: login, register, products, locations, families, transactions

Written Test Cases with pytest framework such as: 

All Crud Actions for products, store locations, product families(category), transactions

Negative testing for Invalid Credentials

Security Testing for Authorization

Login and Registration Testing

Used Postman and JMeter for manual and performance testing

## Install Requirements
```bash
$ cd APITests
$ pip install -r requirements.txt
```
## Install Nodes

```bash
$ cd JSONServer
$ npm install
$ npm run start-auth
```

## To Run All Tests
```bash
$ pytest -v testCases/
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
  "email": "shoniki951@gmail.com",
  "password":"shoniki951"
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

