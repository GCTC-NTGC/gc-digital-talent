import FolderIcon from "@heroicons/react/24/outline/FolderIcon";
import { useIntl } from "react-intl";

import { Card, Heading, Button } from "@gc-digital-talent/ui";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import { detailTabMessages } from "./messages";

const TalentNominationGroupHistoryPage = () => {
  const intl = useIntl();

  return (
    <>
      <Card space="lg">
        <div className="flex flex-col items-center justify-between gap-y-6 sm:flex-row sm:gap-x-3 sm:gap-y-0">
          <Heading
            icon={FolderIcon}
            level="h2"
            size="h4"
            color="secondary"
            className="mt-0 font-normal"
          >
            {intl.formatMessage({
              defaultMessage: "Nomination history",
              id: "grgInC",
              description:
                "Heading for nominee profile page accordion sections",
            })}
          </Heading>
          <Button type="button" mode="inline" color="primary">
            {intl.formatMessage(detailTabMessages.collapseNominations)}
          </Button>
        </div>
      </Card>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewCommunityTalentNominations}>
    <TalentNominationGroupHistoryPage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupHistoryPage";

export default Component;
