function _jmp_abs(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read16_immediate.bind(this, _jmp_abs.bind(this, 1));
            break;
        case 1:
            registers.pc = tmp.pop();
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0x4C] = _jmp_abs;