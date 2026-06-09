import type { LocalizedProvinceOrTerritory } from "@gc-digital-talent/graphql";

export const locationAccessor = (
  city?: string | null,
  provinceOrTerritory?: LocalizedProvinceOrTerritory | null,
): string | null => {
  if (!city && !provinceOrTerritory) return null;
  const strings: string[] = [];

  if (city) {
    strings.push(city);
  }

  if (provinceOrTerritory?.label.localized) {
    strings.push(provinceOrTerritory.label.localized);
  }

  return strings.join(", ");
};
