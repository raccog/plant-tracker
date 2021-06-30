from pathlib import Path
import time
import sqlite3

from .settings import settings


def _open_db(f):
    db_path = Path(settings.db_path).joinpath(f)
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    return (con, cur)


def _id_db():
    return _open_db('DATABASE.db')


def _nutrient_db(nid):
    return _open_db(f'nutrients/{str(nid).zfill(3)}.db')


def add_data(d1, d2):
    con = sqlite3.connect('test.db')
    cur = con.cursor()
    cur.execute('''create table stock
                (data1 text, data2 real)''')
    con.commit()
    con.close()


def get_current_names():
    (con, cur) = _id_db()
    names = cur.execute('select * from names where nid in (?, ?)',
                        tuple(settings.current_plants)).fetchall()
    con.close()
    return names


def get_all_names():
    (con, cur) = _id_db()
    names = cur.execute('select * from names').fetchall()
    con.close()
    return names


def add_record(nid, record):
    (con, cur) = _nutrient_db(nid)
    cur.execute("insert into data values (?, ?, ?, ?, ?, ?, ?, ?)", record)
    con.commit()
    con.close()


def new_plants(plant_names):
    (con, cur) = _id_db()
    nids = []

    # add names and groups
    prevlen = cur.execute("select max(nid) from names").fetchone()[0] + 1
    gid = cur.execute("select max(gid) from groups").fetchone()[0] + 1
    for i in range(len(plant_names)):
        nid = i + prevlen
        cur.execute("insert into names values (?, ?)", (nid, plant_names[i]))
        cur.execute("insert into groups values (?, ?)", (nid, gid))
        nids.append(nid)

    con.commit()
    con.close()

    return nids


def create_db(nid):
    (con, cur) = _nutrient_db(nid)
    cur.execute('''create table data
                (date date, gal real, replace boolean, percent int,
                week text, pHup real, pHdown real, calmag boolean)''')
    cur.execute('''create table events
                (date date, event text)''')
    cur.execute('''create table comments
                (date date, event text)''')
    con.commit()
    con.close()


def new_event(nid, text):
    (con, cur) = _nutrient_db(nid)
    timestamp = time.time()
    cur.execute('insert into events values (?, ?)', (timestamp, text))
    con.commit()
    con.close()


def new_comment(nid, text):
    (con, cur) = _nutrient_db(nid)
    timestamp = time.time()
    cur.execute('insert into comments values (?, ?)', (timestamp, text))
    con.commit()
    con.close()
