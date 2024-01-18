import React from "react";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { useIntl } from "react-intl";

import { formMessages } from "@gc-digital-talent/i18n";

import {
  CardRepeaterProvider,
  CardRepeaterProviderProps,
  useCardRepeaterContext,
} from "./CardRepeaterProvider";
import { BaseItem } from "./types";
import Button from "../Button";
import ActionButton from "./ActionButton";

const AddButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => {
  const intl = useIntl();
  const { max, total } = useCardRepeaterContext();
  const reachedMax = total === max;

  return (
    <Button
      ref={forwardedRef}
      icon={PlusCircleIcon}
      type="button"
      mode="placeholder"
      block
      color="secondary"
      {...rest}
    >
      {reachedMax ? (
        <>{intl.formatMessage(formMessages.repeaterDeleteItem)}</>
      ) : (
        children || intl.formatMessage(formMessages.repeaterAddItem)
      )}{" "}
      {max && `(${total}/${max})`}
    </Button>
  );
});

const EditButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, ...rest }, forwardedRef) => (
  <ActionButton ref={forwardedRef} icon={PencilSquareIcon} {...rest}>
    {children}
  </ActionButton>
));

type CardProps = {
  index: number;
  children: React.ReactNode;
  edit?: React.ReactNode;
};

const Card = ({ index, edit, children }: CardProps) => {
  const { move, remove, total, items } = useCardRepeaterContext();
  const item = items?.[index];
  if (!item) return null;

  const up = () => {
    const to = index - 1;
    move(index, to < 0 ? 0 : to);
  };

  const down = () => {
    const to = index + 1;
    move(index, to > total ? total : to);
  };

  return (
    <div>
      {index + 1}
      <button type="button" disabled={index === 0} onClick={up}>
        Up
      </button>
      <button
        type="button"
        disabled={total <= 1 || index >= total - 1}
        onClick={down}
      >
        Down
      </button>
      <button type="button" onClick={() => remove(index)}>
        Remove
      </button>
      {edit}
      {children}
    </div>
  );
};

type RootProps<T extends BaseItem> = CardRepeaterProviderProps<T>;

const Root = <T extends BaseItem>({
  children,
  items,
  ...rest
}: RootProps<T>) => (
  <CardRepeaterProvider items={items} {...rest}>
    {children}
  </CardRepeaterProvider>
);

export default {
  Root,
  Card,
  Add: AddButton,
  Edit: EditButton,
};
