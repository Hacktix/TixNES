// Include required modules
include('nes/mem.js');
include('nes/rom.js');
include('nes/cpu.js');
include('nes/ppu.js');

// Global Variable Definition
var gamerom = null;

// Initialize offscreen canvas
const tmpcanvas = document.createElement('canvas');
tmpcanvas.width = 256;
tmpcanvas.height = 240;
const tmplcd = tmpcanvas.getContext('2d');

// Initialize Canvas & ImageData
const screen = document.getElementById('screen').getContext('2d', {alpha: false});
screen.imageSmoothingEnabled = false;
screen.scale(3, 3);
screen.fillRect(0, 0, 256, 240);
const screenData = screen.createImageData(256, 240);

// ROM Select Listener
document.getElementById('rom').addEventListener('change', (e) => {
    if(!e.target.files.length)
        return;
    const fr = new FileReader();
    fr.addEventListener('load', (e) => {
        resetEmulator(Array.from(new Uint8Array(e.target.result)));
    });
    fr.readAsArrayBuffer(e.target.files[0]);
});

function resetEmulator(newRom) {
    gamerom = decodeRomObject(newRom);
    resetMemoryState(gamerom);
    resetInputState();
    resetCPU();
    resetPPU();

    startCPU();
}

// Input Listeners
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;