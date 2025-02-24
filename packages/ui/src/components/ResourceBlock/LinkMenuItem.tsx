import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useId } from "react";

import Link, { LinkProps } from "../Link";
import DropdownMenu from "../DropdownMenu";
import Button from "../Button";
import BaseItem, { BaseItemProps } from "./BaseItem";

interface LinkMenuItemProps {
  links: {
    title: string;
    href: LinkProps["href"];
    isSelected?: boolean;
  }[];
  accessibleLabel?: BaseItemProps["accessibleLabel"];
  description: BaseItemProps["description"];
  state?: BaseItemProps["state"];
}

const LinkMenuItem = ({
  links,
  accessibleLabel,
  description,
  state,
}: LinkMenuItemProps) => {
  const descriptionId = useId();
  const selectedLink = links.find((link) => link.isSelected) ?? links?.[0];

  const wrappedDescription = <div id={descriptionId}>{description}</div>;

  const dropdown = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          utilityIcon={ChevronDownIcon}
          mode="inline"
          color="black"
          data-h2-height="base(x0.85)"
          data-h2-transform="base:children[svg](rotate(0deg)) base:selectors[[data-state='open']]:children[svg](rotate(180deg))"
          aria-describedby={descriptionId}
        >
          {selectedLink?.title}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        {links.map((link) => (
          <DropdownMenu.Item
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            key={link.title + String(link.href)}
            asChild
            color={link.isSelected ? "secondary" : "black"}
          >
            <Link href={link.href}>{link.title}</Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
  return (
    <BaseItem
      title={dropdown}
      accessibleLabel={accessibleLabel ?? selectedLink.title}
      description={wrappedDescription}
      state={state}
    />
  );
};

export default LinkMenuItem;
