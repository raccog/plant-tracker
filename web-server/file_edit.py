import json
from os.path import join

from .settings import settings

CURRENT_PLANT_PATH = 'current.json'


def read_current_plants():
    with open(join(settings.db_path, CURRENT_PLANT_PATH), 'r') as f:
        current_plants = json.loads(f.read())
    return current_plants


def write_current_plants(current_plants):
    with open(join(settings.db_path, CURRENT_PLANT_PATH), 'w') as f:
        f.write(json.dumps(current_plants))
