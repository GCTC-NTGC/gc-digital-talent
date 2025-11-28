export const GLOBAL_A11Y_EXCLUDES = [
  // NOTE: Hero has many colour contrast that are not true errors
  ".Hero",
  // NOTE: Known issue: https://github.com/radix-ui/primitives/issues/3560
  "[aria-haspopup][aria-controls]",
  // NOTE: Known issue: https://github.com/radix-ui/primitives/issues/3593
  "[data-radix-focus-guard]",
];
