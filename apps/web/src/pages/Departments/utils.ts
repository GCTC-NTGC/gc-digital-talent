export type DepartmentType =
  | "isCorePublicAdministration"
  | "isCentralAgency"
  | "isScience"
  | "isRegulatory";

export function departmentTypeToInput(types?: DepartmentType[]) {
  return {
    isCorePublicAdministration:
      types?.includes("isCorePublicAdministration") ?? false,
    isCentralAgency: types?.includes("isCentralAgency") ?? false,
    isScience: types?.includes("isScience") ?? false,
    isRegulatory: types?.includes("isRegulatory") ?? false,
  };
}
