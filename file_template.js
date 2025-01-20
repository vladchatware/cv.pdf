//https://stackoverflow.com/a/41106346/21330993
function b64_to_uint8array(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

var embedded_files = __files_data__;
for (let filename in embedded_files) {
  embedded_files[filename] = pako.inflate(b64_to_uint8array(embedded_files[filename]));
}