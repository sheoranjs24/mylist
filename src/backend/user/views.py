from flask import render_template, request

from backend.server import app

@app.route("/", methods=['GET', 'POST'])
def index():
    errors = []
    results = {}
    if request.method == "POST":
        # get url that the user has entered
        try:
            url = request.form['url']
            r = requests.get(url)
            print(r.text)
            result = Result(
                url=url,
                result_all=raw_word_count,
                result_no_stop_words=no_stop_words_count
            )
            db.session.add(result)
            db.session.commit()
            return result.id
        except:
            errors.append(
                "Unable to get URL. Please make sure it's valid and try again."
            )
    return render_template('templates/index.html', errors=errors, results=results)

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)
