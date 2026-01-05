import { useEffect } from "react";
import { useNavigate } from "react-router";

import { getDesiredLocale } from "@gc-digital-talent/i18n";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const locale = getDesiredLocale() || "en";
    void navigate(`/${locale}`, { replace: true });
  }, [navigate]);

  return null;
}
