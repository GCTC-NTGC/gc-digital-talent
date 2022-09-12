import * as React from "react";
import { useIntl } from "react-intl";
import { imageUrl } from "../../helpers/router";

const Footer: React.FunctionComponent<{
  baseUrl: string;
  width?: string;
}> = ({ baseUrl, width }) => {
  const intl = useIntl();
  const links = [
    {
      route: "mailto:GCTalentGC@tbs-sct.gc.ca",
      title: intl.formatMessage({
        defaultMessage: "Submit feedback to GC Talent Cloud via email.",
        id: "mZMdKM",
        description: "Title for the feedback link in the Footer.",
      }),
      label: intl.formatMessage({
        defaultMessage: "Feedback",
        id: "1J4e+j",
        description: "Label for the feedback link in the Footer.",
      }),
    },
    {
      route: `/${intl.locale}/terms-and-conditions`,
      label: intl.formatMessage({
        defaultMessage: "Terms & Conditions",
        id: "ZGpncy",
        description: "Label for the terms and conditions link in the Footer.",
      }),
    },
    {
      route: `/${intl.locale}/privacy-notice`,
      label: intl.formatMessage({
        defaultMessage: "Privacy Policy",
        id: "VcOlXA",
        description: "Label for the privacy link in the Footer.",
      }),
    },
    {
      route: `https://www.canada.ca/${intl.locale}.html`,
      label: intl.formatMessage({
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
      className="footer"
      data-h2-border="base(top, 1px, solid, dt-gray)"
      data-h2-padding="base(x2, 0)"
      data-h2-background-color="base(lightest.dt-gray)"
      style={{ marginTop: "auto" }}
    >
      <div {...footerWidth}>
        <div data-h2-flex-grid="base(center, x3)">
          <div
            data-h2-flex-item="base(1of1) l-tablet(1of2)"
            data-h2-text-align="base(center) l-tablet(left)"
          >
            <nav>
              <ul style={{ gap: "1rem" }} className="reset-ul">
                {links.map(({ route, label }) => (
                  <li
                    key={label}
                    data-h2-display="base(inline-block)"
                    data-h2-margin="base(0, x1, 0, 0)"
                  >
                    {/* These links must use real anchor links, not the history api, as they may direct to outside of this app. */}
                    <a href={route}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <p
              data-h2-font-size="base(caption)"
              data-h2-color="base(dark.dt-gray)"
              data-h2-margin="base(x1, 0, 0, 0)"
            >
              {intl.formatMessage(
                {
                  defaultMessage: "Date Modified: {modifiedDate}",
                  id: "Fc/i3e",
                  description:
                    "Header for the sites last date modification found in the footer.",
                },
                {
                  modifiedDate: new Date(process.env.BUILD_DATE ?? "1970-01-01")
                    .toISOString()
                    .slice(0, 10),
                },
              )}
            </p>
          </div>
          <div
            data-h2-flex-item="base(1of1) l-tablet(1of2)"
            data-h2-text-align="base(center) l-tablet(right)"
          >
            <a
              href={`https://www.canada.ca/${intl.locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                style={{ width: "12rem" }}
                src={imageUrl(baseUrl, "logo_canada.png")}
                alt={intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "m1eQrS",
                  description:
                    "Alt text for the Canada logo link in the Footer.",
                })}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
