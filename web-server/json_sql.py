import json
import sqlite3


def pull_nutrients():
    con = sqlite3.connect('data/NUTRIENT-SCHEDULE.db')
    cur = con.cursor()
    
    return json.dumps([{row[0]: list(row[1:]) for row in cur.execute("select * from schedule")}])