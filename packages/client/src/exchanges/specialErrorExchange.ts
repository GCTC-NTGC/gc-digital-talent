import { pipe, tap } from "wonka";
import type { Exchange } from "@urql/core";
import { IntlShape } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

// A custom exchange that watches for special errors that are meaningful to us and need special handling.
const specialErrorExchange = ({ intl }: { intl: IntlShape }) => {
  const exchange: Exchange =
    ({ forward }) =>
    (ops$) =>
      pipe(
        ops$,
        // eslint-disable-next-line no-console
        // tap((op) => console.log("[Exchange debug]: Incoming operation: ", op)),
        forward,
        tap((result) => {
          if (
            // NOTE: Comes from the library
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            result?.error?.response?.status === 403 &&
            result?.error?.networkError?.message?.includes("Request Rejected")
          ) {
            toast.error(intl.formatMessage(errorMessages.requestRejected));
          }
        }),
      );

  return exchange;
};

export default specialErrorExchange;
