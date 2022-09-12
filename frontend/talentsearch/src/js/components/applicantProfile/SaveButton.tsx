import { Submit } from "@common/components/form";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import * as React from "react";
import { useIntl } from "react-intl";

const SaveButton: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Submit
      color="cta"
      mode="solid"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      text={
        <>
          <ArrowDownOnSquareIcon style={{ width: "1rem" }} />
          <span data-h2-margin="base(auto, auto, auto, x.125)">
            {intl.formatMessage({
              defaultMessage: "Save and go back",
              id: "CuHYqt",
              description: "Text for save button on profile form.",
            })}
          </span>
        </>
      }
      isSubmittingText={
        <>
          <ArrowDownOnSquareIcon style={{ width: "1rem" }} />
          <span data-h2-margin="base(auto, auto, auto, x.125)">
            {intl.formatMessage({
              defaultMessage: "Saving...",
              id: "lai6E5",
              description: "Submitting text for save button on profile form.",
            })}
          </span>
        </>
      }
      submittedText={
        <>
          <ArrowDownOnSquareIcon style={{ width: "1rem" }} />
          <span data-h2-margin="base(auto, auto, auto, x.125)">
            {intl.formatMessage({
              defaultMessage: "Saved",
              id: "TV4UWm",
              description: "Submitted text for save button on profile form.",
            })}
          </span>
        </>
      }
    />
  );
};

export default SaveButton;
