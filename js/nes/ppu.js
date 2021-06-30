// Variable Definitions
var ppuram = null;
var paletteram = null;
var oam = null;

var _ppu = null;

// Reset Function
function resetPPU() {
    ppuram = new Array(0x3000).fill(0);
    paletteram = new Array(0x20).fill(0);
    oam = new Array(0x100).fill(0);

    _ppu = {

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

        // PPUSTATUS Register (Stub)
        get ppustatus() { return 0x80; },

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
    }
}

// PPU Operation Functions
function tickPPU() {

}

const monoPalette = [
    [0, 0, 0],
    [100, 100, 100],
    [200, 200, 200],
    [255, 255, 255],
]

function _renderNametable() {
    for(let x = 0; x < 32*8; x++) {
        for(let y = 0; y < 30*8; y++) {
            let tile = ppuRead(_ppu._nametable + 32*Math.floor(y/8) + Math.floor(x/8));
            let pat_lo = ppuRead(_ppu._bg_pat_table + 16*tile + (y % 8));
            let pat_hi = ppuRead(_ppu._bg_pat_table + 16*tile + (y % 8) + 8);
            let px_lo = (pat_lo >> (7 - (x % 8))) & 1;
            let px_hi = (pat_hi >> (7 - (x % 8))) & 1;
            let px = (px_hi << 1) + px_lo;
            let pal = monoPalette[px];
            drawPixel(pal[0], pal[1], pal[2], x, y);
        }
    }
    renderFrame();
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