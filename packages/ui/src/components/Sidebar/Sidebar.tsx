import React from "react";

export interface SidebarProps extends React.HTMLProps<HTMLElement> {
  children: React.ReactNode;
}

const Sidebar = ({ children, ...rest }: SidebarProps) => (
  <aside data-h2-flex-item="base(1of1) l-tablet(1of4)" {...rest}>
    <div
      data-h2-height="base(100%)"
      data-h2-position="base(relative)"
      className="mb-6"
    >
      <div
        data-h2-position="base(sticky)"
        data-h2-location="base(x3, auto, auto, auto)"
      >
        {children}
      </div>
    </div>
  </aside>
);

export default Sidebar;
