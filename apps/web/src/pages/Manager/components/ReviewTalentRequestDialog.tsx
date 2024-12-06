import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Accordion,
  Button,
  Chip,
  Dialog,
  Pending,
  PreviewList,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getEmploymentDuration,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  ReviewTalentRequestDialogQuery,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import {
  equitySelectionsToDescriptions,
  hasDiplomaToEducationLevel,
  positionDurationToEmploymentDuration,
  positionTypeToYesNoSupervisoryStatement,
} from "~/utils/searchRequestUtils";
import { formatClassificationString } from "~/utils/poolUtils";
import talentRequestMessages from "~/messages/talentRequestMessages";

import { deriveChipSettings, deriveSingleString } from "../utils";

const ReviewTalentRequestDialog_Query = graphql(/* GraphQL */ `
  query ReviewTalentRequestDialog($id: ID!) {
    poolCandidateSearchRequest(id: $id) {
      id
      reason {
        label {
          en
          fr
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
            fr
            en
          }
        }
        languageAbility {
          label {
            en
            fr
          }
        }
        positionDuration
        skills {
          id
          name {
            en
            fr
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
            en
            fr
          }
        }
        operationalRequirements {
          value
          label {
            en
            fr
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
  const locale = getLocale(intl);
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
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-gap="base(x0.75)"
        >
          <div data-h2-flex-grow="p-tablet(2)">
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.requestPurpose)}
            >
              {getLocalizedName(request.reason?.label, intl)}
            </FieldDisplay>
          </div>
          {statusChipSettings ? (
            <div data-h2-align-self="p-tablet(center)">
              <Chip color={statusChipSettings.color}>
                {statusChipSettings.label}
              </Chip>
            </div>
          ) : null}
        </div>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
          data-h2-gap="base(x1)"
        >
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.classification)}
          >
            {classifications.length > 0
              ? deriveSingleString(
                  classifications,
                  formatClassificationString,
                  locale,
                )
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
                  (workStream) => getLocalizedName(workStream.name, intl),
                  locale,
                )
              : nullMessage}
          </FieldDisplay>

          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.languageProfile)}
          >
            {request.applicantFilter?.languageAbility
              ? getLocalizedName(
                  request.applicantFilter.languageAbility.label,
                  intl,
                )
              : nullMessage}
          </FieldDisplay>

          <FieldDisplay
            data-h2-grid-column="p-tablet(span 2)"
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
            data-h2-grid-column="p-tablet(span 2)"
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
            data-h2-grid-column="p-tablet(span 2)"
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
        <Separator orientation="horizontal" data-h2-margin="base(0)" />

        <Accordion.Root type="multiple" data-h2-margin="base(0)">
          <Accordion.Item value="skills">
            <Accordion.Trigger>
              <span>
                {intl.formatMessage(talentRequestMessages.skillRequirements)}
              </span>
              <span
                data-h2-font-weight="base(normal)"
                data-h2-color="base(black.light)"
              >{` (${request.applicantFilter?.skills?.length ?? 0})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {request.applicantFilter?.skills?.length ? (
                <ul>
                  {request.applicantFilter.skills.map((skill) => (
                    <li key={skill?.id}>
                      {getLocalizedName(skill?.name, intl)}
                    </li>
                  ))}
                </ul>
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
                data-h2-font-weight="base(normal)"
                data-h2-color="base(black.light)"
              >{` (${equityDescriptions.length})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {equityDescriptions.length ? (
                <ul>
                  {equityDescriptions.map((equityDescription) => (
                    <li key={equityDescription}>{equityDescription}</li>
                  ))}
                </ul>
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
                data-h2-font-weight="base(normal)"
                data-h2-color="base(black.light)"
              >{` (${request.applicantFilter?.locationPreferences?.length ?? 0})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {request.applicantFilter?.locationPreferences?.length ? (
                <ul>
                  {request.applicantFilter.locationPreferences.map(
                    (locationPreference) => (
                      <li key={locationPreference?.value}>
                        {getLocalizedName(locationPreference?.label, intl)}
                      </li>
                    ),
                  )}
                </ul>
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
                data-h2-font-weight="base(normal)"
                data-h2-color="base(black.light)"
              >{` (${request.applicantFilter?.operationalRequirements?.length ?? 0})`}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              {request.applicantFilter?.operationalRequirements?.length ? (
                <ul>
                  {request.applicantFilter.operationalRequirements.map(
                    (operationalRequirement) => (
                      <li key={operationalRequirement?.value}>
                        {getLocalizedName(operationalRequirement?.label, intl)}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                nullMessage
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Separator orientation="horizontal" data-h2-margin="base(0)" />
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
  title: string;
}

const ReviewTalentRequestDialog = ({
  id,
  title,
}: ReviewTalentRequestDialogProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ReviewTalentRequestDialog_Query,
    variables: {
      id: id,
    },
    pause: !open,
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <PreviewList.Button label={title} />
      </Dialog.Trigger>
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
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentRequestDialog;
