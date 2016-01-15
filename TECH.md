# myList READ ME

## Start a Project
1. Make directory structure
```
	$ mkdir YOUR_APP_NAME
```
2. Initialize git
```
	$ git init
	$ git remote add origin git@github.com:sheoranjs24/YOUR_APP_NAME.git
	$ git -b checkout develop
```
3. Touch initial files
```
	$ touch app.py .gitignore .gitconfig README.md requirements.txt .editorconfig CHANGELOG.md LICENSE MANIFEST.in requirements.txt package.json gulpfile.js fabfile.py
```
4. Make Python Virtual Environment
```
	$ which python3
		/usr/local/bin/python3
	$ mkvirtualenv --python=/usr/local/bin/python3 YOUR_APP_NAME
```
5. Automatically change working directory to the project directory
```
	$ workon YOUR_APP_NAME
	$ echo "cd ~/path/to/your/project" >> $VIRTUAL_ENV/bin/postactivate
```
6. Install Python Libraries
```
	$ pip install Flask==0.10.1
	$ pip install gunicorn
```
7. Add installed libaries to requirements.txt
```
	$ pip freeze > requirements.txt
```
8. Add content to app.py
9. Run the app
```
	$ python app.py  \# http://localhost:5000/
```
10. Install Heroku toolkit and plugins
```
	$ heroku plugins:install heroku-pipelines
```
11. Add content to procfile
```
	$ echo "web: gunicorn --pythonpath src backend.app:app" >> Procfile
```
12. Heroku settings for python
```
	echo "python-3.4.2" >> runtime.txt
```
13. Commit your changes in git and PUSH to Github
```
	$ git checkout -b develop
	$ git add .
	$ git commit -m "hello world app"
	$ git push -u origin develop
```
14. Touch Heroku specific files
```
	$ touch Procfile app.json .env .slugignore runtime.txt
```
15. Create 2 heroku apps
```
	$ heroku create YOUR_APP_NAME-stage
	$ heroku create YOUR_APP_NAME-prod
```
16. Add Heroku git remotes
```
	$ git remote add stage git@heroku.com:YOUR_APP_NAME-stage.git
	$ git remote add prod git@heroku.com:YOUR_APP_NAME-prod.git
```
17. Create Heroku Pipelines
```
	$ heroku pipelines:create -a YOUR_APP_NAME-stage
	$ heroku pipelines:add -a YOUR_APP_NAME-prod YOUR_APP_NAME
```
18. Connect Heroku with GitHub so that commits are automatically deployed
19. Run app locally
```
	$ gunicorn --pythonpath src backend.app:app  # http://127.0.0.1:8000
```
20. Test heroku local deploy
```
	$ heroku local web
```
21. Commit to git
```
	$ git add .
	$ git commit -m "add heroku config"
	$ git push -u origin develop
```
22. Bump up version number & push to staging branch on GitHub (auto-deploy to Heroku)
```
	$ git checkout -b stage
	\# make some changes to reflect new version
	$ git commit -a "bump version number to XX"
	$ git push origin stage
```
23. Check logs
```
	$ heroku logs --tail
```
24. Push changes to master & tag it
```
	$ git checkout master
	$ git merge --no-ff stage
	$ git tag -a XX
	$ git push origin master
```
24. Create config.py file
25. Local & Remote Settings
```
	$ echo "export APP_SETTINGS=\"config.DevelopmentConfig\"" > $VIRTUAL_ENV/bin/Postactivate
	$ workon YOUR_APP_NAME
	$ heroku config:set APP_SETTINGS=config.StagingConfig --remote stage
	$ heroku config:set APP_SETTINGS=config.ProductionConfig --remote prod

	\# test
	$ heroku run python src/backend/app.py --app YOUR_APP_NAME-stage
	$ heroku run python src/backend/app.py --app YOUR_APP_NAME-prod
```
25. Send logs to Papertrail
26. Add Automated tests using Travis/Jenkins


### Add support for database
1. Install Dependencies
```
	$ brew install postgres
	$ pip install psycopg2 Flask-SQLAlchemy Flask-Migrate
	$ pip freeze > requirements.txt
```
2. Create a database called YOUR_APP_NAME-dev to use as our local development database.
```
	$ createdb YOUR_APP_NAME-dev
	$ psql YOUR_APP_NAME-dev
	SQL> \q
	$
```
3. Add database to configuration file: Add SQLALCHEMY_DATABASE_URI field to the Config() class
4. Add database variable to postactivate file
```
	$ echo "export DATABASE_URL=\"postgresql://localhost/YOUR_APP_NAME-dev\"" >> $VIRTUAL_ENV/bin/postactivate
	$ workon YOUR_APP_NAME   #restart virtual env
```
5. In your app.py file import SQLAlchemy and connect to the database.
6. Use Alembic and Flask-Migrate to migrate our local database to the latest version
```
	$ touch src/backend/manage.py
	$ python src/backend/manage.py db init
```
7. Migrate db
```
	$ python src/backend/manage.py db migrate
	$ python src/backend/manage.py db upgrade  
```
8. Remote Migration Configuration
```
	\# Check if the app already has a database
	$ heroku config --app YOUR_APP_NAME-stage
	\# If no database, then add the Postgres addon
	$ heroku addons:create heroku-postgresql:hobby-dev --app YOUR_APP_NAME-stage
```
9. Commit the changes and merge to staging
```
	$ git add .
	$ git commit -m "add postgres configuration"
	$ git push origin feature/config-database
	\# Create pull-request and merge branch to develop
	$ git checkout develop
	$ git pull origin develop
	$ git checkout stage
	$ git merge --no-ff develop
	$ git push origin stage
```
10. DB design tool: http://ondras.zarovi.cz/sql/demo/
11. References:
		* http://docs.sqlalchemy.org/en/rel_1_0/core/metadata.html
		* http://docs.sqlalchemy.org/en/rel_1_0/genindex.html
		* https://docs.python.org/3/library/index.html
		* https://docs.python.org/3/reference/index.html


### Add support for redis
1. Install Redis locally
	* `brew install redis`
	* `pip install redis rq`
	* `pip freeze > requirements.txt`
	* Start redis server: `redis-server`
2. Setup worker: listen for a queue called default and establish a connection to our Redis server on localhost:6379
```
echo "
import os
import redis
from rq import Worker, Queue, Connection
listen = ['default']
redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
conn = redis.from_url(redis_url)
if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
" > worker.py
```
	* run worker: `python worker.py`
3. Update app.py to send jobs to the queue
```
from rq import Queue
from rq.job import Job
from worker import conn
q = Queue(connection=conn)
def redis_job(url):
	return "hello"
job = q.enqueue_call(
      func=count_and_save_words, args=(url,), result_ttl=5000
    )
print(job.get_id())
```
4. Update app.py with new route to fetch job status
```
@app.route("/results/<job_key>", methods=['GET'])
def get_results(job_key):
    job = Job.fetch(job_key, connection=conn)
    if job.is_finished:
        return str(job.result), 200
    else:
        return "Nay!", 202
```
5. Run app: `python manage.py runserver`
6. Setup redis on heroku
	* `heroku addons:add redistogo --app mylist-stage`
	* create bash script: `echo "#!/bin/bash
gunicorn app:app --daemon
python worker.py" > heroku.sh
	* Update Procfile: `echo "web: sh heroku.sh" > procfile
