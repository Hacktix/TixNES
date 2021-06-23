// ----------------------------------------------------------------------
// PHP
// ----------------------------------------------------------------------
function _php(cycle) {
    switch(cycle) {
        default:
            nextfunc = _php.bind(this, 1);
            break;
        case 1:
            nextfunc = _php.bind(this, 2);
            break;
        case 2:
            writeByte(0x100 + registers.s--, (registers.p | 0b110000));
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x08] = _php;

// ----------------------------------------------------------------------
// PLA
// ----------------------------------------------------------------------
function _pla(cycle) {
    switch(cycle) {
        default:
            nextfunc = _pla.bind(this, 1);
            break;
        case 1:
            nextfunc = _pla.bind(this, 2);
            break;
        case 2:
            registers.s++;
            nextfunc = _pla.bind(this, 3);
            break;
        case 3:
            registers.a = readByte(0x100 + registers.s);
            registers.flag_z = registers.a === 0;
            registers.flag_n = registers.a > 127;
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x68] = _pla;