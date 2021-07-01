var _input = null;

function resetInputState() {
    _input = {
        _state: 0,
        _latchedState: 0,
        _latch: false,

        set joypad(v) {
            this._latch = (v & 1) === 1;
            this._latchedState = this._state;
        },
        get joypad() {
            if(this._latch)
                this._latchedState = this._state;
            let v = (this._latchedState & 0x80) >> 7;
            this._latchedState = (this._latchedState << 1) & 0xFF;
            return v;
        },
    }
}

function handleKeyDown(e) {
    switch(e.keyCode) {
        case 65: _input._state |= (1 << 7); break;
        case 83: _input._state |= (1 << 6); break;
        case 16: _input._state |= (1 << 5); break;
        case 13: _input._state |= (1 << 4); break;
        case 38: _input._state |= (1 << 3); break;
        case 40: _input._state |= (1 << 2); break;
        case 37: _input._state |= (1 << 1); break;
        case 39: _input._state |= (1 << 0); break;
    }
}

function handleKeyUp(e) {
    switch(e.keyCode) {
        case 65: _input._state &= ~(1 << 7); break;
        case 83: _input._state &= ~(1 << 6); break;
        case 16: _input._state &= ~(1 << 5); break;
        case 13: _input._state &= ~(1 << 4); break;
        case 38: _input._state &= ~(1 << 3); break;
        case 40: _input._state &= ~(1 << 2); break;
        case 37: _input._state &= ~(1 << 1); break;
        case 39: _input._state &= ~(1 << 0); break;
    }
}