import { useIntl } from "react-intl";

import { Alert, Link, Ul } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";

const WFA_BANNER_COOKIE = "wfaBannerDismissed";

const isBannerDismissed = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(WFA_BANNER_COOKIE))
    ?.split("=")[1] === "true";

const WfaBanner = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { workforceAdjustment } = useFeatureFlags();
  if (isBannerDismissed() || !workforceAdjustment) {
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
            "New platform services to support employees facing workforce adjustment",
          id: "eI2/4I",
          description: "Title for banner about workforce adjustment",
        })}
      </Alert.Title>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "If you're a Government of Canada employee in one of the functional communities supported by this platform and you find yourself in one of the following groups, we may be able to help.",
          id: "z+emiI",
          description:
            "Lead in text for who workforce adjustment tools can help",
        })}
      </p>
      <Ul space="md" className="mb-6">
        <li>
          {intl.formatMessage({
            defaultMessage:
              "You're an indeterminate employee who’s received a workforce adjustment letter and you’re looking for a new job or an alternation",
            id: "QiOSUi",
            description:
              "Item one, indeterminate employee that received wfa letter",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "You're an indeterminate employee in a stable role and you’re interested in a financial package to leave the public service",
            id: "cT3RkN",
            description:
              "Item two, indeterminate employee interested in a package",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "You're in a term position that isn't being renewed or is ending earlier than expected and you’re hoping to find a new role quickly",
            id: "VGu61z",
            description: "Item two, term employee that is not being renewed",
          })}
        </li>
      </Ul>
      <Link href={paths.wfaInfo()} color="black">
        {intl.formatMessage({
          defaultMessage: "Learn more about new services to support you.",
          id: "wlfZcP",
          description: "Link text to the workforce adjustment information page",
        })}
      </Link>
    </Alert.Root>
  );
};

export default WfaBanner;
