from time import time
import json
from flask import Flask, render_template, request

from .database import add_data, add_record, new_plants, create_db, new_event
from .file_edit import write_current_plants
from .json_sql import pull_nutrients
from .settings import init_settings, settings


init_settings()
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
    return render_template('calculator.html', current_plants=settings.current_plants, current_names=settings.current_names)


@app.route("/new_event")
def new_event_page():
    return render_template('new_event.html', current_names=settings.current_names)


@app.route("/new_grow")
def new_grow_page():
    return render_template('new_grow.html')


@app.route("/get/nutrients.json")
def nutrients_data():
    return pull_nutrients()


@app.route("/get/current.json")
def current_data():
    return json.dumps([str(x) for x in settings.current_plants])


@app.route("/post/post_record", methods=["POST"])
def record_post():
    data = request.get_json()
    assert(int(data['id']) in [x[0] for x in settings.current_names])
    now = time()
    record = (now, data['gal'], data['replace'], data['percent'] *
              100, data['week'], data['pHup'], data['pHdown'], data['calmag'])
    add_record(data['id'], record)

    return ''


@app.route("/post/new_event", methods=["POST"])
def event_post():
    event = request.get_json()
    for nid in event['nids']:
        new_event(nid, event['text'])

    return ''


@app.route("/post/new_grow", methods=["POST"])
def grow_post():
    plant_names = request.get_json()
    nids = new_plants(plant_names)
    write_current_plants(nids)
    for nid in nids:
        create_db(nid)

    return ''
