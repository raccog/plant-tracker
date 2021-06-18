import json
import sqlite3
import os.path as path


def pull_nutrients():
    from .settings import settings
    con = sqlite3.connect(path.join(settings.db_path, 'NUTRIENT-SCHEDULE.db'))
    cur = con.cursor()

    return json.dumps([{row[0]: list(row[1:]) for row in cur.execute("select * from schedule")}])
