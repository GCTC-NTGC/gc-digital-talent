import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

const VersionLink = () => {
  const intl = useIntl();
  let content = process.env.COMMIT_HASH;
  if (process.env.VERSION) {
    content = process.env.VERSION;
  }

  if (!content) {
    return null;
  }

  return (
    <span>
      {" "}
      &mdash;{" "}
      {intl.formatMessage({
        id: "C3fUwm",
        defaultMessage: "Version",
        description: "Label for the specific version number of the site",
      })}
      {intl.formatMessage(commonMessages.dividingColon)}
      <Link
        external
        fontSize="caption"
        href={`https://github.com/GCTC-NTGC/gc-digital-talent/releases${
          process.env.VERSION ? `/tag/${process.env.VERSION}` : ``
        }`}
      >
        {content}
      </Link>
    </span>
  );
};

export default VersionLink;
