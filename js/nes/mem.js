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
    if(mappers[rom.header.mapper])
        mappers[rom.header.mapper].init(rom);
    else
        throw `ROM uses unimplemented mapper $${rom.header.mapper.toString(16).padStart(2,0)}`;
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

    if(addr < 0x4000) // PPU Registers
        return _ppu[ppureg[addr & 7]];

    if(addr < 0x4018) { // TODO: APU & I/O Registers
        switch(addr) {
            case 0x4016: // JOYPAD1
            case 0x4017: // JOYPAD2
                return _input.joypad;
            default:
                return 0;
        }
    }

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

    if(addr < 0x4000) // PPU Registers
        return _ppu[ppureg[addr & 7]] = _ppu.write_latch = val;

    if(addr < 0x4018) { // TODO: APU & I/O Registers
        switch(addr) {
            case 0x4016: // JOYPAD1
                return _input.joypad = val;
            default:
                return;
        }
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
    if([0x3F10, 0x3F14, 0x3F18, 0x3F1C].includes(addr))
        addr -= 0x10;
    return paletteram[addr & 0x1F];
}

function _ppuWriteDefault(addr, val) {
    if(addr < 0x3F00)
        return ppuram[addr % 0x3000] = val;
    if([0x3F10, 0x3F14, 0x3F18, 0x3F1C].includes(addr))
        addr -= 0x10;
    return paletteram[addr & 0x1F] = val;
}