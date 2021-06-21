function _jmp_abs(cycle) {
    switch(cycle) {
        default:
            nextfunc = _jmp_abs.bind(this, 1);
            break;
        case 1:
            tmp.push(readByte(registers.pc++));
            nextfunc = _jmp_abs.bind(this, 2);
            break;
        case 2:
            registers.pc = (readByte(registers.pc++) << 8) | tmp.pop();
            nextfunc = fetchInstruction;
            break;
    }
}
funcmap[0x4C] = _jmp_abs;