/* eslint-disable react/forbid-elements */
import { useIntl } from "react-intl";

import {
  Container,
  hrefToString,
  Link,
  LinkProps,
} from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import { CanadaLogo, CanadaLogoWhite } from "../Svg";
import VersionLink from "./VersionLink";

const Footer = () => {
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

  return (
    <footer className="mt-auto border-t border-black/20 bg-white py-12 dark:bg-black">
      <Container center size="lg">
        <div className="grid items-center gap-6 xs:grid-cols-2 xs:gap-12 md:grid-cols-3">
          <div className="text-center xs:text-left md:col-start-1 md:col-end-3">
            <nav
              className="flex flex-col gap-6 xs:flex-row xs:flex-wrap"
              aria-label={intl.formatMessage({
                defaultMessage: "Policy and feedback",
                id: "xdojyj",
                description:
                  "Label for the policy, conditions and feedback navigation",
              })}
            >
              {links.map((props) => (
                <Link key={hrefToString(props.href)} color="black" {...props} />
              ))}
            </nav>
            <div className="mt-12 mb-6 xs:mt-6 xs:mb-0">
              <p className="text-sm text-black/70 dark:text-white/70">
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Date modified: {modifiedDate}",
                      id: "Jkg004",
                      description:
                        "Header for the date of the last modification of the site",
                    },
                    {
                      modifiedDate: new Date(BUILD_DATE ?? "1970-01-01")
                        .toISOString()
                        .slice(0, 10),
                    },
                  )}
                </span>
                <VersionLink />
              </p>
            </div>
          </div>
          <div className="text-center xs:text-right">
            <a
              href={`https://www.canada.ca/${intl.locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CanadaLogo className="inline-block max-w-60 dark:hidden" />
              <CanadaLogoWhite className="hidden max-w-60 dark:inline-block" />
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
      </Container>
    </footer>
  );
};

export default Footer;
