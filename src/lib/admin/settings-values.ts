type AddressValues = { street?: unknown; city?: unknown; region?: unknown; postalCode?: unknown; country?: unknown };

export function flattenSettingsValues(values: Record<string, unknown>): Record<string, unknown> {
  const { address, ...rest } = values;
  if (!address || typeof address !== "object") {
    return rest;
  }

  const parts = address as AddressValues;
  return {
    ...rest,
    addressStreet: parts.street,
    addressCity: parts.city,
    addressRegion: parts.region,
    postalCode: parts.postalCode,
    addressCountry: parts.country,
  };
}
