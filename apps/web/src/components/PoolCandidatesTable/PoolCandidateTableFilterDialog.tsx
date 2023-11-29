import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext, SubmitHandler } from "react-hook-form";
import AdjustmentsVerticalIcon from "@heroicons/react/24/outline/AdjustmentsVerticalIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  BasicForm,
  MultiSelectFieldBase,
  MultiSelectField,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  getPublishingGroup,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { PublishingGroup } from "@gc-digital-talent/graphql";

import useCandidateFilterOptions from "~/components/Table/useCandidateFilterOptions/useCandidateFilterOptions";
import adminMessages from "~/messages/adminMessages";

type Option = { value: string; label: string };

export type FormValues = {
  languageAbility: Option["value"][];
  classifications: Option["value"][];
  stream: Option["value"][];
  operationalRequirement: Option["value"][];
  workRegion: Option["value"][];
  hasDiploma: Option["value"][];
  equity: Option["value"][];
  poolCandidateStatus: Option["value"][];
  priorityWeight: Option["value"][];
  pools: Option["value"][];
  skills: Option["value"][];
  expiryStatus: Option["value"][];
  suspendedStatus: Option["value"][];
  publishingGroups: Option["value"][];
  govEmployee: Option["value"][];
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
      <Button color="secondary" mode="inline" onClick={handleClear}>
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

interface PoolCandidateTableFilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<FormValues>;
  activeFilters: FormValues;
}

const PoolCandidateTableFilterDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  activeFilters,
}: PoolCandidateTableFilterDialogProps): JSX.Element => {
  const { formatMessage, locale } = useIntl();
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(5of5)">
                <MultiSelectField
                  id="pools"
                  name="pools"
                  label={formatMessage(adminMessages.pools)}
                  options={optionsData.pools}
                  isLoading={rawGraphqlResults.pools.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="publishingGroups"
                  name="publishingGroups"
                  label={formatMessage(adminMessages.publishingGroups)}
                  options={enumToOptions(PublishingGroup).map(({ value }) => ({
                    value,
                    label: formatMessage(getPublishingGroup(value)),
                    ariaLabel: formatMessage(getPublishingGroup(value)).replace(
                      locale === "en" ? "IT" : "TI",
                      locale === "en" ? "I T" : "T I",
                    ),
                  }))}
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
                  id="stream"
                  name="stream"
                  label={formatMessage(adminMessages.streams)}
                  options={optionsData.stream}
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="hasDiploma"
                  name="hasDiploma"
                  label={formatMessage({
                    defaultMessage: "Has Diploma",
                    id: "o0XhkM",
                    description: "Label for the has diploma field",
                  })}
                  options={optionsData.hasDiploma}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="expiryStatus"
                  name="expiryStatus"
                  label={formatMessage({
                    defaultMessage: "Expiry status",
                    description: "Label for the expiry status field",
                    id: "HDiUEc",
                  })}
                  options={optionsData.expiryStatus}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectFieldBase
                  forceArrayFormValue
                  id="suspendedStatus"
                  name="suspendedStatus"
                  label={formatMessage({
                    defaultMessage: "Candidacy status",
                    description: "Label for the candidacy status field",
                    id: "NxrKpM",
                  })}
                  options={optionsData.suspendedStatus}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="equity"
                  name="equity"
                  label={formatMessage({
                    defaultMessage: "Employment equity",
                    id: "9e6Xph",
                    description: "Label for the employment equity field",
                  })}
                  options={optionsData.equity}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="poolCandidateStatus"
                  name="poolCandidateStatus"
                  label={formatMessage(adminMessages.status)}
                  options={optionsData.poolCandidateStatus}
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
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
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="priorityWeight"
                  name="priorityWeight"
                  label={formatMessage({
                    defaultMessage: "Category",
                    id: "qrDCTV",
                    description:
                      "Title displayed for the Pool Candidates table Priority column.",
                  })}
                  options={optionsData.priorityWeight}
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

type PoolCandidateTableFiltersProps = Pick<
  PoolCandidateTableFilterDialogProps,
  "onSubmit"
> & {
  isOpenDefault?: boolean;
  initialFilters?: FormValues;
};

const PoolCandidateTableFilters = ({
  onSubmit,
  isOpenDefault = false,
  initialFilters,
  ...rest
}: PoolCandidateTableFiltersProps) => {
  const { emptyFormValues } = useCandidateFilterOptions();
  const initialStateActiveFilters = initialFilters ?? emptyFormValues;
  const [activeFilters, setActiveFilters] = useState<FormValues>(
    initialStateActiveFilters,
  );
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    setActiveFilters(data);
    setIsOpen(false);
    return onSubmit(data);
  };

  return (
    <PoolCandidateTableFilterDialog
      {...{ isOpen, isOpenDefault, activeFilters }}
      {...rest}
      onOpenChange={setIsOpen}
      onSubmit={handleSubmit}
    />
  );
};
export default PoolCandidateTableFilters;
