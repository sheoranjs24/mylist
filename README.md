# myList READ ME

## Start a Project
1. Make directory structure
```
	$ mkdir YOUR_APP_NAME
```
2. Initialize git
```
	$ git init
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
	$ echo "web: gunicorn src/app:app" >> Procfile
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
	$ git remote add origin git@github.com:sheoranjs24/YOUR_APP_NAME.git 
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
	$ git checkout -b staging
	\# make some changes to reflect new version
	$ git commit -a "bump version number to XX"
	$ git push origin staging
```
23. Check logs
```
	$ heroku logs --tail
```
24. Push changes to master & tag it
```
	$ git checkout master
	$ git merge --no-ff staging
	$ git tag -a XX
	$ git push origin master
```
25. Send logs to Papertrail
26. Add Automated tests using Travis/Jenkins
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	