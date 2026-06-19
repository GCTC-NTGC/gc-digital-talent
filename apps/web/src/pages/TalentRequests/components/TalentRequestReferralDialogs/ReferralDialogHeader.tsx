import { useIntl } from "react-intl";

import { Dialog } from "@gc-digital-talent/ui";

interface ReferralDialogHeaderProps {
  userName: string;
}

const ReferralDialogHeader = ({ userName }: ReferralDialogHeaderProps) => {
  const intl = useIntl();

  return (
    <Dialog.Header
      subtitle={intl.formatMessage(
        {
          defaultMessage:
            "Review {userName}'s information and change their status on this request.",
          id: "fhi1EG",
          description: "Subtitle for talent request referral",
        },
        { userName },
      )}
    >
      {userName}
    </Dialog.Header>
  );
};

export default ReferralDialogHeader;
