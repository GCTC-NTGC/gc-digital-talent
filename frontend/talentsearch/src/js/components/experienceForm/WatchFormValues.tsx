import React, { useEffect } from "react";
import { useWatch } from "react-hook-form";
import type { ExperienceDetailsDefaultValues } from "./types";

interface WatchFormValuesProps {
  onUpdateValues: (values: ExperienceDetailsDefaultValues) => void;
}

const WatchFormValues: React.FC<WatchFormValuesProps> = ({
  onUpdateValues,
}) => {
  const watchedValues = useWatch();

  useEffect(() => {
    onUpdateValues(watchedValues as ExperienceDetailsDefaultValues);
  }, [watchedValues, onUpdateValues]);

  return null;
};

export default WatchFormValues;
