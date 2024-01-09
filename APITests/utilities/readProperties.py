import configparser

config = configparser.RawConfigParser()
config.read('.\\configurations\\config.ini')

class ReadConfig:

    @staticmethod
    def getToken():
        token = config.get('common info', 'token')
        return token
    @staticmethod
    def setToken(token_value):
        config.set('common info', 'token', token_value)

    @staticmethod
    def getEmail():
        email = config.get('common info', 'email')
        return email

    @staticmethod
    def getPassword():
        password = config.get('common info', 'password')
        return password

    @staticmethod
    def getBaseURL():
        url = config.get('common info', 'baseURL')
        return url
