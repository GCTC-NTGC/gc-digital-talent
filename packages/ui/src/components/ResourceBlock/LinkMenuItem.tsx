import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useId } from "react";

import Link, { LinkProps } from "../Link";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Button from "../Button";
import BaseItem, { BaseItemProps } from "./BaseItem";
import { hrefToString } from "../../utils";

interface LinkMenuItemProps {
  links: {
    title: string;
    href: LinkProps["href"];
    isSelected?: boolean;
  }[];
  accessibleLabel?: string;
  description: BaseItemProps["content"];
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

  const wrappedDescription = (
    <p className="text-sm text-gray-600 dark:text-gray-200" id={descriptionId}>
      {description}
    </p>
  );

  const dropdown = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          utilityIcon={ChevronDownIcon}
          mode="inline"
          color="black"
          className="h-5 transform [&_svg]:rotate-0 data-[state=open]:[&_svg]:rotate-180"
          aria-describedby={descriptionId}
          aria-label={accessibleLabel}
        >
          {selectedLink?.title}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        {links.map((link) => (
          <DropdownMenu.Item
            key={link.title + hrefToString(link.href)}
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
    <BaseItem title={dropdown} content={wrappedDescription} state={state} />
  );
};

export default LinkMenuItem;
