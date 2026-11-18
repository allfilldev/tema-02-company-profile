const HEADER_BYTES = 6;
const ENTRY_BYTES = 16;
const PNG_WIDTH_OFFSET = 16;
const PNG_HEIGHT_OFFSET = 20;
const MAX_DIMENSION_BYTE = 256;
const BITS_PER_PIXEL = 32;

function dimensionByte(value: number): number {
  return value >= MAX_DIMENSION_BYTE ? 0 : value;
}

export function buildIco(pngs: Buffer[]): Buffer {
  const header = Buffer.alloc(HEADER_BYTES);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  let offset = HEADER_BYTES + pngs.length * ENTRY_BYTES;
  const entries = pngs.map((png) => {
    const entry = Buffer.alloc(ENTRY_BYTES);
    entry.writeUInt8(dimensionByte(png.readUInt32BE(PNG_WIDTH_OFFSET)), 0);
    entry.writeUInt8(dimensionByte(png.readUInt32BE(PNG_HEIGHT_OFFSET)), 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(BITS_PER_PIXEL, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...pngs]);
}
