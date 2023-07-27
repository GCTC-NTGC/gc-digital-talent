import { useContext } from "react";

import { LocaleContext, LocaleState } from "../components/LocaleProvider";

export default function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);

  return ctx;
}
