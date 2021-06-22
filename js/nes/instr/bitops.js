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