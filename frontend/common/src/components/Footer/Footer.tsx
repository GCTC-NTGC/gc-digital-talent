import * as React from "react";
import { useIntl } from "react-intl";
import { Link } from "../Link";
import { imageUrl } from "../../helpers/router";

export const Footer: React.FunctionComponent<{
  baseUrl: string;
}> = ({ baseUrl }) => {
  const intl = useIntl();
  const links = [
    {
      route: "mailto:talent.cloud-nuage.de.talents@tbs-sct.gc.ca",
      title: intl.formatMessage({
        defaultMessage: "Submit feedback to GC Talent Cloud via email.",
        description: "Title for the feedback link in the Footer.",
      }),
      label: intl.formatMessage({
        defaultMessage: "Feedback",
        description: "Label for the feedback link in the Footer.",
      }),
    },
    {
      route: `/${intl.locale}/terms-and-conditions`,
      title: intl.formatMessage({
        defaultMessage: "View our terms and conditions.",
        description: "Title for the terms and conditions link in the Footer.",
      }),
      label: intl.formatMessage({
        defaultMessage: "Terms & Conditions",
        description: "Label for the terms and conditions link in the Footer.",
      }),
    },
    {
      route: `/${intl.locale}/privacy-notice`,
      title: intl.formatMessage({
        defaultMessage: "View our privacy policy.",
        description: "Title for the privacy link in the Footer.",
      }),
      label: intl.formatMessage({
        defaultMessage: "Privacy Policy",
        description: "Label for the privacy link in the Footer.",
      }),
    },
    {
      route: `https://www.canada.ca/${intl.locale}.html`,
      title: intl.formatMessage({
        defaultMessage: "Visit Canada.ca",
        description: "Title for the Canada link in the Footer.",
      }),
      label: intl.formatMessage({
        defaultMessage: "Canada.ca",
        description: "Label for the Canada link in the Footer.",
      }),
    },
  ];
  return (
    <footer
      className="footer"
      data-h2-border="b(gray, top, solid, s)"
      data-h2-bg-color="b(lightgray[.6])"
      style={{ marginTop: "auto" }}
    >
      <div data-h2-flex-grid="b(middle, contained, flush, xl)">
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-padding="b(left, xl)"
          data-h2-text-align="b(center) m(left)"
        >
          <nav>
            <ul
              style={{ gap: "1rem" }}
              className="reset-ul"
              data-h2-display="b(flex)"
              data-h2-flex-wrap="b(wrap)"
              data-h2-justify-content="b(center) m(flex-start)"
              data-h2-margin="b(bottom, xs)"
            >
              {links.map(({ route, title, label }) => (
                <li
                  key={label}
                  data-h2-display="b(inline-block)"
                  data-h2-margin="b(top-bottom, none)"
                >
                  {/* These links must use real anchor links, not the history api, as they may direct to outside of this app. */}
                  <a href={route} title={title}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p
            data-h2-font-size="b(caption)"
            data-h2-font-color="b(darkgray)"
            data-h2-margin="b(bottom, none) b(top, m)"
          >
            {intl.formatMessage(
              {
                defaultMessage: "Date Modified: {modifiedDate}",
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
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-padding="b(right, xl)"
          data-h2-text-align="b(center) m(right)"
        >
          <a
            href={`https://www.canada.ca/${intl.locale}.html`}
            title={intl.formatMessage({
              defaultMessage: "Visit Canada.ca",
              description: "Title for the Canada logo in the Footer.",
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: "12rem" }}
              src={imageUrl(baseUrl, "logo_canada.png")}
              alt={intl.formatMessage({
                defaultMessage: "Canada's Logo.",
                description: "Alt text for the Canada logo in the Footer.",
              })}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
