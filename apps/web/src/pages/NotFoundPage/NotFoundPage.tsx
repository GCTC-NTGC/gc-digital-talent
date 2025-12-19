import { useEffect } from "react";
import { useNavigate } from "react-router";

import { NotFoundError } from "@gc-digital-talent/helpers";

export default function CatchAll() {
  const navigate = useNavigate();

  useEffect(() => {
    throw new NotFoundError();
  }, [navigate]);

  return null;
}
