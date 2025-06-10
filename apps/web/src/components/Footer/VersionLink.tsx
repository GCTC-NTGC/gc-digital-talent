/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

const VersionLink = () => {
  const intl = useIntl();
  let content;
  let url;
  if (typeof VERSION !== "undefined") {
    content = VERSION;
    url = `https://github.com/GCTC-NTGC/gc-digital-talent/releases/tag/${VERSION}`;
  } else if (typeof COMMIT_HASH !== "undefined") {
    content = COMMIT_HASH;
    url = `https://github.com/GCTC-NTGC/gc-digital-talent/commit/${COMMIT_HASH}`;
  }

  if (!content || !url) {
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
      <Link external size="sm" href={url}>
        {content}
      </Link>
    </span>
  );
};

export default VersionLink;
