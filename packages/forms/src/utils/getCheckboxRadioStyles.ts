const getCheckboxRadioStyles = (shouldReduceMotion: boolean | null) => ({
  "data-h2-appearance": "base(none)",
  "data-h2-background-color":
    "base(white) base:focus-visible(focus) base:selectors[::before](primary) base:dark:selectors[::before](primary.light) base:all:selectors[:focus-visible::before](black)",
  "data-h2-border": "base(thin solid black.light)",
  "data-h2-color": "base(currentColor)",
  "data-h2-content": "base:selectors[::before]('')",
  "data-h2-display": "base(grid)",
  "data-h2-flex-shrink": "base(0)",
  "data-h2-place-content": "base(center)",
  "data-h2-height": "base(x1) base:selectors[::before](x.5)",
  "data-h2-line-height": "base(x1)",
  "data-h2-margin": "base(0)",
  "data-h2-transform":
    "base:selectors[::before](scale(0)) base:selectors[:checked::before](scale(1))",
  ...(!shouldReduceMotion && {
    "data-h2-transition":
      "base:selectors[::before](120ms transform ease-in-out)",
  }),
  "data-h2-width": "base(x1) base:selectors[::before](x.5)",
});

export default getCheckboxRadioStyles;
