import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import Link, { LinkProps } from "../Link";
import DropdownMenu from "../DropdownMenu";
import Button from "../Button";
import BaseItem, { BaseItemProps } from "./BaseItem";

interface LinkMenuItemProps {
  links: Array<{
    title: string;
    href: LinkProps["href"];
    isSelected?: boolean;
  }>;
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
  const selectedLink = links.find((link) => link.isSelected) ?? links?.[0];

  const dropdown = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button utilityIcon={ChevronDownIcon} mode="inline" color="black">
          {selectedLink?.title}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        {links.map((link) => (
          <DropdownMenu.Item key={link.title + link.href} asChild color="black">
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
      description={description}
      state={state}
    />
  );
};

export default LinkMenuItem;
