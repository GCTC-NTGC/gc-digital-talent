import React from "react";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";
import { useIntl } from "react-intl";

import { Accordion, Heading, Link, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { PoolCandidateStatus } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import TrackApplicationsCard from "~/pages/ProfileAndApplicationsPage/components/TrackApplications/TrackApplicationsCard";

import { SectionProps } from "../../types";
import { getSectionTitle } from "../../utils";

type AccordionItems = Array<
  "sign_in_authentication" | "recruitment_availability" | ""
>;

const AccountAndPrivacy = ({ user, pool }: SectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const title = getSectionTitle("account");
  const [currentAccordionItems, setCurrentAccordionItems] =
    React.useState<AccordionItems>([]); // Start with accordion closed

  const activeApplications = unpackMaybes(user.poolCandidates).filter(
    ({ status }) =>
      status &&
      [
        PoolCandidateStatus.QualifiedAvailable,
        PoolCandidateStatus.QualifiedUnavailable,
        PoolCandidateStatus.QualifiedWithdrew,
        PoolCandidateStatus.PlacedCasual,
        PoolCandidateStatus.PlacedIndeterminate,
        PoolCandidateStatus.PlacedTerm,
        PoolCandidateStatus.Expired,
      ].includes(status),
  );

  const gckeyURL =
    intl.locale === "en"
      ? "https://www.canada.ca/en/government/sign-in-online-account/gckey.html"
      : "https://www.canada.ca/fr/gouvernement/ouvrir-session-dossier-compte-en-ligne/clegc.html";

  const inlineLink = (href: string, chunks: React.ReactNode) => (
    <Link href={href} color="black">
      {chunks}
    </Link>
  );

  return (
    <>
      <Heading
        data-h2-margin="base(0)"
        data-h2-padding-bottom="base(x1)"
        Icon={LockClosedIcon}
        color="secondary"
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
      >
        {intl.formatMessage(title)}
      </Heading>
      <Accordion.Root
        type="multiple"
        size="sm"
        value={currentAccordionItems}
        onValueChange={(value: AccordionItems) =>
          setCurrentAccordionItems(value)
        }
      >
        <Accordion.Item value="sign_in_authentication">
          <Accordion.Trigger
            as="h3"
            subtitle={intl.formatMessage({
              defaultMessage:
                "Find out about GCKey and find links to account information.",
              id: "d3HIMV",
              description:
                "Introductory text displayed in login and authentication accordion.",
            })}
          >
            {currentAccordionItems.includes("sign_in_authentication")
              ? intl.formatMessage({
                  defaultMessage:
                    "Hide information about sign in and authentication",
                  id: "LBU5dT",
                  description:
                    "Heading for closing the sign in and authentication accordion in account and privacy",
                })
              : intl.formatMessage({
                  defaultMessage: "Learn more about sign in and authentication",
                  id: "x+PMFn",
                  description:
                    "Heading for opening the sign in and authentication accordion in account and privacy",
                })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "GC Digital Talent partners with the Government of Canada's credential service, GCKey, to provide you with account access using a single username and password. You can manage related data on the GCKey website and it will automatically reflect here when you access your account.",
                id: "NkZeS1",
                description:
                  "Description of how we use GCKey for authentication.",
              })}
            </p>
            <Link
              newTab
              external
              href={gckeyURL}
              mode="solid"
              color="secondary"
            >
              {intl.formatMessage({
                defaultMessage: "Visit GCKey",
                id: "aVp6q7",
                description: "Link text for visiting the GCKey website",
              })}
            </Link>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="recruitment_availability">
          <Accordion.Trigger
            as="h3"
            subtitle={intl.formatMessage({
              defaultMessage:
                "See how your data is accessed and manage availability and communication.",
              id: "Sgp2Zb",
              description:
                "Introductory text displayed in recruitment availability accordion.",
            })}
          >
            {currentAccordionItems.includes("recruitment_availability")
              ? intl.formatMessage({
                  defaultMessage: "Hide recruitment availability",
                  id: "iPuAKE",
                  description:
                    "Heading for closing the recruitment availability accordion in account and privacy",
                })
              : intl.formatMessage({
                  defaultMessage: "Manage recruitment availability",
                  id: "XCYYdk",
                  description:
                    "Heading for opening the recruitment availability accordion in account and privacy",
                })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p data-h2-margin-bottom="base(x0.5)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "By agreeing to use the GC Digital Talent platform, you agree to your data being anonymized and used for statistical purposes. You can learn more about how we handle your privacy in our platform <link>Privacy policy</link>.",
                  id: "yITGeG",
                  description: "Description of how we handle privacy.",
                },
                {
                  link: (chunks: React.ReactNode) =>
                    inlineLink(`/${intl.locale}/privacy-notice`, chunks),
                },
              )}
            </p>
            <p data-h2-margin-bottom="base(x1)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "By applying to a talent pool on the platform, you agree to receive notifications about related potential employment opportunities. You can manage these notifications using the <strong>availability controls</strong>, or by reviewing the <link>current recruitment processes on your career timeline</link>.",
                  id: "nx5fZY",
                  description:
                    "Description for managing recruitment availability.",
                },
                {
                  link: (chunks: React.ReactNode) =>
                    inlineLink(paths.profileAndApplications(), chunks),
                },
              )}
            </p>
            {activeApplications.length > 0 ? (
              activeApplications.map((application) => (
                <TrackApplicationsCard
                  key={application.id}
                  application={application}
                />
              ))
            ) : (
              <Well data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage:
                    "You do not currently have any talent pools on your profile.",
                  id: "QHR5ay",
                  description:
                    "Message displayed in recruitment availability when the user is not in any valid pools",
                })}
              </Well>
            )}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
};

export default AccountAndPrivacy;
