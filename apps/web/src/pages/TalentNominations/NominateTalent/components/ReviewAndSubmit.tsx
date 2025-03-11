import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";

import useCurrentStep from "../useCurrentStep";
import { BaseFormValues } from "../types";
import Actions from "./Actions";
import useMutations from "../useMutations";

const NominateTalentReviewAndSubmit_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentReviewAndSubmit on TalentNomination {
    id
  }
`);

interface ReviewAndSubmitProps {
  revieAndSubmitQuery: FragmentType<
    typeof NominateTalentReviewAndSubmit_Fragment
  >;
}

const ReviewAndSubmit = ({ revieAndSubmitQuery }: ReviewAndSubmitProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  const [fetching, { submit }] = useMutations();
  // TO DO: Use in the form population
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const revieAndSubmit = getFragment(
    NominateTalentReviewAndSubmit_Fragment,
    revieAndSubmitQuery,
  );

  const methods = useForm<BaseFormValues>({ disabled: fetching });

  if (current !== TalentNominationStep.ReviewAndSubmit) {
    return null;
  }

  const handleSubmit = async (values: BaseFormValues) => {
    await submit(values.intent);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Heading level="h2" Icon={DocumentMagnifyingGlassIcon}>
          {intl.formatMessage({
            defaultMessage: "Review and submit",
            id: "29uHtO",
            description: "Heading for submit step of a talent nomination",
          })}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "Please review all the information collected as a part of your nomination form before submitting. Each section contains a link to edit the associated step, should you need to make changes.",
            id: "Lqm83x",
            description: "Subtitle for submit step of a talent nomination",
          })}
        </p>
        <Actions />
      </form>
    </FormProvider>
  );
};

export default ReviewAndSubmit;
