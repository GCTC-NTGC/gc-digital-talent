import React from "react";

export interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => (
  <aside data-h2-flex-item="base(1of1) l-tablet(1of4)">
    <div data-h2-height="base(100%)" data-h2-position="base(relative)">
      <div
        data-h2-position="base(sticky)"
        data-h2-location="base(0, auto, auto, auto)"
      >
        {children}
      </div>
    </div>
  </aside>
);

export default Sidebar;
