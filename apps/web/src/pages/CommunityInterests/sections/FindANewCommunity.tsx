import { defineMessage, useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useFormContext } from "react-hook-form";
import { ComponentProps, useId } from "react";

import { Heading, Well } from "@gc-digital-talent/ui";
import { Checklist, RadioGroup, Select } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  assertUnreachable,
  nodeToString,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { FormValues } from "../form";

const FindANewCommunityOptions_Fragment = graphql(/* GraphQL */ `
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

    meForOptions: me {
      employeeProfile {
        communityInterests {
          community {
            id
          }
        }
      }
    }
  }
`);

export interface SubformValues {
  communityId: string | null;
  jobInterest: string | null;
  trainingInterest: string | null;
  interestInWorkStreamIds: string[] | null;
}

interface FindANewCommunityProps {
  optionsQuery: FragmentType<typeof FindANewCommunityOptions_Fragment>;
  formDisabled: boolean;
  mode: "create" | "update";
}

const FindANewCommunity = ({
  optionsQuery,
  formDisabled,
  mode,
}: FindANewCommunityProps) => {
  const intl = useIntl();
  const optionsData = getFragment(
    FindANewCommunityOptions_Fragment,
    optionsQuery,
  );

  const { watch } = useFormContext<FormValues>();
  const [selectedCommunityId] = watch(["communityId"]);
  const workStreamListDescription = useId();

  const alreadyInterestedCommunityIds =
    optionsData.meForOptions?.employeeProfile?.communityInterests?.map(
      (interest) => interest?.community?.id,
    ) ?? [];

  const communityOptions: ComponentProps<typeof Select>["options"] =
    unpackMaybes(optionsData.communities)
      .filter(
        (community) => !alreadyInterestedCommunityIds.includes(community.id),
      )
      .map((community) => ({
        value: community.id,
        label:
          community.name?.localized ??
          intl.formatMessage(commonMessages.notProvided),
      }));
  const workStreamOptions: ComponentProps<typeof Checklist>["items"] =
    optionsData.communities
      .find((community) => community?.id === selectedCommunityId)
      ?.workStreams?.map((workStream) => ({
        value: workStream.id,
        label:
          workStream.name?.localized ??
          intl.formatMessage(commonMessages.notProvided),
      })) ?? [];
  workStreamOptions.sort((a, b) =>
    (nodeToString(a.label) ?? "").localeCompare(nodeToString(b.label) ?? ""),
  );

  // heading and description change depending on whether the user is creating or updating
  let heading;
  let description;

  switch (mode) {
    case "create":
      heading = defineMessage({
        defaultMessage: "Find a new community",
        id: "53LNWh",
        description:
          "Heading for the 'Find a new community' section when creating",
      });
      description = defineMessage({
        defaultMessage:
          "To get started, browse through the list of communities that partner with GC Digital Talent. More communities will be added as they join the platform. Once you’ve selected a community, you’ll be asked a few questions about your interest in opportunities.",
        id: "koX5xF",
        description:
          "Description of the 'find a new community' section when creating",
      });
      break;
    case "update":
      heading = defineMessage({
        defaultMessage: "Update your preferences",
        id: "TtJCR6",
        description:
          "Heading for the 'Find a new community' section when updating",
      });
      description = defineMessage({
        defaultMessage:
          "Update your interest in job and training opportunities for this community or rescind your consent to share your profile with its HR staff and hiring managers.",
        id: "tkKGAr",
        description:
          "Description of the 'find a new community' section when updating",
      });
      break;
    default:
      return assertUnreachable(mode); // exhaustive switch
  }

  return (
    <div className="flex flex-col gap-7.5">
      {/* heading and description */}
      <div className="flex flex-col gap-6">
        <Heading
          level="h2"
          icon={UserGroupIcon}
          color="secondary"
          className="mt-0 font-normal"
        >
          {intl.formatMessage(heading)}
        </Heading>
        <p>{intl.formatMessage(description)}</p>
      </div>
      {/* form */}
      <div className="flex flex-col gap-6">
        {/* The user only gets to pick the community if they are creating a new interest. */}
        {mode === "create" && (
          <Select
            id="communityId"
            name="communityId"
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
        )}
        {selectedCommunityId ? (
          // Only show more form controls if a community has been selected
          <>
            <RadioGroup
              idPrefix="jobInterest"
              name="jobInterest"
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
                      "By indicating that you're interested in work opportunities, you agree to share your profile information with recruiters and hiring managers within this functional community.",
                    id: "aElqQN",
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
              idPrefix="trainingInterest"
              name="trainingInterest"
              legend={intl.formatMessage({
                defaultMessage: "Interest in training and development",
                id: "WfX9z1",
                description:
                  "Label for user Interest in training and development for a community",
              })}
              items={[
                {
                  value: "true",
                  label: intl.formatMessage({
                    defaultMessage:
                      "I’m interested in being considered for training opportunities or development programs within this community.",
                    id: "gsjH8R",
                    description:
                      "Label for the community interest in training opportunities radio option",
                  }),
                  contentBelow: intl.formatMessage({
                    defaultMessage:
                      "By indicating that you're interested in training or development, you agree to share your profile information with recruiters and hiring managers within this functional community.",
                    id: "/SOIpV",
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
            {/* work stream section */}
            {workStreamOptions.length ? (
              <div className="flex flex-col gap-3">
                <span id={workStreamListDescription}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please select any of the work streams listed that you would consider for work or training.",
                    id: "1vpJU6",
                    description:
                      "Introduction for a work stream referral preferences input",
                  })}
                </span>
                <Checklist
                  idPrefix="interestInWorkStreamIds"
                  name="interestInWorkStreamIds"
                  legend={intl.formatMessage({
                    defaultMessage:
                      "Preferred work streams for job and training opportunities",
                    id: "EoEEha",
                    description:
                      "Label for the input for selecting work stream referral preferences",
                  })}
                  items={workStreamOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  disabled={formDisabled}
                  aria-describedby={workStreamListDescription}
                />
              </div>
            ) : // no work streams
            null}
          </>
        ) : (
          // no community selected
          <Well className="text-center">
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
