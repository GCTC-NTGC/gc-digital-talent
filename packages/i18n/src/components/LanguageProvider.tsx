import { IntlProvider } from "react-intl";
import { ReactNode, useMemo } from "react";

import defaultRichTextElements from "@gc-digital-talent/rich-text-elements";

import useLocale from "../hooks/useLocale";
import { Messages } from "../types";
import { combineMessages } from "../utils/utils";

interface LanguageProviderProps {
  messages: Messages;
  children: ReactNode;
}

const LanguageProvider = ({ messages, children }: LanguageProviderProps) => {
  // eslint-disable-next-line no-restricted-syntax
  const locale = useLocale();
  const compiledMessages = useMemo(() => combineMessages(locale, messages), []);

  return (
    <IntlProvider
      locale={locale}
      messages={compiledMessages}
      defaultRichTextElements={defaultRichTextElements}
    >
      {children}
    </IntlProvider>
  );
};

export default LanguageProvider;
