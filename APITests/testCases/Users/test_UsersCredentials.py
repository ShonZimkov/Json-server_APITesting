import requests
from APITests.utilities.readProperties import ReadConfig
import string
import random

def test_login_wrongEmail(): # test login function with wrong email
    # Arrange
    password = ReadConfig.getPassword()
    baseUrl = ReadConfig.getBaseURL()

    login_data = {
        "email": "shon@gmail.com",
        "password": password
    }
    # login
    response = requests.post(baseUrl + "/auth/login", json=login_data)
    assert response.status_code == 401

def test_login_wrongPassword(): # test login function with wrong password
    # Arrange
    email = ReadConfig.getEmail()
    baseUrl = ReadConfig.getBaseURL()

    login_data = {
        "email": email,
        "password": "wrongPass"
    }
    # login
    response = requests.post(baseUrl + "/auth/login", json=login_data)
    assert response.status_code == 401

def test_register(): # test register function with existing user
    # Arrange
    email = ReadConfig.getEmail()
    password = ReadConfig.getPassword()
    baseUrl = ReadConfig.getBaseURL()

    registeration_data = {
        "email": email,
        "password": password
    }
    # login
    response = requests.post(baseUrl + "/auth/register", json=registeration_data)
    assert response.status_code == 401