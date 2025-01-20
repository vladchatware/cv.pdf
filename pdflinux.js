function update_downloading() {}

function start() {
  var args = ["file:///vm.cfg", 256, "", null, 0, 0, 1, ""];
  Module.ccall("vm_start", null, ["string", "number", "string", "string", "number", "number", "number", "string"], args);
}

class Display {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.getElementById("display");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.image = this.ctx.createImageData(width, height);
  }
}

var graphic_display = new Display(320, 200);