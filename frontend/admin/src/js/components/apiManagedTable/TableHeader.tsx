import { Button, Link } from "@common/components";
import Dialog from "@common/components/Dialog";
import { Fieldset } from "@common/components/inputPartials";
import React, { ReactElement, useState } from "react";
import { useIntl } from "react-intl";
import { FilterIcon, PlusIcon, TableIcon } from "@heroicons/react/outline";
import SearchForm, { SearchColumn } from "../Table/SearchForm";
import {
  ButtonIcon,
  IndeterminateCheckbox,
  Spacer,
} from "../Table/tableComponents";
import { ColumnHiddenEvent, ColumnsOf, IdType } from "./basicTableHelpers";

export interface TableHeaderProps<T extends Record<string, unknown>> {
  onSearchChange: (s: string) => void;
  onSearchSubmit: () => void;
  columns: ColumnsOf<T>;
  searchBy?: SearchColumn[];
  addBtn?: {
    path: string;
    label: string;
  };
  filter?: boolean;
  title?: string;
  onColumnHiddenChange?: (e: ColumnHiddenEvent<T>) => void;
  hiddenColumnIds: Array<IdType<T>>;
}

function TableHeader<T extends Record<string, unknown>>({
  onSearchChange,
  onSearchSubmit,
  columns,
  searchBy,
  addBtn,
  filter = true,
  title,
  onColumnHiddenChange,
  hiddenColumnIds,
}: TableHeaderProps<T>): ReactElement {
  const intl = useIntl();

  const [showList, setShowList] = useState(false);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {filter && (
        <div
          data-h2-align-items="b(center)"
          data-h2-display="b(flex)"
          data-h2-bg-color="b(lightgray)"
          data-h2-justify-content="b(space-between)"
          data-h2-radius="b(s, s, none, none)"
          data-h2-padding="b(all, s)"
        >
          <div style={{ flexShrink: 0 }}>
            {title && <span data-h2-font-weight="b(800)">{title}</span>}
          </div>
          <div
            style={{ flexShrink: 0 }}
            data-h2-display="b(flex)"
            data-h2-justify-content="b(flex-end)"
          >
            <SearchForm
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
              searchBy={searchBy}
            />
            <Spacer>
              <Button
                mode="outline"
                color="black"
                type="button"
                data-h2-display="b(inline-flex)"
                data-h2-align-items="b(center)"
              >
                <ButtonIcon icon={FilterIcon} />
                <span>
                  {intl.formatMessage({
                    defaultMessage: "Filters",
                    description:
                      "Text label for button to open filter dialog on admin tables.",
                  })}
                </span>
              </Button>
            </Spacer>
            <Spacer>
              <div data-h2-position="b(relative)">
                <Button
                  mode="outline"
                  color="black"
                  type="button"
                  data-h2-display="b(inline-flex)"
                  data-h2-align-items="b(center)"
                  onClick={() => setShowList(!showList)}
                >
                  <ButtonIcon icon={TableIcon} />
                  <span>
                    {intl.formatMessage({
                      defaultMessage: "Columns",
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
                    description:
                      "Dialog title for the admin tables columns toggle.",
                  })}
                >
                  <Fieldset
                    legend={intl.formatMessage({
                      defaultMessage: "Visible columns",
                      description:
                        "Legend for the column toggle in admin tables.",
                    })}
                  >
                    <div data-h2-margin="b(top-bottom, xxs)">
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
                      <div key={column.id} data-h2-margin="b(top-bottom, xxs)">
                        <label htmlFor={column.label}>
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
            </Spacer>
            {addBtn && (
              <Spacer>
                <Link
                  mode="outline"
                  color="black"
                  type="button"
                  data-h2-display="b(inline-flex)"
                  data-h2-align-items="b(center)"
                  style={{ textDecoration: "none" }}
                  href={addBtn.path}
                >
                  <ButtonIcon icon={PlusIcon} />
                  <span>{addBtn.label}</span>
                </Link>
              </Spacer>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TableHeader;
