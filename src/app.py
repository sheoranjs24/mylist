from flask import Flask, send_file

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!"
    #return send_file("templates/index.html")

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)


from flask import Flask
app = Flask(__name__)
