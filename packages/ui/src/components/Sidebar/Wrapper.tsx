import { HTMLProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const sidebarWrapper = tv({
  base: "mb-18 flex flex-col gap-y-6 sm:grid sm:grid-cols-4 sm:gap-x-18 sm:gap-y-0",
  variants: {
    // Temp fix for view pool candidate page
    scrollbar: {
      true: "sm:gap-x-9",
      false: "",
    },
  },
});

type SidebarWrapperVariants = VariantProps<typeof sidebarWrapper>;

interface SidebarWrapperProps
  extends SidebarWrapperVariants,
    HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

const Wrapper = ({
  children,
  className,
  scrollbar,
  ...rest
}: SidebarWrapperProps) => (
  <div className={sidebarWrapper({ scrollbar, class: className })} {...rest}>
    {children}
  </div>
);

export default Wrapper;
