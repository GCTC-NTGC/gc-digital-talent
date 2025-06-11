import { useIntl } from "react-intl";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";

const StepDisabledPage = ({ returnUrl }: { returnUrl: string | undefined }) => {
  const intl = useIntl();

  return (
    <>
      <Heading data-h2-margin-top="base(0)">
        {intl.formatMessage({
          id: "9vQj8o",
          defaultMessage: "Uh oh, it looks like you jumped ahead!",
          description: "Application step skipped page title",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          id: "EPF4Ac",
          defaultMessage:
            "The application process relies on collecting and reviewing information in a linear fashion. As a result, it’s not possible to complete this step just yet. The last step you were working on is highlighted in the steps area of the page, or you can use the button provided to go there directly.",
          description: "Application step skipped page details",
        })}
      </p>
      <Separator />
      {returnUrl ? (
        <Link href={returnUrl} color="secondary" mode="solid">
          {intl.formatMessage({
            id: "88dH+F",
            defaultMessage: "Return to the last step I was working on",
            description: "Button text to return back to the last step",
          })}
        </Link>
      ) : null}
    </>
  );
};

export default StepDisabledPage;
