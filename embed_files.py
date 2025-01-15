import sys
import pathlib
import json
import base64

if len(sys.argv) < 4:
  print("not enough arguments.")
  sys.exit(1)

out_path = pathlib.Path(sys.argv[-1]).resolve()
js_path = pathlib.Path(sys.argv[1]).resolve()

files = {}
for path_str in sys.argv[2:-1]:
  path = pathlib.Path(path_str).resolve()
  data_b64 = base64.b64encode(path.read_bytes())
  files[path.name] = data_b64.decode()

js = js_path.read_text()
js = js.replace("__files_data__", json.dumps(files))

out_path.write_text(js)