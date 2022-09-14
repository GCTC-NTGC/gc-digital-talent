import React, { ReactElement, useState } from "react";
import { useIntl } from "react-intl";
import { Button, Link } from "@common/components";
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { SubmitHandler } from "react-hook-form";
import Dialog from "@common/components/Dialog";
import { Fieldset } from "@common/components/inputPartials";
import SearchForm from "./SearchForm";
import { ButtonIcon, IndeterminateCheckbox } from "../Table/tableComponents";
import type {
  ColumnHiddenEvent,
  ColumnsOf,
  IdType,
  SearchColumn,
} from "./basicTableHelpers";
import UserTableFilterDialog from "../user/UserTableFilterDialog";
import type { FormValues } from "../user/UserTableFilterDialog";
import { UserFilterInput } from "../../api/generated";
import {
  stringToEnumJobLooking,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "../user/util";

export interface TableHeaderProps<T extends Record<string, unknown>> {
  onSearchChange: (
    val: string | undefined,
    col: SearchColumn["value"] | undefined,
  ) => void;
  columns: ColumnsOf<T>;
  searchBy?: Array<SearchColumn>;
  addBtn?: {
    path: string;
    label: string;
  };
  filter?: boolean;
  title?: string;
  onColumnHiddenChange?: (e: ColumnHiddenEvent<T>) => void;
  hiddenColumnIds: Array<IdType<T>>;
  onFilterChange: React.Dispatch<
    React.SetStateAction<UserFilterInput | undefined>
  >;
}

function TableHeader<T extends Record<string, unknown>>({
  onSearchChange,
  searchBy,
  columns,
  addBtn,
  filter = true,
  title,
  onColumnHiddenChange,
  hiddenColumnIds,
  onFilterChange,
}: TableHeaderProps<T>): ReactElement {
  const intl = useIntl();

  const [showList, setShowList] = useState(false);
  const handleFilterSubmit: SubmitHandler<FormValues> = (data) => {
    // this state lives in the UserTable component, this step also acts like a formValuesToSubmitData function
    onFilterChange({
      applicantFilter: {
        expectedClassifications: data.classifications.map((classification) => {
          const splitString = classification.split("-");
          return { group: splitString[0], level: Number(splitString[1]) };
        }),
        languageAbility: data.languageAbility[0]
          ? stringToEnumLanguage(data.languageAbility[0])
          : undefined,
        locationPreferences: data.workRegion.map((region) => {
          return stringToEnumLocation(region);
        }),
        operationalRequirements: data.operationalRequirement.map(
          (requirement) => {
            return stringToEnumOperational(requirement);
          },
        ),
        skills: data.skills.map((skill) => {
          const skillString = skill;
          return { id: skillString };
        }),
        wouldAcceptTemporary: data.employmentDuration[0]
          ? data.employmentDuration[0] === "TERM"
          : undefined,
      },
      isGovEmployee: data.govEmployee[0] ? true : undefined,
      isProfileComplete: data.profileComplete[0] ? true : undefined,
      jobLookingStatus: data.jobLookingStatus.map((status) => {
        return stringToEnumJobLooking(status);
      }),
      poolFilters: data.pools.map((pool) => {
        const poolString = pool;
        return { poolId: poolString };
      }),
    });
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {filter && (
        <div data-h2-margin="base(x2, 0, x.5, 0)">
          <p>{title && <span data-h2-font-weight="base(700)">{title}</span>}</p>
          <div data-h2-flex-grid="base(center, x1)">
            <div data-h2-flex-item="base(1of1) l-tablet(fill)">
              <div data-h2-flex-grid="base(center, x.5)">
                <div data-h2-flex-item="base(content)">
                  <SearchForm onChange={onSearchChange} searchBy={searchBy} />
                </div>
                <div data-h2-flex-item="base(content)">
                  <UserTableFilterDialog.Button onSubmit={handleFilterSubmit} />
                </div>
                <div data-h2-flex-item="base(content)">
                  <div data-h2-position="base(relative)">
                    <Button
                      mode="solid"
                      color="secondary"
                      type="button"
                      data-h2-display="base(inline-flex)"
                      data-h2-align-items="base(center)"
                      onClick={() => setShowList(!showList)}
                    >
                      <ButtonIcon icon={TableCellsIcon} />
                      <span>
                        {intl.formatMessage({
                          defaultMessage: "Columns",
                          id: "xcBl1q",
                          description:
                            "Label displayed on the Table Columns toggle button.",
                        })}
                      </span>
                    </Button>
                    <Dialog
                      color="ts-primary"
                      isOpen={showList}
                      onDismiss={() => setShowList(false)}
                      title={intl.formatMessage({
                        defaultMessage: "Table columns",
                        id: "YH6bFU",
                        description:
                          "Dialog title for the admin tables columns toggle.",
                      })}
                    >
                      <Fieldset
                        legend={intl.formatMessage({
                          defaultMessage: "Visible columns",
                          id: "H9rxOR",
                          description:
                            "Legend for the column toggle in admin tables.",
                        })}
                      >
                        <div data-h2-margin="base(x.125, 0)">
                          <IndeterminateCheckbox
                            checked={hiddenColumnIds.length === 0}
                            indeterminate={
                              hiddenColumnIds.length > 0 &&
                              hiddenColumnIds.length < columns.length
                            }
                            onChange={() => {
                              if (onColumnHiddenChange) {
                                onColumnHiddenChange({
                                  setHidden: hiddenColumnIds.length === 0,
                                });
                              }
                            }}
                          />
                        </div>
                        {columns.map((column) => (
                          <div key={column.id} data-h2-margin="base(x.125, 0)">
                            <label htmlFor={column.id}>
                              <input
                                id={column.id}
                                type="checkbox"
                                checked={!hiddenColumnIds.includes(column.id)}
                                onChange={() => {
                                  if (onColumnHiddenChange) {
                                    onColumnHiddenChange({
                                      columnId: column.id,
                                      setHidden: !hiddenColumnIds.includes(
                                        column.id,
                                      ),
                                    });
                                  }
                                }}
                              />{" "}
                              {column.label}
                            </label>
                          </div>
                        ))}
                      </Fieldset>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
            <div data-h2-flex-item="base(1of1) l-tablet(content)">
              {addBtn && (
                <Link
                  mode="solid"
                  color="primary"
                  type="button"
                  data-h2-display="base(inline-flex)"
                  data-h2-align-items="base(center)"
                  style={{ textDecoration: "none" }}
                  href={addBtn.path}
                >
                  <ButtonIcon icon={PlusIcon} />
                  <span>{addBtn.label}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TableHeader;
