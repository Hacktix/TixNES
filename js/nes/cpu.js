// Constant Value Definition
const BLOCK_SIZE = 1789773;

// Include Instruction Set
include('nes/instr/instrs.js');

// Variable Definitions
var registers = null;
var nextfunc = null;

// Reset Function
function resetCPU() {
    registers = {
        _a: 0,
        _x: 0,
        _y: 0,
        _p: 0x34,
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
        set p(v) { this._p = v & 0x3F; },
        set s(v) { this._s = v & 0xFF; },
        set pc(v) { this._pc = v & 0xFFFF; },
    }
    nextfunc = fetchInstruction;
}

// Callback function for fetching & decoding the next instruction
function fetchInstruction() {
    let opcode = readByte(registers.pc++);
    if(funcmap[opcode] === undefined)
        throw `Encountered unknown opcode $${opcode.toString(16).padStart(2, '0')} at $${(registers.pc-1).toString(16).padStart(4, '0')}`;
    funcmap[opcode]();
}

// CPU Operation Functions
function step() {
    nextfunc();
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