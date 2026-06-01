import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

interface UseSelectedRowsReturn<T> {
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
  selectedRows: T[];
  hasSelected: boolean;
}

function useSelectedRows<T>(defaultSelected?: T[]): UseSelectedRowsReturn<T> {
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<T[]>(defaultSelected ?? []);

  useEffect(() => {
    if (selectedRows.length > 0 && !hasSelected) {
      setHasSelected(true);
    }
  }, [selectedRows, hasSelected]);

  return {
    selectedRows,
    setSelectedRows,
    hasSelected: hasSelected || selectedRows.length > 0,
  };
}

export default useSelectedRows;
