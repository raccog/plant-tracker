from flask import Flask, render_template, request

from .database import add_data
from .json_sql import pull_nutrients

app = Flask(__name__)

@app.route("/")
def index_page():
    return render_template('index.html')

@app.route("/data", methods=['GET', 'POST'])
def data_page():
    if request.method == 'POST':
        add_data(request.form['data1'], request.form['data2'])
        print(f"{request.form['data1']} {request.form['data2']}")
    return render_template('data_input.html')

@app.route("/calculator")
def calculator_page():
    return render_template('calculator.html', nutrients=pull_nutrients())

@app.route("/nutrients.json")
def nutrients_data():
    return pull_nutrients()