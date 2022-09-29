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
import useFilterOptions from "../user/useFilterOptions";
import { ButtonIcon } from "../Table/tableComponents";

type Option = { value: string; label: string };

export type FormValues = {
  languageAbility: Option["value"][];
  classifications: Option["value"][];
  operationalRequirement: Option["value"][];
  workRegion: Option["value"][];
  cmoAssets: Option["value"][];
  hasDiploma: Option["value"][];
  equity: Option["value"][];
  status: Option["value"][];
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
    <div data-h2-display="base(flex)" style={{ placeContent: "space-between" }}>
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
    </div>
  );
};

interface PoolCandidateTableFilterDialogProps {
  isOpen: boolean;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onSubmit: SubmitHandler<FormValues>;
  activeFilters: FormValues;
  enableEducationType?: boolean;
}

const PoolCandidateTableFilterDialog = ({
  isOpen,
  onDismiss,
  onSubmit,
  activeFilters,
  enableEducationType = false,
}: PoolCandidateTableFilterDialogProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { optionsData, rawGraphqlResults } =
    useFilterOptions(enableEducationType);

  return (
    <Dialog
      {...{ isOpen, onDismiss }}
      color="ts-secondary"
      id="user-table-filter-dialog"
      title={formatMessage({
        defaultMessage: "Select filters",
        id: "P9SZBZ",
        description: "Candidate search filter dialog: title",
      })}
      subtitle={formatMessage({
        defaultMessage:
          "Narrow down your table results using the following filters.",
        id: "hqZfyb",
        description: "Candidate search filter dialog: subtitle",
      })}
    >
      <BasicForm
        {...{ onSubmit }}
        options={{
          defaultValues: activeFilters,
        }}
      >
        <div data-h2-flex-grid="base(flex-start, x1, x.5)">
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
              id="cmoAssets"
              label={formatMessage({
                defaultMessage: "Cmo Assets",
                id: "SPXifX",
              })}
              options={optionsData.cmoAssets}
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
              id="status"
              label={formatMessage({
                defaultMessage: "Status",
                id: "tzMNF3",
              })}
              options={optionsData.status}
            />
          </div>
        </div>
        <Dialog.Footer>
          <Footer />
        </Dialog.Footer>
      </BasicForm>
    </Dialog>
  );
};

export type PoolCandidateTableFilterButtonProps = Pick<
  PoolCandidateTableFilterDialogProps,
  "onSubmit" | "enableEducationType"
> & {
  isOpenDefault?: boolean;
};
const PoolCandidateTableFilterButton = ({
  onSubmit,
  isOpenDefault = false,
  enableEducationType,
  ...rest
}: PoolCandidateTableFilterButtonProps) => {
  const { formatMessage } = useIntl();
  const { emptyFormValues } = useFilterOptions(enableEducationType);
  const [activeFilters, setActiveFilters] =
    useState<FormValues>(emptyFormValues);
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const handleOpen = () => setIsOpen(true);
  const handleDismiss = () => setIsOpen(false);
  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
    setActiveFilters(data);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
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
      <PoolCandidateTableFilterDialog
        {...{ isOpen, activeFilters, enableEducationType }}
        {...rest}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </>
  );
};
PoolCandidateTableFilterDialog.Button = PoolCandidateTableFilterButton;
export default PoolCandidateTableFilterDialog;
