import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import { useQuery } from "urql";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Pool,
} from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/profile/governmentInformation";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import FormFields, {
  GovernmentInfoClassification_Fragment,
} from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const GovernmentInformationFormData_Query = graphql(/* GraphQL */ `
  query GetProfileFormOptions {
    ...GovernmentInfoEmployeeTypes
    departments {
      ...GovernmentInfoDepartment
    }
    classifications {
      ...GovernmentInfoClassification
    }
  }
`);

const ProfileGovernmentInformation_Fragment = graphql(/** GraphQL */ `
  fragment ProfileGovernmentInformation on User {
    id
    isGovEmployee
    hasPriorityEntitlement
    priorityNumber
    govEmployeeType {
      value
    }
    department {
      id
    }
    currentClassification {
      group
      level
    }
    workEmail
    ...GovernmentInformationDisplay
  }
`);

interface GovernmentInformationProps extends SectionProps<Pick<Pool, "id">> {
  query: FragmentType<typeof ProfileGovernmentInformation_Fragment>;
}

const GovernmentInformation = ({
  query,
  onUpdate,
  isUpdating,
  pool,
}: GovernmentInformationProps) => {
  const user = getFragment(ProfileGovernmentInformation_Fragment, query);
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const intl = useIntl();
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "government",
    isNull,
    emptyRequired,
    fallbackIcon: BuildingLibraryIcon,
  });

  const [{ data }] = useQuery({ query: GovernmentInformationFormData_Query });
  const classifications = getFragment(
    GovernmentInfoClassification_Fragment,
    unpackMaybes(data?.classifications),
  );

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(
      user.id,
      formValuesToSubmitData(formValues, user.id, [...classifications]),
    )
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Government information updated successfully!",
              id: "dVc2uY",
              description:
                "Message displayed when a user successfully updates their government employee information.",
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
      id="gov-section"
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
                defaultMessage: "Edit government information",
                id: "Ysf8wI",
                description:
                  "Button text to start editing government information",
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
              defaultMessage:
                "You are missing required government information.",
              id: "Rq14QK",
              description:
                "Error message displayed when a users government information is incomplete",
            })}
          </p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <NullDisplay /> : <Display query={user} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <BasicForm
            labels={labels}
            onSubmit={handleSubmit}
            options={{
              mode: "onBlur",
              defaultValues: dataToFormValues(user),
            }}
          >
            <FormFields
              labels={labels}
              departmentsQuery={unpackMaybes(data?.departments)}
              classificationsQuery={unpackMaybes(data?.classifications)}
              employeeTypesQuery={data}
            />
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default GovernmentInformation;
