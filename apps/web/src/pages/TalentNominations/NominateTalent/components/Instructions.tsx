import { useIntl } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import { ReactNode } from "react";

import { TalentNominationStep } from "@gc-digital-talent/graphql";
import { Link } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import { BaseFormValues } from "../types";
import useCurrentStep from "../useCurrentStep";
import SubHeading from "./SubHeading";
import UpdateForm from "./UpdateForm";

const Instructions = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { current } = useCurrentStep();

  if (current !== TalentNominationStep.Instructions) {
    return null;
  }

  return (
    <UpdateForm<BaseFormValues>>
      <SubHeading Icon={ClipboardDocumentIcon}>
        {intl.formatMessage({
          defaultMessage: "Instructions",
          id: "fhbTHo",
          description: "Heading for instructions step of a talent nomination",
        })}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Welcome to the talent nomination form. This form allows you to nominate a candidate for advancement, lateral movement, or development opportunities unique to their area of work.",
          id: "6ZwHMj",
          description:
            "Paragraph one, instructions on how to submit a nomination",
        })}
      </p>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Nominations must be sponsored by a C-suite level executive working in the candidate’s domain and will be triaged by the associated functional community team. Once confirmed, the candidate will be entered in that community’s talent management system for the current year.",
          id: "QqwcpX",
          description:
            "Paragraph two, instructions on how to submit a nomination",
        })}
      </p>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "Have questions? <link>Reach out to our support team</link>.",
            id: "3RUGGK",
            description:
              "Paragraph two, instructions on how to submit a nomination",
          },
          {
            link: (chunks: ReactNode) => (
              <Link href={paths.support()} color="black">
                {chunks}
              </Link>
            ),
          },
        )}
      </p>
    </UpdateForm>
  );
};

export default Instructions;
