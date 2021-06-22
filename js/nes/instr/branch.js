// ----------------------------------------------------------------------
// BCS
// ----------------------------------------------------------------------
function _bcs(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _bcs.bind(this, 1));
            break;
        case 1:
            if(registers.flag_c)
                nextfunc = _bcs.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _bcs.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xB0] = _bcs;