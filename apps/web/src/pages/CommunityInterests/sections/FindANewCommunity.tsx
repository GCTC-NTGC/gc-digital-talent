import { useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useFormContext } from "react-hook-form";
import { ComponentProps } from "react";

import { Heading, Well } from "@gc-digital-talent/ui";
import { Checklist, RadioGroup, Select } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
} from "@gc-digital-talent/graphql";

import { FormValues } from "../CreateCommunityInterestPage/CreateCommunityInterestPage";

export const FindANewCommunityOptions_Fragment = graphql(/* GraphQL */ `
  fragment FindANewCommunityOptions_Fragment on Query {
    communities {
      id
      name {
        localized
      }
      workStreams {
        id
        name {
          localized
        }
      }
    }
  }
`);

export interface SubformValues {
  functionalCommunity: Maybe<string>;
  interestInJobOpportunities: Maybe<string>;
  interestInTrainingOpportunities: Maybe<string>;
  workStreamPreferences: Maybe<string[]>;
}

interface FindANewCommunityProps {
  optionsQuery: FragmentType<typeof FindANewCommunityOptions_Fragment>;
  formDisabled: boolean;
}

const FindANewCommunity = ({
  optionsQuery,
  formDisabled,
}: FindANewCommunityProps) => {
  const intl = useIntl();
  const optionsData = getFragment(
    FindANewCommunityOptions_Fragment,
    optionsQuery,
  );

  const { watch } = useFormContext<FormValues>();
  const [selectedFunctionalCommunity] = watch(["functionalCommunity"]);

  const communityOptions: ComponentProps<typeof Select>["options"] =
    unpackMaybes(optionsData.communities).map((community) => ({
      value: community.id,
      label:
        community.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    }));
  const workStreamOptions: ComponentProps<typeof Checklist>["items"] =
    optionsData.communities
      .find((community) => community?.id === selectedFunctionalCommunity)
      ?.workStreams?.map((workstream) => ({
        value: workstream.id,
        label:
          workstream.name?.localized ??
          intl.formatMessage(commonMessages.notProvided),
      })) ?? [];
  workStreamOptions.sort((a, b) =>
    (a.label?.toString() ?? "").localeCompare(b.label?.toString() ?? ""),
  );

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
          Icon={UserGroupIcon}
          color="primary"
          data-h2-margin="base(0)"
        >
          {intl.formatMessage({
            defaultMessage: "Find a new community",
            id: "yo4y4l",
            description: "Heading for the 'Find a new community' section",
          })}
        </Heading>
        <span>
          {intl.formatMessage({
            defaultMessage:
              "To get started, browse through the list of communities that partner with GC Digital Talent. If you can’t find a community that matches what you’re searching for, feel free to check back later as we add more communities to the platform. Once you’ve selected a community, you’ll be asked a few questions about your interest in opportunities.",
            id: "FbjKw/",
            description: "Description of the 'find a new community' section",
          })}
        </span>
      </div>
      {/* form */}
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1.25)"
      >
        <Select
          id="functionalCommunity"
          name="functionalCommunity"
          label={intl.formatMessage({
            defaultMessage: "Functional community",
            id: "ElnCxi",
            description:
              "Description for a form input for selecting a functional community",
          })}
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          options={communityOptions}
          disabled={formDisabled}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        {selectedFunctionalCommunity ? (
          // community selected
          <>
            <RadioGroup
              idPrefix="interestInJobOpportunities"
              name="interestInJobOpportunities"
              legend={intl.formatMessage({
                defaultMessage: "Interest in job opportunities",
                id: "9IhPwx",
                description:
                  "Label for the input for choosing interest level in a job opportunity",
              })}
              items={[
                {
                  value: "true",
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m interested in work opportunities within this community.",
                    id: "tmwk97",
                    description:
                      "Label for the community interest in work opportunities radio option",
                  }),
                  contentBelow: intl.formatMessage({
                    defaultMessage:
                      "By indicating you’re interested in work opportunities, you agree to share your profile information with recruiters and hiring managers within this functional community.",
                    id: "n3rJfA",
                    description:
                      "Context for the 'I'm interested in work opportunities within this community' radio option",
                  }),
                },
                {
                  value: "false",
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m not looking for work in this community right now.",
                    id: "S+GQc9",
                    description:
                      "Label for the community not interested in work opportunities radio option",
                  }),
                },
              ]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              disabled={formDisabled}
            />
            <RadioGroup
              idPrefix="interestInTrainingOpportunities"
              name="interestInTrainingOpportunities"
              legend={intl.formatMessage({
                defaultMessage: "Interest in training opportunities",
                id: "H1UEd5",
                description:
                  "Label for the input for choosing interest level in a training opportunity",
              })}
              items={[
                {
                  value: "true",
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m interested in being considered for training or development opportunities within this community.",
                    id: "oEYCLO",
                    description:
                      "Label for the community interest in training opportunities radio option",
                  }),
                  contentBelow: intl.formatMessage({
                    defaultMessage:
                      "By indicating you’re interested in training opportunities, you agree to share your profile information with recruiters and hiring managers within this functional community.",
                    id: "3TEZds",
                    description:
                      "Context for the 'I'm interested in training opportunities within this community' radio option",
                  }),
                },
                {
                  value: "false",
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m not interested in training opportunities right now.",
                    id: "cLBubr",
                    description:
                      "Label for the community not interested in training opportunities radio option",
                  }),
                },
              ]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              disabled={formDisabled}
            />
            {/* workstream section */}
            {workStreamOptions.length ? (
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x0.5)"
              >
                <span>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please select any of the work streams described below that you would consider working within.",
                    id: "gEtMPC",
                    description:
                      "Introduction for a work stream referral preferences input",
                  })}
                </span>
                <Checklist
                  idPrefix="workStreamPreferences"
                  name="workStreamPreferences"
                  legend={intl.formatMessage({
                    defaultMessage:
                      "Preferred work streams for job opportunities",
                    id: "loImp5",
                    description:
                      "Label for the input for selecting work stream referral preferences",
                  })}
                  items={workStreamOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  disabled={formDisabled}
                />
              </div>
            ) : // no workstreams
            null}
          </>
        ) : (
          // no community selected
          <Well data-h2-text-align="base(center)">
            {intl.formatMessage({
              defaultMessage:
                "Please select a functional community to continue.",
              id: "sZhjI3",
              description:
                "Message displayed when no functional community is selected",
            })}
          </Well>
        )}
      </div>
    </div>
  );
};

export default FindANewCommunity;
