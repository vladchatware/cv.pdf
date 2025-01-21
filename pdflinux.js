var Module = {};
var Browser = {};
var lines = [];
var req_handle = 0;
var timeout_callbacks = {};

function set_timeout_callback(id) {
  timeout_callbacks[id]();
  delete timeout_callbacks[id];
}

function set_interval_callback(id) {
  timeout_callbacks[id]();
}

function safe_script(js) {
  return `try {${js}} catch (e) {app.alert(e.stack || e)}`;
}

function set_timeout(callback, timeout) {
  let id = Math.random()+"";
  timeout_callbacks[id] = callback;
  app.setTimeOut(safe_script(`set_timeout_callback(${id})`), timeout);
}

function set_interval(callback, interval) {
  let id = Math.random()+"";
  timeout_callbacks[id] = callback;
  app.setInterval(safe_script(`set_interval_callback(${id})`), interval);
}

var performance = {
  now() {return Date.now()}
}

function print_msg(msg) {
  lines.push(""+msg);
  if (lines.length > 25) 
    lines.shift();
  
  for (var i = 0; i < lines.length; i++) {
    var row = lines[i];
    globalThis.getField("console_"+(25-i-1)).value = row;
  }
}

Module.print = function(msg) {
  let max_len = 50;
  let num_lines = Math.ceil(msg.length / max_len);
  
  for (let i = 0, o = 0; i < num_lines; ++i, o += max_len) {
    print_msg(msg.substr(o, max_len));
  }
}
Module.printErr = function(msg) {
  print_msg(msg);
}

function start() {
  var args = ["file:///vm.cfg", 128, "", null, 0, 0, 1, ""];
  Module.ccall("vm_start", null, ["string", "number", "string", "string", "number", "number", "number", "string"], args);
}

function round_float(num, digits) {
  let multiplier = Math.pow(10, digits);
  return Math.round(num * multiplier) / multiplier;
}

var total_instrs = 0;
var last_updated = null;

function machine_tick(m_ptr) {
  total_instrs += _virt_machine_run(m_ptr);
  let now = Date.now();
  let time_interval = now - last_updated;
  if (time_interval > 1000) {
    let k_ips = Math.round(total_instrs / ((time_interval) / 1000) / 1000);
    globalThis.getField("speed_indicator").value = `Speed: ${k_ips} kIPS`;
    total_instrs = 0;
    last_updated = now;
  }
}

function start_machine_interval(m_ptr) {
  print_msg("starting the machine. please be patient...")
  last_updated = Date.now();
  set_interval(() => {machine_tick(m_ptr)}, 1)
}

function update_framebuffer(width, height, data) {
  for (let y=0; y < height; y++) {
    let row = Array(width);
    let old_row = row.join("");
    for (let x=0; x < width; x++) {
      let index = (y * width + x) * 4;
      let r = data[index];
      let g = data[index+1];
      let b = data[index+2];
      let avg = (r + g + b) / 3;
      //let avg = (x/width) * 255; // (uncomment for a gradient test)

      //note - these ascii characters were all picked because they have the same width in the sans-serif font that chrome decided to use for text fields
      if (avg > 200)
        row[x] = "_";
      else if (avg > 150)
        row[x] = "::";
      else if (avg > 100)
        row[x] = "?";
      else if (avg > 50)
        row[x] = "//";
      else if (avg > 25)
        row[x] = "b";
      else
        row[x] = "#";
    }
    let row_str = row.join("");
    if (row_str !== old_row)
      globalThis.getField("field_"+(height-y-1)).value = row_str;
  }
}

var graphic_display = {
  width: 320,
  height: 200,
  data: new Uint8Array(320 * 200 * 4)
}

set_timeout(start, 100);
