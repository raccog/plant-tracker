from time import time
import json
from flask import Flask, render_template, request, redirect, url_for

from .database import add_data, add_record, get_names
from .json_sql import pull_nutrients


with open('data/CURRENT.json', 'r') as f:
    d = f.read()
    current_plants = json.loads(d)

names = get_names(current_plants)

app = Flask(__name__)

@app.route("/")
def index_page():
    return render_template('index.html')

@app.route("/data", methods=['GET', 'POST'])
def data_page():
    if request.method == 'POST':
        add_data(request.form['data1'], request.form['data2'])
    return render_template('data_input.html')

@app.route("/calculator")
def calculator_page():
    return render_template('calculator.html', current_plants=current_plants, names=names)

@app.route("/current_plants")
def current_plants_page():
    print(names)
    return render_template('current_plants.html', current_plants=current_plants, names=names)

@app.route("/get/nutrients.json")
def nutrients_data():
    return pull_nutrients()

@app.route("/get/current.json")
def current_data():
    return json.dumps([str(x) for x in current_plants])

@app.route("/post/post_record", methods=["POST"])
def record_post():
    data = request.get_json()
    assert(int(data['id']) in [x[0] for x in names])
    now = time()
    record = (now, data['gal'], data['replace'], data['percent'] * 100, data['week'], data['pHup'],
            data['pHdown'], data['calmag'])
    add_record(data['id'], record)
    
    return ''