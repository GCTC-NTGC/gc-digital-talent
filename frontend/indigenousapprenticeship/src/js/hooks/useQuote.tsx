import React from "react";
import { useIntl } from "react-intl";

export interface Quote {
  content: React.ReactNode | string;
  author: string;
}

const useQuote = (): Quote => {
  const intl = useIntl();

  const quotes: Quote[] = [
    {
      author: intl.formatMessage({
        defaultMessage: "Government of Canada IT Apprentice",
        description: "author of testimonial number one",
      }),
      content: intl.formatMessage(
        {
          defaultMessage:
            "This program has been a life-changing opportunity for me and I see a <b>greater future ahead</b>.",
          description: "testimonial number one",
        },
        {
          b: (...chunks) => <span style={{ color: "#FFDCA7" }}>{chunks}</span>,
        },
      ),
    },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default useQuote;
