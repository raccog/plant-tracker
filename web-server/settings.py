import json
import os
import os.path as path
import sys


CURRENT_PLANT_PATH = 'current.json'


class _Settings:
    def __init__(self):
        self.db_path = None
        self.current_plant_path = None
        self.current_plants = None
        self.current_names = None


# Static server settings
settings = _Settings()


def read_current_plants():
    """Returns a list containing nids of the current plants."""
    with open(path.join(settings.db_path, CURRENT_PLANT_PATH), 'r') as f:
        return json.loads(f.read())


def get_db_path():
    """Reads from the environment variable 'GROW_DATA_PATH' into settings."""
    settings.db_path = path.expanduser(os.getenv("GROW_PATH"))
    if settings.db_path == None:
        print('GROW_PATH environment variable needs to be set to the database path.')
        sys.exit(1)
    settings.current_plant_path = path.join(settings.db_path, CURRENT_PLANT_PATH)


def update_current():
    from .database import get_current_names
    settings.current_plants = read_current_plants()
    settings.current_names = get_current_names()


def init_settings():
    get_db_path()
    update_current()
