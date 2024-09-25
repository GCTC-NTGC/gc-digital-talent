import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Dialog,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  graphql,
  ReviewTalentRequestDialogQuery,
} from "@gc-digital-talent/graphql";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";

import { talentRequestMessages } from "../messages";

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
      applicantFilter {
        qualifiedClassifications {
          id
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
  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        {/* <div>request purpose, submitted</div> */}
        <div>
          <FieldDisplay
            label={intl.formatMessage(talentRequestMessages.requestPurpose)}
          >
            {getLocalizedName(request.reason?.label, intl)}
          </FieldDisplay>
        </div>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <div>class, job title</div>
        <div>stream, language</div>
        <div>supervisory</div>
        <div>duration</div>
        <div>education</div>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <div>skills</div>
        <div>equity</div>
        <div>work location</div>
        <div>coe</div>
        <Separator orientation="horizontal" data-h2-margin="base(0)" />
        <div>comments</div>
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
