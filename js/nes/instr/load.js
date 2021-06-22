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