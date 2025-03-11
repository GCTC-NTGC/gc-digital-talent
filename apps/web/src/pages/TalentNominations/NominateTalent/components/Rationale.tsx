import ChatBubbleBottomCenterTextIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon";
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

const NominateTalentRationale_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentRationale on TalentNomination {
    id
  }
`);

// TO DO: Values to be used when form is created
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  return {};
};

interface RationaleProps {
  rationaleQuery: FragmentType<typeof NominateTalentRationale_Fragment>;
}

const Rationale = ({ rationaleQuery }: RationaleProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  // TO DO: Use in the form population
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNomation = getFragment(
    NominateTalentRationale_Fragment,
    rationaleQuery,
  );

  if (current !== TalentNominationStep.Rationale) {
    return null;
  }

  return (
    <UpdateForm<FormValues> submitDataTransformer={transformSubmitData}>
      <SubHeading level="h2" Icon={ChatBubbleBottomCenterTextIcon}>
        {intl.formatMessage({
          defaultMessage: "Rationale and additional comments",
          id: "LA0AM1",
          description: "Heading for rationale step of a talent nomination",
        })}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "The final step in the nomination process is to explain why this candidate is being nominated. If you've nominated an executive or equivalent level employee, please also provide the top 3 key leadership competencies demonstrated by the nominee.",
          id: "jhOq6m",
          description: "Subtitle for nomiation rationale step",
        })}
      </p>
    </UpdateForm>
  );
};

export default Rationale;
