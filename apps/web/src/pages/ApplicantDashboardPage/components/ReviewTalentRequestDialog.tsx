import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { ReactNode, useState } from "react";

import {
  Accordion,
  Button,
  Chip,
  Dialog,
  Pending,
  Separator,
  ThrowNotFound,
  Ul,
} from "@gc-digital-talent/ui";
import { commonMessages, getEmploymentDuration } from "@gc-digital-talent/i18n";
import {
  graphql,
  ReviewTalentRequestDialogQuery,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import {
  equitySelectionsToDescriptions,
  hasDiplomaToEducationLevel,
  positionDurationToEmploymentDuration,
  positionTypeToYesNoSupervisoryStatement,
} from "~/utils/searchRequestUtils";
import { formatClassificationString } from "~/utils/poolUtils";
import talentRequestMessages from "~/messages/talentRequestMessages";

import { deriveChipSettings, deriveSingleString } from "./utils";

const ReviewTalentRequestDialog_Query = graphql(/* GraphQL */ `
  query ReviewTalentRequestDialog($id: ID!) {
    poolCandidateSearchRequest(id: $id) {
      id
      reason {
        label {
          localized
        }
      }
      status {
        value
      }
      additionalComments
      applicantFilter {
        hasDiploma
        qualifiedClassifications {
          group
          level
        }
        workStreams {
          name {
            localized
          }
        }
        languageAbility {
          label {
            localized
          }
        }
        positionDuration
        skills {
          id
          name {
            localized
          }
        }
        equity {
          isWoman
          hasDisability
          isIndigenous
          isVisibleMinority
        }
        locationPreferences {
          value
          label {
            localized
          }
        }
        operationalRequirements {
          value
          label {
            localized
          }
        }
      }
      jobTitle
      positionType {
        value
      }
    }
  }
`);

interface ReviewTalentRequestDialogContentProps {
  request: NonNullable<
    ReviewTalentRequestDialogQuery["poolCandidateSearchRequest"]
  >;
}

const ReviewTalentRequestDialogContent = ({
  request,
}: ReviewTalentRequestDialogContentProps) => {
  const intl = useIntl();
  const nullMessage = intl.formatMessage({
    defaultMessage: "(None selected)",
    id: "+O6J4u",
    description: "Text shown when the filter was not selected",
  });
  const statusChipSettings = request.status
    ? deriveChipSettings(request.status.value, intl)
    : null;
  const classifications = unpackMaybes(
    request.applicantFilter?.qualifiedClassifications,
  );
  const workStreams = unpackMaybes(request.applicantFilter?.workStreams);
  const equityDescriptions = equitySelectionsToDescriptions(
    request.applicantFilter?.equity,
    intl,
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-6 xs:flex-row">
          <div className="flex-grow-2">
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.requestPurpose)}
            >
              {request.reason?.label.localized ?? nullMessage}
            </FieldDisplay>
          </div>
          {statusChipSettings ? (
            <div className="xs:self-center">
              <Chip color={statusChipSettings.color}>
                {statusChipSettings.label}
              </Chip>
            </div>
          ) : null}
        </div>
        <Separator decorative space="sm" />
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2">
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.classification)}
          >
            {classifications.length > 0
              ? deriveSingleString(classifications, formatClassificationString)
              : nullMessage}
          </FieldDisplay>

          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.jobTitle)}
          >
            {request.jobTitle ?? nullMessage}
          </FieldDisplay>

          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.workStream)}
          >
            {workStreams.length > 0
              ? deriveSingleString(
                  workStreams,
                  (stream) => stream.name?.localized ?? "",
                )
              : nullMessage}
          </FieldDisplay>

          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.languageProfile)}
          >
            {request.applicantFilter?.languageAbility?.label.localized ??
              nullMessage}
          </FieldDisplay>

          <FieldDisplay
            className="xs:col-span-2"
            label={intl.formatMessage(talentRequestMessages.supervisoryStatus)}
          >
            {request.positionType
              ? positionTypeToYesNoSupervisoryStatement(
                  request.positionType.value,
                  intl,
                )
              : nullMessage}
          </FieldDisplay>

          <FieldDisplay
            className="xs:col-span-2"
            label={intl.formatMessage(talentRequestMessages.employmentDuration)}
          >
            {
              // has its own null state
              intl.formatMessage(
                getEmploymentDuration(
                  positionDurationToEmploymentDuration(
                    unpackMaybes(request.applicantFilter?.positionDuration),
                  ),
                ),
              )
            }
          </FieldDisplay>

          <FieldDisplay
            className="xs:col-span-2"
            label={intl.formatMessage(
              talentRequestMessages.educationRequirement,
            )}
          >
            {
              // has its own null state
              hasDiplomaToEducationLevel(
                request.applicantFilter?.hasDiploma,
                intl,
              )
            }
          </FieldDisplay>
        </div>
        <Separator decorative space="sm" />

        <Accordion.Root type="multiple" className="m-0">
          <Accordion.Item value="skills">
            <Accordion.Trigger>
              <span>
                {intl.formatMessage(talentRequestMessages.skillRequirements)}
              </span>
              <span
                className="font-normal"
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              >{` (${request.applicantFilter?.skills?.length ?? 0})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {request.applicantFilter?.skills?.length ? (
                <Ul>
                  {request.applicantFilter.skills.map((skill) => (
                    <li key={skill?.id}>
                      {skill?.name.localized ?? nullMessage}
                    </li>
                  ))}
                </Ul>
              ) : (
                nullMessage
              )}
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="equity-groups">
            <Accordion.Trigger>
              <span>
                {intl.formatMessage(talentRequestMessages.equityGroups)}
              </span>
              <span
                className="font-normal"
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              >{` (${equityDescriptions.length})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {equityDescriptions.length ? (
                <Ul>
                  {equityDescriptions.map((equityDescription) => (
                    <li key={equityDescription}>{equityDescription}</li>
                  ))}
                </Ul>
              ) : (
                nullMessage
              )}
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="work-location">
            <Accordion.Trigger>
              <span>
                {intl.formatMessage(talentRequestMessages.workLocation)}
              </span>
              <span
                className="font-normal"
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              >{` (${request.applicantFilter?.locationPreferences?.length ?? 0})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {request.applicantFilter?.locationPreferences?.length ? (
                <Ul>
                  {request.applicantFilter.locationPreferences.map(
                    (locationPreference) => (
                      <li key={locationPreference?.value}>
                        {locationPreference?.label.localized ?? nullMessage}
                      </li>
                    ),
                  )}
                </Ul>
              ) : (
                nullMessage
              )}
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="conditions-of-employment">
            <Accordion.Trigger>
              <span>
                {intl.formatMessage(
                  talentRequestMessages.conditionsOfEmployment,
                )}
              </span>
              <span
                className="font-normal"
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              >{` (${request.applicantFilter?.operationalRequirements?.length ?? 0})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {request.applicantFilter?.operationalRequirements?.length ? (
                <Ul>
                  {request.applicantFilter.operationalRequirements.map(
                    (operationalRequirement) => (
                      <li key={operationalRequirement?.value}>
                        {operationalRequirement?.label.localized ?? nullMessage}
                      </li>
                    ),
                  )}
                </Ul>
              ) : (
                nullMessage
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Separator decorative space="sm" />
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.additionalComments)}
        >
          {request.additionalComments ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
      </div>
    </>
  );
};

interface ReviewTalentRequestDialogProps {
  id: string;
  trigger: ReactNode;
}

const ReviewTalentRequestDialog = ({
  id,
  trigger,
}: ReviewTalentRequestDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [{ data, fetching, error }] = useQuery({
    query: ReviewTalentRequestDialog_Query,
    variables: {
      id: id,
    },
    pause: !open,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "See chosen search filters alongside any other information provided with this request.",
            id: "UoUzWJ",
            description: "Subtitle for the 'review talent request' dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Review a talent request",
            id: "r4IQ0h",
            description: "Title for the 'review talent request' dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Pending fetching={fetching} error={error} inline={true}>
            {data?.poolCandidateSearchRequest ? (
              <ReviewTalentRequestDialogContent
                request={data.poolCandidateSearchRequest}
              />
            ) : (
              <ThrowNotFound
                message={intl.formatMessage(commonMessages.notFound)}
              />
            )}
          </Pending>
          <Dialog.Footer>
            <Button
              color="warning"
              mode="inline"
              onClick={() => setOpen(false)}
            >
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentRequestDialog;
