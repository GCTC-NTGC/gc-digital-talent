import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

interface ReferralDialogFooterProps {
  fetching: boolean;
  userId: string;
}

const ReferralDialogFooter = ({
  fetching,
  userId,
}: ReferralDialogFooterProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  return (
    <Dialog.Footer>
      <Button type="submit">
        {fetching
          ? intl.formatMessage(commonMessages.saving)
          : intl.formatMessage(formMessages.saveChanges)}
      </Button>
      <Dialog.Close>
        <Button type="button" color="warning" mode="inline">
          {intl.formatMessage(formMessages.cancelGoBack)}
        </Button>
      </Dialog.Close>
      <Link href={paths.userView(userId)} mode="inline" newTab>
        {intl.formatMessage({
          defaultMessage: "View profile",
          id: "KsUNz1",
          description: "Link text to view a user's profile in a new tab",
        })}
      </Link>
    </Dialog.Footer>
  );
};

export default ReferralDialogFooter;
