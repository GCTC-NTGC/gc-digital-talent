import HomeIcon from "@heroicons/react/16/solid/HomeIcon";

import { NavMenu } from "@gc-digital-talent/ui";

import { borderItem } from "./Menu";

interface HomeLinkProps {
  href: string;
  label: string;
}

const HomeLink = ({ href, label }: HomeLinkProps) => {
  return (
    <NavMenu.Item
      className={borderItem({
        borderRight: true,
        class: "mr-1 -ml-1 hidden after:ml-3 sm:flex sm:items-center",
      })}
    >
      <NavMenu.IconLink href={href} icon={HomeIcon} label={label} />
    </NavMenu.Item>
  );
};

export default HomeLink;
