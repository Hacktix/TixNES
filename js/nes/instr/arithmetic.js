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
            registers.flag_c = registers.a >= 0;
            registers.flag_z = registers.a === v;
            registers.flag_n = registers.a < v;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xC9] = _cmp.bind(this, _read8_immediate);

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
            registers.flag_c = registers.x >= 0;
            registers.flag_z = registers.x === v;
            registers.flag_n = registers.x < v;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xE0] = _cpx.bind(this, _read8_immediate);

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
            registers.flag_c = registers.y >= 0;
            registers.flag_z = registers.y === v;
            registers.flag_n = registers.y < v;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xC0] = _cpy.bind(this, _read8_immediate);

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