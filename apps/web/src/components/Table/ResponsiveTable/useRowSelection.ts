import React from "react";
import { Updater, RowSelectionState, OnChangeFn } from "@tanstack/react-table";

import { notEmpty } from "@gc-digital-talent/helpers";

import { RowSelectDef } from "./types";

type UseRowSelectionReturn = [
  value: RowSelectionState,
  setter: OnChangeFn<RowSelectionState>,
];

const useRowSelection = <T>(
  data: T[],
  rowSelect?: RowSelectDef<T>,
): UseRowSelectionReturn => {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const rowSelectionCallback = React.useCallback(
    (newRowSelection: RowSelectionState) => {
      if (rowSelect?.onRowSelection) {
        const selectedRows = Object.values(newRowSelection)
          .map((value, index) => {
            return value ? data[index] : undefined;
          })
          .filter(notEmpty);

        rowSelect.onRowSelection(selectedRows);
      }
    },
    [rowSelect?.onRowSelection],
  );

  const handleRowSelection = (
    setter: React.Dispatch<React.SetStateAction<RowSelectionState>>,
    updater: Updater<RowSelectionState>,
  ) => {
    if (updater instanceof Function) {
      setter((previous) => {
        return updater(previous);
      });
    } else {
      setter(updater);
    }
  };

  const setter = (updater: Updater<RowSelectionState>) =>
    handleRowSelection(setRowSelection, updater);

  React.useEffect(() => {
    rowSelectionCallback(rowSelection);
  }, [rowSelection]);

  return [rowSelection, setter];
};

export default useRowSelection;
