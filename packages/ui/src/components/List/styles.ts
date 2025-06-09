import { tv, VariantProps } from "tailwind-variants";

export const list = tv({
  base: "",
  variants: {
    type: {
      ordered: "list-decimal [&_ul]:list-[lower-roman]",
      unordered: "list-disc [&_ul]:list-[circle]",
    },
    space: {
      sm: "[&_li]:mb-0.75",
      md: "[&_li]:mb-1.5",
      lg: "[&_li]:mb-3",
      xl: "[&_li]:mb-6",
    },
    unStyled: {
      true: "",
      false: "",
    },
    inside: {
      true: "list-inside",
      false: "list-outside",
    },
    noIndent: {
      true: "",
      false: "pl-8",
    },
  },
  compoundVariants: [
    {
      unStyled: true,
      type: ["ordered", "unordered"],
      class: "list-none p-0 [&_ul]:list-none",
    },
    {
      inside: true,
      noIndent: true,
      class: "pl-0",
    },
    {
      inside: false,
      noIndent: true,
      class: "pl-4.5",
    },
  ],
});

export type ListVariants = Omit<VariantProps<typeof list>, "type">;
