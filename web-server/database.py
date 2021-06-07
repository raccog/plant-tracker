import sqlite3

def _open_db(f):
    con = sqlite3.connect(f)
    cur = con.cursor()
    return (con, cur)

def _id_db():
    return _open_db('data/DATABASE.db')

def _nutrient_db(id):
    return _open_db(f'data/nutrients/{id}.db')

def add_data(d1, d2):
    con = sqlite3.connect('test.db')
    cur = con.cursor()
    cur.execute('''create table stock
                (data1 text, data2 real)''')
    con.commit()
    con.close()

def get_names(current_plants):
    (con, cur) = _id_db()
    r = tuple(cur.execute('select * from names'))
    con.close()
    return tuple([x for x in r if x[0] in current_plants])

def add_record(id, record):
    (con, cur) = _nutrient_db(str(id).zfill(3))
    cur.execute("insert into data values (?, ?, ?, ?, ?, ?, ?, ?)", record)
    con.commit()
    con.close()
