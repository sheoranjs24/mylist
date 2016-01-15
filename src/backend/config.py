import os

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'
    LANGUAGES = {
        'en': 'English'
    }
    #times = int(os.environ.get('TIMES',3))
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    if os.environ.get('DATABASE_URL') is None:
        SQLALCHEMY_DATABASE_URI = ('sqlite:///' + os.path.join(BASE_DIR, '../../database/app.db') +
            '?check_same_thread=False')
    else:
        SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_NATIVE_UNICODE = True
    SQLALCHEMY_RECORD_QUERIES = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DATABASE_QUERY_TIMEOUT = 0.5
    #ADMINS = ['admin@gmail.com']

class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
