import os

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from backend import config

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
db = SQLAlchemy(app)

from backend.user import views, models


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
