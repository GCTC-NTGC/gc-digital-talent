import React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import { InputError } from "@gc-digital-talent/forms";

const CommunityError = () => {
  const {
    formState: { errors },
  } = useFormContext();

  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, "communities")?.message as FieldError;

  return error ? (
    <div data-h2-display="base(block)" data-h2-margin="base(x.125, 0, 0, 0)">
      <InputError isVisible={!!error} error={error} />
    </div>
  ) : null;
};

export default CommunityError;
