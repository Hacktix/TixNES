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
funcmap[0xA6] = _ldx.bind(this, _read8_zpage);
funcmap[0xAE] = _ldx.bind(this, _read8_absolute);

// ----------------------------------------------------------------------
// LDY
// ----------------------------------------------------------------------
function _ldy(loadfunc, cycle) {
    switch(cycle) {
        default:
            nextfunc = loadfunc.bind(this, _ldy.bind(this, null, 1));
            break;
        case 1:
            registers.y = tmp.pop();
            registers.flag_z = registers.y === 0;
            registers.flag_n = registers.y > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xA0] = _ldy.bind(this, _read8_immediate);
funcmap[0xA4] = _ldy.bind(this, _read8_zpage);
funcmap[0xAC] = _ldy.bind(this, _read8_absolute);

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
funcmap[0xAD] = _lda.bind(this, _read8_absolute);
funcmap[0xA5] = _lda.bind(this, _read8_zpage);
funcmap[0xA1] = _lda.bind(this, _read8_indexed_indirect_x);
funcmap[0xB1] = _lda.bind(this, _read8_indirect_indexed_y);

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
funcmap[0x8E] = _stx.bind(this, _write8_absolute);

// ----------------------------------------------------------------------
// STY
// ----------------------------------------------------------------------
function _sty(storefunc, cycle) {
    switch(cycle) {
        default:
            tmp.push(registers.y);
            nextfunc = storefunc.bind(this, _sty.bind(this, null, 1));
            break;
        case 1:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x84] = _sty.bind(this, _write8_zpage);
funcmap[0x8C] = _sty.bind(this, _write8_absolute);

// ----------------------------------------------------------------------
// STA
// ----------------------------------------------------------------------
function _sta(storefunc, cycle) {
    switch(cycle) {
        default:
            tmp.push(registers.a);
            nextfunc = storefunc.bind(this, _sta.bind(this, null, 1));
            break;
        case 1:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x85] = _sta.bind(this, _write8_zpage);
funcmap[0x8D] = _sta.bind(this, _write8_absolute);
funcmap[0x81] = _sta.bind(this, _write8_indexed_indirect_x);

// ----------------------------------------------------------------------
// TAX
// ----------------------------------------------------------------------
function _tax(cycle) {
    switch(cycle) {
        default:
            nextfunc = _tax.bind(this, 1);
            break;
        case 1:
            registers.x = registers.a;
            registers.flag_z = registers.x === 0;
            registers.flag_n = registers.x > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xAA] = _tax;

// ----------------------------------------------------------------------
// TAY
// ----------------------------------------------------------------------
function _tay(cycle) {
    switch(cycle) {
        default:
            nextfunc = _tay.bind(this, 1);
            break;
        case 1:
            registers.y = registers.a;
            registers.flag_z = registers.y === 0;
            registers.flag_n = registers.y > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xA8] = _tay;

// ----------------------------------------------------------------------
// TXA
// ----------------------------------------------------------------------
function _txa(cycle) {
    switch(cycle) {
        default:
            nextfunc = _txa.bind(this, 1);
            break;
        case 1:
            registers.a = registers.x;
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x8A] = _txa;

// ----------------------------------------------------------------------
// TYA
// ----------------------------------------------------------------------
function _tya(cycle) {
    switch(cycle) {
        default:
            nextfunc = _tya.bind(this, 1);
            break;
        case 1:
            registers.a = registers.y;
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x98] = _tya;

// ----------------------------------------------------------------------
// TSX
// ----------------------------------------------------------------------
function _tsx(cycle) {
    switch(cycle) {
        default:
            nextfunc = _tsx.bind(this, 1);
            break;
        case 1:
            registers.x = registers.s;
            registers.flag_z = registers.x === 0;
            registers.flag_n = registers.x > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xBA] = _tsx;

// ----------------------------------------------------------------------
// TXS
// ----------------------------------------------------------------------
function _txs(cycle) {
    switch(cycle) {
        default:
            nextfunc = _txs.bind(this, 1);
            break;
        case 1:
            registers.s = registers.x;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x9A] = _txs;