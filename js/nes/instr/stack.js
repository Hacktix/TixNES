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
            writeByte(0x100 + registers.s--, registers.p);
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x08] = _php;