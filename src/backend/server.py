import os

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from backend import config

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../')

app = Flask(__name__, template_folder=tmpl_dir)
app.config.from_object(os.environ['APP_SETTINGS'])
#app.jinja_loader = jinja2.FileSystemLoader('tmpl_dir')

db = SQLAlchemy(app)

# debugging STARTS
print("current dir: ", os.getcwd())
for x in os.walk(os.getcwd()):
    print("\n ", x)
# debugging ENDS

from backend.user import views, models


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
