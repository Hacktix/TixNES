// ----------------------------------------------------------------------
// JMP
// ----------------------------------------------------------------------
function _jmp(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _jmp.bind(this, null, 1));
            break;
        case 1:
            registers.pc = tmp.pop();
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x4C] = _jmp.bind(this, _read16_immediate);