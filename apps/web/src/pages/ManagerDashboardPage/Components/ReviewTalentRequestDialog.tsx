import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Chip,
  Chips,
  Dialog,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  commonMessages,
  getEmploymentDuration,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  ReviewTalentRequestDialogQuery,
} from "@gc-digital-talent/graphql";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import {
  hasDiplomaToEducationLevel,
  positionDurationToEmploymentDuration,
} from "~/utils/searchRequestUtils";
import { formatClassificationString } from "~/utils/poolUtils";

import { talentRequestMessages } from "../messages";
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
        qualifiedStreams {
          label {
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
      }
      jobTitle
      positionType {
        label {
          en
          fr
        }
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

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x0.75)"
        >
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.requestPurpose)}
          >
            {getLocalizedName(request.reason?.label, intl)}
          </FieldDisplay>
          {statusChipSettings ? (
            <Chips>
              <Chip color={statusChipSettings.color}>
                {statusChipSettings.label}
              </Chip>
            </Chips>
          ) : null}
        </div>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1)"
        >
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.classification)}
          >
            {deriveSingleString(
              request.applicantFilter?.qualifiedClassifications,
              formatClassificationString,
            ) ?? nullMessage}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.jobTitle)}
          >
            {request.jobTitle ?? nullMessage}
          </FieldDisplay>
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1)"
        >
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.workStream)}
          >
            {deriveSingleString(
              request.applicantFilter?.qualifiedStreams,
              (stream) => getLocalizedName(stream.label, intl),
            ) ?? nullMessage}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.languageProfile)}
          >
            {getLocalizedName(
              request.applicantFilter?.languageAbility?.label,
              intl,
            ) ?? nullMessage}
          </FieldDisplay>
        </div>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.supervisoryStatus)}
        >
          {getLocalizedName(request.positionType?.label, intl) ?? nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.employmentDuration)}
        >
          {request.applicantFilter?.positionDuration
            ? intl.formatMessage(
                getEmploymentDuration(
                  positionDurationToEmploymentDuration(
                    request.applicantFilter.positionDuration,
                  ),
                ),
              )
            : nullMessage}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.educationRequirement)}
        >
          {hasDiplomaToEducationLevel(
            request.applicantFilter?.hasDiploma,
            intl,
          ) ?? nullMessage}
        </FieldDisplay>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <div>skills</div>
        <div>equity</div>
        <div>work location</div>
        <div>coe</div>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.additionalComments)}
        >
          {request.additionalComments ??
            intl.formatMessage(commonMessages.notProvided)}
        </FieldDisplay>
      </div>
      <div
        data-h2-padding-top="base(x1.5)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1.5)"
      >
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        Buttons
      </div>
    </>
  );
};

interface ReviewTalentRequestDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const ReviewTalentRequestDialog = ({
  open,
  setOpen,
  id,
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewTalentRequestDialog;
