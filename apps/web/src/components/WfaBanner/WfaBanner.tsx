import { useIntl } from "react-intl";

import { Alert, Link, Ul } from "@gc-digital-talent/ui";

const WFA_BANNER_COOKIE = "wfaBannerDismissed";

const isBannerDismissed = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(WFA_BANNER_COOKIE))
    ?.split("=")[1] === "true";

const WfaBanner = () => {
  const intl = useIntl();
  if (isBannerDismissed()) {
    return null;
  }

  const handleDismiss = () => {
    // Set a 10 year (10 * 365 * 24 * 60 * 60 seconds) cookie
    document.cookie = `${WFA_BANNER_COOKIE}=true; path=/; Max-Age=315360000; SameSite=Lax`;
  };

  return (
    <Alert.Root
      type="info"
      dismissible
      onDismiss={handleDismiss}
      className="mb-6"
    >
      <Alert.Title>
        {intl.formatMessage({
          defaultMessage:
            "Are you in the Digital community and need support through workforce adjustment?",
          id: "jT3Ytq",
          description: "Title for banner about workforce adjustment",
        })}
      </Alert.Title>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "If you're working in the core public administration and you find yourself in one of the following groups, we may be able to help.",
          id: "0Grydu",
          description:
            "Lead in text for who workforce adjustment tools can help",
        })}
      </p>
      <Ul space="md" className="mb-6">
        <li></li>
      </Ul>
      <Link href="#">
        {intl.formatMessage({
          defaultMessage:
            "Visit our work force adjustment page to learn more about your options.",
          id: "IzTyKU",
          description: "Link text to the workforce adjustment information page",
        })}
      </Link>
    </Alert.Root>
  );
};

export default WfaBanner;
