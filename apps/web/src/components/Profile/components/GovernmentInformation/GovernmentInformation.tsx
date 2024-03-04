import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import { useQuery } from "urql";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";

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
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const GovernmentInformationFormData_Query = graphql(/* GraphQL */ `
  query GetProfileFormOptions {
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    classifications {
      id
      name {
        en
        fr
      }
      group
      level
      minSalary
      maxSalary
    }
  }
`);

const GovernmentInformation = ({
  user,
  onUpdate,
  isUpdating,
  pool,
}: SectionProps) => {
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
  const classifications = unpackMaybes(data?.classifications);
  const departments = unpackMaybes(data?.departments);

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(
      user.id,
      formValuesToSubmitData(formValues, classifications),
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
        Icon={icon.icon}
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
          {isNull ? <NullDisplay /> : <Display user={user} />}
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
              departments={departments}
              classifications={classifications}
            />
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default GovernmentInformation;
