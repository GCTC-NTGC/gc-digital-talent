import { useIntl } from "react-intl";

import { Link, Notice } from "@gc-digital-talent/ui";

const TrainingFundNotice = () => {
  const intl = useIntl();

  return (
    <Notice.Root mode="card" color="gray">
      <Notice.Title defaultIcon as="h2">
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
        <Link mode="inline" color="black" href="#">
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
