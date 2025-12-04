import { HTMLProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const scrollbarWrapper = tv({
  base: "sticky",
  variants: {
    // Temp fix for view pool candidate page
    scrollbar: {
      true: "top-0 sm:top-18 sm:h-[calc(100vh-var(--spacing)*18)] sm:overflow-y-auto sm:pr-3",
      false: "top-30",
    },
  },
});

type ScrollbarVariants = VariantProps<typeof scrollbarWrapper>;

export interface SidebarProps
  extends ScrollbarVariants,
    HTMLProps<HTMLElement> {
  children: ReactNode;
}

const Sidebar = ({ children, scrollbar, ...rest }: SidebarProps) => (
  <aside {...rest}>
    <div className="relative mb-6 h-full">
      <div className={scrollbarWrapper({ scrollbar })}>{children}</div>
    </div>
  </aside>
);

export default Sidebar;
