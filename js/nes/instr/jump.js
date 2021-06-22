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

// ----------------------------------------------------------------------
// JSR
// ----------------------------------------------------------------------
function _jsr(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _jsr.bind(this, 1));
            break;
        case 1:
            nextfunc = _jsr.bind(this, 2);
            break;
        case 2:
            nextfunc = _jsr.bind(this, 3);
            break;
        case 3:
            writeByte(0x100 + (registers.s--), ((registers.pc-1) & 0xFF00) >> 8);
            nextfunc = _jsr.bind(this, 4);
            break;
        case 4:
            writeByte(0x100 + (registers.s--), (registers.pc-1) & 0xFF);
            nextfunc = _read8_immediate.bind(this, _jsr.bind(this, 5));
            break;
        case 5:
            registers.pc = (tmp.pop() << 8) | tmp.pop();
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x20] = _jsr;

// ----------------------------------------------------------------------
// RTS
// ----------------------------------------------------------------------
function _rts(cycle) {
    switch(cycle) {
        default:
            nextfunc = _rts.bind(this, 1);
            break;
        case 1:
            nextfunc = _rts.bind(this, 2);
            break;
        case 2:
            registers.s++;
            nextfunc = _rts.bind(this, 3);
            break;
        case 3:
            tmp.push(readByte(0x100 + registers.s++));
            nextfunc = _rts.bind(this, 4);
            break;
        case 4:
            tmp.push(readByte(0x100 + registers.s))
            nextfunc = _rts.bind(this, 5);
            break;
        case 5:
            registers.pc = ((tmp.pop() << 8) | tmp.pop()) + 2;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x60] = _rts;