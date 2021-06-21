import json
import os
from pathlib import Path

from .file_edit import read_current_plants
from .log_meta import *


logger = get_debug_logger(__name__)
CURRENT_PLANT_PATH = 'current.json'


class _Settings:
    def __init__(self):
        self.db_path = None
        self.current_plant_path = None
        self.current_plants = None
        self.current_names = None


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


def update_current():
    from .database import get_current_names
    settings.current_plants = read_current_plants()
    settings.current_names = get_current_names()


def init_settings():
    get_db_path()
    update_current()
