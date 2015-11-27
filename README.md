# READ ME

## Start a Project
1. Make directory structure
```
	$ mkdir myapp
```
2. Initialize git
```
	$ git init
```
3. Touch initial files
```
	$ touch app.py .gitignore README.md requirements.txt
```
4. Make Python Virtual Environment
```
	$ which python3
		/usr/local/bin/python3
	$ mkvirtualenv --python=/usr/local/bin/python3 myapp
```
5. Automatically change working directory to the project directory
```
	$ workon myapp
	$ echo "cd ~/path/to/your/project" >> $VIRTUAL_ENV/bin/postactivate
```
6. Install Python Libraries
```
	$ pip install Flask==0.10.1
```
7. Add installed libaries to requirements.txt
```
	$ pip freeze > requirements.txt
```
8. Add content to app.py
9. Run the app at http://localhost:5000/
```
	$ python app.py
```

