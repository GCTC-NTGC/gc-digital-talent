import React, { useState } from "react";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";
import { useIntl } from "react-intl";
import { BasicForm } from "@common/components/form";
import SelectFieldV2 from "@common/components/form/Select/SelectFieldV2";
import MultiSelectFieldV2 from "@common/components/form/MultiSelect/MultiSelectFieldV2";
import "../user/UserTableFilterDialog.css";
import { useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import useFilterOptions from "../apiManagedTable/useFilterOptions";
import { ButtonIcon } from "../Table/tableComponents";

type Option = { value: string; label: string };

export type FormValues = {
  languageAbility: Option["value"][];
  classifications: Option["value"][];
  operationalRequirement: Option["value"][];
  workRegion: Option["value"][];
  hasDiploma: Option["value"][];
  equity: Option["value"][];
  poolCandidateStatus: Option["value"][];
  priorityWeight: Option["value"][];
  pools: Option["value"][];
  skills: Option["value"][];
};

type FooterProps = Pick<
  PoolCandidateTableFilterDialogProps,
  "enableEducationType"
>;
const Footer = ({ enableEducationType }: FooterProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { reset } = useFormContext();
  const { emptyFormValues } = useFilterOptions(enableEducationType);
  const handleClear = () => {
    reset(emptyFormValues);
  };

  return (
    <>
      <Button color="secondary" mode="outline" onClick={handleClear}>
        {formatMessage({
          description: "Clear button within the search filter dialog",
          defaultMessage: "Clear filters",
          id: "uC0YPE",
        })}
      </Button>
      <Button type="submit" color="cta">
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
        <Button
          mode="solid"
          color="secondary"
          type="button"
          data-h2-display="base(inline-flex)"
          data-h2-align-items="base(center)"
        >
          <ButtonIcon icon={AdjustmentsVerticalIcon} />
          <span>
            {formatMessage({
              defaultMessage: "Filters",
              id: "1HPhji",
              description:
                "Text label for button to open filter dialog on admin tables.",
            })}
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          color="ts-secondary"
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
        <BasicForm
          {...{ onSubmit }}
          options={{
            defaultValues: activeFilters,
          }}
        >
          <div data-h2-flex-grid="base(flex-start, x1, x.5)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
              <MultiSelectFieldV2
                id="pools"
                label={formatMessage({
                  defaultMessage: "Pools",
                  id: "mjyHeP",
                })}
                options={optionsData.pools}
                isLoading={rawGraphqlResults.pools.fetching}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(2of5)">
              <SelectFieldV2
                forceArrayFormValue
                id="languageAbility"
                label={formatMessage({
                  defaultMessage: "Languages",
                  id: "GsBRWL",
                })}
                options={optionsData.languageAbility}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <MultiSelectFieldV2
                id="classifications"
                label={formatMessage({
                  defaultMessage: "Classifications",
                  id: "5TVKj1",
                })}
                options={optionsData.classifications}
                isLoading={rawGraphqlResults.classifications.fetching}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <MultiSelectFieldV2
                id="operationalRequirement"
                label={formatMessage({
                  defaultMessage: "Work Preferences",
                  id: "1XyQqX",
                })}
                options={optionsData.operationalRequirement}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <MultiSelectFieldV2
                id="workRegion"
                label={formatMessage({
                  defaultMessage: "Work Locations",
                  id: "qhhPj5",
                })}
                options={optionsData.workRegion}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <SelectFieldV2
                forceArrayFormValue
                id="hasDiploma"
                label={formatMessage({
                  defaultMessage: "Has Diploma",
                  id: "+tzO5t",
                })}
                options={optionsData.hasDiploma}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <MultiSelectFieldV2
                id="equity"
                label={formatMessage({
                  defaultMessage: "Employment Equity",
                  id: "Gr3BwB",
                })}
                options={optionsData.equity}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <MultiSelectFieldV2
                id="poolCandidateStatus"
                label={formatMessage({
                  defaultMessage: "Status",
                  id: "tzMNF3",
                })}
                options={optionsData.poolCandidateStatus}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
              <MultiSelectFieldV2
                id="priorityWeight"
                label={formatMessage({
                  defaultMessage: "Priority",
                  id: "8lCjAM",
                })}
                options={optionsData.priorityWeight}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
              <MultiSelectFieldV2
                id="skills"
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export type PoolCandidateTableFiltersProps = Pick<
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
    onSubmit(data);
    setActiveFilters(data);
    setIsOpen(false);
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
