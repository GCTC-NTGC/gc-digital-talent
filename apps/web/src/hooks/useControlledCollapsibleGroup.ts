import { useState } from "react";

const useControlledCollapsibleGroup = (ids: string[]) => {
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

  const toggleAllExpanded = () => {
    if (hasExpanded) {
      setExpandedItems([]);
    } else {
      setExpandedItems(ids);
    }
  };

  return { hasExpanded, toggleExpandedItem, toggleAllExpanded, isExpanded };
};

export default useControlledCollapsibleGroup;
