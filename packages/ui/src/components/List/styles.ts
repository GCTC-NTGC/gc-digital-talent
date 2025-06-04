import { tv, VariantProps } from "tailwind-variants";

export const list = tv({
  base: "pl-8",
  variants: {
    type: {
      ordered: "list-decimal",
      unordered: "list-disc",
    },
    space: {
      sm: "[&_li]:mb-0.75",
      md: "[&_li]:mb-1.5",
      lg: "[&_li]:mb-3",
      xl: "[&_li]:mb-6",
    },
    unStyled: {
      true: "list-none p-0",
      false: "",
    },
  },
});

export type ListVariants = Omit<VariantProps<typeof list>, "type">;
