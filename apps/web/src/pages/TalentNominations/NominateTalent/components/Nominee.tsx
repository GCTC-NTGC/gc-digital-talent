import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";

import { BaseFormValues } from "../types";
import useCurrentStep from "../useCurrentStep";
import UpdateForm, { SubmitDataTransformer } from "./UpdateForm";
import SubHeading from "./SubHeading";

// TO DO: Populate when building form
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FormValues extends BaseFormValues {}

const NominateTalentNominee_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentNominee on TalentNomination {
    id
  }
`);

// TO DO: Values to be used when form is created
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  return {};
};

interface NomineeProps {
  nomineeQuery: FragmentType<typeof NominateTalentNominee_Fragment>;
}

const Nominee = ({ nomineeQuery }: NomineeProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  // TO DO: Use in the form population
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNomination = getFragment(
    NominateTalentNominee_Fragment,
    nomineeQuery,
  );

  if (current !== TalentNominationStep.NomineeInformation) {
    return null;
  }

  return (
    <>
      <UpdateForm<FormValues> submitDataTransformer={transformSubmitData}>
        <SubHeading level="h2" Icon={UserCircleIcon}>
          {intl.formatMessage({
            defaultMessage: "Nominee information",
            id: "Efdmb2",
            description: "Heading for nominee step of a talent nomination",
          })}
        </SubHeading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "Now that we know a little about who is submitting the nomination, let’s collect some information about the nominee. We'll start by checking if they have a GC Digital Talent account using their work email.",
            id: "AdYm70",
            description: "Subtitle for nomiation nominee step",
          })}
        </p>
      </UpdateForm>
    </>
  );
};

export default Nominee;
