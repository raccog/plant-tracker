import json
from pathlib import Path
import sqlite3
from sqlite3.dbapi2 import DatabaseError

from .log_meta import *


logger = get_debug_logger(__name__)


def pull_nutrient_schedule():
    from .settings import settings
    nutrient_schedule_path = settings.nutrient_schedule_path
    if not nutrient_schedule_path.is_file():
        logger.critical(f'Nutrient schedule database is not a valid file at path: {nutrient_schedule_path}')
        return None

    con = sqlite3.connect(nutrient_schedule_path)
    cur = con.cursor()

    try:
        return json.dumps({row[0]: list(row[1:]) for row in cur.execute("select * from schedule")})
    except DatabaseError:
        logger.critical(f'Nutrient schedule database is not a valid sqlite3 database at path: {nutrient_schedule_path}')
        return None


def pull_plant_nutrients(id):
    from .settings import settings
    db_path = settings.nutrient_db_path.joinpath(f'{id.zfill(3)}.db')
    if not db_path.is_file():
        logger.critical(f"Plant's nutrient database is not a valid file at path: {db_path}")
        return None

    con = sqlite3.connect(db_path)
    cur = con.cursor()

    try:
        return json.dumps({row[0]: list(row[1:]) for row in cur.execute("select * from data")})
    except DatabaseError:
        logger.critical(f"Plant's nutrient database is not a valid sqlite3 database at path: {db_path}")
        return None
