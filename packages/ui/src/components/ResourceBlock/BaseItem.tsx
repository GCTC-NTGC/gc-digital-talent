import { ReactNode } from "react";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import { tv } from "tailwind-variants";

const stateIcon = tv({
  base: "absolute top-5 right-5 size-5",
});

// an icon pinned to the top-right to show the completion state
const StateIcon = ({ state }: { state: BaseItemProps["state"] }) => {
  if (state === "incomplete") {
    return (
      <ExclamationCircleIcon
        className={stateIcon({ class: "text-error dark:text-error-300" })}
      />
    );
  }
  if (state === "complete") {
    return (
      <CheckCircleIcon
        className={stateIcon({
          class: "text-success-600 dark:text-success",
        })}
      />
    );
  }
  return null;
};

const baseItem = tv({
  base: "relative flex flex-col gap-1 p-6 not-last:border-b not-last:border-b-gray-300 sm:px-8 dark:not-last:border-b-gray-100",
});

export interface BaseItemProps {
  title: ReactNode;
  content: ReactNode;
  state?: "incomplete" | "complete";
}

const BaseItem = ({ title, content, state }: BaseItemProps) => (
  <div
    className={baseItem({
      class:
        state === "incomplete"
          ? // should match the absolute positioning of the center of the state icon (x0.75 + (x0.75/2))
            "bg-radial-[circle_7.5rem_at_top_1.6875rem_right_1.6875rem] from-error/10 to-transparent"
          : undefined,
    })}
    role="listitem"
  >
    <StateIcon state={state} />
    <div
      // icon extends margin + icons size: x0.75 + x0.75 = x1.5
      // item margin is base(x1) l-tablet(x1.5)
      className="pr-3"
    >
      {title}
    </div>
    {content}
  </div>
);

export default BaseItem;
