import React, { useState } from "react";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";
import { useIntl } from "react-intl";
import { BasicForm } from "@common/components/form";
import SelectFieldV2 from "@common/components/form/Select/SelectFieldV2";
import MultiSelectFieldV2 from "@common/components/form/MultiSelect/MultiSelectFieldV2";
import "./UserTableFilterDialog.css";
import { useFormContext } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { Option } from "@common/components/form/Select/SelectFieldV2";
import { FilterIcon } from "@heroicons/react/outline";
import useFilterOptions from "./useFilterOptions";
import { ButtonIcon } from "../Table/tableComponents";

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
  const { formatMessage } = useIntl();
  const { reset } = useFormContext();
  const { emptyFormValues } = useFilterOptions(enableEducationType);
  const handleClear = () => {
    reset(emptyFormValues);
  };

  return (
    <div style={{ display: "flex", placeContent: "space-between" }}>
      <Button color="secondary" mode="outline" onClick={handleClear}>
        {formatMessage({
          description: "Clear button within the search filter dialog",
          defaultMessage: "Clear filters",
        })}
      </Button>
      <Button type="submit" color="cta">
        {formatMessage({
          description: "Submit button within the search filter dialog",
          defaultMessage: "Show results",
        })}
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
  <div
    data-h2-margin="b(left, s)"
    {...(grow && { style: { flexGrow: 1 } })}
    {...rest}
  />
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
      id="user-table-filter-dialog"
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
          <Item style={{ minWidth: 275 }}>
            <SelectFieldV2
              forceArrayFormValue
              id="languageAbility"
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
              id="operationalRequirement"
              label={formatMessage({
                defaultMessage: "Work Preferences",
              })}
              options={optionsData.operationalRequirement}
            />
          </Item>
          <Item grow>
            <MultiSelectFieldV2
              id="workRegion"
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
                id="educationType"
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
              id="employmentDuration"
              label={formatMessage({
                defaultMessage: "Duration Preferences",
              })}
              options={optionsData.employmentDuration}
            />
          </Item>
          <Item grow>
            <MultiSelectFieldV2
              id="jobLookingStatus"
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

export type UserTableFilterButtonProps = Pick<
  UserTableFilterDialogProps,
  "onSubmit" | "enableEducationType"
> & { isOpenDefault?: boolean };
const UserTableFilterButton = ({
  onSubmit,
  isOpenDefault = false,
  enableEducationType,
  ...rest
}: UserTableFilterButtonProps) => {
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
        mode="outline"
        color="black"
        type="button"
        data-h2-display="b(inline-flex)"
        data-h2-align-items="b(center)"
      >
        <ButtonIcon icon={FilterIcon} />
        <span>
          {formatMessage({
            defaultMessage: "Filters",
            description:
              "Text label for button to open filter dialog on admin tables.",
          })}
        </span>
      </Button>
      <UserTableFilterDialog
        {...{ isOpen, activeFilters, enableEducationType }}
        {...rest}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
      />
    </>
  );
};
UserTableFilterDialog.Button = UserTableFilterButton;
export default UserTableFilterDialog;
