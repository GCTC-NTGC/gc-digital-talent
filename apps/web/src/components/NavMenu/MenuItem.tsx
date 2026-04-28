import type { LinkProps } from "@gc-digital-talent/ui";
import { NavMenu } from "@gc-digital-talent/ui";

interface MenuItemProps {
  href: string;
  title: string;
  subMenu?: boolean;
  state?: LinkProps["state"];
  newTab?: LinkProps["newTab"];
  end?: boolean;
  className?: string;
}

const MenuItem = ({
  href,
  title,
  subMenu,
  state,
  end,
  className,
  newTab = false,
  ...rest
}: MenuItemProps) => {
  return (
    <NavMenu.Item {...rest} className={className}>
      <NavMenu.Link
        type={subMenu ? "subMenuLink" : "link"}
        // NOTE: Comes from react-router
        {...{ state, href, end, newTab }}
      >
        {title}
      </NavMenu.Link>
    </NavMenu.Item>
  );
};

export default MenuItem;
