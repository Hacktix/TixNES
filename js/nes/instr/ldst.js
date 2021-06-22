// ----------------------------------------------------------------------
// LDX
// ----------------------------------------------------------------------
function _ldx(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _ldx.bind(this, null, 1));
            break;
        case 1:
            registers.x = tmp.pop();
            registers.flag_z = registers.x === 0;
            registers.flag_n = registers.x > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xA2] = _ldx.bind(this, _read8_immediate);

// ----------------------------------------------------------------------
// LDA
// ----------------------------------------------------------------------
function _lda(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _lda.bind(this, null, 1));
            break;
        case 1:
            registers.a = tmp.pop();
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xA9] = _lda.bind(this, _read8_immediate);

// ----------------------------------------------------------------------
// STX
// ----------------------------------------------------------------------
function _stx(storefunc, cycle) {
    switch(cycle) {
        default:
            tmp.push(registers.x);
            nextfunc = storefunc.bind(this, _stx.bind(this, null, 1));
            break;
        case 1:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x86] = _stx.bind(this, _write8_zpage);