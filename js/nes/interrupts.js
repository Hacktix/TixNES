function _nmi_dispatch(cycle) {
    switch(cycle) {
        default:
            writeByte(0x100 + (registers.s--), (registers.pc & 0xFF00) >> 8);
            nextfunc = _nmi_dispatch.bind(this, 1);
            break;
        case 1:
            writeByte(0x100 + (registers.s--), registers.pc & 0xFF);
            nextfunc = _nmi_dispatch.bind(this, 2);
            break;
        case 2:
            writeByte(0x100 + (registers.s--), registers.p);
            nextfunc = _nmi_dispatch.bind(this, 3);
            break;
        case 3:
            registers.flag_i = false;
            nextfunc = _nmi_dispatch.bind(this, 4);
            break;
        case 4:
            registers.pc = readByte(0xFFFA) | (readByte(0xFFFB) << 8);
            nextfunc = fetchInstruction;
            break;
    }
}