import sys
import pathlib
import json
import base64

if len(sys.argv) < 4:
  print("not enough arguments.")
  sys.exit(1)

js_path = pathlib.Path(sys.argv[1]).resolve()
files_dir = pathlib.Path(sys.argv[2]).resolve()
out_path = pathlib.Path(sys.argv[3]).resolve()

files = {}
for file_path in files_dir.rglob("*"):
  if file_path.is_dir():
    continue
  rel_path = str(file_path.relative_to(files_dir))
  data_b64 = base64.b64encode(file_path.read_bytes())
  files[rel_path] = data_b64.decode()

js = js_path.read_text()
js = js.replace("__files_data__", json.dumps(files))

out_path.write_text(js)