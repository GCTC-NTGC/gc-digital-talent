import { IntlProvider } from "react-intl";

export type Locales = "en" | "fr";

export type Messages = React.ComponentProps<typeof IntlProvider>["messages"];
