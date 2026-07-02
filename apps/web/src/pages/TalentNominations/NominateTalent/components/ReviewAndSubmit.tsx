import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { isPast } from "date-fns/isPast";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { Card, CardSeparator } from "@gc-digital-talent/ui";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import pageTitles from "~/messages/pageTitles";

import useCurrentStep from "../useCurrentStep";
import type { BaseFormValues } from "../types";
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
    talentNominationEvent {
      id
      closeDate
    }
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

  const talentNomination = getFragment(
    NominateTalentReviewAndSubmit_Fragment,
    reviewAndSubmitQuery,
  );

  const closeDate = talentNomination?.talentNominationEvent?.closeDate;
  const isPastEvent = !!closeDate && isPast(parseDateTimeUtc(closeDate));

  const [fetching, { submit }] = useMutations({
    forceProtectedEndpoint: isPastEvent,
  });

  const methods = useForm<BaseFormValues>({ disabled: fetching });

  if (current !== TalentNominationStep.ReviewAndSubmit) {
    return null;
  }

  const handleSubmit = async (values: BaseFormValues) => {
    await submit(values.intent);
  };

  return (
    <Card>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <SubHeading icon={DocumentMagnifyingGlassIcon}>
            {intl.formatMessage(pageTitles.reviewAndSubmit)}
          </SubHeading>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "Please review all the information collected as a part of your nomination form before submitting. Each section contains a link to edit the associated step, should you need to make changes.",
              id: "Lqm83x",
              description: "Subtitle for submit step of a talent nomination",
            })}
          </p>
          <CardSeparator decorative />
          <NominatorReview nominatorQuery={talentNomination} />
          <CardSeparator decorative />
          <NomineeReview nomineeQuery={talentNomination} />
          <CardSeparator decorative />
          <NominationDetailsReview detailsQuery={talentNomination} />
          <CardSeparator decorative />
          <RationaleReview rationaleQuery={talentNomination} />
          <Actions />
        </form>
      </FormProvider>
    </Card>
  );
};

export default ReviewAndSubmit;
