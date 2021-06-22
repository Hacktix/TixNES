// Constant Value Definition
const BLOCK_SIZE = 1789773;

// Include Instruction Set
include('nes/instr/instrs.js');

// Variable Definitions
var registers = null;
var nextfunc = null;
var cycle = null;

// Reset Function
function resetCPU() {
    registers = {
        _a: 0,
        _x: 0,
        _y: 0,
        _p: 0x24,
        _s: 0xFD,
        _pc: 0xC000,

        get a() { return this._a; },
        get x() { return this._x; },
        get y() { return this._y; },
        get p() { return this._p; },
        get s() { return this._s; },
        get pc() { return this._pc; },

        set a(v) { this._a = v & 0xFF; },
        set x(v) { this._x = v & 0xFF; },
        set y(v) { this._y = v & 0xFF; },
        set p(v) { this._p = v & 0xFF; },
        set s(v) { this._s = v & 0xFF; },
        set pc(v) { this._pc = v & 0xFFFF; },

        get flag_c() { return (this._p & (1 << 0)) !== 0; },
        get flag_z() { return (this._p & (1 << 1)) !== 0; },
        get flag_i() { return (this._p & (1 << 2)) !== 0; },
        get flag_d() { return (this._p & (1 << 3)) !== 0; },
        get flag_v() { return (this._p & (1 << 6)) !== 0; },
        get flag_n() { return (this._p & (1 << 7)) !== 0; },
        get flag_b() { return (this._p & 0x30) >> 4; },

        set flag_c(v) { this._p = v ? (this._p | (1 << 0)) : (this._p & ~(1 << 0)); },
        set flag_z(v) { this._p = v ? (this._p | (1 << 1)) : (this._p & ~(1 << 1)); },
        set flag_i(v) { this._p = v ? (this._p | (1 << 2)) : (this._p & ~(1 << 2)); },
        set flag_d(v) { this._p = v ? (this._p | (1 << 3)) : (this._p & ~(1 << 3)); },
        set flag_v(v) { this._p = v ? (this._p | (1 << 6)) : (this._p & ~(1 << 6)); },
        set flag_n(v) { this._p = v ? (this._p | (1 << 7)) : (this._p & ~(1 << 7)); },
        set flag_b(v) { this._p = (this._p & 0xCF) | ((v & 0x03) << 4); },
    }
    nextfunc = fetchInstruction;
    cycle = 7;
}

// Callback function for fetching & decoding the next instruction
function fetchInstruction() {
    let opcode = readByte(registers.pc++);
    if(funcmap[opcode] === undefined)
        throw `Encountered unknown opcode $${opcode.toString(16).padStart(2, '0')} at $${(registers.pc-1).toString(16).padStart(4, '0')} (Cycle ${cycle})`;
    funcmap[opcode]();
}

// CPU Operation Functions
function step() {
    nextfunc();
    cycle++;
}

function stepInstr() {
    do {
        step();
    } while(nextfunc !== fetchInstruction);
}

function execBlock() {
    try {
        for(let i = 0; i < BLOCK_SIZE; i++)
            step();
        window.requestAnimationFrame(execBlock);
    } catch(e) {
        console.error(e);
    }
}

function startCPU() {
    window.requestAnimationFrame(execBlock);
}