export type NavMenuType = "link" | "subMenuLink";
export const linkStyleMapDesktop = new Map<NavMenuType, Record<string, string>>(
  [
    [
      "link",
      {
        "data-h2-color": `
        base:all(white)
        base:all:hover(secondary.lighter)
        base:all:focus-visible(black)

        base:children(white)
        base:focus-visible:children(focus)

        base:selectors[[data-active]](secondary.lighter)
      `,
      },
    ],
    [
      "subMenuLink",
      {
        "data-h2-color": `
          base(black)
          base:hover(secondary.darker) base:hover:dark(secondary.lightest)
          base:all:focus-visible(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)

          base:selectors[[data-active]](secondary.darker)
          base:dark:selectors[[data-active]](secondary.lightest)
      `,
      },
    ],
  ],
);

export const linkStyleMapMobile = new Map<NavMenuType, Record<string, string>>([
  [
    "link",
    {
      "data-h2-color": `
        base(black)
        base:hover(secondary.darker) base:hover:dark(secondary.lightest)
        base:all:focus-visible(black)

        base:children[.counter](white)
        base:focus-visible:children[.counter](focus)

        base:selectors[[data-active]](secondary.darker)
        base:dark:selectors[[data-active]](secondary.lightest)
      `,
    },
  ],
  [
    "subMenuLink",
    {
      "data-h2-color": `
        base(black)
        base:hover(secondary.darker) base:hover:dark(secondary.lightest)
        base:all:focus-visible(black)

        base:children[.counter](white)
        base:focus-visible:children[.counter](focus)

        base:selectors[[data-active]](secondary.darker)
        base:dark:selectors[[data-active]](secondary.lightest)
      `,
    },
  ],
]);
