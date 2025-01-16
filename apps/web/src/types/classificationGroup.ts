export const CLASSIFICATION_GROUP = [
  "AS",
  "CR",
  "EC",
  "EX",
  "IT",
  "PM",
] as const; // List of classification groups that we expect need to be handled.

export type ClassificationGroup = (typeof CLASSIFICATION_GROUP)[number];

export const isClassificationGroup = (x: unknown): x is ClassificationGroup => {
  return (
    typeof x === "string" &&
    CLASSIFICATION_GROUP.includes(x as ClassificationGroup)
  );
};
