import { useIntl } from "react-intl";
import { getLocale } from "@common/helpers/localize";

export default function useLocale() {
  const intl = useIntl();
  const locale = getLocale(intl);

  return locale;
}
