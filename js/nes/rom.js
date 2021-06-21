function decodeRomObject(rom) {
    if(rom[0] === 0x4E && rom[1] === 0x45 && rom[2] === 0x53 && rom[3] === 0x1A) {
        if((rom[7] & 0xC) == 0x08)
            return decodeRomObjectNES20(rom);
        else
            return decodeRomObjectiNES(rom);
    }
    return null;
}

function decodeRomObjectNES20(rom) {
    // TODO: Implement NES 2.0 support
    return null;
}

function decodeRomObjectiNES(rom) {
    // Decode ROM Header
    let romheader = rom.splice(0, 16);
    let header = {
        prgrom_size: 16384 * romheader[4],
        prgram_size: 8192 * romheader[8],
        chrrom_size: 8192 * romheader[5],
        mapper: (romheader[6] >> 4) | (romheader[7] & 0xF0)
    };

    // Separate Trainer
    let hasTrainer = (romheader[6] & 0b100) !== 0;
    let trainer = hasTrainer ? rom.splice(0, 512) : null;

    // PRG and CHR ROM (if present)
    let prgrom = rom.splice(0, header.prgrom_size);
    let chrrom = header.chrrom_size === 0 ? null : rom.splice(0, header.chrrom_size);

    return { header, trainer, prgrom, chrrom };
}