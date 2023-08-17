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

  const rowSelectionCallback = (newRowSelection: RowSelectionState) => {
    if (rowSelect?.onRowSelection) {
      const selectedRows = Object.values(newRowSelection)
        .map((value, index) => {
          return value ? data[index] : undefined;
        })
        .filter(notEmpty);

      rowSelect.onRowSelection(selectedRows);
    }
  };

  const handleRowSelection = (
    setter: React.Dispatch<React.SetStateAction<RowSelectionState>>,
    updater: Updater<RowSelectionState>,
  ) => {
    if (updater instanceof Function) {
      setter((previous) => {
        const newRowSelection = updater(previous);
        rowSelectionCallback(newRowSelection);
        return newRowSelection;
      });
    } else {
      setter(updater);
    }
  };

  const setter = (updater: Updater<RowSelectionState>) =>
    handleRowSelection(setRowSelection, updater);

  return [rowSelection, setter];
};

export default useRowSelection;
