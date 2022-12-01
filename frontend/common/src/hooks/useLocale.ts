import { useContext } from "react";
import { LocaleContext } from "../components/context/LocaleProvider";

export default function useLocale() {
  const ctx = useContext(LocaleContext);

  return ctx;
}
