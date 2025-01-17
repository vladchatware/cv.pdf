#!/bin/bash

set -e
set -x

if [ ! -d "./emsdk" ]; then
  git clone https://github.com/emscripten-core/emsdk.git --branch 1.39.20
  ./emsdk/emsdk install 1.39.20-fastcomp
  ./emsdk/emsdk activate 1.39.20-fastcomp
fi

source ./emsdk/emsdk_env.sh >/dev/null 2>&1

mkdir -p out build
if [ ! -f "build/vm.tar.gz" ]; then
  wget "https://bellard.org/tinyemu/diskimage-linux-riscv-2018-09-23.tar.gz" -O build/vm.tar.gz
fi
if [ ! -d "build/vm" ]; then
  tar -xf build/vm.tar.gz -C build
  mv build/diskimage* build/vm
fi

if [ "$1" = "clean" ]; then
  emmake make -C tinyemu/ -f Makefile.pdfjs clean
fi
emmake make -C tinyemu/ -f Makefile.pdfjs -j$(nproc --all)

python3 embed_files.py file_template.js vm.cfg build/vm/bbl64.bin build/vm/kernel-riscv64.bin build/vm/root-riscv64.bin build/files.js
cat tinyemu/js/riscvemu64.js build/files.js pdflinux.js > out/compiled.js