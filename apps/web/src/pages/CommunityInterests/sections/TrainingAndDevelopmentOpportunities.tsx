import { useIntl } from "react-intl";
import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import { useFormContext } from "react-hook-form";

import { CardSeparator, Chip, Chips, Heading } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  DevelopmentProgramParticipationStatus,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { RadioGroup } from "@gc-digital-talent/forms";

import { getClassificationName } from "~/utils/poolUtils";

import { FormValues } from "../CreateCommunityInterestPage/CreateCommunityInterestPage";

export const TrainingAndDevelopmentOpportunitiesOptions_Fragment = graphql(
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
  developmentProgramsInterests: Maybe<
    {
      developmentProgramId: Maybe<string>;
      programParticipation: Maybe<string>;
    }[]
  >;
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
  const selectedFunctionalCommunity = watch("functionalCommunity");

  const developmentPrograms =
    optionsData.communities.find(
      (community) => community?.id === selectedFunctionalCommunity,
    )?.developmentPrograms ?? [];

  // sort programs
  developmentPrograms.sort((a, b) =>
    (a.name?.localized ?? "").localeCompare(b.name?.localized ?? ""),
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
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1.25)"
    >
      {/* heading and description */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Heading
          level="h2"
          data-h2-font-weight="base(400)"
          Icon={RectangleGroupIcon}
          color="primary"
          data-h2-margin="base(0)"
        >
          {intl.formatMessage({
            defaultMessage: "Training and development opportunities",
            id: "I5K1zI",
            description:
              "Heading for the 'Training and development opportunities' section",
          })}
        </Heading>
        <span>
          {intl.formatMessage({
            defaultMessage:
              "Most functional communities offer various programs for learning and development. These programs might have specific eligibility requirements based on your experience, classification, or other qualifications. Expressing interest in these opportunities isn’t an application, but it allows HR and recruitment staff to verify your interest in case you’ve been nominated for a training or development opportunity.",
            id: "2HNbTn",
            description:
              "Description of the 'Training and development opportunities' section",
          })}
        </span>
      </div>
      {/* list of programs */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1.5)"
      >
        {developmentPrograms.map((developmentProgram, index) => (
          <div
            key={developmentProgram.id}
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x1.25)"
          >
            <CardSeparator space="none" />
            <div
              key={developmentProgram.id}
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
            >
              {/* titles */}
              <div>
                <Heading
                  level="h3"
                  size="h6"
                  data-h2-font-weight="base(bold)"
                  data-h2-margin="base(0)"
                >
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
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(row)"
                  data-h2-gap="base(x0.25)"
                >
                  <span>
                    {intl.formatMessage({
                      defaultMessage: "Available to:",
                      id: "ZC5dpP",
                      description: "Title for the classification list",
                    })}
                  </span>
                  <Chips>
                    {unpackMaybes(
                      developmentProgram?.eligibleClassifications,
                    ).map((classification) => (
                      <Chip key={classification.id}>
                        {getClassificationName(classification, intl)}
                      </Chip>
                    ))}
                  </Chips>
                </div>
              ) : null}
              {/* radio group */}
              <div>
                <input
                  type="hidden"
                  {...register(
                    `developmentProgramsInterests.${index}.developmentProgramId`,
                  )}
                  value={developmentProgram.id}
                />
                <RadioGroup
                  idPrefix={`developmentProgramsInterests.${index}.programParticipation`}
                  name={`developmentProgramsInterests.${index}.programParticipation`}
                  legend={intl.formatMessage({
                    defaultMessage: "Program participation",
                    id: "LQ0a0a",
                    description:
                      "Legend for the radio group of program participation",
                  })}
                  items={[
                    {
                      value:
                        DevelopmentProgramParticipationStatus.NotInterested,
                      label: intl.formatMessage({
                        defaultMessage: "I’m not interested right now.",
                        id: "CU/Mk6",
                        description:
                          "Option for the 'not intersted' choice of program participation",
                      }),
                    },
                    {
                      value: DevelopmentProgramParticipationStatus.Interested,
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’m interested in participating in this program.",
                        id: "K1DbQ9",
                        description:
                          "Option for the 'intersted' choice of program participation",
                      }),
                    },
                    {
                      value: DevelopmentProgramParticipationStatus.Completed,
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’ve successfully completed this program.",
                        id: "tGTM5i",
                        description:
                          "Option for the 'completed' choice of program participation",
                      }),
                    },
                    {
                      value: DevelopmentProgramParticipationStatus.Enrolled,
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’m currently enrolled in this program.",
                        id: "oYEBcP",
                        description:
                          "Option for the 'enrolled' choice of program participation",
                      }),
                    },
                  ]}
                  disabled={formDisabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingAndDevelopmentOpportunities;
