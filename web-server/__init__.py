from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def index_page():
    return render_template('index.html')

@app.route("/data", methods=['GET', 'POST'])
def data_page():
    if request.method == 'POST':
        print(f"{request.form['data1']} {request.form['data2']}")
    return render_template('data_input.html')