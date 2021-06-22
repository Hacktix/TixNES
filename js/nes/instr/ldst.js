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
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xA2] = _ldx.bind(this, _read8_immediate);

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