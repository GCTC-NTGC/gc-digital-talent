export function deriveTimelinePlacement(
  index?: number,
  groupLength?: number,
): "single" | "top" | "bottom" | "middle" | null {
  if (typeof index !== "number" || typeof groupLength !== "number") {
    return null;
  }

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
