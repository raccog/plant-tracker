import sqlite3

def add_data(d1, d2):
    con = sqlite3.connect('test.db')
    cur = con.cursor()
    cur.execute('''create table stock
                (data1 text, data2 real)''')
    con.commit()
    con.close()