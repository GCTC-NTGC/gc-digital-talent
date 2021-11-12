import React, { ReactElement } from "react";
import { Routes } from "universal-router";
import { useIntl } from "react-intl";
import NavMenu from "@common/components/NavMenu";
import { RouterResult, useLocation, useRouter } from "@common/helpers/router";
import { Link } from "@common/components";
import NotFound from "@common/components/NotFound";
import Footer from "./Footer";
import Header from "./Header";

export const exactMatch = (ref: string, test: string): boolean => ref === test;

interface MenuLinkProps {
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  text,
  title,
  isActive = exactMatch,
}) => {
  const location = useLocation();
  return (
    <Link
      href={href}
      title={title ?? ""}
      {...{
        "data-h2-color": "b(lightpurple)",
      }}
    >
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

const TalentSearchNotFound: React.FC = () => {
  const intl = useIntl();
  return (
    <NotFound
      headingMessage={intl.formatMessage({
        description: "Heading for the message saying the page was not found.",
        defaultMessage: "Sorry, we can't find the page you were looking for.",
      })}
    >
      <p>
        {intl.formatMessage({
          description: "Detailed message saying the page was not found.",
          defaultMessage:
            "Oops, it looks like you've landed on a page that either doesn't exist or has moved.",
        })}
      </p>
    </NotFound>
  );
};

export const PageContainer: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const content = useRouter(contentRoutes, <TalentSearchNotFound />);

  return (
    <div
      className="container"
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      style={{ height: "100vh", margin: "0" }}
    >
      <div>
        <Header />
        <NavMenu items={menuItems} />
      </div>
      <div>{content}</div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
};

export default PageContainer;
