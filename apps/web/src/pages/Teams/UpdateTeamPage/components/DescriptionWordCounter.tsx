import React from "react";
import { useFormContext } from "react-hook-form";

import { WordCounter } from "@gc-digital-talent/forms";

export const TEXT_AREA_MAX_WORDS = 200;

interface DescriptionWordCounterProps {
  name: string;
}

const DescriptionWordCounter = ({ name }: DescriptionWordCounterProps) => {
  const { watch } = useFormContext();
  const value = watch(name);

  return (
    <div data-h2-margin="base(-x.5, 0, 0, 0)" data-h2-text-align="base(right)">
      <WordCounter text={value} wordLimit={TEXT_AREA_MAX_WORDS} />
    </div>
  );
};

export default DescriptionWordCounter;
