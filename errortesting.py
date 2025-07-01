import json
config_path = r"C:\Users\Karthik\OneDrive\Desktop\PS22(Part2)\models\XTTS-v2\config.json"

with open(config_path, "r") as f:
    config = json.load(f)

print(config)