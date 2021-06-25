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
funcmap[0x2C] = _bit.bind(this, _read8_absolute);

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
funcmap[0x25] = _and.bind(this, _read8_zpage);
funcmap[0x2D] = _and.bind(this, _read8_absolute);
funcmap[0x21] = _and.bind(this, _read8_indexed_indirect_x);
funcmap[0x31] = _and.bind(this, _read8_indirect_indexed_y);

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
funcmap[0x05] = _ora.bind(this, _read8_zpage);
funcmap[0x0D] = _ora.bind(this, _read8_absolute);
funcmap[0x01] = _ora.bind(this, _read8_indexed_indirect_x);
funcmap[0x11] = _ora.bind(this, _read8_indirect_indexed_y);

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
funcmap[0x45] = _eor.bind(this, _read8_zpage);
funcmap[0x4D] = _eor.bind(this, _read8_absolute);
funcmap[0x41] = _eor.bind(this, _read8_indexed_indirect_x);
funcmap[0x51] = _eor.bind(this, _read8_indirect_indexed_y);

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

function _lsr(modfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = modfunc.bind(this, _lsr.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            registers.flag_c = (v & 1) !== 0;
            v >>= 1;
            registers.flag_z = v === 0;
            registers.flag_n = v > 127;
            tmp.push(v);
            break;
    }
}

funcmap[0x4A] = _lsr_acc;
funcmap[0x46] = _lsr.bind(this, _mod8_zpage);
funcmap[0x4E] = _lsr.bind(this, _mod8_absolute);

// ----------------------------------------------------------------------
// ASL
// ----------------------------------------------------------------------
function _asl_acc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _asl_acc.bind(this, 1);
            break;
        case 1:
            registers.flag_c = (registers.a & 0x80) !== 0;
            registers.a <<= 1;
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

function _asl(modfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = modfunc.bind(this, _asl.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            registers.flag_c = (v & 0x80) !== 0;
            v = (v << 1) & 0xFF;
            registers.flag_z = v === 0;
            registers.flag_n = v > 127;
            tmp.push(v);
            break;
    }
}

funcmap[0x0A] = _asl_acc;
funcmap[0x06] = _asl.bind(this, _mod8_zpage);
funcmap[0x0E] = _asl.bind(this, _mod8_absolute);

// ----------------------------------------------------------------------
// ROR
// ----------------------------------------------------------------------
function _ror_acc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _ror_acc.bind(this, 1);
            break;
        case 1:
            let c = (registers.a & 1) !== 0;
            registers.a >>= 1;
            if(registers.flag_c)
                registers.a |= 0x80;
            registers.flag_c = c;
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

function _ror(modfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = modfunc.bind(this, _ror.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            let c = (v & 1) !== 0;
            v >>= 1;
            if(registers.flag_c)
                v |= 0x80;
            registers.flag_c = c;
            registers.flag_z = v === 0;
            registers.flag_n = v > 127;
            tmp.push(v);
            break;
    }
}

funcmap[0x6A] = _ror_acc;
funcmap[0x66] = _ror.bind(this, _mod8_zpage);
funcmap[0x6E] = _ror.bind(this, _mod8_absolute);

// ----------------------------------------------------------------------
// ROL
// ----------------------------------------------------------------------
function _rol_acc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _rol_acc.bind(this, 1);
            break;
        case 1:
            let c = (registers.a & 0x80) !== 0;
            registers.a <<= 1;
            if(registers.flag_c)
                registers.a |= 1;
            registers.flag_c = c;
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

function _rol(modfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = modfunc.bind(this, _rol.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            let c = (v & 0x80) !== 0;
            v = (v << 1) & 0xFF;
            if(registers.flag_c)
                v |= 1;
            registers.flag_c = c;
            registers.flag_z = v === 0;
            registers.flag_n = v > 127;
            tmp.push(v);
            break;
    }
}

funcmap[0x2A] = _rol_acc;
funcmap[0x26] = _rol.bind(this, _mod8_zpage);
funcmap[0x2E] = _rol.bind(this, _mod8_absolute);