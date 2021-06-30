// --------------------------------------------------------------------
// Memory Variables & Initialization
// --------------------------------------------------------------------

// Import mappers
let mappernames = {
    0x00: 'nrom'
};
let mappers = [];
for(let id of Object.keys(mappernames))
    include('nes/mapper/' + mappernames[id] + ".js");

// Memory-related variables
var ram = null;                     // 2KB internal RAM
var cartRead, cartWrite = null;     // Function pointers for cartridge space I/O operations, defined by mappers
var ppuRead, ppuWrite = null;       // Function pointers for PPU I/O operations, defined by mappers

// Reset memory state on emulator restart
function resetMemoryState(rom) {
    // RAM Array
    ram = new Array(0x800).fill(0);

    // Mapper detection & cartridge space function mapping
    mappers[rom.header.mapper].init(rom);
}

// --------------------------------------------------------------------
// Memory I/O Functions
// --------------------------------------------------------------------

// Lookup Tables for Hardware Register Names
const ppureg = [ "ppuctrl", "ppumask", "ppustatus", "oamaddr", "oamdata", "ppuscroll", "ppuaddr", "ppudata" ];

function readByte(addr) {
    addr &= 0xFFFF;

    if(addr < 0x2000) // 2KB internal RAM  (+ Mirrors)
        return ram[addr & 0x7FF];

    if(addr < 0x4000) { // TODO: PPU Registers
        let val = _ppu[ppureg[addr & 7]];
        // console.log(`> Read $${val.toString(16).padStart(2,0)} from ${ppureg[addr & 7].toUpperCase()}`);
        return val;
    }

    if(addr < 0x4018) // TODO: APU & I/O Registers
        return 0;

    if(addr < 0x4020) // TODO: Test Mode Registers
        return 0;

    // If none of the above - refer to cartridge space function
    return cartRead(addr);
}

function writeByte(addr, val) {
    addr &= 0xFFFF;
    val &= 0xFF;
    
    if(addr < 0x2000) { // 2KB internal RAM (+ Mirrors)
        ram[addr & 0x7FF] = val;
        return;
    }

    if(addr < 0x4000) { // TODO: PPU Registers
        // console.log(`> Wrote $${val.toString(16).padStart(2,0)} to ${ppureg[addr & 7].toUpperCase()}`);
        _ppu[ppureg[addr & 7]] = val;
    }

    if(addr < 0x4018) { // TODO: APU & I/O Registers
        return;
    }

    if(addr < 0x4020) { // TODO: Test Mode Registers
        return;
    }

    // If none of the above - refer to cartridge space function
    cartWrite(addr, val);
}

// --------------------------------------------------------------------
// PPU I/O Functions
// --------------------------------------------------------------------
function _ppuReadDefault(addr) {
    if(addr < 0x3F00)
        return ppuram[addr % 0x3000];
    return paletteram[addr & 0x1F];
}

function _ppuWriteDefault(addr, val) {
    if(addr < 0x3F00)
        return ppuram[addr % 0x3000] = val;
    return paletteram[addr & 0x1F] = val;
}