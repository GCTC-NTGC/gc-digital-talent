import { useIntl } from "react-intl";
import type { ComponentProps } from "react";

import { Notice } from "@gc-digital-talent/ui";

interface NewFeatureMessageProps {
  onDismiss?: ComponentProps<typeof Notice.Root>["onDismiss"];
}

const NewFeatureMessage = ({ onDismiss }: NewFeatureMessageProps) => {
  const intl = useIntl();
  return (
    <Notice.Root color="gray" onDismiss={onDismiss}>
      <Notice.Title defaultIcon>
        {intl.formatMessage({
          defaultMessage: "Your employee profile has expanded!",
          id: "EPztLn",
          description: "Title for a new feature notice",
        })}
      </Notice.Title>
      <Notice.Content>
        {intl.formatMessage({
          defaultMessage:
            "We’ve added a few features to the employee profile, so feel free to use the tabs near the top of the page to explore what’s new. As always, you can contact our support team with questions or feedback.",
          id: "0aC0CM",
          description: "Message for a new feature notice",
        })}
      </Notice.Content>
    </Notice.Root>
  );
};

export default NewFeatureMessage;
