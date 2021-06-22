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