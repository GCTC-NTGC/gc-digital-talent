import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import { useIntl } from "react-intl";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";

import { Button, Card, Heading } from "@gc-digital-talent/ui";

import BrowseJobsLayout from "./BrowseJobsLayout";

export const Component = () => {
  const intl = useIntl();
  return (
    <BrowseJobsLayout>
      <Heading
        rank="h2"
        size="h3"
        icon={RocketLaunchIcon}
        color="primary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Open job opportunities",
          id: "fSMBX0",
          description: "Title for the current jobs recruiting candidates",
        })}
      </Heading>
      <p className="mb-3">
        {intl.formatMessage({
          id: "C7sYnb",
          defaultMessage:
            "This platform allows you to apply to recruitment processes that make it easy for hiring managers to find you. This page offers you a snapshot of our open recruitment processes. Come back and check this page often!",
          description:
            "Description of how the application process works, paragraph one",
        })}
      </p>
      <p className="mb-12">
        {intl.formatMessage({
          id: "vNFHWp",
          defaultMessage:
            "Your application to a process will be reviewed by our team and if it's a match, you will be invited to an assessment. Once accepted, managers can contact you about job opportunities.",
          description:
            "Description of how the application process works, paragraph two",
        })}
      </p>
      <div className="flex flex-col gap-6 xs:flex-row">
        <div className="flex w-full flex-col gap-1.5 xs:w-78">
          <Card>filter jobs</Card>
          <Card>manage my alerts</Card>
        </div>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Card>header</Card>
            <Card>pool 1</Card>
            <Card>pool 2</Card>
          </div>
          <div className="self-center">
            <Button color="secondary" icon={ArrowPathIcon}>
              {intl.formatMessage({
                defaultMessage: "Load more results",
                id: "HuA8aL",
                description: "Button text to load the next set of results",
              })}
            </Button>
          </div>
        </div>
      </div>
    </BrowseJobsLayout>
  );
};

Component.displayName = "OpenOpportunitiesPage";

export default Component;
