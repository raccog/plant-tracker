import json
from json.decoder import JSONDecodeError
from pathlib import Path

from .log_meta import *
from .settings import settings


logger = get_debug_logger(__name__)


def read_current_plants():
    try:
        with open(settings.current_plant_path, 'r') as f:
            current_plants = json.loads(f.read())
    except FileNotFoundError:
        logger.critical(f'Path for current plants file: {settings.current_plant_path} does not exist')
        return None
    except JSONDecodeError:
        logger.critical(f'Current plants file at path: {settings.current_plant_path} does not contain a valid json structure')
        return None
    return current_plants


def write_current_plants(current_plants):
    err_msg = f'Attempted to write invalid data to current plants file: {current_plants}'
    
    if current_plants is None or len(current_plants) < 1 or isinstance(current_plants, dict):
        logger.error(err_msg)
        return
    try:
        with open(settings.current_plant_path, 'w') as f:
            f.write(json.dumps(current_plants))
    except TypeError:
        logger.error(err_msg)
        return
