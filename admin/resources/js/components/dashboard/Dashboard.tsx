import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { useLocation, useRouter, RouterResult } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import { Routes } from "universal-router";
import { Button, Link } from "@common/components";
import NotFound from "@common/components/NotFound";
import { poolCandidateTablePath } from "../../adminRoutes";
import { useGetPoolsQuery } from "../../api/generated";
import SideMenu from "../menu/SideMenu";
import Footer from "../Footer";
import Header from "../Header";

export const exactMatch = (ref: string, test: string): boolean => ref === test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

export const MenuHeading: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span
      data-h2-display="b(block)"
      data-h2-padding="b(top-bottom, xs) b(right-left, s)"
      data-h2-bg-color="b(lightnavy)"
      data-h2-text-align="b(center)"
      data-h2-font-color="b(white)"
      data-h2-font-size="b(caption) m(normal)"
      data-h2-font-weight="b(700)"
      style={{
        overflowWrap: "break-word",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
};

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
  isActive = startsWith,
}) => {
  const location = useLocation();
  return (
    <Link
      href={href}
      title={title ?? ""}
      {...(isActive(href, location.pathname)
        ? { "data-h2-font-style": "b(reset)" }
        : { "data-h2-font-style": "b(underline)" })}
    >
      <Button color="white" mode="inline" block tabIndex={-1}>
        <span
          {...(isActive(href, location.pathname)
            ? { "data-h2-font-weight": "b(700)" }
            : { "data-h2-font-weight": "b(100)" })}
        >
          {text}
        </span>
      </Button>
    </Link>
  );
};

const PoolListApi = () => {
  const intl = useIntl();
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const items = [];

  if (!fetching && !error) {
    items.push(
      <MenuHeading
        key="pool-candidates"
        text={intl.formatMessage({
          defaultMessage: "Pool Candidates",
          description: "Label displayed on the Pool Candidates menu item.",
        })}
      />,
    );
    data?.pools.map((pool) =>
      items.push(
        <MenuLink
          key={`pools/${pool?.id}/pool-candidates`}
          href={poolCandidateTablePath(pool?.id ?? "")}
          text={(pool?.name && pool?.name[getLocale(intl)]) ?? ""}
        />,
      ),
    );
  }

  return items;
};

const AdminNotFound: React.FC = () => {
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

export const Dashboard: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const content = useRouter(contentRoutes, <AdminNotFound />);
  return (
    <div className="container">
      <section
        className="dashboard"
        data-h2-flex-grid="b(stretch, contained, flush, none)"
      >
        <div
          data-h2-bg-color="b(lightnavy)"
          data-h2-flex-item="b(1of1) m(1of4) l(1of6)"
        >
          <div
            data-h2-padding="b(right-left, m)"
            data-h2-position="b(static) m(sticky)"
            style={{ top: "0", maxHeight: "100vh", overflow: "auto" }}
          >
            <SideMenu items={[...menuItems, ...PoolListApi()]} />
          </div>
        </div>
        <div
          data-h2-flex-item="b(1of1) m(9of12) l(10of12)"
          data-h2-display="b(flex)"
          style={{ flexDirection: "column" }}
        >
          <Header />
          {content}
          <Footer />
        </div>
      </section>
    </div>
  );
};
