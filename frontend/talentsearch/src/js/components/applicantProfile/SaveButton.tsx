import { Submit } from "@common/components/form";
import { SaveIcon } from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";

const SaveButton: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Submit
      color="cta"
      mode="solid"
      data-h2-display="b(flex)"
      data-h2-align-items="b(center)"
      text={
        <>
          <SaveIcon style={{ width: "1rem" }} />
          <span data-h2-margin="b(auto, auto, auto, x.125)">
            {intl.formatMessage({
              defaultMessage: "Save and go back",
              description: "Text for save button on profile form.",
            })}
          </span>
        </>
      }
      isSubmittingText={
        <>
          <SaveIcon style={{ width: "1rem" }} />
          <span data-h2-margin="b(auto, auto, auto, x.125)">
            {intl.formatMessage({
              defaultMessage: "Saving...",
              description: "Submitting text for save button on profile form.",
            })}
          </span>
        </>
      }
      submittedText={
        <>
          <SaveIcon style={{ width: "1rem" }} />
          <span data-h2-margin="b(auto, auto, auto, x.125)">
            {intl.formatMessage({
              defaultMessage: "Saved",
              description: "Submitted text for save button on profile form.",
            })}
          </span>
        </>
      }
    />
  );
};

export default SaveButton;
