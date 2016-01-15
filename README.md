# Project Details

## Introduction
A personal productivity app. The app has below features:
* logins
* goals
* habits


## User Guide


## Development Guide

### Technologies Used
* Github for codebase, issue-mgmt and wiki
* Database: PostgresSQL
* Backend: Python3
* Frontend: AngularJS, Bootstrap-ui, Gulp
* Cloud Server: Heroku
* Development: Atom IDE

#### How to build & deploy
1. **Setup local environment**
	1. Install pre-requisite
		* git
		* python, virtualenvwrapper
		* postgresql
			* `brew install postgres`
			* `createdb YOUR_APP_NAME-dev`
		* heroku
			* install heroku
			* `heroku plugins:install heroku-pipelines`
			* `heroku addons:create heroku-postgresql:hobby-dev`
			* ?mongodb, heroku-redis:hobby-dev, hadoop, 
			* ?librato, graphite
			* ?papertrail
			* ?sendgrid, mandrill
			* ?memcached
			* ?elasticsearch, solr
			* ?analytics
			* ?testing
			* ?rabbitMQ
			* ?DNS
			* ?oauth.io
		* atom
	2. Clone the git repository
		`git clone <repo>`
	3. Setup python venv:
		* `mkvirtualenv --python=/usr/local/bin/python3 venv`
		* `workon venv`
		* `echo "#!/bin/bash
cd ~/workspace/Personal-projects/mylist
export PYTHONPATH=$PYTHONPATH:$HOME/workspace/Personal-projects/mylist/src
export APP_SETTINGS=backend.config.DevelopmentConfig
export DATABASE_URL="postgresql://localhost/mylist-dev"" > $VIRTUAL_ENV/bin/postactivate`
		* `workon venv`
	4. Setup Heroku:
		* `heroku config:set APP_SETTINGS=config.StagingConfig --remote stage`
		* `heroku config:set APP_SETTINGS=config.ProductionConfig --remote prod`
		* check: `heroku config -s | grep HEROKU_POSTGRESQL`
	5. Install dependencies
		`pip install -r requirements.txt`
2. **Build the app locally**
3. **Run the app locally**
	* Check available commonds: `python src/backend/manage.py --help`
	* Backend app: 
		* `./run.py`
		* `python src/backend/app.py`  # http://localhost:5000/
		* `python src/backend/manage.py runserver`
		* `python src/backend/manage.py shell`
	* Backend server: `gunicorn --pythonpath src backend.app:app`  # http://localhost:8000
	* DB: `psql YOUR_APP_NAME-dev`
	* **todo** Fronend app:
4. **Test the app locally**
	* run unit-tests
	* test local-deploy: 
		* `heroku local web`
6. **Making code changes**: 
	* create a git branch from the `develop` branch
	* make your changes on the branch & commit them
		* `git add .`
		* `git commit -m "commit message"`
	* squash all commits to one: `git rebase -i HEAD~2`
	* rebase with `develop` branch: 
		* `git fetch origin`
		* `git rebase origin develop`
	* submit a pull-request to merge with `develop` branch on GitHub: 
		* `git push origin feature/feature-name`
		* create a pull-request
7. **Making config changes**:
	* Local env
		* `echo "export <CONFIG_NAME>=\"<CONFIG_VALUE>\"" > $VIRTUAL_ENV/bin/postactivate`
		* `echo "<CONFIG_NAME>=<CONFIG_VALUE>\n" > .env`
	* Heroku 
		* `heroku config:set <CONFIG_NAME>=<CONFIG_VALUE> --remote stage`
7. **Deploying new code changes to stage**
	* Merge `develop` branch to `stage` branch
		* `git checkout -b stage`
		* `git fetch origin`
		* `git merge --no-ff develop`
	* Make some changes to reflect new version
		* `git commit -a "bump version number to XX"`
	* Push to Remote and auto-deploy to heroku
		* `git push origin stage`
8. **Debugging heroku**
	* Monitor logs: `heroku logs --tail --app mylist-stage`
	* Open url: `heroku open --app mylist-stage`
	* Backend:
		* Start a python shell: `heroku run python manage.py shell --app mylist-stage`
		* Start app: `heroku run python src/backend/app.py --app mylist-stage`
		* Run bash: `heroku run bash`
		* Run config: `heroku run python config.py --app mylist-stage`
	* DB: 
		* Monitor db logs: `heroku logs -p postgres -t --app mylist-stage`
		* Monitor db: `heroku pg:psql --app mylist-stage`
		* Diagnoise db: `heroku pg:diagnose --app mylist-stage`
		* Other useful db commands: pg:pull, pg:push, pg:dump, pg:restore, pg:ps, pg:kill, pg:promote, pg:credentials, pg:reset, pg:upgrade
9. **Pushing stage to prod**
	* Merge `stage` branch with `master` branch
		* `git checkout master`
		* `git fetch origin`
		* `git merge --no-ff stage`
		* `git tag -a XX`
		* `git push origin master`
10. **Making db changes**
	* `python src/backend/manage.py db --help`
	* Initialize db migration: `python src/backend/manage.py db init`  # first time only
	* Generate db migration scirpts: `python src/backend/manage.py db migrate`
	* Review db migration scripts in $PROJECT_HOME/migrations
	* Apply migrations to the db: `python src/backend/manage.py db upgrade`
	* commit changes & push to `stage` branch
	* heroku update: `heroku run python manage.py db upgrade --app mylist-stage`
11. **todo**: Continuous delivery
	* travis test is run on every commit to `?` branch
	* travis build is run on every successful test-runs
	* app is deployed to staging on successful builds
	* integration & e2e tests are run on successful deployments
	* manual exploratory testing is done on successful test-runs
	* staging is moved to prod on successful manual-testing

## Features
### feature-requests
* login
* landing page
* goals : view, add, delete, edit
* habbit : view, add, delete, edit

### ops-todos
* test env
* frontend setup
* gulp tasks
* logging
* continuous integration

### Done
* heroku app with github integration
* db setup
* https://realpython.com/blog/python/flask-by-example-part-3-text-processing-with-requests-beautifulsoup-nltk/