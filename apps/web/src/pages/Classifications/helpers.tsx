export function getClassificationLevels(): {
  value: number;
  label: number;
}[] {
  const levels: {
    value: number;
    label: number;
  }[] = [];
  for (let i = 1; i <= 19; i++) {
    levels.push({ value: i, label: i });
  }
  return levels;
}
