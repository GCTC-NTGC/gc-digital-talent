import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext, SubmitHandler } from "react-hook-form";
import AdjustmentsVerticalIcon from "@heroicons/react/24/outline/AdjustmentsVerticalIcon";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  BasicForm,
  MultiSelectFieldBase,
  MultiSelectField,
} from "@gc-digital-talent/forms";

import useCandidateFilterOptions from "~/components/Table/useCandidateFilterOptions/useCandidateFilterOptions";
import adminMessages from "~/messages/adminMessages";

import "./UserTableFilterDialog.css";

type Option = { value: string; label: string };

export type FormValues = {
  pools: Option["value"][];
  languageAbility: Option["value"][];
  operationalRequirement: Option["value"][];
  workRegion: Option["value"][];
  employmentDuration: Option["value"][];
  skills: Option["value"][];
  profileComplete: Option["value"][];
  govEmployee: Option["value"][];
  roles: Option["value"][];
  trashed: Option["value"][];
};

const Footer = () => {
  const { formatMessage } = useIntl();
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext();
  const { emptyFormValues } = useCandidateFilterOptions();
  const handleClear = () => {
    reset(emptyFormValues);
  };

  return (
    <>
      <Button
        color="secondary"
        mode="inline"
        type="button"
        onClick={handleClear}
      >
        {formatMessage({
          description: "Clear button within the search filter dialog",
          defaultMessage: "Clear filters",
          id: "uC0YPE",
        })}
      </Button>
      <Button type="submit" color="primary" disabled={isSubmitting}>
        {formatMessage({
          description: "Submit button within the search filter dialog",
          defaultMessage: "Show results",
          id: "V4+lDw",
        })}
      </Button>
    </>
  );
};

interface UserTableFilterDialogProps {
  isOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<FormValues>;
  activeFilters: FormValues;
}

const UserTableFilterDialog = ({
  onSubmit,
  activeFilters,
  isOpen,
  onOpenChange,
}: UserTableFilterDialogProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { optionsData, rawGraphqlResults } = useCandidateFilterOptions();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button color="quaternary" type="button" icon={AdjustmentsVerticalIcon}>
          {formatMessage({
            defaultMessage: "Filters",
            id: "1HPhji",
            description:
              "Text label for button to open filter dialog on admin tables.",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={formatMessage({
            defaultMessage:
              "Narrow down your table results using the following filters.",
            id: "hqZfyb",
            description: "Candidate search filter dialog: subtitle",
          })}
        >
          {formatMessage({
            defaultMessage: "Select filters",
            id: "P9SZBZ",
            description: "Candidate search filter dialog: title",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <BasicForm
            {...{ onSubmit }}
            options={{
              defaultValues: activeFilters,
            }}
          >
            <div data-h2-flex-grid="base(flex-start, x1, x.5)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="pools"
                  name="pools"
                  label={formatMessage(adminMessages.pools)}
                  options={optionsData.pools}
                  isLoading={rawGraphqlResults.pools.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(2of5)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="languageAbility"
                  name="languageAbility"
                  label={formatMessage({
                    defaultMessage: "Languages",
                    id: "iUAe/2",
                    description: "Label for language ability field",
                  })}
                  options={optionsData.languageAbility}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="classifications"
                  name="classifications"
                  label={formatMessage(adminMessages.classifications)}
                  options={optionsData.classifications}
                  isLoading={rawGraphqlResults.classifications.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="operationalRequirement"
                  name="operationalRequirement"
                  label={formatMessage(navigationMessages.workPreferences)}
                  options={optionsData.operationalRequirement}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="workRegion"
                  name="workRegion"
                  label={formatMessage(navigationMessages.workLocation)}
                  options={optionsData.workRegion}
                  doNotSort
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="employmentDuration"
                  name="employmentDuration"
                  label={formatMessage({
                    defaultMessage: "Duration preferences",
                    id: "2ingb6",
                    description: "Label for the employment duration field",
                  })}
                  options={optionsData.employmentDuration}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="profileComplete"
                  name="profileComplete"
                  label={formatMessage({
                    defaultMessage: "Profile complete",
                    id: "h7IJnu",
                    description: "Label for the profile complete field",
                  })}
                  options={optionsData.profileComplete}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="skills"
                  name="skills"
                  label={formatMessage({
                    defaultMessage: "Skill filter",
                    id: "lxDj4o",
                    description: "Label for the skills field",
                  })}
                  options={optionsData.skills}
                  isLoading={rawGraphqlResults.skills.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(2of5)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="govEmployee"
                  name="govEmployee"
                  label={formatMessage({
                    defaultMessage: "Government employee",
                    id: "bOA3EH",
                    description: "Label for the government employee field",
                  })}
                  options={optionsData.govEmployee}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="roles"
                  name="roles"
                  label={formatMessage(adminMessages.rolesAndPermissions)}
                  options={optionsData.roles}
                  isLoading={rawGraphqlResults.roles.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(2of5)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="trashed"
                  name="trashed"
                  label={formatMessage({
                    defaultMessage: "Deleted",
                    id: "CzK1qY",
                    description: "Label for the trashed field",
                  })}
                  options={optionsData.trashed}
                />
              </div>
            </div>
            <Dialog.Footer>
              <Footer />
            </Dialog.Footer>
          </BasicForm>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export type UserTableFiltersProps = Pick<
  UserTableFilterDialogProps,
  "onSubmit"
> & {
  isOpenDefault?: boolean;
  initialFilters?: FormValues;
};

const UserTableFilters = ({
  onSubmit,
  isOpenDefault = false,
  initialFilters,
  ...rest
}: UserTableFiltersProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(isOpenDefault);
  const { emptyFormValues } = useCandidateFilterOptions();
  const initialStateActiveFilters = initialFilters ?? emptyFormValues;
  const [activeFilters, setActiveFilters] = useState<FormValues>(
    initialStateActiveFilters,
  );

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    setActiveFilters(data);
    setOpen(false);
    return onSubmit(data);
  };

  return (
    <UserTableFilterDialog
      {...{ activeFilters, isOpenDefault, isOpen }}
      {...rest}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
    />
  );
};

export default UserTableFilters;
