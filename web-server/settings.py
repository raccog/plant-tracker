import os
import os.path as path
import sys

from .database import get_current_names
from .json_io import read_current_plants


class _Settings:
    def __init__(self):
        self.db_path = None
        self.current_plants = None
        self.current_names = None


# Static server settings
settings = _Settings()


def get_db_path():
    """Reads from the environment variable 'GROW_DATA_PATH' into settings."""
    settings.db_path = path.expanduser(os.getenv("GROW_DATA_PATH"))
    if settings.db_path == None:
        print('GROW_PATH environment variable needs to be set to the database path.')
        sys.exit(1)


def update_current():
    settings.current_plants = read_current_plants()
    settings.current_names = get_current_names()


def init_settings():
    get_db_path()
    update_current()
