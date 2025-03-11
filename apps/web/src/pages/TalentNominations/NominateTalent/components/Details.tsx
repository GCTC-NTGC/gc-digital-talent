import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";

import useMutations from "../useMutations";
import { BaseFormValues } from "../types";
import Actions from "./Actions";
import useCurrentStep from "../useCurrentStep";

// TO DO: Populate when building form
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FormValues extends BaseFormValues {}

const NominateTalentDetails_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentDetails on TalentNomination {
    id
  }
`);

interface DetailsProps {
  detailsQuery: FragmentType<typeof NominateTalentDetails_Fragment>;
}

const Details = ({ detailsQuery }: DetailsProps) => {
  const intl = useIntl();
  const currentStep = useCurrentStep();
  // TO DO: Use in the form population
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const details = getFragment(NominateTalentDetails_Fragment, detailsQuery);
  const [fetching, { update }] = useMutations();

  const methods = useForm<FormValues>({
    disabled: fetching,
  });

  if (currentStep !== TalentNominationStep.NominationDetails) {
    return null;
  }

  const handleSubmit = async (values: FormValues) => {
    await update(
      {
        insertSubmittedStep: TalentNominationStep.NominationDetails,
      },
      values.intent,
      TalentNominationStep.Rationale,
    );
  };

  return (
    <>
      <Heading level="h2" Icon={RectangleGroupIcon}>
        {intl.formatMessage({
          defaultMessage: "Nomination details",
          id: "gD98oQ",
          description: "Heading for details step of a talent nomination",
        })}
      </Heading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Now, we'll look at the details of the nomination you'd like to submit.",
          id: "ZWIfBh",
          description: "Subtitle for nomiation details step",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Actions previousStep={TalentNominationStep.NomineeInformation} />
        </form>
      </FormProvider>
    </>
  );
};

export default Details;
