import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog, Link, Separator } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import BoolCheckIcon from "./BoolCheckIcon";
import DevelopmentProgramInterestItem from "./DevelopmentProgramInterestItem";

export const CommunityInterestDialog_Fragment = graphql(/* GraphQL */ `
  fragment CommunityInterestDialog on CommunityInterest {
    id
    community {
      workStreams {
        id
        name {
          localized
        }
      }
      developmentPrograms {
        id
        name {
          localized
        }
      }
      name {
        localized
      }
    }
    workStreams {
      id
    }
    interestInDevelopmentPrograms {
      developmentProgram {
        id
      }
      ...CommunityInterestDialogDevelopmentProgramInterest
    }
    jobInterest
    trainingInterest
    additionalInformation
  }
`);

interface CommunityInterestDialogProps {
  communityInterestQuery: FragmentType<typeof CommunityInterestDialog_Fragment>;
  trigger?: ReactNode;
  defaultOpen?: boolean;
}

const CommunityInterestDialog = ({
  communityInterestQuery,
  trigger,
  defaultOpen = false,
}: CommunityInterestDialogProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const communityInterest = getFragment(
    CommunityInterestDialog_Fragment,
    communityInterestQuery,
  );
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const title = communityInterest.community?.name?.localized ?? notAvailable;
  const communityWorkStreams = unpackMaybes(
    communityInterest.community.workStreams,
  );
  const communityDevelopmentPrograms = unpackMaybes(
    communityInterest?.community.developmentPrograms,
  );
  const interestedWorkStreams = unpackMaybes(
    communityInterest?.workStreams,
  ).flatMap((workStream) => workStream.id);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger || <Button>{title}</Button>}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage: "View and edit your settings for this community.",
            id: "PRRKAq",
            description: "Subtitle for dialog viewing a community interest",
          })}
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage({
              defaultMessage: "Interest in job opportunities",
              id: "dYsXAU",
              description:
                "Label for users interest in job opportunities for a community",
            })}
          </p>
          <BoolCheckIcon
            value={communityInterest.jobInterest}
            data-h2-margin-bottom="base(x1)"
          >
            {communityInterest.jobInterest
              ? intl.formatMessage({
                  defaultMessage: "Interested in work*",
                  id: "nVlmhK",
                  description:
                    "Message displayed when user expresses interest in job opportunities",
                })
              : intl.formatMessage({
                  defaultMessage: "Not interested in work",
                  id: "szxveb",
                  description:
                    "Message displayed when a user has expressed they are not interested in job opportunities",
                })}
          </BoolCheckIcon>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage({
              defaultMessage: "Interest in training opportunities",
              id: "9whw8l",
              description:
                "Label for users interest in training opportunities for a community",
            })}
          </p>
          <BoolCheckIcon
            value={communityInterest.trainingInterest}
            data-h2-margin-bottom="base(x1)"
          >
            {communityInterest.trainingInterest
              ? intl.formatMessage({
                  defaultMessage: "Interested in training*",
                  id: "edqRug",
                  description:
                    "Message displayed when user expresses interest in training opportunities",
                })
              : intl.formatMessage({
                  defaultMessage: "Not interested in training",
                  id: "m6NZda",
                  description:
                    "Message displayed when a user has expressed they are not interested in training opportunities",
                })}
          </BoolCheckIcon>
          <p
            data-h2-color="base(black.light)"
            data-h2-font-size="base(caption)"
            data-h2-margin-bottom="base(x1)"
          >
            {intl.formatMessage({
              defaultMessage:
                "* Note that by indicating you’re interested in jobs or training opportunities, you agree to share your profile information with Government of Canada HR and recruitment staff within this community.",
              id: "EJPdqH",
              description:
                "Footnote for more information on interest in job and training opportunities",
            })}
          </p>
          {communityWorkStreams.length > 0 && (
            <>
              <p
                data-h2-font-weight="base(700)"
                data-h2-margin-bottom="base(x.25)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Preferred work streams for job opportunities",
                  id: "Nq3XrT",
                  description:
                    "Label for users interest in training opportunities for a community",
                })}
              </p>
              <ul
                data-h2-list-style="base(none)"
                data-h2-padding-left="base(0)"
              >
                {communityWorkStreams.map((workStream) => (
                  <li
                    key={workStream.id}
                    data-h2-display="base(flex)"
                    data-h2-align-items="base(flex-start)"
                    data-h2-gap="base(x.25)"
                    data-h2-margin-bottom="base(x.25)"
                  >
                    <BoolCheckIcon
                      value={interestedWorkStreams.includes(workStream.id)}
                      trueLabel={intl.formatMessage(
                        commonMessages.interestedIn,
                      )}
                      falseLabel={intl.formatMessage(
                        commonMessages.notInterestedIn,
                      )}
                    >
                      {workStream.name?.localized ?? notAvailable}
                    </BoolCheckIcon>
                  </li>
                ))}
              </ul>
            </>
          )}
          {communityDevelopmentPrograms.length > 0 && (
            <>
              <Separator orientation="horizontal" decorative space="sm" />
              <p
                data-h2-font-weight="base(700)"
                data-h2-margin-bottom="base(x.25)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Leadership and professional development options",
                  id: "UfwS5s",
                  description:
                    "Label for users interest in development programs for a community",
                })}
              </p>
              <ul
                data-h2-list-style="base(none)"
                data-h2-padding-left="base(0)"
              >
                {communityDevelopmentPrograms.map((developmentProgram) => {
                  const interestedProgram =
                    communityInterest?.interestInDevelopmentPrograms?.find(
                      (interest) =>
                        interest?.developmentProgram?.id ===
                        developmentProgram.id,
                    );
                  return (
                    <DevelopmentProgramInterestItem
                      key={developmentProgram.id}
                      developmentProgramInterestQuery={interestedProgram}
                      label={
                        developmentProgram?.name?.localized ?? notAvailable
                      }
                    />
                  );
                })}
              </ul>
            </>
          )}
          {!!communityInterest?.additionalInformation && (
            <>
              <Separator orientation="horizontal" decorative space="sm" />
              <p
                data-h2-font-weight="base(700)"
                data-h2-margin-bottom="base(x.25)"
              >
                {intl.formatMessage({
                  defaultMessage: "Additional information",
                  id: "NCMG9w",
                  description:
                    "Label for a community interests additional information",
                })}
              </p>
              <p>{communityInterest.additionalInformation}</p>
            </>
          )}
          <Dialog.Footer>
            <Link
              mode="solid"
              color="secondary"
              href={paths.communityInterest(communityInterest.id)}
            >
              {intl.formatMessage({
                defaultMessage: "Edit this community",
                id: "zpr5ny",
                description: "Link text for edit interest in a community",
              })}
            </Link>
            <Dialog.Close>
              <Button mode="inline" color="quaternary">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CommunityInterestDialog;
