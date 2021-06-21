class NROM {

    static init(rom) {
        NROM._prgram = new Array(rom.header.prgram_size);
        NROM._chrrom = rom.chrrom;
        NROM._prgrom = rom.prgrom;

        cartRead = NROM.read;
        cartWrite = NROM.write;
    }

    static read(addr) {
        if(addr < 0x6000)
            return 0;
        
        // PRG RAM
        if(addr < 0x8000)
            return NROM._prgram.length > 0 ? NROM._prgram[addr % NROM._prgram.length] : 0;
        
        // ROM
        return NROM._prgrom[addr % NROM._prgrom.length];
    }

    static write(addr, val) {
        if(addr < 0x6000)
            return;

        if(addr < 0x8000) {
            if(NROM._prgram.length > 0)
                NROM._prgram[addr % NROM._prgram.length] = val;
            return;
        }
    }

}

mappers[0] = NROM;
console.log(mappers);