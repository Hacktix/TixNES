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
var cartRead, cartWrite = null;     // Write function pointers for cartridge space I/O operations, defined by mappers

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

function readByte(addr) {
    if(addr < 0x2000) // 2KB internal RAM  (+ Mirrors)
        return ram[addr & 0x7FF];

    if(addr < 0x4000) // TODO: PPU Registers
        return 0;

    if(addr < 0x4018) // TODO: APU & I/O Registers
        return 0;

    if(addr < 0x4020) // TODO: Test Mode Registers
        return 0;

    // If none of the above - refer to cartridge space function
    return cartRead(addr);
}

function writeByte(addr, val) {
    if(addr < 0x2000) { // 2KB internal RAM (+ Mirrors)
        ram[addr & 0x7FF] = val;
        return;
    }

    if(addr < 0x4000) { // TODO: PPU Registers
        return;
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