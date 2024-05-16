import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface UseSelectedRowsReturn<T> {
  setSelectedRows: Dispatch<SetStateAction<T[]>>;
  selectedRows: T[];
  hasSelected: boolean;
}

function useSelectedRows<T>(defaultSelected?: T[]): UseSelectedRowsReturn<T> {
  const hasSelected = useRef<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<T[]>(defaultSelected ?? []);

  useEffect(() => {
    if (selectedRows.length > 0 && !hasSelected.current) {
      hasSelected.current = true;
    }
  }, [selectedRows]);

  let pause = !hasSelected.current;
  if (selectedRows.length > 0) {
    pause = false;
  }

  return {
    selectedRows,
    setSelectedRows,
    hasSelected: !pause,
  };
}

export default useSelectedRows;
