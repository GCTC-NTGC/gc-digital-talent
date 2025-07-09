import { useIntl } from "react-intl";
import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import { useFormContext } from "react-hook-form";

import { Chip, Chips, Heading } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  DevelopmentProgramParticipationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";
import { DATE_SEGMENT, DateInput, RadioGroup } from "@gc-digital-talent/forms";

import { getClassificationName } from "~/utils/poolUtils";

import { FormValues } from "../form";

const TrainingAndDevelopmentOpportunitiesOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment TrainingAndDevelopmentOpportunitiesOptions_Fragment on Query {
      communities {
        id
        developmentPrograms {
          id
          name {
            localized
          }
          descriptionForProfile {
            localized
          }
          eligibleClassifications {
            id
            group
            level
          }
        }
      }
    }
  `,
);

export interface SubformValues {
  interestInDevelopmentPrograms:
    | {
        developmentProgramId: string | null;
        participationStatus: DevelopmentProgramParticipationStatus | null;
        completionDate: string | null;
      }[]
    | null;
}

interface TrainingAndDevelopmentOpportunitiesProps {
  optionsQuery: FragmentType<
    typeof TrainingAndDevelopmentOpportunitiesOptions_Fragment
  >;
  formDisabled: boolean;
}

const TrainingAndDevelopmentOpportunities = ({
  optionsQuery,
  formDisabled,
}: TrainingAndDevelopmentOpportunitiesProps) => {
  const intl = useIntl();
  const optionsData = getFragment(
    TrainingAndDevelopmentOpportunitiesOptions_Fragment,
    optionsQuery,
  );

  const { watch, register } = useFormContext<FormValues>();
  const [selectedCommunityId, selectedInterestInDevelopmentPrograms] = watch([
    "communityId",
    "interestInDevelopmentPrograms",
  ]);

  const developmentPrograms =
    optionsData.communities.find(
      (community) => community?.id === selectedCommunityId,
    )?.developmentPrograms ?? [];

  // sort programs
  developmentPrograms.sort(
    sortAlphaBy((developmentProgram) => developmentProgram.name?.localized),
  );
  // sort classifications in programs
  developmentPrograms.forEach((developmentProgram) => {
    if (developmentProgram.eligibleClassifications) {
      developmentProgram.eligibleClassifications.sort((a, b) =>
        getClassificationName(a, intl).localeCompare(
          getClassificationName(b, intl),
        ),
      );
    }
  });

  return (
    <div className="flex flex-col gap-7.5">
      {/* heading and description */}
      <div className="flex flex-col gap-6">
        <Heading
          level="h2"
          icon={RectangleGroupIcon}
          color="secondary"
          className="mt-0 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Training and development opportunities",
            id: "I5K1zI",
            description:
              "Heading for the 'Training and development opportunities' section",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Most functional communities offer various programs for learning and development. These programs might have specific eligibility requirements based on your experience, classification, or other qualifications. Expressing interest in these opportunities isn’t an application, but it allows HR and recruitment staff to verify your interest in case you’ve been nominated for a training or development opportunity.",
            id: "2HNbTn",
            description:
              "Description of the 'Training and development opportunities' section",
          })}
        </p>
      </div>
      {/* list of programs */}
      <div className="flex flex-col gap-9">
        {developmentPrograms.map((developmentProgram, index) => (
          <div key={developmentProgram.id} className="flex flex-col gap-6">
            {/* titles */}
            <div>
              <Heading level="h3" size="h6" className="m-0 font-bold">
                {developmentProgram.name?.localized ??
                  intl.formatMessage(commonMessages.notProvided)}
              </Heading>
              <p>
                {developmentProgram.descriptionForProfile?.localized ??
                  intl.formatMessage(commonMessages.notProvided)}
              </p>
            </div>
            {/* classification list */}
            {developmentProgram?.eligibleClassifications?.length ? (
              <div className="flex gap-1.5">
                <span>
                  {intl.formatMessage({
                    defaultMessage: "Available to",
                    id: "nCqQlv",
                    description: "Title for the classification list",
                  })}
                  {intl.formatMessage(commonMessages.dividingColon)}
                </span>
                <Chips>
                  {unpackMaybes(
                    developmentProgram?.eligibleClassifications,
                  ).map((classification) => (
                    <Chip key={classification.id} color="secondary">
                      {getClassificationName(classification, intl)}
                    </Chip>
                  ))}
                </Chips>
              </div>
            ) : null}
            {/* radio group */}

            <input
              type="hidden"
              {...register(
                `interestInDevelopmentPrograms.${index}.developmentProgramId`,
              )}
              value={developmentProgram.id}
            />
            <RadioGroup
              idPrefix={`interestInDevelopmentPrograms.${index}.participationStatus`}
              name={`interestInDevelopmentPrograms.${index}.participationStatus`}
              legend={intl.formatMessage(
                {
                  defaultMessage:
                    "Program participation<hidden> for {name}</hidden>",
                  id: "c667HQ",
                  description:
                    "Legend for the radio group of program participation",
                },
                {
                  name:
                    developmentProgram.name?.localized ??
                    intl.formatMessage(commonMessages.notProvided),
                },
              )}
              items={[
                {
                  value: DevelopmentProgramParticipationStatus.NotInterested,
                  label: intl.formatMessage({
                    defaultMessage: "I’m not interested right now.",
                    id: "gg0yRf",
                    description:
                      "Option for the 'not interested' choice of program participation",
                  }),
                },
                {
                  value: DevelopmentProgramParticipationStatus.Interested,
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m interested in participating in this program.",
                    id: "r6WWEn",
                    description:
                      "Option for the 'interested' choice of program participation",
                  }),
                },
                {
                  value: DevelopmentProgramParticipationStatus.Completed,
                  label: intl.formatMessage({
                    defaultMessage: "I’ve successfully completed this program.",
                    id: "tGTM5i",
                    description:
                      "Option for the 'completed' choice of program participation",
                  }),
                },
                {
                  value: DevelopmentProgramParticipationStatus.Enrolled,
                  label: intl.formatMessage({
                    defaultMessage: "I’m currently enrolled in this program.",
                    id: "oYEBcP",
                    description:
                      "Option for the 'enrolled' choice of program participation",
                  }),
                },
              ]}
              disabled={formDisabled}
            />
            {selectedInterestInDevelopmentPrograms?.[index]
              ?.participationStatus ===
            DevelopmentProgramParticipationStatus.Completed ? (
              <DateInput
                id={`interestInDevelopmentPrograms.${index}.completionDate`}
                name={`interestInDevelopmentPrograms.${index}.completionDate`}
                legend={intl.formatMessage({
                  defaultMessage: "Program completion date",
                  id: "JGhMIC",
                  description: "Legend for the program completion date input",
                })}
                show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingAndDevelopmentOpportunities;
