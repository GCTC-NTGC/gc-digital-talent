import { useId } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import { twMerge } from "tailwind-merge";

import {
  Button,
  Card,
  type ButtonProps,
  type CardProps,
} from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

const selectedSortStyle: ButtonProps = {
  mode: "inline",
  color: "black",
  className: "[&_*]:no-underline pointer-events-none",
} as const;

const unselectedSortStyle: ButtonProps = {
  mode: "inline",
  color: "black",
  className: "font-normal",
} as const;

interface ResultsBarProps extends CardProps {
  fetching: boolean;
  resultCount: number;
}

const ResultsBar = ({
  fetching,
  resultCount,
  className,
  ...rest
}: ResultsBarProps) => {
  const intl = useIntl();
  const sortByLabelId = useId();

  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "publishedAt";
  const setSortBy = (s: string) => {
    // already selected, avoid pushing a duplicate history entry
    if (s === sortBy) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sortBy", s);
      return next;
    });
  };

  return (
    <Card
      className={twMerge(
        "mb-1.5 flex flex-row flex-wrap items-center gap-x-6 gap-y-3",
        className,
      )}
      {...rest}
    >
      <div role="status" className="grow font-bold">
        {!fetching
          ? intl.formatMessage(
              {
                defaultMessage: `{resultCount, plural,
                        =0 {0 open opportunities}
                        one {# open opportunity}
                        other {# open opportunities}
                      }`,
                id: "Efy/VY",
                description: "Number of open job opportunities found",
              },
              {
                resultCount,
              },
            )
          : null}
      </div>
      <div
        role="group"
        aria-labelledby={sortByLabelId}
        className="flex flex-row flex-wrap items-center gap-3 whitespace-nowrap"
      >
        <span id={sortByLabelId} className="text-gray-500 dark:text-gray-200">
          {intl.formatMessage(formMessages.sortBy)}
          {intl.formatMessage(commonMessages.dividingColon)}
        </span>
        <Button
          aria-pressed={sortBy === "publishedAt"}
          onClick={() => setSortBy("publishedAt")}
          {...(sortBy === "publishedAt"
            ? selectedSortStyle
            : unselectedSortStyle)}
        >
          {intl.formatMessage({
            defaultMessage: "Date posted",
            id: "K7MAfs",
            description: "Button to sort by date posted",
          })}
        </Button>
        <span
          aria-hidden
          className="self-stretch border-l border-gray-300 dark:border-gray-500"
        />
        <Button
          aria-pressed={sortBy === "closeDate"}
          onClick={() => setSortBy("closeDate")}
          {...(sortBy === "closeDate"
            ? selectedSortStyle
            : unselectedSortStyle)}
        >
          {intl.formatMessage(commonMessages.deadline)}
        </Button>
      </div>
    </Card>
  );
};

export default ResultsBar;
