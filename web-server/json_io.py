import json
import os.path as path

from .settings import settings


def read_current_plants():
    """Returns a list containing nids of the current plants."""
    with open(path.join(settings.db_path, 'current.json'), 'r') as f:
        return json.loads(f.read())
