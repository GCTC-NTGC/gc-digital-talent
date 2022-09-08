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
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import useFilterOptions from "./useFilterOptions";
import { ButtonIcon } from "../Table/tableComponents";
import { UserFilterInput } from "../../api/generated";
import {
  stringToEnumJobLooking,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "./util";

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
    <div data-h2-display="base(flex)" style={{ placeContent: "space-between" }}>
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
      color="ts-secondary"
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
        <div data-h2-flex-grid="base(flex-start, 0, x1, x.5)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
            <MultiSelectFieldV2
              id="pools"
              label={formatMessage({
                defaultMessage: "Pools",
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
              })}
              options={optionsData.languageAbility}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
            <MultiSelectFieldV2
              id="classifications"
              label={formatMessage({
                defaultMessage: "Classifications",
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
              })}
              options={optionsData.operationalRequirement}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
            <MultiSelectFieldV2
              id="workRegion"
              label={formatMessage({
                defaultMessage: "Work Locations",
              })}
              options={optionsData.workRegion}
            />
          </div>
          {enableEducationType && (
            <div data-h2-flex-item="base(1of1)">
              <MultiSelectFieldV2
                id="educationType"
                label={formatMessage({
                  defaultMessage: "Education",
                })}
                options={optionsData.educationType}
              />
            </div>
          )}
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
            <SelectFieldV2
              forceArrayFormValue
              id="employmentDuration"
              label={formatMessage({
                defaultMessage: "Duration Preferences",
              })}
              options={optionsData.employmentDuration}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
            <MultiSelectFieldV2
              id="jobLookingStatus"
              label={formatMessage({
                defaultMessage: "Availability",
              })}
              options={optionsData.jobLookingStatus}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
            <SelectFieldV2
              forceArrayFormValue
              id="profileComplete"
              label={formatMessage({
                defaultMessage: "Profile Complete",
              })}
              options={optionsData.profileComplete}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
            <MultiSelectFieldV2
              id="skills"
              label={formatMessage({
                defaultMessage: "Skill Filter",
              })}
              options={optionsData.skills}
              isLoading={rawGraphqlResults.skills.fetching}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(2of5)">
            <SelectFieldV2
              forceArrayFormValue
              id="govEmployee"
              label={formatMessage({
                defaultMessage: "Government Employee",
              })}
              options={optionsData.govEmployee}
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

export type UserTableFilterButtonProps = Pick<
  UserTableFilterDialogProps,
  "onSubmit" | "enableEducationType"
> & {
  isOpenDefault?: boolean;
  onFilterChange: React.Dispatch<
    React.SetStateAction<UserFilterInput | undefined>
  >;
};
const UserTableFilterButton = ({
  onSubmit,
  isOpenDefault = false,
  enableEducationType,
  onFilterChange,
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
    // this state lives in the UserTable component, this step also acts like a formValuesToSubmitData function
    onFilterChange({
      applicantFilter: {
        expectedClassifications: data.classifications.map((classification) => {
          const splitString = classification.toString().split("-");
          return { group: splitString[0], level: Number(splitString[1]) };
        }),
        languageAbility: data.languageAbility[0]
          ? stringToEnumLanguage(data.languageAbility[0].toString())
          : undefined,
        locationPreferences: data.workRegion.map((region) => {
          return stringToEnumLocation(region.toString());
        }),
        operationalRequirements: data.operationalRequirement.map(
          (requirement) => {
            return stringToEnumOperational(requirement.toString());
          },
        ),
        skills: data.skills.map((skill) => {
          const skillString = skill.toString();
          return { id: skillString };
        }),
        wouldAcceptTemporary: data.employmentDuration[0]
          ? data.employmentDuration[0].toString() === "TERM"
          : undefined,
      },
      isGovEmployee: data.govEmployee[0] ? true : undefined,
      isProfileComplete: data.profileComplete[0] ? true : undefined,
      jobLookingStatus: data.jobLookingStatus.map((status) => {
        return stringToEnumJobLooking(status.toString());
      }),
      poolFilters: data.pools.map((pool) => {
        const poolString = pool.toString();
        return { poolId: poolString };
      }),
    });
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
