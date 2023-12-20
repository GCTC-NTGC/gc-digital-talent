import React from "react";

import { Breadcrumbs, NavTabs } from "@gc-digital-talent/ui";

type NavItem = {
  label: React.ReactNode;
  url: string;
};

type NavMode = "crumbs" | "subNav";

export interface AdminSubNavProps {
  mode: NavMode;
  items: NavItem[];
}

const AdminSubNav = ({ mode, items }: AdminSubNavProps) => {
  if (mode === "crumbs") {
    return <Breadcrumbs crumbs={items} fullWidth />;
  }

  return (
    <NavTabs.Root>
      <NavTabs.List data-h2-container="base(center, full, x1) base(center, full, x2)">
        {items.map((item) => (
          <NavTabs.Item key={item.url}>
            <NavTabs.Link href={item.url}>{item.label}</NavTabs.Link>
          </NavTabs.Item>
        ))}
      </NavTabs.List>
    </NavTabs.Root>
  );
};

export default AdminSubNav;
