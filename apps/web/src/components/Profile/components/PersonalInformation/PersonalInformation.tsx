import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { useQuery } from "urql";

import { Loading, ToggleSection, Well } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql, Pool } from "@gc-digital-talent/graphql";
import BasicForm from "@gc-digital-talent/forms/BasicForm";

import profileMessages from "~/messages/profileMessages";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/about";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
// not importing a whole page, just a context
// eslint-disable-next-line no-restricted-imports
import { useApplicationContext } from "~/pages/Applications/ApplicationContext";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { formValuesToSubmitData, dataToFormValues } from "./utils";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import FormFields from "./FormFields";

const PersonalInformationForm_Query = graphql(/* GraphQL */ `
  query PersonalInformationForm {
    ...PersonalInformationFormOptions
  }
`);

const PersonalInformation = ({
  user,
  onUpdate,
  isUpdating,
  pool,
}: SectionProps<Pick<Pool, "id">>) => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "personal",
    isNull,
    emptyRequired,
    fallbackIcon: UserIcon,
  });
  const applicationContext = useApplicationContext();
  const isInApplication = !!applicationContext.currentStepOrdinal;
  const [{ data, fetching }] = useQuery({
    query: PersonalInformationForm_Query,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(user.id, formValuesToSubmitData(formValues, user))
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Personal and contact information updated successfully!",
              id: "J+MAUg",
              description:
                "Message displayed when a user successfully updates their personal and contact information.",
            }),
          );
          setIsEditing(false);
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  return (
    <ToggleSection.Root
      id="personal-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
        data-h2-font-weight="base(400)"
        toggle={
          !isNull ? (
            <ToggleForm.Trigger
              aria-label={intl.formatMessage({
                defaultMessage: "Edit personal and contact information",
                id: "WE8ZUX",
                description:
                  "Button text to start editing personal and contact information",
              })}
            >
              {intl.formatMessage(commonMessages.editThisSection)}
            </ToggleForm.Trigger>
          ) : undefined
        }
      >
        {title ? intl.formatMessage(title) : null}
      </ToggleSection.Header>
      {pool && emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "You are missing required personal information.",
              id: "QceO8G",
              description:
                "Error message displayed when a users personal information is incomplete",
            })}
          </p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <NullDisplay />
          ) : (
            <Display user={user} showEmailVerification={!isInApplication} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          {fetching ? (
            <Loading inline />
          ) : (
            <BasicForm
              labels={labels}
              onSubmit={handleSubmit}
              options={{
                defaultValues: dataToFormValues(user),
              }}
            >
              <FormFields labels={labels} optionsQuery={data} />
              <FormActions isUpdating={isUpdating} />
            </BasicForm>
          )}
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default PersonalInformation;
