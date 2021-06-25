// ----------------------------------------------------------------------
// Reading Functions
// ----------------------------------------------------------------------

// (8 bit) Immediate Addressing - No Delay
function _read8_immediate(callback) {
    tmp.push(readByte(registers.pc++));
    callback();
}

// (16 bit) Immediate Addressing - 1 Cycle Delay
function _read16_immediate(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read16_immediate.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((readByte(registers.pc++) << 8) | tmp.pop());
            callback();
            break;
    }
}

// (16 bit) Indirect Addressing - 3 Cycle Delay
function _read16_indirect(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read16_indirect.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((readByte(registers.pc++) << 8) | tmp.pop());
            nextfunc = _read16_indirect.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp[0]));
            nextfunc = _read16_indirect.bind(this, callback, 3);
            break;
        case 3:
            tmp.push((readByte((tmp[0] & 0xFF00) + ((tmp.shift() + 1) & 0xFF)) << 8) | tmp.pop());
            callback();
            break;
    }
}

// (8 bit) Absolute Addressing - 2 Cycle Delay
function _read8_absolute(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read8_absolute.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((readByte(registers.pc++) << 8) | tmp.pop());
            nextfunc = _read8_absolute.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp.pop()));
            callback();
            break;
    }
}

// (8 bit) Zero Page Addressing - 1 Cycle Delay
function _read8_zpage(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read8_zpage.bind(this, callback, 1);
            break;
        case 1:
            tmp.push(readByte(tmp.pop()));
            callback();
            break;
    }
}

// (8 bit) Zero Page Addressing with X-Offset - 2 Cycle Delay
function _read8_zpage_x(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read8_zpage_x.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((tmp.pop() + registers.x) & 0xFF);
            nextfunc = _read8_zpage_x.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp.pop()));
            callback();
            break;
    }
}

// (8 bit) Zero Page Addressing with Y-Offset - 2 Cycle Delay
function _read8_zpage_y(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read8_zpage_y.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((tmp.pop() + registers.y) & 0xFF);
            nextfunc = _read8_zpage_y.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp.pop()));
            callback();
            break;
    }
}

// (8 bit) Indexed Indirect Addressing with X-Offset - 4 Cycle Delay
function _read8_indexed_indirect_x(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read8_indexed_indirect_x.bind(this, callback, 1);
            break;
        case 1:
            tmp.push(tmp.pop() + registers.x);
            nextfunc = _read8_indexed_indirect_x.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp[0] & 0xFF));
            nextfunc = _read8_indexed_indirect_x.bind(this, callback, 3);
            break;
        case 3:
            tmp.push(tmp.pop() + (readByte((tmp.pop() + 1) & 0xFF) << 8));
            nextfunc = _read8_indexed_indirect_x.bind(this, callback, 4);
            break;
        case 4:
            tmp.push(readByte(tmp.pop()));
            callback();
            break;
    }
}

// (8 bit) Indirect Indexed Addressing with Y-Offset - 4/5 Cycle Delay
function _read8_indirect_indexed_y(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _read8_indirect_indexed_y.bind(this, callback, 1);
            break;
        case 1:
            tmp.push(readByte(tmp[0]));
            nextfunc = _read8_indirect_indexed_y.bind(this, callback, 2);
            break;
        case 2:
            tmp.push((readByte((tmp.shift() + 1) & 0xFF) << 8) + tmp.pop());
            nextfunc = _read8_indirect_indexed_y.bind(this, callback, 3);
            break;
        case 3:
            if(((tmp[0] + registers.y) & 0xFF00) !== (tmp[0] & 0xFF00)) {
                readByte((tmp[0] & 0xFF00) + ((tmp[0] + registers.y) & 0xFF))
                nextfunc = _read8_indirect_indexed_y.bind(this, callback, 4);
                break;
            }
        case 4:
            tmp.push(readByte(tmp.pop() + registers.y));
            callback();
            break;
    }
}



// ----------------------------------------------------------------------
// Writing Functions
// ----------------------------------------------------------------------

// (8-bit) Zero Page Addressing - 1 Cycle Delay
function _write8_zpage(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _write8_zpage.bind(this, callback, 1);
            break;
        case 1:
            writeByte(tmp.pop(), tmp.pop());
            callback();
            break;
    }
}

// (8-bit) Absolute Addressing - 2 Cycle Delay
function _write8_absolute(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _write8_absolute.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((readByte(registers.pc++) << 8) + tmp.pop());
            nextfunc = _write8_absolute.bind(this, callback, 2);
            break;
        case 2:
            writeByte(tmp.pop(), tmp.pop());
            callback();
            break;
    }
}

// (8-bit) Indexed Indirect Addressing with X-Offset - 4 Cycle Delay
function _write8_indexed_indirect_x(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _write8_indexed_indirect_x.bind(this, callback, 1);
            break;
        case 1:
            tmp.push(tmp.pop() + registers.x);
            nextfunc = _write8_indexed_indirect_x.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp[1] & 0xFF));
            nextfunc = _write8_indexed_indirect_x.bind(this, callback, 3);
            break;
        case 3:
            tmp.push(tmp.pop() + (readByte((tmp.pop() + 1) & 0xFF) << 8));
            nextfunc = _write8_indexed_indirect_x.bind(this, callback, 4);
            break;
        case 4:
            writeByte(tmp.pop(), tmp.pop());
            callback();
            break;
    }
}

// (8-bit) Indirect Indexed Addressing with Y-Offset - 5 Cycle Delay
function _write8_indirect_indexed_y(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _write8_indirect_indexed_y.bind(this, callback, 1);
            break;
        case 1:
            tmp.push(readByte(tmp[1]));
            nextfunc = _write8_indirect_indexed_y.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(tmp.pop() + (readByte((tmp.pop() + 1) & 0xFF) << 8));
            nextfunc = _write8_indirect_indexed_y.bind(this, callback, 3);
            break;
        case 3:
            readByte((tmp[1] & 0xFF00) + ((tmp[1] + registers.y) & 0xFF))
            nextfunc = _write8_indirect_indexed_y.bind(this, callback, 4);
            break;
        case 4:
            writeByte(tmp.pop(), tmp.pop());
            callback();
            break;
    }
}



// ----------------------------------------------------------------------
// Modify Functions
// ----------------------------------------------------------------------

// (8-bit) Zero Page Addressing - 2 Cycle Delay - 1 Cycle Operation - 1 Cycle Delay
function _mod8_zpage(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _mod8_zpage.bind(this, callback, 1);
            break;
        case 1:
            tmp.push(readByte(tmp[0]));
            nextfunc = _mod8_zpage.bind(this, callback, 2);
            break;
        case 2:
            writeByte(tmp[0], tmp[1]);
            callback();
            nextfunc = _mod8_zpage.bind(this, callback, 3);
            break;
        case 3:
            let v = tmp.pop();
            writeByte(tmp.pop(), v);
            nextfunc = fetchInstruction;
            break;
    }
}

// (8-bit) Absolute Addressing - 3 Cycle Delay - 1 Cycle Operation - 1 Cycle Delay
function _mod8_absolute(callback, cycle) {
    switch(cycle) {
        default:
            tmp.push(readByte(registers.pc++));
            nextfunc = _mod8_absolute.bind(this, callback, 1);
            break;
        case 1:
            tmp.push((readByte(registers.pc++) << 8) + tmp.pop());
            nextfunc = _mod8_absolute.bind(this, callback, 2);
            break;
        case 2:
            tmp.push(readByte(tmp[0]));
            nextfunc = _mod8_absolute.bind(this, callback, 3);
            break;
        case 3:
            writeByte(tmp[0], tmp[1]);
            callback();
            nextfunc = _mod8_absolute.bind(this, callback, 4);
            break;
        case 4:
            let v = tmp.pop();
            writeByte(tmp.pop(), v);
            nextfunc = fetchInstruction;
            break;
    }
}