import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Button } from "@gc-digital-talent/ui";

import experienceMessages from "~/messages/experienceMessages";

export type SortValue = "type" | "timeline";

const selectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "[&_*]:no-underline pointer-events-none",
};

const unselectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "font-normal text-gray-500",
};

interface ExperienceListSortSelectorProps {
  sortBy: SortValue;
  setSortBy: (sortValue: SortValue) => void;
}

const ExperienceListSortSelector = ({
  sortBy,
  setSortBy,
}: ExperienceListSortSelectorProps) => {
  const intl = useIntl();

  return (
    <fieldset className="mt-6 mb-1.5 flex items-center gap-3">
      <legend
        id="sortFilter"
        className="float-left text-gray-500 dark:text-gray-200"
      >
        {intl.formatMessage(formMessages.sortBy)}
        {intl.formatMessage(commonMessages.dividingColon)}
      </legend>
      <Button
        onClick={() => setSortBy("type")}
        aria-pressed={sortBy === "type"}
        {...(sortBy === "type" ? selectedFilterStyle : unselectedFilterStyle)}
      >
        {intl.formatMessage(experienceMessages.type)}
      </Button>
      <Button
        onClick={() => setSortBy("timeline")}
        aria-pressed={sortBy === "timeline"}
        {...(sortBy === "timeline"
          ? selectedFilterStyle
          : unselectedFilterStyle)}
      >
        {intl.formatMessage({
          defaultMessage: "Timeline",
          id: "V+cJvn",
          description: "Button to filter experiences by timeline",
        })}
      </Button>
    </fieldset>
  );
};

export default ExperienceListSortSelector;
