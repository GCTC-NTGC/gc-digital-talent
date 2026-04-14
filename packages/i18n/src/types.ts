import type { ComponentProps } from "react";
import type { IntlProvider } from "react-intl";

export type Locales = "en" | "fr";

export type Messages = ComponentProps<typeof IntlProvider>["messages"];
