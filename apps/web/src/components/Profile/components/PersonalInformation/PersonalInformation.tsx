import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { useQuery } from "urql";

import { Loading, ToggleSection, Well } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Pool,
} from "@gc-digital-talent/graphql";

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

const ProfilePersonalInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfilePersonalInformation on User {
    id
    firstName
    lastName
    telephone
    preferredLang {
      value
    }
    preferredLanguageForInterview {
      value
    }
    preferredLanguageForExam {
      value
    }
    citizenship {
      value
    }
    armedForcesStatus {
      value
    }
    ...PersonalInformationDisplay
  }
`);

interface PersonalInformationProps extends SectionProps<Pick<Pool, "id">> {
  query: FragmentType<typeof ProfilePersonalInformation_Fragment>;
}

const PersonalInformation = ({
  query,
  onUpdate,
  isUpdating,
  pool,
}: PersonalInformationProps) => {
  const intl = useIntl();
  const user = getFragment(ProfilePersonalInformation_Fragment, query);
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "personal",
    isNull,
    emptyRequired,
    fallbackIcon: UserIcon,
  });
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
        icon={icon.icon}
        color={icon.color}
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
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
          {isNull ? <NullDisplay /> : <Display query={user} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          {fetching ? (
            <Loading inline />
          ) : (
            <BasicForm
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
