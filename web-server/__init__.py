from sqlite3.dbapi2 import complete_statement
from time import time, sleep
import json
from flask import Flask, render_template, request

from .database import add_data, add_record, new_plants, create_db, new_event, new_comment
from .file_edit import write_current_plants
from .json_sql import pull_nutrient_schedule, pull_plant_nutrients
from .settings import init_settings, settings, update_current


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


@app.route("/new_comment")
def new_comment_page():
    return render_template('new_comment.html', current_names=settings.current_names)


@app.route("/new_grow")
def new_grow_page():
    return render_template('new_grow.html')


@app.route("/data_tables")
def data_tables_page():
    return render_template('data_tables.html', current_names=settings.current_names)


@app.route("/get/nutrients.json")
def nutrient_schedule_data():
    return pull_nutrient_schedule()


@app.route("/get/current.json")
def current_data():
    return json.dumps([str(x) for x in settings.current_plants])


@app.route("/get/nutrient_<id>.json")
def plant_nutrient_data(id):
    data = pull_plant_nutrients(id)
    if data is None:
        return '', 404
    return data, 200


@app.route("/post/new_record", methods=["POST"])
def record_post():
    data = request.get_json()
    assert(int(data['id']) in [x[0] for x in settings.current_names])
    now = time()
    record = (now, data['gal'], data['replace'], data['percent'], data['week'], data['pHup'], data['pHdown'], data['calmag'])
    add_record(data['id'], record)

    return ''


@app.route("/post/new_event", methods=["POST"])
def event_post():
    event = request.get_json()
    for nid in event['nids']:
        new_event(nid, event['text'])

    return '', 200


@app.route("/post/new_comment", methods=["POST"])
def comment_post():
    comment = request.get_json()
    for nid in comment['nids']:
        new_comment(nid, comment['text'])

    return '', 200


@app.route("/post/new_grow", methods=["POST"])
def grow_post():
    plant_names = request.get_json()
    nids = new_plants(plant_names)
    write_current_plants(nids)
    for nid in nids:
        create_db(nid)
    update_current()

    return '', 200
