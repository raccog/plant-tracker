import json
import os
from pathlib import Path

from .log_meta import *


logger = get_debug_logger(__name__)
CURRENT_PLANT_PATH = 'current.json'
NUTRIENT_SCHEDULE_PATH = 'NUTRIENT-SCHEDULE.db'


class _Settings:
    def __init__(self):
        self.db_path = None
        self.nutrient_db_path = None
        self.current_plant_path = None
        self.nutrient_schedule_path = None
        self.current_plants = None
        self.current_names = None
        self.other_plants = None
        self.other_names = None


# Static server settings
settings = _Settings()


def get_db_path():
    """Reads from the environment variable 'GROW_DATA_PATH' into settings."""
    settings.db_path = os.getenv("GROW_PATH")
    if settings.db_path == None:
        settings.db_path = '~/.grow_data'
    settings.db_path = Path(settings.db_path).expanduser()
    if not settings.db_path.is_dir():
        logger.critical(f'Grow data is not a valid directory at path: {settings.db_path}')
        return
    settings.current_plant_path = Path(settings.db_path).joinpath(CURRENT_PLANT_PATH)
    settings.nutrient_schedule_path = Path(settings.db_path).joinpath(NUTRIENT_SCHEDULE_PATH)
    settings.nutrient_db_path = Path(settings.db_path).joinpath('nutrients')


def pull_current_plants():
    from .database import get_current_names
    from .file_edit import read_current_plants
    settings.current_plants = read_current_plants()
    settings.current_names = get_current_names()


def pull_all_plants():
    pull_current_plants()
    from .database import get_all_names
    settings.other_names = dict(get_all_names())
    for id in settings.current_plants:
        settings.other_names.pop(id)
    settings.other_plants = list(settings.other_names.keys())
    settings.other_names = settings.other_names.items()


def init_settings():
    get_db_path()
    pull_all_plants()
