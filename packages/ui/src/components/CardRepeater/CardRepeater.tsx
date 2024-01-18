import React from "react";

import {
  CardRepeaterProvider,
  CardRepeaterProviderProps,
} from "./CardRepeaterProvider";
import { BaseItem } from "./types";
import { Add, Edit } from "./Button";
import Card from "./Card";

type RootProps<T extends BaseItem> = CardRepeaterProviderProps<T>;

const Root = <T extends BaseItem>({
  children,
  items,
  ...rest
}: RootProps<T>) => (
  <CardRepeaterProvider items={items} {...rest}>
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5)"
    >
      {children}
    </div>
  </CardRepeaterProvider>
);

export default {
  Root,
  Card,
  Add,
  Edit,
};
