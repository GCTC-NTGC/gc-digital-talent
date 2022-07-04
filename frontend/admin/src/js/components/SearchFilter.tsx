import React from "react";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";
import { FormattedMessage, useIntl } from "react-intl";
import { BasicForm } from "@common/components/form";
import SelectFieldV2 from "@common/components/form/Select/SelectFieldV2";
import MultiSelectFieldV2 from "@common/components/form/MultiSelect/MultiSelectFieldV2";
import "./SearchFilter.css";

interface SearchFilterFooterProps {
  handleClear: () => void;
  handleSubmit: () => void;
}

const SearchFilterFooter = ({
  handleClear,
  handleSubmit,
}: SearchFilterFooterProps): JSX.Element => (
  <div style={{ display: "flex", placeContent: "space-between" }}>
    <Button type="reset" color="secondary" mode="outline" onClick={handleClear}>
      <FormattedMessage
        description="Reset button within the search filter dialog"
        defaultMessage="Clear filters"
      />
    </Button>
    <Button type="submit" color="cta" onClick={handleSubmit}>
      <FormattedMessage
        description="Submit button within the search filter dialog"
        defaultMessage="Show results"
      />
    </Button>
  </div>
);

interface SearchFilterProps {
  isOpen: boolean;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

const generateOptionsFromValues = (item: string, index: number) => ({
  label: item,
  value: index,
});

const SearchFilter = ({
  isOpen,
  onDismiss,
}: SearchFilterProps): JSX.Element => {
  const handleSubmit = () => {};
  const handleClear = () => {};
  const { formatMessage } = useIntl();

  const optionsData = {
    pools: [
      "Digital Talent",
      "Women in STEM",
      "Indigenous Apprenticeship Program",
    ].map(generateOptionsFromValues),
    languages: ["Any", "English only", "French only", "Bilingual"].map(
      generateOptionsFromValues,
    ),
    classifications: ["CS-01", "CS-02", "CS-03", "CS-04", "CS-05"].map(
      generateOptionsFromValues,
    ),
    workPreferences: [
      "Overtime",
      "Shift-work",
      "24/7 on-call",
      "Travel",
      "Transport & Lift (20kg)",
      "Driver license",
    ].map(generateOptionsFromValues),
    workLocations: [
      "Virtual",
      "National Capital Region",
      "Atlantic Region",
      "Quebec Region",
      "Ontario Region",
      "Prairie Region",
      "British Columbia Region",
      "North Region",
    ].map(generateOptionsFromValues),
    education: ["Combination", "Has diploma"].map(generateOptionsFromValues),
    durationPreferences: ["Term", "Indeterminate"].map(
      generateOptionsFromValues,
    ),
    availability: ["Actively looking", "Open to opportunities", "Inactive"].map(
      generateOptionsFromValues,
    ),
    skillFilter: ["Data Analysis", "Data Cleaning", "Database Design"].map(
      generateOptionsFromValues,
    ),
    profileComplete: ["Yes", "No"].map(generateOptionsFromValues),
    govEmployee: ["Yes", "No"].map(generateOptionsFromValues),
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={formatMessage({
        defaultMessage: "Select filters",
      })}
      subtitle={formatMessage({
        defaultMessage:
          "Narrow down your table results using the following filters.",
      })}
      footer={<SearchFilterFooter handleSubmit={handleSubmit} />}
    >
      <BasicForm onSubmit={() => {}}>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }}>
            <MultiSelectFieldV2
              id="pools"
              label={formatMessage({
                defaultMessage: "Pools",
              })}
              options={optionsData.pools}
            />
          </div>
          <div style={{ minWidth: 200, marginLeft: 20 }}>
            <SelectFieldV2
              id="languages"
              label={formatMessage({
                defaultMessage: "Languages",
              })}
              options={optionsData.languages}
            />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 1, minWidth: 175 }}>
            <MultiSelectFieldV2
              id="classifications"
              label={formatMessage({
                defaultMessage: "Classifications",
              })}
              options={optionsData.classifications}
            />
          </div>
          <div style={{ flexGrow: 1, marginLeft: 20 }}>
            <MultiSelectFieldV2
              id="workPreferences"
              label={formatMessage({
                defaultMessage: "Work Preferences",
              })}
              options={optionsData.workPreferences}
            />
          </div>
          <div style={{ flexGrow: 1, marginLeft: 20 }}>
            <MultiSelectFieldV2
              id="workLocations"
              label={formatMessage({
                defaultMessage: "Work Locations",
              })}
              options={optionsData.workLocations}
            />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }}>
            <SelectFieldV2
              id="education"
              label={formatMessage({
                defaultMessage: "Education",
              })}
              options={optionsData.education}
            />
          </div>
          <div style={{ flexGrow: 1, marginLeft: 20 }}>
            <SelectFieldV2
              id="durationPreference"
              label={formatMessage({
                defaultMessage: "Duration Preference",
              })}
              options={optionsData.durationPreferences}
            />
          </div>
          <div style={{ flexGrow: 1, marginLeft: 20 }}>
            <MultiSelectFieldV2
              id="availability"
              label={formatMessage({
                defaultMessage: "Availability",
              })}
              options={optionsData.availability}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <SelectFieldV2
              id="profileComplete"
              label={formatMessage({
                defaultMessage: "Profile Complete",
              })}
              options={optionsData.profileComplete}
            />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flexGrow: 1 }}>
            <MultiSelectFieldV2
              id="skillFilter"
              label={formatMessage({
                defaultMessage: "Skill Filter",
              })}
              options={optionsData.skillFilter}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <SelectFieldV2
              id="govEmployee"
              label={formatMessage({
                defaultMessage: "Government Employee",
              })}
              options={optionsData.govEmployee}
            />
          </div>
        </div>
      </BasicForm>
    </Dialog>
  );
};

export default SearchFilter;
