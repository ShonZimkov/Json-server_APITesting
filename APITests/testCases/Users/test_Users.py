import requests
from APITests.utilities.readProperties import ReadConfig
import string
import random

def test_login(): # test login function
    # Arrange
    email = ReadConfig.getEmail()
    password = ReadConfig.getPassword()
    baseUrl = ReadConfig.getBaseURL()

    login_data = {
        "email": email,
        "password": password
    }
    # login
    response = requests.post(baseUrl + "/auth/login", json=login_data)
    assert response.status_code == 200

def test_register(): # test register function
    # Arrange
    email = ReadConfig.getEmail()
    password = ReadConfig.getPassword()
    baseUrl = ReadConfig.getBaseURL()

    registeration_data = {
        "email": random_generator() + "@gmail.com",
        "password": password
    }
    # login
    response = requests.post(baseUrl + "/auth/register", json=registeration_data)
    assert response.status_code == 200

def random_generator(size= 8, chars= string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))