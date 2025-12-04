import { useIntl } from "react-intl";

import { Notice } from "@gc-digital-talent/ui";

const NullExperienceType = () => {
  const intl = useIntl();

  return (
    <Notice.Root>
      <Notice.Content>
        <p className="text-center">
          {intl.formatMessage({
            defaultMessage: "Please, select a type of experience to continue.",
            id: "nQbfnB",
            description:
              "Test displayed on the experience form when a user has not selected an experience type.",
          })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default NullExperienceType;
