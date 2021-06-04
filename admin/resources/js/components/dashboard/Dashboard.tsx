import React from "react";
import { Link, useLocation } from "../../helpers/router";

export const exactMatch = (ref: string, test: string): boolean => ref == test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

export const MenuLink: React.FC<{
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}> = ({ href, text, title, isActive = startsWith }) => {
  const location = useLocation();
  return (
    <Link href={href} title={title ?? ""}>
      <div
        data-h2-font-weight={
          isActive(href, location.pathname) ? "b(700)" : "b(100)"
        }
      >
        {text}
      </div>
    </Link>
  );
};

export const Dashboard: React.FC = () => {
  const location = useLocation();
  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <nav>
        <ul>
          <li>
            <MenuLink href="/dashboard" text="Home" isActive={exactMatch} />
          </li>
        </ul>
        <ul>
          <li>
            <MenuLink href="/dashboard/users" text="Users" />
          </li>
        </ul>
        <ul>
          <li>
            <MenuLink href="/dashboard/pools" text="Pools" />
          </li>
        </ul>
      </nav>
    </div>
  );
};
