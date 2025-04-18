"""
config.json file structure:
{
    "HOST": "<host>",
    "PORT": <port>,
    "USER": "<user>",
    "PASSWORD": "<password>",
    "DATABASE": "<database>",

    "JWT_SECRET": "<jwt_secret>",
    "GOOGLE_WEB_CLIENT_ID": "<google_web_client_id>"
}
"""

import os
import json

# Path to your config.json file
CONFIG_FILE_PATH = 'config.json'


def load_config():
    # Load environment variables
    env_config = {
        "HOST": os.getenv("HOST"),
        "PORT": os.getenv("PORT"),
        "USER": os.getenv("USER"),
        "PASSWORD": os.getenv("PASSWORD"),
        "DATABASE": os.getenv("DATABASE"),

        "JWT_SECRET": os.getenv("JWT_SECRET"),
        "GOOGLE_WEB_CLIENT_ID": os.getenv("GOOGLE_WEB_CLIENT_ID"),
    }

    # Check if all environment variables are set
    if all(env_config.values()):
        return env_config
    else:
        # Load from config.json if any environment variable is missing
        with open(CONFIG_FILE_PATH, 'r') as file:
            json_config = json.load(file)
            return json_config


# Load configuration
config = load_config()