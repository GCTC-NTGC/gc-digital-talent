/* eslint-disable react/forbid-elements */
import * as React from "react";
import { useIntl } from "react-intl";

import { Link, LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import { CanadaLogo, CanadaLogoWhite } from "../Svg";
import VersionLink from "./VersionLink";

interface FooterProps {
  width?: string;
}

const Footer = ({ width }: FooterProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const links: LinkProps[] = [
    {
      href: paths.support(),
      children: intl.formatMessage({
        defaultMessage: "Contact us",
        id: "RIi/3q",
        description: "Title for Contact us action",
      }),
      state: { referrer: window.location.href },
    },
    {
      href: paths.termsAndConditions(),
      children: intl.formatMessage({
        defaultMessage: "Terms & Conditions",
        id: "ZGpncy",
        description: "Label for the terms and conditions link in the Footer.",
      }),
    },
    {
      href: paths.privacyPolicy(),
      children: intl.formatMessage({
        defaultMessage: "Privacy Policy",
        id: "VcOlXA",
        description: "Label for the privacy link in the Footer.",
      }),
    },
    {
      href: paths.accessibility(),
      children: intl.formatMessage({
        defaultMessage: "Accessibility statement",
        id: "2iCpAL",
        description: "Title for the websites accessibility statement",
      }),
    },
    {
      href: `https://www.canada.ca/${intl.locale}.html`,
      external: true,
      children: intl.formatMessage({
        defaultMessage: "Canada.ca",
        id: "ZE77nf",
        description: "Label for the Canada link in the Footer.",
      }),
    },
  ];
  let footerWidth = {
    "data-h2-container": "base(center, large, x1) p-tablet(center, large, x2)",
  };
  if (width === "full") {
    footerWidth = {
      "data-h2-container": "base(center, full, x1) p-tablet(center, full, x2)",
    };
  }
  return (
    <footer
      data-h2-background-color="base(foreground) base:dark(white)"
      data-h2-border-top="base(1px solid black.20)"
      className="mt-auto py-12 text-center"
    >
      <div {...footerWidth}>
        <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-12 md:grid-cols-3">
          <div className="sm:col-span-2 sm:text-left">
            <nav
              className="flex flex-col gap-6 sm:flex-row sm:flex-wrap"
              aria-label={intl.formatMessage({
                defaultMessage: "Policy and feedback",
                id: "xdojyj",
                description:
                  "Label for the policy, conditions and feedback navigation",
              })}
            >
              {links.map((props) => (
                <Link key={props.href} color="black" {...props} />
              ))}
            </nav>
            <div className="mb-6 mt-12 sm:mb-0 sm:mt-6">
              <p
                data-h2-color="base(black.70)"
                data-h2-font-size="base(caption)"
              >
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Date modified: {modifiedDate}",
                      id: "Jkg004",
                      description:
                        "Header for the date of the last modification of the site",
                    },
                    {
                      modifiedDate: new Date(
                        process.env.BUILD_DATE ?? "1970-01-01",
                      )
                        .toISOString()
                        .slice(0, 10),
                    },
                  )}
                </span>
                <VersionLink />
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <a
              href={`https://www.canada.ca/${intl.locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CanadaLogo
                className="max-w-64"
                data-h2-display="base(inline-block) base:dark(none)"
              />
              <CanadaLogoWhite
                className="max-w-64"
                data-h2-display="base(none) base:dark(inline-block)"
              />
              <span className="sr-only">
                {intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "m1eQrS",
                  description:
                    "Alt text for the Canada logo link in the Footer.",
                })}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
