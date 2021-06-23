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