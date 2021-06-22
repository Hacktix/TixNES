// Include instruction files
include('nes/instr/memaccess.js');
include('nes/instr/jump.js');
include('nes/instr/branch.js');
include('nes/instr/ldst.js');

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