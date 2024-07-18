export default {
  link: (isUnread: boolean, isDisabled: boolean) => ({
    "data-h2-text-decoration": "base(none)",
    "data-h2-color": "base(inherit) base:hover(secondary.darker)",
    "data-h2-outline": "base(none)",
    ...(isUnread && {
      "data-h2-font-weight": "base(700)",
    }),
    ...(isDisabled && {
      "data-h2-opacity": "base(0.6)",
      "data-h2-pointer-events": "base(none)",
      "aria-disabled": true,
    }),
  }),
};
