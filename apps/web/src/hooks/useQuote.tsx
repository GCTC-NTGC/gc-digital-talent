import React from "react";
import { useIntl } from "react-intl";
import { getITAbbrHtml } from "~/../../../frontend/common/src/helpers/nameUtils";

export interface Quote {
  content: React.ReactNode | string;
  author: React.ReactNode | string;
}

const useQuote = (): Quote => {
  const intl = useIntl();

  const quotes: Quote[] = [
    {
      author: intl.formatMessage(
        {
          defaultMessage: "Government of Canada {ITAbbr} Apprentice",
          id: "zgvZdl",
          description: "author of testimonial number one",
        },
        { ITAbbr: getITAbbrHtml(intl) },
      ),
      content: intl.formatMessage(
        {
          defaultMessage:
            "This program has been a life-changing opportunity for me and I see a <b>greater future ahead</b>.",
          id: "404R1N",
          description: "testimonial number one",
        },
        {
          b: (chunks: React.ReactNode) => (
            <span style={{ color: "#FFDCA7" }}>{chunks}</span>
          ),
        },
      ),
    },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default useQuote;
