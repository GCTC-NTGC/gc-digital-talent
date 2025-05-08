import { useWatch } from "react-hook-form";

import WordCounter from "../WordCounter";
import { countNumberOfWordsAfterReplacingHTML } from "../../utils";

interface FooterProps {
  name: string;
  wordLimit?: number;
}

const Footer = ({ wordLimit, name }: FooterProps) => {
  const currentValue = useWatch<Record<string, string | undefined>>({ name });

  if (!wordLimit) return null;

  const wordCountForOverride = currentValue
    ? countNumberOfWordsAfterReplacingHTML(currentValue)
    : 0;

  return (
    <div data-h2-text-align="base(right)">
      <WordCounter
        name={name}
        wordLimit={wordLimit}
        currentCount={wordCountForOverride}
      />
    </div>
  );
};

export default Footer;
