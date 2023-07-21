import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext, SubmitHandler } from "react-hook-form";
import AdjustmentsVerticalIcon from "@heroicons/react/24/outline/AdjustmentsVerticalIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  BasicForm,
  MultiSelectFieldBase,
  MultiSelectField,
} from "@gc-digital-talent/forms";

import useFilterOptions from "~/components/Table/ApiManagedTable/useFilterOptions";

import "./UserTableFilterDialog.css";
import adminMessages from "~/messages/adminMessages";

type Option = { value: string; label: string };

export type FormValues = {
  pools: Option["value"][];
  languageAbility: Option["value"][];
  classifications: Option["value"][];
  operationalRequirement: Option["value"][];
  workRegion: Option["value"][];
  // TODO: Make mandatory once data model settles.
  // See: https://www.figma.com/proto/XS4Ag6GWcgdq2dBlLzBkay?node-id=1064:5862#224617157
  educationType?: Option["value"][];
  employmentDuration: Option["value"][];
  skills: Option["value"][];
  profileComplete: Option["value"][];
  govEmployee: Option["value"][];
};

type FooterProps = Pick<UserTableFilterDialogProps, "enableEducationType">;
const Footer = ({ enableEducationType }: FooterProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { reset } = useFormContext();
  const { emptyFormValues } = useFilterOptions(enableEducationType);
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
      <Button type="submit" color="primary">
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
  enableEducationType?: boolean;
}

const UserTableFilterDialog = ({
  onSubmit,
  activeFilters,
  isOpen,
  onOpenChange,
  enableEducationType = false,
}: UserTableFilterDialogProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { optionsData, rawGraphqlResults } =
    useFilterOptions(enableEducationType);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button color="secondary" type="button" icon={AdjustmentsVerticalIcon}>
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
                    id: "GsBRWL",
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
                  label={formatMessage({
                    defaultMessage: "Work Preferences",
                    id: "1XyQqX",
                  })}
                  options={optionsData.operationalRequirement}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="workRegion"
                  name="workRegion"
                  label={formatMessage({
                    defaultMessage: "Work Locations",
                    id: "qhhPj5",
                  })}
                  options={optionsData.workRegion}
                />
              </div>
              {enableEducationType && (
                <div data-h2-flex-item="base(1of1)">
                  <MultiSelectField
                    id="educationType"
                    name="educationType"
                    label={formatMessage({
                      defaultMessage: "Education",
                      id: "jtygmI",
                    })}
                    options={optionsData.educationType}
                  />
                </div>
              )}
              <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="employmentDuration"
                  name="employmentDuration"
                  label={formatMessage({
                    defaultMessage: "Duration Preferences",
                    id: "hmfQmT",
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
                    defaultMessage: "Profile Complete",
                    id: "OPG1Q0",
                  })}
                  options={optionsData.profileComplete}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="skills"
                  name="skills"
                  label={formatMessage({
                    defaultMessage: "Skill Filter",
                    id: "GGaxMx",
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
                    defaultMessage: "Government Employee",
                    id: "YojrdC",
                  })}
                  options={optionsData.govEmployee}
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
  "onSubmit" | "enableEducationType"
> & {
  isOpenDefault?: boolean;
  initialFilters?: FormValues;
};

const UserTableFilters = ({
  onSubmit,
  isOpenDefault = false,
  enableEducationType,
  initialFilters,
  ...rest
}: UserTableFiltersProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(isOpenDefault);
  const { emptyFormValues } = useFilterOptions(enableEducationType);
  const initialStateActiveFilters = initialFilters ?? emptyFormValues;
  const [activeFilters, setActiveFilters] = useState<FormValues>(
    initialStateActiveFilters,
  );

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
    setActiveFilters(data);
    setOpen(false);
  };

  return (
    <UserTableFilterDialog
      {...{ activeFilters, isOpenDefault, enableEducationType, isOpen }}
      {...rest}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
    />
  );
};

export default UserTableFilters;
