import { HTMLProps, ReactNode } from "react";

export interface SidebarProps extends HTMLProps<HTMLElement> {
  children: ReactNode;
}

const Sidebar = ({ children, ...rest }: SidebarProps) => (
  <aside data-h2-flex-item="base(1of1) l-tablet(1of4)" {...rest}>
    <div
      data-h2-height="base(100%)"
      data-h2-position="base(relative)"
      data-h2-margin-bottom="base(x1)"
    >
      <div
        data-h2-position="base(sticky)"
        data-h2-location="base(x5, auto, auto, auto)"
        data-h2-height="base(85vh)"
        data-h2-overflow="base(auto)"
      >
        {children}
      </div>
    </div>
  </aside>
);

export default Sidebar;
