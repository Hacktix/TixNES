// Include required modules
include('nes/mem.js');
include('nes/rom.js');
include('nes/cpu.js');

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
    var rom = decodeRomObject(newRom);
    resetMemoryState(rom);
    resetCPU();

    startCPU();
}