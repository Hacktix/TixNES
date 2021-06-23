// Include instruction files
include('nes/instr/memaccess.js');
include('nes/instr/jump.js');
include('nes/instr/branch.js');
include('nes/instr/ldst.js');
include('nes/instr/bitops.js');
include('nes/instr/arithmetic.js');
include('nes/instr/stack.js');

// Variable Declarations
var funcmap = { };   // Maps opcodes to function callbacks
var tmp = [];        // Buffer for values that need to be preserved between cycles

// Implementations of "General Purpose" Instructions that don't fit anywhere else
function _nop(cycle) {
    switch(cycle) {
        default:
            nextfunc = _nop.bind(this, 1);
            break;
        case 1:
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0xEA] = _nop;

function _sec(cycle) {
    switch(cycle) {
        default:
            nextfunc = _sec.bind(this, 1);
            break;
        case 1:
            registers.flag_c = true;
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0x38] = _sec;

function _clc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _clc.bind(this, 1);
            break;
        case 1:
            registers.flag_c = false;
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0x18] = _clc;

function _cld(cycle) {
    switch(cycle) {
        default:
            nextfunc = _cld.bind(this, 1);
            break;
        case 1:
            registers.flag_d = false;
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0xD8] = _cld;

function _sei(cycle) {
    switch(cycle) {
        default:
            nextfunc = _sei.bind(this, 1);
            break;
        case 1:
            registers.flag_i = true;
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0x78] = _sei;

function _sed(cycle) {
    switch(cycle) {
        default:
            nextfunc = _sed.bind(this, 1);
            break;
        case 1:
            registers.flag_d = true;
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0xF8] = _sed;

function _clv(cycle) {
    switch(cycle) {
        default:
            nextfunc = _clv.bind(this, 1);
            break;
        case 1:
            registers.flag_v = false;
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0xB8] = _clv;