import DocumentCheckIcon from "@heroicons/react/24/outline/DocumentCheckIcon";
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
import messages from "../messages";

// TO DO: Populate when building form
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FormValues extends BaseFormValues {}

const NominateTalentNominator_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentNominator on TalentNomination {
    id
  }
`);

// TO DO: Values to be used when form is created
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  return {};
};

interface NominatorProps {
  nominatorQuery: FragmentType<typeof NominateTalentNominator_Fragment>;
}

const Nominator = ({ nominatorQuery }: NominatorProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  // TO DO: Use in the form population
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNomination = getFragment(
    NominateTalentNominator_Fragment,
    nominatorQuery,
  );

  if (current !== TalentNominationStep.NominatorInformation) {
    return null;
  }

  return (
    <UpdateForm<FormValues> submitDataTransformer={transformSubmitData}>
      <SubHeading level="h2" Icon={DocumentCheckIcon}>
        {intl.formatMessage(messages.nominatorInfo)}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Let’s get started by learning a little about the nominator.",
          id: "oglvAY",
          description: "Subtitle for nomination nominator step",
        })}
      </p>
    </UpdateForm>
  );
};

export default Nominator;
