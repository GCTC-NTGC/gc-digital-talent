import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import pageTitles from "~/messages/pageTitles";

import useCurrentStep from "../useCurrentStep";
import { BaseFormValues } from "../types";
import Actions from "./Actions";
import SubHeading from "./SubHeading";
import useMutations from "../useMutations";
import NominatorReview from "./ReviewAndSubmit/NominatorReview";
import NomineeReview from "./ReviewAndSubmit/NomineeReview";
import NominationDetailsReview from "./ReviewAndSubmit/NominationDetailsReview";
import RationaleReview from "./ReviewAndSubmit/RationaleReview";

const NominateTalentReviewAndSubmit_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentReviewAndSubmit on TalentNomination {
    ...NominatorReview
    ...NomineeReview
    ...NominationDetailsReview
    ...RationaleReview
  }
`);

interface ReviewAndSubmitProps {
  reviewAndSubmitQuery: FragmentType<
    typeof NominateTalentReviewAndSubmit_Fragment
  >;
}

const ReviewAndSubmit = ({ reviewAndSubmitQuery }: ReviewAndSubmitProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  const [fetching, { submit }] = useMutations();

  const talentNomination = getFragment(
    NominateTalentReviewAndSubmit_Fragment,
    reviewAndSubmitQuery,
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
        <SubHeading level="h2" icon={DocumentMagnifyingGlassIcon}>
          {intl.formatMessage(pageTitles.reviewAndSubmit)}
        </SubHeading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "Please review all the information collected as a part of your nomination form before submitting. Each section contains a link to edit the associated step, should you need to make changes.",
            id: "Lqm83x",
            description: "Subtitle for submit step of a talent nomination",
          })}
        </p>
        <Separator orientation="horizontal" decorative />
        <NominatorReview nominatorQuery={talentNomination} />
        <Separator orientation="horizontal" decorative />
        <NomineeReview nomineeQuery={talentNomination} />
        <Separator orientation="horizontal" decorative />
        <NominationDetailsReview detailsQuery={talentNomination} />
        <Separator orientation="horizontal" decorative />
        <RationaleReview rationaleQuery={talentNomination} />
        <Actions />
      </form>
    </FormProvider>
  );
};

export default ReviewAndSubmit;
