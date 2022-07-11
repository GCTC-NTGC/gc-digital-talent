import React from "react";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";
import { FormattedMessage, useIntl } from "react-intl";
import { BasicForm } from "@common/components/form";
import SelectFieldV2 from "@common/components/form/Select/SelectFieldV2";
import MultiSelectFieldV2 from "@common/components/form/MultiSelect/MultiSelectFieldV2";
import "./UserTableFilterDialog.css";
import { useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { Option } from "@common/components/form/Select/SelectFieldV2";
import useFilterOptions from "./useFilterOptions";

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
  jobLookingStatus: Option["value"][];
  skills: Option["value"][];
  profileComplete: Option["value"][];
  govEmployee: Option["value"][];
};

type FooterProps = Pick<UserTableFilterDialogProps, "enableEducationType">;
const Footer = ({ enableEducationType }: FooterProps): JSX.Element => {
  const { reset } = useFormContext();
  const { emptyFormValues } = useFilterOptions(enableEducationType);
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

type RowProps = React.HTMLAttributes<HTMLDivElement>;
const Row = (props: RowProps) => (
  <div className="search-filter__row" {...props} />
);

type ItemProps = React.HTMLAttributes<HTMLDivElement> & { grow?: boolean };
const Item = ({ grow = false, ...rest }: ItemProps) => (
  <div data-h2-margin="b(left, s)" {...rest} {...(grow && { flexGrow: 1 })} />
);

interface UserTableFilterDialogProps {
  isOpen: boolean;
  onDismiss: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onSubmit: SubmitHandler<FormValues>;
  activeFilters: FormValues;
  enableEducationType?: boolean;
}

const UserTableFilterDialog = ({
  isOpen,
  onDismiss,
  onSubmit,
  activeFilters,
  enableEducationType = false,
}: UserTableFilterDialogProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { optionsData, rawGraphqlResults } =
    useFilterOptions(enableEducationType);

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
          <Item grow>
            <MultiSelectFieldV2
              id="pools"
              label={formatMessage({
                defaultMessage: "Pools",
              })}
              options={optionsData.pools}
              isLoading={rawGraphqlResults.pools.fetching}
            />
          </Item>
          <Item>
            <SelectFieldV2
              forceArrayFormValue
              id="languages"
              label={formatMessage({
                defaultMessage: "Languages",
              })}
              options={optionsData.languageAbility}
            />
          </Item>
        </Row>
        <Row>
          <Item grow>
            <MultiSelectFieldV2
              id="classifications"
              label={formatMessage({
                defaultMessage: "Classifications",
              })}
              options={optionsData.classifications}
              isLoading={rawGraphqlResults.classifications.fetching}
            />
          </Item>
          <Item grow>
            <MultiSelectFieldV2
              id="workPreferences"
              label={formatMessage({
                defaultMessage: "Work Preferences",
              })}
              options={optionsData.operationalRequirement}
            />
          </Item>
          <Item grow>
            <MultiSelectFieldV2
              id="workLocations"
              label={formatMessage({
                defaultMessage: "Work Locations",
              })}
              options={optionsData.workRegion}
            />
          </Item>
        </Row>
        <Row>
          {enableEducationType && (
            <Item grow>
              <MultiSelectFieldV2
                id="educationTypes"
                label={formatMessage({
                  defaultMessage: "Education",
                })}
                options={optionsData.educationType}
              />
            </Item>
          )}
          <Item>
            <SelectFieldV2
              forceArrayFormValue
              id="durationPreferences"
              label={formatMessage({
                defaultMessage: "Duration Preferences",
              })}
              options={optionsData.employmentDuration}
            />
          </Item>
          <Item grow>
            <MultiSelectFieldV2
              id="availability"
              label={formatMessage({
                defaultMessage: "Availability",
              })}
              options={optionsData.jobLookingStatus}
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
          <Item grow>
            <MultiSelectFieldV2
              id="skills"
              label={formatMessage({
                defaultMessage: "Skill Filter",
              })}
              options={optionsData.skills}
              isLoading={rawGraphqlResults.skills.fetching}
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
          <Footer />
        </Dialog.Footer>
      </BasicForm>
    </Dialog>
  );
};

export default UserTableFilterDialog;
