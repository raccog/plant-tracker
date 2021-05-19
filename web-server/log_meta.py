import logging


def get_logger(name, level):
    logger = logging.getLogger(name)
    logger.setLevel(level)
    return logger


def get_debug_logger(name):
    return get_logger(name, logging.DEBUG)


def get_info_logger(name):
    return get_logger(name, logging.INFO)