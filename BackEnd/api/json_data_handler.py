import json

def read_json(file_path):
    """Reads and parses a JSON file."""
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        raise Exception(f"File {file_path} not found.")
    except json.JSONDecodeError:
        raise Exception(f"Error decoding JSON from file {file_path}.")