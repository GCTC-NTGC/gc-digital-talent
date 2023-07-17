import React from "react";

import { Tabs } from "@gc-digital-talent/ui";

import CommunityIcon from "./CommunityIcon";

interface CommunityTabTriggerProps {
  value: string;
  community: string;
  label: React.ReactNode;
}

const CommunityTabTrigger = ({
  value,
  community,
  label,
}: CommunityTabTriggerProps) => (
  <Tabs.Trigger
    value={value}
    data-h2-align-items="base(center)"
    data-h2-border="
      base(all, x.15, solid, ia-secondary.15)
      base:selectors[[data-state='active']](all, x.25, solid, ia-secondary)"
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-radius="base(s)"
    data-h2-shadow="base(none) base:hover(s)"
    data-h2-padding="base(x.1)"
    data-h2-cursor="base(pointer)"
  >
    <CommunityIcon community={community} values={[value]} />
    <span data-h2-visually-hidden="base(invisible)">{label}</span>
  </Tabs.Trigger>
);

interface CommunityTabContentProps {
  value: string;
  children: React.ReactNode;
  on?: boolean;
}

const CommunityTabContent = ({
  value,
  on,
  children,
}: CommunityTabContentProps) => {
  return (
    <Tabs.Content
      value={value}
      forceMount
      data-h2-margin="base(x.5, 0)"
      data-h2-padding="base(0)"
      data-h2-border="base(none)"
      {...(!on && {
        "data-h2-visually-hidden": "base(invisible)",
      })}
    >
      {children}
    </Tabs.Content>
  );
};

export default {
  Trigger: CommunityTabTrigger,
  Content: CommunityTabContent,
};
