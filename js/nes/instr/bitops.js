// ----------------------------------------------------------------------
// BIT
// ----------------------------------------------------------------------
function _bit(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _bit.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            let r = registers.a & v;
            registers.flag_z = r === 0;
            registers.flag_v = (v & (1 << 6)) !== 0;
            registers.flag_n = (v & (1 << 7)) !== 0;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x24] = _bit.bind(this, _read8_zpage);

// ----------------------------------------------------------------------
// AND
// ----------------------------------------------------------------------
function _and(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _and.bind(this, null, 1));
            break;
        case 1:
            registers.a &= tmp.pop();
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x29] = _and.bind(this, _read8_immediate);

// ----------------------------------------------------------------------
// ORA
// ----------------------------------------------------------------------
function _ora(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _ora.bind(this, null, 1));
            break;
        case 1:
            registers.a |= tmp.pop();
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x09] = _ora.bind(this, _read8_immediate);

// ----------------------------------------------------------------------
// EOR
// ----------------------------------------------------------------------
function _eor(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _eor.bind(this, null, 1));
            break;
        case 1:
            registers.a ^= tmp.pop();
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x49] = _eor.bind(this, _read8_immediate);

// ----------------------------------------------------------------------
// LSR
// ----------------------------------------------------------------------
function _lsr_acc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _lsr_acc.bind(this, 1);
            break;
        case 1:
            registers.flag_c = (registers.a & 1) !== 0;
            registers.a >>= 1;
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x4A] = _lsr_acc;