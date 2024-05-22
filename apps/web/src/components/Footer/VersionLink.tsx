import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

const VersionLink = () => {
  const intl = useIntl();
  let content;
  let url;
  if (process.env.VERSION) {
    content = process.env.VERSION;
    url = `https://github.com/GCTC-NTGC/gc-digital-talent/releases/tag/${process.env.VERSION}`;
  } else if (process.env.COMMIT_HASH) {
    content = process.env.COMMIT_HASH;
    url = `https://github.com/GCTC-NTGC/gc-digital-talent/commit/${process.env.COMMIT_HASH}`;
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
