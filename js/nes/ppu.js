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

const colorPalette = [
    [101,101,101],[0,45,105],[19,31,127],[60,19,124],[96,11,98],[115,10,55],[113,15,7],[90,26,0],[52,40,0],[11,52,0],[0,60,0],[0,61,16],[0,56,64],[0,0,0],[0,0,0],[0,0,0],
    [174,174,174],[15,99,179],[64,81,208],[120,65,204],[167,54,169],[192,52,112],[189,60,48],[159,74,0],[109,92,0],[54,109,0],[7,119,4],[0,121,61],[0,114,125],[0,0,0],[0,0,0],[0,0,0],
    [255,255,255],[93,179,255],[143,161,255],[200,144,255],[247,133,250],[255,131,192],[255,139,127],[239,154,73],[189,172,44],[133,188,47],[85,199,83],[60,201,140],[62,194,205],[78,78,78],[0,0,0],[0,0,0],
    [255,255,255],[188,223,255],[209,216,255],[232,209,255],[251,205,253],[255,204,229],[255,207,202],[248,213,180],[228,220,168],[204,227,169],[185,232,184],[174,232,208],[175,229,234],[182,182,182],[0,0,0],[0,0,0],
];

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
        patternShift: [],
        paletteShift: [],
        lineCycle: 0,
        fetchState: 0,
        frame: 0,

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
        set write_latch(v) { this._status = (this._status & 0xE0) | (v & 0x1F); },
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

        // PPUDATA Register
        _dataBuffer: 0,
        get ppudata() {
            let v = ppuRead(this._ppuaddr);
            if(this._ppuaddr < 0x3F00) {
                let av = this._dataBuffer;
                this._dataBuffer = v;
                this._ppuaddr += this._addr_inc;
                return av;
            }
            this._dataBuffer = v;
            this._ppuaddr += this._addr_inc;
            return v;
        },
        set ppudata(v) {
            ppuWrite(this._ppuaddr, v);
            this._ppuaddr += this._addr_inc;
        },

        // NMI
        nmiTrigger: false,
        lastStateNMI: false,
    };

    nextfuncPPU = zeroCycle;
}

// PPU Operation Functions
function tickPPU() {
    for(let i = 0; i < 3; i++) {
        nextfuncPPU();

        // Update NMI
        let nmi = _ppu._en_nmi && ((_ppu._status & 0x80) !== 0);
        if(!_ppu.lastStateNMI && nmi)
            _ppu.nmiTrigger = true;
        _ppu.lastStateNMI = nmi;
    }
}

function zeroCycle() {
    // (Pre-)rendering scanlines
    if(_ppu.y < 240) {
        if(_ppu.y === 0 && (_ppu.frame++ % 2) === 1)
            renderCycle();
        return nextfuncPPU = renderCycle;
    }

    // Post-render line + VBlank
    if(_ppu.y === 241 && _ppu.lineCycle === 1) {
        _ppu.flag_v = 1;
    }
    if(_ppu.lineCycle++ === 340) {
        _ppu.lineCycle = 0;
        if(++_ppu.y === 261) {
            _ppu.y = -1;
            _ppu.fetchY = 0;
            _ppu.patternShift = [];
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
    if(_ppu.lineCycle < 257 || _ppu.lineCycle > 320) {
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
                _ppu.at = ppuRead(_ppu._nametable + 0x3C0 + 8*Math.floor(_ppu.fetchY/32) + Math.floor(_ppu.fetchX/4));
                break;
            case 5: // Second Low BG cycle
                _ppu.bgl = ppuRead(_ppu._bg_pat_table + 16*_ppu.nt + (_ppu.fetchY % 8));
                break;
            case 7: // Second High BG cycle
                _ppu.bgh = ppuRead(_ppu._bg_pat_table + 16*_ppu.nt + (_ppu.fetchY % 8) + 8);
    
                // Decode & Push pixel data
                let pal =   ((_ppu.fetchX % 4) < 2) ?
                                ((_ppu.fetchY % 32) < 16) ? (_ppu.at & 0b11) : ((_ppu.at & 0b110000) >> 4) :
                                ((_ppu.fetchY % 32) < 16) ? ((_ppu.at & 0b1100) >> 2) : ((_ppu.at & 0b11000000) >> 6);
                for(let i = 0x80, j = 7; i > 0; i >>= 1, j--) {
                    _ppu.patternShift.push(((_ppu.bgl & i) >> j) | (j > 0 ? ((_ppu.bgh & i) >> (j-1)) : ((_ppu.bgh & i) << 1)));
                    _ppu.paletteShift.push(pal);
                }
                _ppu.fetchX++;
    
                _ppu.fetchState = 0;
                break;
        }
    }

    // Rendering
    if(_ppu.x < 256) {
        let px = _ppu.patternShift.length > 0 ? _ppu.patternShift.shift() : null;
        let pal = px === null ? null : _ppu.paletteShift.shift();
        if(_ppu.y !== -1 && px !== null) {
            let rgb = px === 0 ? colorPalette[(ppuRead(0x3F00) & 0x3F)] :
                                 colorPalette[ppuRead([0x3F01, 0x3F05, 0x3F09, 0x3F0D][pal] + px - 1) & 0x3F];
            drawPixel(rgb[0], rgb[1], rgb[2], _ppu.x++, _ppu.y);
        }
    }

    // Check for Pre-fetch for next line
    if(_ppu.lineCycle === 320) {
        _ppu.fetchState = 0;
        _ppu.patternShift = [];
        _ppu.paletteShift = [];
        _ppu.fetchX = 0;
        if(_ppu.y !== -1)
            _ppu.fetchY++;
    }

    // Checking for end of scanline
    if(_ppu.lineCycle === 340) {
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