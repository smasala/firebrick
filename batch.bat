cd tools
node r.js -o build.js
cd ..
call yuidoc --configfile yuidoc.json ./src
copy fbui_small.png .\docs\fbui_small.png