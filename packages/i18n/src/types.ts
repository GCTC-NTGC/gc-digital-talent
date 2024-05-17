import { ComponentProps } from "react";
import { IntlProvider } from "react-intl";

export type Locales = "en" | "fr";

export type Messages = ComponentProps<typeof IntlProvider>["messages"];
