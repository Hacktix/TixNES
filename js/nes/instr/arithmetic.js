// ----------------------------------------------------------------------
// CMP
// ----------------------------------------------------------------------
function _cmp(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _cmp.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            registers.flag_c = registers.a >= v;
            registers.flag_z = registers.a === v;
            registers.flag_n = ((registers.a - v) & 0xFF) > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xC9] = _cmp.bind(this, _read8_immediate);
funcmap[0xC5] = _cmp.bind(this, _read8_zpage);
funcmap[0xCD] = _cmp.bind(this, _read8_absolute);
funcmap[0xC1] = _cmp.bind(this, _read8_indexed_indirect_x);

// ----------------------------------------------------------------------
// CPX
// ----------------------------------------------------------------------
function _cpx(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _cpx.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            registers.flag_c = registers.x >= v;
            registers.flag_z = registers.x === v;
            registers.flag_n = ((registers.x - v) & 0xFF) > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xE0] = _cpx.bind(this, _read8_immediate);
funcmap[0xE4] = _cpx.bind(this, _read8_zpage);
funcmap[0xEC] = _cpx.bind(this, _read8_absolute);

// ----------------------------------------------------------------------
// CPY
// ----------------------------------------------------------------------
function _cpy(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _cpy.bind(this, null, 1));
            break;
        case 1:
            let v = tmp.pop();
            registers.flag_c = registers.y >= v;
            registers.flag_z = registers.y === v;
            registers.flag_n = ((registers.y - v) & 0xFF) > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xC0] = _cpy.bind(this, _read8_immediate);
funcmap[0xC4] = _cpy.bind(this, _read8_zpage);
funcmap[0xCC] = _cpy.bind(this, _read8_absolute);

// ----------------------------------------------------------------------
// ADC
// ----------------------------------------------------------------------
function _adc(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _adc.bind(this, null, 1));
            break;
        case 1:
            let a = tmp.pop();
            let v = a + registers.a + registers.flag_c;
            registers.flag_c = v > 0xFF;
            registers.flag_z = (v & 0xFF) === 0;
            registers.flag_v = ~(registers.a ^ a) & (registers.a ^ v) & 0x80;
            registers.flag_n = (v & 0xFF) > 127;
            registers.a = v;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x69] = _adc.bind(this, _read8_immediate);
funcmap[0x65] = _adc.bind(this, _read8_zpage);
funcmap[0x6D] = _adc.bind(this, _read8_absolute);
funcmap[0x61] = _adc.bind(this, _read8_indexed_indirect_x);

// ----------------------------------------------------------------------
// SBC
// ----------------------------------------------------------------------
function _sbc(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _sbc.bind(this, null, 1));
            break;
        case 1:
            tmp.push(~tmp.pop() & 0xFF);
            _adc(null, 1);
            break;
    }
}

funcmap[0xE9] = _sbc.bind(this, _read8_immediate);
funcmap[0xE5] = _sbc.bind(this, _read8_zpage);
funcmap[0xED] = _sbc.bind(this, _read8_absolute);
funcmap[0xE1] = _sbc.bind(this, _read8_indexed_indirect_x);

// ----------------------------------------------------------------------
// INX
// ----------------------------------------------------------------------
function _inx(cycle) {
    switch(cycle) {
        default:
            nextfunc = _inx.bind(this, 1);
            break;
        case 1:
            registers.x++;
            registers.flag_z = registers.x === 0;
            registers.flag_n = registers.x > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xE8] = _inx;

// ----------------------------------------------------------------------
// INY
// ----------------------------------------------------------------------
function _iny(cycle) {
    switch(cycle) {
        default:
            nextfunc = _iny.bind(this, 1);
            break;
        case 1:
            registers.y++;
            registers.flag_z = registers.y === 0;
            registers.flag_n = registers.y > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xC8] = _iny;

// ----------------------------------------------------------------------
// DEX
// ----------------------------------------------------------------------
function _dex(cycle) {
    switch(cycle) {
        default:
            nextfunc = _dex.bind(this, 1);
            break;
        case 1:
            registers.x--;
            registers.flag_z = registers.x === 0;
            registers.flag_n = registers.x > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xCA] = _dex;

// ----------------------------------------------------------------------
// DEY
// ----------------------------------------------------------------------
function _dey(cycle) {
    switch(cycle) {
        default:
            nextfunc = _dey.bind(this, 1);
            break;
        case 1:
            registers.y--;
            registers.flag_z = registers.y === 0;
            registers.flag_n = registers.y > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x88] = _dey;

// ----------------------------------------------------------------------
// INC
// ----------------------------------------------------------------------

function _inc(modfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = modfunc.bind(this, _inc.bind(this, null, 1));
            break;
        case 1:
            let v = (tmp.pop() + 1) & 0xFF;
            registers.flag_z = v === 0;
            registers.flag_n = v > 127;
            tmp.push(v);
            break;
    }
}

funcmap[0xE6] = _inc.bind(this, _mod8_zpage);

// ----------------------------------------------------------------------
// DEC
// ----------------------------------------------------------------------

function _dec(modfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = modfunc.bind(this, _dec.bind(this, null, 1));
            break;
        case 1:
            let v = (tmp.pop() - 1) & 0xFF;
            registers.flag_z = v === 0;
            registers.flag_n = v > 127;
            tmp.push(v);
            break;
    }
}

funcmap[0xC6] = _dec.bind(this, _mod8_zpage);