import { KeyboardEventHandler, ReactElement, ReactNode, useId } from "react";

import { ARROW_KEY, isArrowKey } from "../../utils/keyboard";
import {
  CardRepeaterProvider,
  CardRepeaterProviderProps,
  useCardRepeaterContext,
} from "./CardRepeaterProvider";
import { BaseItem } from "./types";
import { Add, Edit, Remove } from "./Button";
import Card, { CARD_CLASS_NAME, CardProps } from "./Card";
import List from "./List";

type RootProps<T extends BaseItem> = Omit<
  CardRepeaterProviderProps<T>,
  "children" | "id"
> & {
  children?: ReactElement<CardProps> | ReactElement<CardProps>[];
  add?: ReactNode;
};

const cardSelector = `.${CARD_CLASS_NAME}`;

const Root = <T extends BaseItem>({
  children,
  items,
  add,
  ...rest
}: RootProps<T>) => {
  const id = useId();

  const decrementFocus = (el: HTMLElement) => {
    let sibling = el.previousElementSibling;
    while (sibling) {
      if (sibling.matches(cardSelector)) {
        break;
      }
      sibling = sibling.previousElementSibling;
    }

    const previousCard = sibling ? document.getElementById(sibling.id) : false;
    if (previousCard) {
      previousCard.focus();
    }
  };

  const incrementFocus = (el: HTMLElement) => {
    let sibling = el.nextElementSibling;
    while (sibling) {
      if (sibling.matches(cardSelector)) {
        break;
      }
      sibling = sibling.nextElementSibling;
    }

    const nextCard = sibling ? document.getElementById(sibling.id) : false;
    if (nextCard) {
      nextCard.focus();
    }
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (isArrowKey(event.key)) {
      const target = event.target as HTMLElement;
      let targetItem: HTMLElement | null | undefined = target;
      if (!target.classList.contains(cardSelector)) {
        targetItem = target.closest<HTMLElement>(cardSelector);
      }
      if (targetItem) {
        switch (event.key) {
          case ARROW_KEY.DOWN:
            incrementFocus(targetItem);
            break;
          case ARROW_KEY.UP:
            decrementFocus(targetItem);
            break;
          default:
          // Not an arrow key
        }
      }
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <CardRepeaterProvider items={items} id={id} {...rest}>
      <List onKeyDown={handleKeyDown}>{children}</List>
      {add}
    </CardRepeaterProvider>
  );
};

export default {
  Root,
  Card,
  Add,
  Edit,
  Remove,
};

export { useCardRepeaterContext };
