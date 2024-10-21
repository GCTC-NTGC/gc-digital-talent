import { ReactNode } from "react";

import { Breadcrumbs, NavTabs } from "@gc-digital-talent/ui";

interface NavItem {
  label: ReactNode;
  url: string;
}

type NavMode = "crumbs" | "subNav";

export interface AdminSubNavProps {
  mode: NavMode;
  items: NavItem[];
}

const AdminSubNav = ({ mode, items }: AdminSubNavProps) => {
  if (mode === "crumbs") {
    return <Breadcrumbs crumbs={items} />;
  }

  return (
    <NavTabs.Root>
      <NavTabs.List data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
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
