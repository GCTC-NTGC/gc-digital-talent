import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { homePath, searchPath } from "../talentSearchRoutes";

const messages = defineMessages({
  notFoundHeading: {
    defaultMessage: "Sorry, we can't find the page you were looking for.",
    description: "Heading for the message saying the page was not found.",
  },
  notFoundMessage: {
    defaultMessage: "Oops, it looks like you've landed on a page that either doesn't exist or has moved. That's okay, here are a few options for other pages that may help you get rolling.",
    description: "Detailed message saying the page was not found and suggesting some links.",
  },
  homeLinkTitle: {
    defaultMessage: "Home",
    description: "Title for link to application home.",
  },
  homeLinkText: {
    defaultMessage: "Home",
    description: "Text for link to application home.",
  },
  searchLinkTitle: {
    defaultMessage: "Search",
    description: "Title for link to application search.",
  },
  searchLinkText: {
    defaultMessage: "Search",
    description: "Text for link to application search.",
  },
  contactUsMessageTextPart: {
    defaultMessage: "If you still haven't found what you're looking for please ",
    description: "Invitation to contact us for help - text part.",
  },
  contactUsMessageLinkPart: {
    defaultMessage: "get in touch with us directly",
    description: "Invitation to contact us for help - link part.",
  },
  contactUsTitle: {
    defaultMessage: "Send an email to Talent Cloud.",
    description: "Link title of invitation to contact us for help.",
  },
});

export const NotFound: React.FC = () => {
  const intl = useIntl();
  return (
    <div
      data-h2-flex-grid="b(top, contained, flush, xl)"
      data-h2-container="b(center, l)"
    >
      <div data-h2-flex-item="b(1of1) s(2of3)">
        <h3
          data-h2-font-size="b(h4)"
          data-h2-font-weight="b(700)"
          data-h2-margin="b(bottom, m)"
        >
          {intl.formatMessage(messages.notFoundHeading)}
        </h3>
        <p>{intl.formatMessage(messages.notFoundMessage)}</p>
        <ul>
          <li>
            <a
              href={homePath()}
              title={intl.formatMessage(messages.homeLinkTitle)}
            >
              {intl.formatMessage(messages.homeLinkText)}
            </a>
          </li>
          <li>
            <a
              href={searchPath()}
              title={intl.formatMessage(messages.searchLinkTitle)}
            >
              {intl.formatMessage(messages.searchLinkText)}
            </a>
          </li>
        </ul>
        <p>
          {intl.formatMessage(messages.contactUsMessageTextPart)}
          &nbsp;
          <a
            href="mailto:talent.cloud-nuage.de.talents@tbs-sct.gc.ca"
            title={intl.formatMessage(messages.contactUsTitle)}
          >
            {intl.formatMessage(messages.contactUsMessageLinkPart)}
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFound;
