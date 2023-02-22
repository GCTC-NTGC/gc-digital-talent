import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";

import { Button, Link, Dialog } from "@gc-digital-talent/ui";
import { Fieldset } from "@gc-digital-talent/forms";

import SearchForm from "./SearchForm";
import {
  ButtonIcon,
  IndeterminateCheckbox,
} from "../ClientManagedTable/tableComponents";
import type {
  ColumnHiddenEvent,
  ColumnsOf,
  IdType,
  SearchColumn,
  SearchState,
} from "./helpers";

export interface TableHeaderProps<T extends Record<string, unknown>> {
  onSearchChange: (
    val: string | undefined,
    col: SearchColumn["value"] | undefined,
  ) => void;
  columns: ColumnsOf<T>;
  initialSearchState?: SearchState;
  searchBy?: Array<SearchColumn>;
  addBtn?: {
    path: string;
    label: string;
  };
  filter?: boolean;
  title?: string;
  onColumnHiddenChange?: (e: ColumnHiddenEvent<T>) => void;
  hiddenColumnIds: Array<IdType<T>>;
  filterComponent: React.ReactNode;
}

function TableHeader<T extends Record<string, unknown>>({
  onSearchChange,
  searchBy,
  initialSearchState,
  columns,
  addBtn,
  filter = true,
  title,
  onColumnHiddenChange,
  hiddenColumnIds,
  filterComponent,
}: TableHeaderProps<T>): ReactElement {
  const intl = useIntl();
  const methods = useForm();

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
                  <SearchForm
                    onChange={onSearchChange}
                    searchBy={searchBy}
                    initialData={initialSearchState}
                  />
                </div>
                <div data-h2-flex-item="base(content)">{filterComponent}</div>
                <div data-h2-flex-item="base(content)">
                  <div data-h2-position="base(relative)">
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          mode="solid"
                          color="secondary"
                          type="button"
                          data-h2-display="base(inline-flex)"
                          data-h2-align-items="base(center)"
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
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>
                          {intl.formatMessage({
                            defaultMessage: "Table columns",
                            id: "YH6bFU",
                            description:
                              "Dialog title for the admin tables columns toggle.",
                          })}
                        </Dialog.Header>
                        <Dialog.Body>
                          <FormProvider {...methods}>
                            <Fieldset
                              name="visibleColumns"
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
                                <div
                                  key={column.id}
                                  data-h2-margin="base(x.125, 0)"
                                >
                                  <label htmlFor={column.id}>
                                    <input
                                      id={column.id}
                                      type="checkbox"
                                      checked={
                                        !hiddenColumnIds.includes(column.id)
                                      }
                                      onChange={() => {
                                        if (onColumnHiddenChange) {
                                          onColumnHiddenChange({
                                            columnId: column.id,
                                            setHidden:
                                              !hiddenColumnIds.includes(
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
                          </FormProvider>
                        </Dialog.Body>
                      </Dialog.Content>
                    </Dialog.Root>
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
