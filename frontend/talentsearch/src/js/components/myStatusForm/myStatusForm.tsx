import React from "react";
import { useIntl } from "react-intl";
import type {
  User,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
} from "../../api/generated";

export type FormValues = Pick<User, "preferredLang" | "currentProvince">;

export interface MyStatusFormProps {
  initialData: User;
  handleMyStatus: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateWorkPreferencesMutation["updateUserAsUser"]>;
}

//
const MyStatusForm: React.FC = () => {
  const intl = useIntl();
  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }

  return (
    <>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "Let us know if you want to be contacted for new jobs. Please update this status if your situation changes.",
          description: "Description for My Status Form",
        })}
      </div>
      <div
        data-h2-bg-color="b(gray)"
        data-h2-padding="b(all, m)"
        data-h2-radius="b(s)"
      >
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "<bold>Why can’t I change my status?</bold>",
              description: "Message in My Status Form.",
            },
            {
              bold,
            },
          )}
        </p>
        {intl.formatMessage({
          defaultMessage:
            "Please complete all required fields on your profile before setting your status as active.",
          description: "Message in My Status Form.",
        })}
      </div>
    </>
  );
};

export default MyStatusForm;
