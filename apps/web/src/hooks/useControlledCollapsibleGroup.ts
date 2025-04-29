import { useState } from "react";

const useControlledCollapsibleGroup = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const hasExpanded = expandedItems.length > 0;

  const isExpanded = (id: string) => expandedItems.includes(id);

  const toggleExpandedItem = (id: string) => {
    setExpandedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const toggleAllExpanded = (allIds: string[]) => {
    if (hasExpanded) {
      setExpandedItems([]);
    } else {
      setExpandedItems(allIds);
    }
  };

  return {
    hasExpanded,
    toggleExpandedItem,
    toggleAllExpanded,
    isExpanded,
    expandedItems,
    setExpandedItems,
  };
};

export default useControlledCollapsibleGroup;
