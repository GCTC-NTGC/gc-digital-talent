import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

const VersionLink = () => {
  const intl = useIntl();
  let content;
  let url;
  console.log({ VERSION, COMMIT_HASH });
  if (VERSION) {
    content = VERSION;
    url = `https://github.com/GCTC-NTGC/gc-digital-talent/releases/tag/${VERSION}`;
  } else if (COMMIT_HASH) {
    content = COMMIT_HASH;
    url = `https://github.com/GCTC-NTGC/gc-digital-talent/commit/${COMMIT_HASH}`;
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
      <Link external fontSize="caption" href={url}>
        {content}
      </Link>
    </span>
  );
};

export default VersionLink;
