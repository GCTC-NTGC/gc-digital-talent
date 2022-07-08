import React from "react";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";
import { FormattedMessage, useIntl } from "react-intl";
import { BasicForm } from "@common/components/form";
import SelectFieldV2 from "@common/components/form/Select/SelectFieldV2";
import MultiSelectFieldV2 from "@common/components/form/MultiSelect/MultiSelectFieldV2";
import "./SearchFilter.css";
import { useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { Option } from "@common/components/form/Select/SelectFieldV2";
import useSearchFilterOptions from "./useSearchFilterOptions";

export type FormValues = {
  pools: Option["value"][];
  languages: Option["value"][];
  classifications: Option["value"][];
  workPreferences: Option["value"][];
  workLocations: Option["value"][];
  // TODO: Make mandatory once data model settles.
  // See: https://www.figma.com/proto/XS4Ag6GWcgdq2dBlLzBkay?node-id=1064:5862#224617157
  educationTypes?: Option["value"][];
  durationPreferences: Option["value"][];
  availability: Option["value"][];
  skillFilter: Option["value"][];
  profileComplete: Option["value"][];
  govEmployee: Option["value"][];
};

type SearchFilterFooterProps = Pick<SearchFilterProps, "enableEducationType">;
const SearchFilterFooter = ({
  enableEducationType,
}: SearchFilterFooterProps): JSX.Element => {
  const { reset } = useFormContext();
  const { emptyFormValues } = useSearchFilterOptions(enableEducationType);
  const handleClear = () => {
    reset(emptyFormValues);
  };

  return (
    <div style={{ display: "flex", placeContent: "space-between" }}>
      <Button color="secondary" mode="outline" onClick={handleClear}>
        <FormattedMessage
          description="Clear button within the search filter dialog"
          defaultMessage="Clear filters"
        />
      </Button>
      <Button type="submit" color="cta">
        <FormattedMessage
          description="Submit button within the search filter dialog"
          defaultMessage="Show results"
        />
      </Button>
    </div>
  );
};

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;
const Row = (props: ContainerProps) => (
  <div className="search-filter__row" {...props} />
);
const Item = (props: ContainerProps) => (
  <div className="search-filter__item" {...props} />
);

interface SearchFilterProps {
  isOpen: boolean;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onSubmit: SubmitHandler<FormValues>;
  activeFilters: FormValues;
  enableEducationType?: boolean;
}

const SearchFilter = ({
  isOpen,
  onDismiss,
  onSubmit,
  activeFilters,
  enableEducationType = false,
}: SearchFilterProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { optionsData } = useSearchFilterOptions(enableEducationType);

  return (
    <Dialog
      {...{ isOpen, onDismiss }}
      title={formatMessage({
        defaultMessage: "Select filters",
        description: "Candidate search filter dialog: title",
      })}
      subtitle={formatMessage({
        defaultMessage:
          "Narrow down your table results using the following filters.",
        description: "Candidate search filter dialog: subtitle",
      })}
    >
      <BasicForm
        {...{ onSubmit }}
        options={{
          defaultValues: activeFilters,
        }}
      >
        <Row>
          <Item>
            <MultiSelectFieldV2
              id="pools"
              label={formatMessage({
                defaultMessage: "Pools",
              })}
              options={optionsData.pools}
            />
          </Item>
          <Item style={{ minWidth: 300 }}>
            <SelectFieldV2
              forceArrayFormValue
              id="languages"
              label={formatMessage({
                defaultMessage: "Languages",
              })}
              options={optionsData.languages}
            />
          </Item>
        </Row>
        <Row>
          <Item style={{ minWidth: 175 }}>
            <MultiSelectFieldV2
              id="classifications"
              label={formatMessage({
                defaultMessage: "Classifications",
              })}
              options={optionsData.classifications}
            />
          </Item>
          <Item>
            <MultiSelectFieldV2
              id="workPreferences"
              label={formatMessage({
                defaultMessage: "Work Preferences",
              })}
              options={optionsData.workPreferences}
            />
          </Item>
          <Item>
            <MultiSelectFieldV2
              id="workLocations"
              label={formatMessage({
                defaultMessage: "Work Locations",
              })}
              options={optionsData.workLocations}
            />
          </Item>
        </Row>
        <Row>
          <Item>
            <SelectFieldV2
              forceArrayFormValue
              id="durationPreferences"
              label={formatMessage({
                defaultMessage: "Duration Preferences",
              })}
              options={optionsData.durationPreferences}
            />
          </Item>
          {enableEducationType && (
            <Item>
              <MultiSelectFieldV2
                id="educationTypes"
                label={formatMessage({
                  defaultMessage: "Education",
                })}
                options={optionsData.educationTypes}
              />
            </Item>
          )}
          <Item>
            <MultiSelectFieldV2
              id="availability"
              label={formatMessage({
                defaultMessage: "Availability",
              })}
              options={optionsData.availability}
            />
          </Item>
          <Item>
            <SelectFieldV2
              forceArrayFormValue
              id="profileComplete"
              label={formatMessage({
                defaultMessage: "Profile Complete",
              })}
              options={optionsData.profileComplete}
            />
          </Item>
        </Row>
        <Row>
          <Item>
            <MultiSelectFieldV2
              id="skillFilter"
              label={formatMessage({
                defaultMessage: "Skill Filter",
              })}
              options={optionsData.skillFilter}
            />
          </Item>
          <Item>
            <SelectFieldV2
              forceArrayFormValue
              id="govEmployee"
              label={formatMessage({
                defaultMessage: "Government Employee",
              })}
              options={optionsData.govEmployee}
            />
          </Item>
        </Row>
        <Dialog.Footer>
          <SearchFilterFooter />
        </Dialog.Footer>
      </BasicForm>
    </Dialog>
  );
};

export default SearchFilter;
