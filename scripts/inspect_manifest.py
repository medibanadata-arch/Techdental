import json

with open('scripts/probe_manifest.json', encoding='utf-8') as f:
    data = json.load(f)

print(data[0].keys())
print(json.dumps(data[0], indent=2)[:500])
