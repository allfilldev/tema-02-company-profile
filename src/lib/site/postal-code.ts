type AddressRegionParts = {
  city: string;
  region: string;
  postalCode: string;
};

export function visiblePostalCode(postalCode: string): string | null {
  const trimmed = postalCode.trim();
  return trimmed === "" || /^-+$/.test(trimmed) ? null : trimmed;
}

export function formatAddressRegionLine({ city, region, postalCode }: AddressRegionParts): string {
  const visible = visiblePostalCode(postalCode);
  const base = `${city}, ${region}`;
  return visible ? `${base} ${visible}` : base;
}
