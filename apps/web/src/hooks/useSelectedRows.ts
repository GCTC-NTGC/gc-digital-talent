import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

interface UseSelectedRowsReturn<T> {
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
  selectedRows: T[];
  hasSelected: boolean;
}

function useSelectedRows<T>(defaultSelected?: T[]): UseSelectedRowsReturn<T> {
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<T[]>(defaultSelected ?? []);

  if (selectedRows.length > 0 && !hasSelected) {
    setHasSelected(true);
  }

  return {
    selectedRows,
    setSelectedRows,
    hasSelected,
  };
}

export default useSelectedRows;
