import json
from pathlib import Path
import sqlite3
from sqlite3.dbapi2 import DatabaseError

from .log_meta import *


logger = get_debug_logger(__name__)


def pull_nutrients():
    from .settings import settings
    nutrient_db = Path(settings.db_path).joinpath('NUTRIENT-SCHEDULE.db')
    if not nutrient_db.is_file():
        logger.critical(f'Nutrient database is not a valid file at path: {nutrient_db}')
        return None

    con = sqlite3.connect(nutrient_db)
    cur = con.cursor()

    try:
        return json.dumps([{row[0]: list(row[1:]) for row in cur.execute("select * from schedule")}])
    except DatabaseError:
        logger.critical(f'Nutrient database is not a valid sqlite3 database at path: {nutrient_db}')
        return None
