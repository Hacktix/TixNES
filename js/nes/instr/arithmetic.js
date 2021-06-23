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