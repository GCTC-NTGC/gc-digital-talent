import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";

import { ToggleSection, Notice } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType, Pool } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/profile/citizenVeteranPriority";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import type { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import type { FormValues } from "./types";
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const ProfileCitizenVeteranPriority_Fragment = graphql(/** GraphQL */ `
  fragment ProfileCitizenVeteranPriority on User {
    id
    hasPriorityEntitlement
    priorityNumber
    citizenship {
      value
      label {
        localized
      }
    }
    armedForcesStatus {
      value
      label {
        localized
      }
    }
    ...CitizenVeteranPriorityDisplay
  }
`);

interface CitizenVeteranPriorityProps extends SectionProps<Pick<Pool, "id">> {
  query: FragmentType<typeof ProfileCitizenVeteranPriority_Fragment>;
}

const CitizenVeteranPriority = ({
  query,
  onUpdate,
  isUpdating,
  pool,
}: CitizenVeteranPriorityProps) => {
  const user = getFragment(ProfileCitizenVeteranPriority_Fragment, query);
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const intl = useIntl();
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "citizen-veteran-priority",
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
              defaultMessage:
                "Citizenship, veteran status and priority entitlements updated successfully!",
              id: "sZv6bv",
              description:
                "Message displayed when a user successfully updates their citizen/veteran/priority.",
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
                defaultMessage:
                  "Edit citizenship, veteran status and priority entitlements",
                id: "EX82UF",
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
        <Notice.Root color="error">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You are missing required citizenship, veteran status and priority entitlement information.",
                id: "/WUaCi",
                description:
                  "Error message displayed when a users priority entitlements is incomplete",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
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

export default CitizenVeteranPriority;
