import requests
from ..utilities.readProperties import ReadConfig

class customLogin:
    @staticmethod
    def login():
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
        data = response.json()

        return data["access_token"], response.status_code
