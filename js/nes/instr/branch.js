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

// ----------------------------------------------------------------------
// BCC
// ----------------------------------------------------------------------
function _bcc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _bcc.bind(this, 1));
            break;
        case 1:
            if(!registers.flag_c)
                nextfunc = _bcc.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _bcc.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x90] = _bcc;

// ----------------------------------------------------------------------
// BEQ
// ----------------------------------------------------------------------
function _beq(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _beq.bind(this, 1));
            break;
        case 1:
            if(registers.flag_z)
                nextfunc = _beq.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _beq.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xF0] = _beq;

// ----------------------------------------------------------------------
// BNE
// ----------------------------------------------------------------------
function _bne(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _bne.bind(this, 1));
            break;
        case 1:
            if(!registers.flag_z)
                nextfunc = _bne.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _bne.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0xD0] = _bne;

// ----------------------------------------------------------------------
// BVS
// ----------------------------------------------------------------------
function _bvs(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _bvs.bind(this, 1));
            break;
        case 1:
            if(registers.flag_v)
                nextfunc = _bvs.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _bvs.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x70] = _bvs;

// ----------------------------------------------------------------------
// BVC
// ----------------------------------------------------------------------
function _bvc(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _bvc.bind(this, 1));
            break;
        case 1:
            if(!registers.flag_v)
                nextfunc = _bvc.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _bvc.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x50] = _bvc;

// ----------------------------------------------------------------------
// BPL
// ----------------------------------------------------------------------
function _bpl(cycle) {
    switch(cycle) {
        default:
            nextfunc = _read8_immediate.bind(this, _bpl.bind(this, 1));
            break;
        case 1:
            if(!registers.flag_n)
                nextfunc = _bpl.bind(this, 2);
            else {
                tmp.pop();
                nextfunc = fetchInstruction;
            }
            break;
        case 2:
            let offset = e8(tmp.pop());
            let npc = (registers.pc + offset) & 0xFFFF;
            if((npc & 0xFF00) !== (npc & 0xFF00))
                nextfunc = _bpl.bind(this, 3);
            else
                nextfunc = fetchInstruction;
            registers.pc = npc;
            break;
        case 3:
            nextfunc = fetchInstruction;
            break;
    }
}

funcmap[0x10] = _bpl;