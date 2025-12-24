import { LinkProps, NavMenu } from "@gc-digital-talent/ui";

interface MenuItemProps {
  href: string;
  title: string;
  subMenu?: boolean;
  state?: LinkProps["state"];
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
  ...rest
}: MenuItemProps) => {
  return (
    <NavMenu.Item {...rest} className={className}>
      <NavMenu.Link
        type={subMenu ? "subMenuLink" : "link"}
        // NOTE: Comes from react-router
        {...{ state, href, end }}
      >
        {title}
      </NavMenu.Link>
    </NavMenu.Item>
  );
};

export default MenuItem;
