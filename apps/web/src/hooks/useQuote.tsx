import { ReactNode } from "react";
import { useIntl } from "react-intl";

export interface Quote {
  content: ReactNode | string;
  author: string | ReactNode;
}

const useQuote = (): Quote => {
  const intl = useIntl();

  const quotes: Quote[] = [
    {
      author: intl.formatMessage({
        defaultMessage: "Government of Canada IT Apprentice",
        id: "49UIne",
        description: "author of testimonial number one",
      }),
      content: intl.formatMessage(
        {
          defaultMessage:
            "This program has been a life-changing opportunity for me and I see a <b>greater future ahead</b>.",
          id: "404R1N",
          description: "testimonial number one",
        },
        {
          b: (chunks: ReactNode) => (
            <span style={{ color: "#FFDCA7" }}>{chunks}</span>
          ),
        },
      ),
    },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default useQuote;
