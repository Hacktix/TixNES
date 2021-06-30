// Variable Definitions
var ppuram = null;
var paletteram = null;
var oam = null;

var _ppu = null;
var nextfuncPPU = null;

const monoPalette = [
    [0, 0, 0],
    [100, 100, 100],
    [200, 200, 200],
    [255, 255, 255],
]

// Reset Function
function resetPPU() {
    ppuram = new Array(0x3000).fill(0);
    paletteram = new Array(0x20).fill(0);
    oam = new Array(0x100).fill(0);

    _ppu = {

        // Rendering Variables
        x: 0,
        y: -1,
        fetchX: 0,
        fetchY: 0,
        nt: 0,
        at: 0,
        bgl: 0,
        bgh: 0,
        shift_pattern: [],
        lineCycle: 0,
        fetchState: 0,

        // PPUCTRL Register
        _nametable: 0x2000,
        _addr_inc: 1,
        _sprite_pat_table: 0x0000,
        _bg_pat_table: 0x0000,
        _sprite16: false,
        _master: false,
        _en_nmi: false,
        set ppuctrl(v) {
            this._nametable = [0x2000, 0x2400, 0x2800, 0x2C00][v & 0b11];
            this._addr_inc = (v & 0b100) === 0 ? 1 : 32;
            this._sprite_pat_table = (v & 0b1000) === 0 ? 0x0000 : 0x1000;
            this._bg_pat_table = (v & 0b10000) === 0 ? 0x0000 : 0x1000;
            this._sprite16 = (v & 0b100000) !== 0;
            this._master = (v & 0b1000000) !== 0;
            this._en_nmi = (v & 0b10000000) !== 0;
        },

        // PPUSTATUS Register
        _status: 0,
        set flag_v(v) { if(v) this._status |= 0x80; else this._status &= ~0x80; },
        set flag_s(v) { if(v) this._status |= 0x40; else this._status &= ~0x40; },
        set flag_o(v) { if(v) this._status |= 0x20; else this._status &= ~0x20; },
        set write_latch(v) { this._status = (this._status & 0xE) | (v & 0x1F); },
        get ppustatus() {
            let v = this._status;
            this._status &= 0x7F;
            this._ppuaddr_hi = true;
            // TODO: Clear PPUSCROLL Latch
            return v;
        },

        // PPUADDR Register
        _ppuaddr: 0,
        _ppuaddr_hi: true,
        set ppuaddr(v) {
            if(this._ppuaddr_hi)
                this._ppuaddr = (this._ppuaddr & 0xFF) + ((v & 0xFF) << 8);
            else
                this._ppuaddr = (this._ppuaddr & 0xFF00) + (v & 0xFF);
            this._ppuaddr_hi = !this._ppuaddr_hi;
        },
        get ppuaddr() { return this._ppuaddr; },

        // PPUDATA Register
        set ppudata(v) {
            ppuWrite(this._ppuaddr, v);
            this._ppuaddr += this._addr_inc;
        },
    };

    nextfuncPPU = zeroCycle;
}

// PPU Operation Functions
function tickPPU() {
    for(let i = 0; i < 3; i++) {
        //console.log(nextfuncPPU.name);
        nextfuncPPU();
    }
}

function zeroCycle() {
    // (Pre-)rendering scanlines
    if(_ppu.y < 240)
        return nextfuncPPU = renderCycle;

    // Post-render line + VBlank
    if(_ppu.y === 241 && _ppu.lineCycle === 1)
        _ppu.flag_v = 1;
    if(_ppu.lineCycle++ === 340) {
        _ppu.lineCycle = 0;
        if(++_ppu.y === 261) {
            _ppu.y = -1;
            _ppu.fetchY = 0;
            _ppu.shift_pattern = [];
        }
    }
}

function renderCycle() {
    // Increment Cycle Count & Clear Flags if necessary
    if(++_ppu.lineCycle === 1 && _ppu.y === -1) {
        _ppu.flag_v = false;
        _ppu.flag_s = false;
        _ppu.flag_o = false;
    }

    // Pattern Fetcher
    switch(_ppu.fetchState++) {
        case 0: // First NT byte cycle
        case 2: // First AT byte cycle
        case 4: // First Low BG cycle
        case 6: // First High BG cycle
            break;
        case 1: // Second NT byte cycle
            _ppu.nt = ppuRead(_ppu._nametable + 32*Math.floor(_ppu.fetchY/8) + _ppu.fetchX);
            break;
        case 3: // Second AT byte cycle
            _ppu.at = ppuRead(_ppu._nametable + 0x3C0 + 8*Math.floor(_ppu.fetchY/32) + Math.floor(_ppu.fetchX/8));
            break;
        case 5: // Second Low BG cycle
            _ppu.bgl = ppuRead(_ppu._bg_pat_table + 16*_ppu.nt + (_ppu.fetchY % 8));
            break;
        case 7: // Second High BG cycle
            _ppu.bgh = ppuRead(_ppu._bg_pat_table + 16*_ppu.nt + (_ppu.fetchY % 8) + 8);
            if(_ppu.fetchX <= 32)
                _ppu.fetchX++;

            // Decode & Push pixel data
            for(let i = 0x80, j = 7; i > 0; i >>= 1, j--)
                _ppu.shift_pattern.push(((_ppu.bgl & i) >> j) | (j > 0 ? ((_ppu.bgh & i) >> (j-1)) : ((_ppu.bgh & i) << 1)));

            _ppu.fetchState = 0;
            break;
    }

    // Rendering
    let px = _ppu.shift_pattern.length > 0 ? _ppu.shift_pattern.shift() : null;
    if(_ppu.y !== -1 && px !== null) {
        let rgb = monoPalette[px];
        drawPixel(rgb[0], rgb[1], rgb[2], _ppu.x++, _ppu.y);
    }

    // Checking for end of scanline
    if(_ppu.lineCycle === 340) {
        if(_ppu.y !== -1)
            _ppu.fetchY++;
        _ppu.fetchX = 0;
        _ppu.x = 0;
        _ppu.y++;
        _ppu.lineCycle = 0;
        _ppu.fetchState = 0;
        nextfuncPPU = zeroCycle;
    }
}

// Rendering Functions
function drawPixel(r, g, b, x, y) {
    let pxBase = (4*x) + (4*256*y);
    screenData.data[pxBase+0] = r;
    screenData.data[pxBase+1] = g;
    screenData.data[pxBase+2] = b;
    screenData.data[pxBase+3] = 255;
}

function renderFrame() {
    tmplcd.putImageData(screenData, 0, 0);
    screen.drawImage(tmpcanvas, 0, 0, 256, 240)
}