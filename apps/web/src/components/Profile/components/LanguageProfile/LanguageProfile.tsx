import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import LanguageIcon from "@heroicons/react/24/outline/LanguageIcon";
import { useQuery } from "urql";

import { Loading, ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql, Pool } from "@gc-digital-talent/graphql";

import MissingLanguageRequirements from "~/components/MissingLanguageRequirements";
import profileMessages from "~/messages/profileMessages";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/profile/languageInformation";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import FormFields from "./FormFields";

const LanguageProfile_Query = graphql(/* GraphQL */ `
  query LanguageProfile {
    ...LanguageProfileOptions
  }
`);

const LanguageProfile = ({
  user,
  application,
  onUpdate,
  isUpdating,
  pool,
}: SectionProps<Pick<Pool, "id">>) => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "language",
    isNull,
    emptyRequired,
    fallbackIcon: LanguageIcon,
  });
  const [{ data, fetching }] = useQuery({ query: LanguageProfile_Query });

  const missingLanguageRequirements = getMissingLanguageRequirements(user, {
    language: application?.pool?.language,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(user.id, formValuesToSubmitData(formValues))
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Language profile updated successfully!",
              id: "43VEQA",
              description:
                "Message displayed when a user successfully updates their language profile.",
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
      id="lang-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
        toggle={
          !isNull ? (
            <ToggleForm.Trigger
              aria-label={intl.formatMessage({
                defaultMessage: "Edit language profile",
                id: "fxPLAl",
                description: "Button text to start editing language profile",
              })}
            >
              {intl.formatMessage(commonMessages.editThisSection)}
            </ToggleForm.Trigger>
          ) : undefined
        }
      >
        {intl.formatMessage(title)}
      </ToggleSection.Header>
      {pool && emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "You are missing required language information.",
              id: "F4RHJu",
              description:
                "Error message displayed when a users language information is incomplete",
            })}
          </p>
        </Well>
      )}
      {missingLanguageRequirements.length > 0 && (
        <MissingLanguageRequirements
          headingLevel="h3"
          user={user}
          pool={application?.pool}
        />
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <NullDisplay /> : <Display user={user} />}
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

export default LanguageProfile;
