import HandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { useQuery } from "urql";

import { Loading, ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
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
} from "~/validators/profile/workPreferences";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const WorkPreferencesForm_Query = graphql(/* GraphQL */ `
  query WorkPreferencesForm_Query {
    ...WorkPreferencesFormOptions
    ...FlexibleWorkLocationOptionsFragment
  }
`);

const ProfileWorkPreferences_Fragment = graphql(/** GraphQL */ `
  fragment ProfileWorkPreferences on User {
    id
    positionDuration
    acceptedOperationalRequirements {
      value
    }
    currentProvince {
      value
    }
    currentCity
    locationPreferences {
      value
    }
    locationExemptions
    ...WorkPreferencesDisplay
  }
`);

interface WorkPreferencesProps extends SectionProps<Pick<Pool, "id">> {
  query: FragmentType<typeof ProfileWorkPreferences_Fragment>;
}

const WorkPreferences = ({
  query,
  onUpdate,
  isUpdating,
  pool,
}: WorkPreferencesProps) => {
  const intl = useIntl();
  const user = getFragment(ProfileWorkPreferences_Fragment, query);
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "work",
    isNull,
    emptyRequired,
    fallbackIcon: HandThumbUpIcon,
  });
  const [{ data, fetching }] = useQuery({ query: WorkPreferencesForm_Query });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(user.id, formValuesToSubmitData(formValues))
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Work preferences updated successfully!",
              id: "bt0WcN",
              description:
                "Message displayed when a user successfully updates their work preferences.",
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
      id="work-section"
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
                defaultMessage: "Edit work preferences",
                id: "w63YYp",
                description: "Button text to start editing work preferences",
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
              defaultMessage: "You are missing required work preferences.",
              id: "h30KEc",
              description:
                "Error message displayed when a users work preferences is incomplete",
            })}
          </p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <NullDisplay />
          ) : (
            <Display query={user} optionsQuery={data} labels={labels} />
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

export default WorkPreferences;
