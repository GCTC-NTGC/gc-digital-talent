import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext, SubmitHandler } from "react-hook-form";
import AdjustmentsVerticalIcon from "@heroicons/react/24/outline/AdjustmentsVerticalIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  BasicForm,
  MultiSelectFieldBase,
  MultiSelectField,
} from "@gc-digital-talent/forms";

import useFilterOptions from "~/components/Table/ApiManagedTable/useFilterOptions";

import "./PoolCandidateFilterDialog.css";
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
};

type FooterProps = Pick<
  PoolCandidateTableFilterDialogProps,
  "enableEducationType"
>;
const Footer = ({ enableEducationType }: FooterProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext();
  const { emptyFormValues } = useFilterOptions(enableEducationType);
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
  enableEducationType?: boolean;
}

const PoolCandidateTableFilterDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  activeFilters,
  enableEducationType = false,
}: PoolCandidateTableFilterDialogProps): JSX.Element => {
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
                  id="stream"
                  name="stream"
                  label={formatMessage({
                    defaultMessage: "Streams",
                    id: "GwbTAz",
                  })}
                  options={optionsData.stream}
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
                    id: "+tzO5t",
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
                    defaultMessage: "Expiry Status",
                    description: "Expiry status",
                    id: "TQU5g8",
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
                    defaultMessage: "Candidacy Status",
                    description: "Candidacy status label",
                    id: "/LGiVB",
                  })}
                  options={optionsData.suspendedStatus}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="equity"
                  name="equity"
                  label={formatMessage({
                    defaultMessage: "Employment Equity",
                    id: "Gr3BwB",
                  })}
                  options={optionsData.equity}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="poolCandidateStatus"
                  name="poolCandidateStatus"
                  label={formatMessage({
                    defaultMessage: "Status",
                    id: "tzMNF3",
                  })}
                  options={optionsData.poolCandidateStatus}
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
  "onSubmit" | "enableEducationType"
> & {
  isOpenDefault?: boolean;
  initialFilters?: FormValues;
};

const PoolCandidateTableFilters = ({
  onSubmit,
  isOpenDefault = false,
  enableEducationType,
  initialFilters,
  ...rest
}: PoolCandidateTableFiltersProps) => {
  const { emptyFormValues } = useFilterOptions(enableEducationType);
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
      {...{ isOpen, isOpenDefault, activeFilters, enableEducationType }}
      {...rest}
      onOpenChange={setIsOpen}
      onSubmit={handleSubmit}
    />
  );
};
export default PoolCandidateTableFilters;
