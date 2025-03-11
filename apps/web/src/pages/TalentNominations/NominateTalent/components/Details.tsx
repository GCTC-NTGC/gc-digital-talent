import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
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

const NominateTalentDetails_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentDetails on TalentNomination {
    id
  }
`);

// TO DO: Values to be used when form is created
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  return {};
};

interface DetailsProps {
  detailsQuery: FragmentType<typeof NominateTalentDetails_Fragment>;
}

const Details = ({ detailsQuery }: DetailsProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  // TO DO: Use in the form population
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const talentNomination = getFragment(
    NominateTalentDetails_Fragment,
    detailsQuery,
  );
  if (current !== TalentNominationStep.NominationDetails) {
    return null;
  }

  return (
    <UpdateForm<FormValues> submitDataTransformer={transformSubmitData}>
      <SubHeading Icon={RectangleGroupIcon}>
        {intl.formatMessage({
          defaultMessage: "Nomination details",
          id: "gD98oQ",
          description: "Heading for details step of a talent nomination",
        })}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Now, we'll look at the details of the nomination you'd like to submit.",
          id: "ZWIfBh",
          description: "Subtitle for nomiation details step",
        })}
      </p>
    </UpdateForm>
  );
};

export default Details;
