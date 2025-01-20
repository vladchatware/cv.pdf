function update_downloading() {
  
}

function start() {
  var args = ["file:///vm.cfg", 256, "", null, 0, 0, 1, ""];
  Module.ccall("vm_start", null, ["string", "number", "string", "string", "number", "number", "number", "string"], args);
}
