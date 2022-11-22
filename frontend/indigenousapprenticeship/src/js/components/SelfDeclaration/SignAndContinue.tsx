import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Input, Submit } from "@common/components/form";
import { FieldLabels } from "@common/components/form/BasicForm";
import errorMessages from "@common/messages/errorMessages";

interface SignAndContinueProps {
  labels: FieldLabels;
}

const SignAndContinue = ({ labels }: SignAndContinueProps) => {
  const intl = useIntl();
  const { watch } = useFormContext();

  const [isIndigenousValue, communitiesValue] = watch([
    "isIndigenous",
    "communities",
  ]);

  const isIndigenous = isIndigenousValue === "yes";
  const hasCommunities = communitiesValue && communitiesValue.length > 0;

  // Only show for Indigenous person
  if (!isIndigenous || !hasCommunities) {
    return null;
  }

  return (
    <div
      data-h2-max-width="bas(48rem)"
      data-h2-margin="base(x1, auto)"
      data-h2-text-align="base(center)"
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "By submitting your signature (typing your full name), you are contributing to an honest and safe space for Indigenous Peoples to access these opportunities.",
          id: "Dz9xib",
          description:
            "Disclaimer displayed before signing the Indigenous self-declaration form",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-align-items="base(center) p-tablet(flex-end)"
        data-h2-justify-content="base(center)"
        data-h2-gap="base(0, x.5) p-tablet(x.5, 0)"
      >
        <Input
          type="text"
          id="signature"
          name="signature"
          label={labels.signature}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <p data-h2-margin="base(x1, 0)">
          <Submit
            color="black"
            mode="outline"
            text={intl.formatMessage({
              defaultMessage: "Sign and continue",
              id: "7rSh+m",
              description:
                "Button text to submit the Indigenous self-declaration form.",
            })}
          />
        </p>
      </div>
    </div>
  );
};

export default SignAndContinue;
