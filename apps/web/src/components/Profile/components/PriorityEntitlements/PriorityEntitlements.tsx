import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
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
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/profile/priorityEntitlements";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const ProfilePriorityEntitlements_Fragment = graphql(/** GraphQL */ `
  fragment ProfilePriorityEntitlements on User {
    id
    hasPriorityEntitlement
    priorityNumber
    ...PriorityEntitlementDisplay
  }
`);

interface PriorityEntitlementsProps extends SectionProps<Pick<Pool, "id">> {
  query: FragmentType<typeof ProfilePriorityEntitlements_Fragment>;
}

const PriorityEntitlements = ({
  query,
  onUpdate,
  isUpdating,
  pool,
}: PriorityEntitlementsProps) => {
  const user = getFragment(ProfilePriorityEntitlements_Fragment, query);
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const intl = useIntl();
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "priority",
    isNull,
    emptyRequired,
    fallbackIcon: BuildingLibraryIcon,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(user.id, formValuesToSubmitData(formValues, user.id))
      .then((response) => {
        if (response) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Priority entitlements updated successfully!",
              id: "xOCF/f",
              description:
                "Message displayed when a user successfully updates their priority entitlements.",
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
      id="priority-section"
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
                defaultMessage: "Edit priority entitlements",
                id: "TIu/WA",
                description:
                  "Button text to start editing priority entitlements",
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
                "You are missing required priority entitlement information.",
              id: "3MhIFU",
              description:
                "Error message displayed when a users priority entitlements is incomplete",
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
            <FormFields labels={labels} />
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default PriorityEntitlements;
