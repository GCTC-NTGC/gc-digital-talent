// Given groupLength, figure out if a given index is at the top, middle, or bottom of a list.
export function deriveTimelinePlacement(
  index: number,
  groupLength: number,
): "single" | "top" | "bottom" | "middle" | null {
  if (groupLength == 1) {
    return "single";
  }
  if (groupLength > 1 && index == 0) {
    return "top";
  }
  if (groupLength > 1 && index == groupLength - 1) {
    return "bottom";
  }
  if (groupLength > 1 && index > 0 && index < groupLength - 1) {
    return "middle";
  }
  return null;
}
