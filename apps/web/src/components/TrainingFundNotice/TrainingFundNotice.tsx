import { useIntl } from "react-intl";

import { Link, Notice } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

const TrainingFundNotice = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  return (
    <Notice.Root mode="card" color="gray">
      <Notice.Title icon={InformationCircleIcon} as="h2">
        {intl.formatMessage({
          defaultMessage: "This page has moved",
          id: "Luf+Nm",
          description: "Title for page has moved",
        })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The IT training fund has to moved to GCXchange. Please note that accessing GCXchange requires a Government of Canada network connection.",
            id: "/0xanG",
            description: "Description for moved to GCXchange",
          })}
        </p>
      </Notice.Content>

      <Notice.Actions>
        <Link
          mode="inline"
          color="black"
          href={
            locale === "en"
              ? "https://gcxgce.sharepoint.com/teams/10001173/SitePages/IT-Community-Training-and-Development-Fund.aspx"
              : "https://gcxgce.sharepoint.com/teams/10001173/SitePages/fr/IT-Community-Training-and-Development-Fund.aspx"
          }
          external
        >
          {intl.formatMessage({
            defaultMessage: "Go to GCXchange",
            id: "X91dLK",
            description: "Title for GCXchange link",
          })}
        </Link>
      </Notice.Actions>
    </Notice.Root>
  );
};

export default TrainingFundNotice;
